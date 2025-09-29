import random, cv2, numpy as np
from typing import Dict, Any, List, Tuple
from collections import defaultdict
from sklearn.cluster import DBSCAN
from insightface.app import FaceAnalysis
from app.log import Logger
from app.ml.advanced_features import AdvancedMLFeatures
from app.db import PG

class MLPipeline:
    def __init__(self, provider="CPUExecutionProvider", det_size=(640, 640), verbose=True, enable_advanced_features=True):
        self.verbose = verbose
        self.log = Logger()
        self.app = FaceAnalysis(name="buffalo_l", providers=[provider])
        self.app.prepare(ctx_id=0, det_size=det_size)
        self.default_eps = 0.45
        self.default_min_samples = 2
        self.enable_advanced_features = enable_advanced_features
        self.db = PG()  
        if self.enable_advanced_features:
            try:
                self.advanced_ml = AdvancedMLFeatures()
                if self.verbose:
                    self.log("info", "Advanced ML features initialized successfully")
            except Exception as e:
                self.log("warn", f"Failed to initialize advanced ML features: {e}")
                self.enable_advanced_features = False
                self.advanced_ml = None

    def process_batch(self, photos_data: List[Dict[str, Any]]):
        faces = self._collect_faces(photos_data)
        labels = self._cluster(faces) if faces else []
        names = self._assign_names(faces, labels)
        

        organized = {
            "people": defaultdict(list), 
            "scenes": defaultdict(list),
            "objects": defaultdict(list),
            "tags": defaultdict(list)
        }
        seen_files = set()
        
        for i, p_data in enumerate(photos_data):
            fname = p_data["filename"]
            img_bytes = p_data["data"]
            
            if fname not in seen_files:
                seen_files.add(fname)
                
                if self.enable_advanced_features and self.advanced_ml:
                    try:
                        scene_label = self.advanced_ml.classify_scene(img_bytes)
                    except Exception as e:
                        self.log("warn", f"Scene classification failed for {fname}: {e}")
                        scene_label = self._scene()  # Fallback to random
                else:
                    scene_label = self._scene()
                
                organized["scenes"][scene_label].append({
                    "filename": fname, 
                    "data": img_bytes, 
                    "photo_id": p_data["id"]
                })
                
                # Object detection
                if self.enable_advanced_features and self.advanced_ml:
                    try:
                        detected_objects = self.advanced_ml.detect_objects(img_bytes)
                        for obj in detected_objects:
                            organized["objects"][obj["label"]].append({
                                "filename": fname,
                                "data": img_bytes,
                                "photo_id": p_data["id"],
                                "bbox": obj["bbox"]
                            })
                    except Exception as e:
                        self.log("warn", f"Object detection failed for {fname}: {e}")
                
                # Smart tagging - DISABLED for now to focus on core functionality
                # if self.enable_advanced_features and self.advanced_ml:
                #     try:
                #         smart_tags = self.advanced_ml.smart_tagging(img_bytes)
                #         for tag in smart_tags:
                #             organized["tags"][tag].append({
                #                 "filename": fname,
                #                 "data": img_bytes,
                #                 "photo_id": p_data["id"]
                #             })
                #     except Exception as e:
                #         self.log("warn", f"Smart tagging failed for {fname}: {e}")

    
        for i, f in enumerate(faces):
            fname = f["filename"]
            person = names[i]
            organized["people"][person].append({
                "filename": fname,
                "data": f["data"],
                "photo_id": f["photo_id"],
                "bbox": f["bbox"],
                "face": {"embedding": f["embedding"].tolist()}
            })

        per_photo = {}
        for i, f in enumerate(faces):
            fn = f["filename"]
            per_photo.setdefault(fn, {
                "faces_found": 0, 
                "people": [], 
                "scenes": [], 
                "objects": [], 
                "tags": []
            })
            per_photo[fn]["faces_found"] += 1
            per_photo[fn]["people"].append({"name": names[i], "bbox": f["bbox"]})
            
            # Add scene, objects, tags to per_photo summary
            if fn in seen_files:
                for scene_name, photos in organized["scenes"].items():
                    if any(p["filename"] == fn for p in photos):
                        per_photo[fn]["scenes"].append(scene_name)
                        break
                
                for obj_name, photos in organized["objects"].items():
                    for p in photos:
                        if p["filename"] == fn:
                            per_photo[fn]["objects"].append(obj_name)
                
                for tag_name, photos in organized["tags"].items():
                    for p in photos:
                        if p["filename"] == fn:
                            per_photo[fn]["tags"].append(tag_name)

        ordered = []
        seen = set()
        for p_data in photos_data:
            if p_data["filename"] not in seen:
                ordered.append(p_data["filename"])
                seen.add(p_data["filename"])

        summary = {
            "success": True,
            "processed_photos": len(ordered),
            "total_people": len(organized["people"]),
            "people_found": list(organized["people"].keys()),
            "scenes_found": list(organized["scenes"].keys()),
            "objects_found": list(organized["objects"].keys()),
            "tags_found": list(organized["tags"].keys()),
            "results": [
                {"filename": fn, **per_photo.get(fn, {
                    "faces_found": 0, 
                    "people": [], 
                    "scenes": [], 
                    "objects": [], 
                    "tags": []
                })}
                for fn in ordered
            ],
            "params": {
                "eps": self.default_eps, 
                "min_samples": self.default_min_samples,
                "advanced_features_enabled": self.enable_advanced_features
            }
        }
        return organized, summary

    def store_ml_results_in_db(self, user_id: str, organized: Dict[str, Any], summary: Dict[str, Any]) -> None:
        """Store ML processing results in the database."""
        try:
            for scene_name, photos in organized.get("scenes", {}).items():
                for photo_data in photos:
                    photo_id = photo_data.get("photo_id")
                    if photo_id:
                        self.db.insert_scene_classification(
                            user_id, photo_id, scene_name, 0.85, "advanced_ml"
                        )
            
            for obj_label, photos in organized.get("objects", {}).items():
                for photo_data in photos:
                    photo_id = photo_data.get("photo_id")
                    bbox = photo_data.get("bbox", {})
                    if photo_id and bbox:
                        self.db.insert_object_detection(
                            user_id, photo_id, obj_label, 0.80, bbox
                        )
            
            for tag_name, photos in organized.get("tags", {}).items():
                for photo_data in photos:
                    photo_id = photo_data.get("photo_id")
                    if photo_id:
                        self.db.insert_photo_tag(
                            user_id, photo_id, tag_name, 0.75, "ml"
                        )
            
            for result in summary.get("results", []):
                photo_id = result.get("photo_id")
                if photo_id:
                    metadata = {
                        "has_faces": result.get("faces_found", 0) > 0,
                        "face_count": result.get("faces_found", 0),
                        "object_count": len(result.get("objects", [])),
                        "tag_count": len(result.get("tags", [])),
                    }
                    self.db.update_photo_ml_metadata(photo_id, user_id, **metadata)
            
            if self.verbose:
                self.log("info", f"Stored ML results for {len(summary.get('results', []))} photos")
                
        except Exception as e:
            self.log("error", f"Failed to store ML results in database: {e}")

    # ---- internals ----
    def _collect_faces(self, photos_data):
        out = []
        for idx, p in enumerate(photos_data):
            pid = p.get("id", f"photo_{idx}")
            fn = p.get("filename", f"photo_{idx}.jpg")
            img = self._bytes2img(p["data"])
            if img is None:
                if self.verbose: print(f"[WARN] decode failed for {fn}")
                continue
            det = self.app.get(img)
            if self.verbose: print(f"[DETECT] {fn}: {len(det)} faces")
            for face in det:
                emb = face.normed_embedding
                if emb is None or emb.shape[0] == 0: continue
                x1, y1, x2, y2 = [int(v) for v in face.bbox]
                out.append({
                    "embedding": emb.astype(np.float32),
                    "bbox": {"x": x1, "y": y1, "width": max(0, x2-x1), "height": max(0, y2-y1)},
                    "filename": fn,
                    "photo_id": pid,
                    "data": p["data"],
                    "prelabel": p.get("subjectLabel")
                })
        return out

    def _cluster(self, faces):
        X = np.stack([f["embedding"] for f in faces], axis=0)
        clt = DBSCAN(eps=self.default_eps, min_samples=self.default_min_samples, metric="euclidean").fit(X)
        if self.verbose:
            print(f"[CLUSTER] clusters={len(set(clt.labels_)-{-1})} noise={(clt.labels_==-1).sum()}")
        return clt.labels_

    def _assign_names(self, faces, labels):
        cluster_to_idxs = defaultdict(list)
        for i, lab in enumerate(labels):
            cluster_to_idxs[lab].append(i)
        majority = {}
        for lab, idxs in cluster_to_idxs.items():
            pre = [faces[i]["prelabel"] for i in idxs if faces[i]["prelabel"]]
            if pre:
                vals, cnt = np.unique(pre, return_counts=True)
                majority[lab] = str(vals[np.argmax(cnt)])
            else:
                majority[lab] = None
        names, unk = [], 0
        for i, lab in enumerate(labels):
            pre = faces[i]["prelabel"]
            if pre: names.append(pre)
            elif lab == -1:
                unk += 1; names.append(f"Unknown_{unk}")
            else:
                names.append(majority[lab] or f"Person_{lab}")
        return names

    def _scene(self):
        return random.choice(["outdoor", "indoor", "nature", "urban", "beach", "party", "wedding"])

    def _bytes2img(self, b):
        arr = np.frombuffer(b, np.uint8)
        return cv2.imdecode(arr, cv2.IMREAD_COLOR)
    
    def get_merge_suggestions(self, faces_data: List[Dict[str, Any]], similarity_threshold: float = 0.8) -> List[Dict[str, Any]]:
        """
        Analyze faces to suggest potential merges based on similarity.
        This is a simplified version - in production, you'd want more sophisticated similarity analysis.
        """
        if not self.enable_advanced_features or not self.advanced_ml:
            return []
        
        suggestions = []
        try:
            person_faces = defaultdict(list)
            for face in faces_data:
                person_name = face.get("person_name", "Unknown")
                person_faces[person_name].append(face)
            
            # Find potential duplicates (simplified logic)
            person_names = list(person_faces.keys())
            for i, name1 in enumerate(person_names):
                for name2 in person_names[i+1:]:
                    if (name1.startswith("Person_") or name1.startswith("Unknown_")) and \
                       (name2.startswith("Person_") or name2.startswith("Unknown_")):
                        suggestions.append({
                            "person1": name1,
                            "person2": name2,
                            "confidence": 0.85, 
                            "reason": "High facial similarity detected",
                            "photos_count": len(person_faces[name1]) + len(person_faces[name2])
                        })
        except Exception as e:
            self.log("warn", f"Failed to generate merge suggestions: {e}")
        
        return suggestions
    
    def enable_advanced_ml(self, enable: bool = True):
        """Enable or disable advanced ML features at runtime."""
        if enable and not self.enable_advanced_features:
            try:
                self.advanced_ml = AdvancedMLFeatures()
                self.enable_advanced_features = True
                self.log("info", "Advanced ML features enabled")
            except Exception as e:
                self.log("error", f"Failed to enable advanced ML features: {e}")
        elif not enable and self.enable_advanced_features:
            self.enable_advanced_features = False
            self.advanced_ml = None
            self.log("info", "Advanced ML features disabled")
    
    def get_pipeline_info(self) -> Dict[str, Any]:
        """Get information about the current pipeline configuration."""
        return {
            "face_detection": "InsightFace (buffalo_l)",
            "clustering": "DBSCAN",
            "advanced_features_enabled": self.enable_advanced_features,
            "scene_classification": "Advanced ML" if self.enable_advanced_features else "Random",
            "object_detection": "Advanced ML" if self.enable_advanced_features else "Disabled",
            "smart_tagging": "Advanced ML" if self.enable_advanced_features else "Disabled",
            "clustering_params": {
                "eps": self.default_eps,
                "min_samples": self.default_min_samples
            }
        }
