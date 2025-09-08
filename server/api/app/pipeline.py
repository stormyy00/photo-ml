import random, cv2, numpy as np
from typing import Dict, Any, List, Tuple
from collections import defaultdict
from sklearn.cluster import DBSCAN
from insightface.app import FaceAnalysis
from app.log import Logger

class MLPipeline:
    def __init__(self, provider="CPUExecutionProvider", det_size=(640, 640), verbose=True):
        self.verbose = verbose
        self.log = Logger()
        self.app = FaceAnalysis(name="buffalo_l", providers=[provider])
        self.app.prepare(ctx_id=0, det_size=det_size)
        self.default_eps = 0.45
        self.default_min_samples = 2

    def process_batch(self, photos_data: List[Dict[str, Any]]):
        faces = self._collect_faces(photos_data)
        labels = self._cluster(faces) if faces else []
        names = self._assign_names(faces, labels)

        # Build organized dict; also attach the face object into people list
        organized = {"people": defaultdict(list), "scenes": defaultdict(list)}
        seen_files = set()
        for i, f in enumerate(faces):
            fname = f["filename"]
            if fname not in seen_files:
                organized["scenes"][self._scene()] \
                    .append({"filename": fname, "data": f["data"], "photo_id": f["photo_id"]})
                seen_files.add(fname)

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
            per_photo.setdefault(fn, {"faces_found": 0, "people": []})
            per_photo[fn]["faces_found"] += 1
            per_photo[fn]["people"].append({"name": names[i], "bbox": f["bbox"]})

        ordered = []
        seen = set()
        for f in faces:
            if f["filename"] not in seen:
                ordered.append(f["filename"]); seen.add(f["filename"])

        summary = {
            "success": True,
            "processed_photos": len(ordered),
            "total_people": len(organized["people"]),
            "people_found": list(organized["people"].keys()),
            "scenes_found": list(organized["scenes"].keys()),
            "results": [
                {"filename": fn, **per_photo.get(fn, {"faces_found": 0, "people": []})}
                for fn in ordered
            ],
            "params": {"eps": self.default_eps, "min_samples": self.default_min_samples}
        }
        return organized, summary

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
