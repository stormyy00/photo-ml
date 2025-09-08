"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../ui/button";
import { Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { Input } from "../../ui/input";
import Radio from "../../radio";
import { ScrollArea } from "../../ui/scroll-area";
import Subjects from "./subjects";
import { organizeFiles, finalizeMove } from "../actions";
import { LabeledImage, RenamePair, ReviewRow } from "@/types";
import {
  buildReviewRows,
  dedupeByKey,
  enforceUniqueDestinations,
  safeFolder,
} from "@/utils/upload-form";

type Phase = "select" | "processing" | "review";

const UploadForm = ({ onDone }: { onDone: () => void }) => {
  const [location, setLocation] = useState<string>("local");
  const [images, setImages] = useState<LabeledImage[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [phase, setPhase] = useState<Phase>("select");
  const [reviewRows, setReviewRows] = useState<ReviewRow[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [batchPrefix, setBatchPrefix] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        subject: null,
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noClick: true,
    noKeyboard: true,
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const assignSubjectToPhoto = (imgIdx: number) => {
    if (!activeSubject) return;
    setImages((prev) =>
      prev.map((img, idx) =>
        idx === imgIdx ? { ...img, subject: activeSubject } : img,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images.length) return;

    setLoading(true);
    setSubmitting(true);
    setPhase("processing");

    try {
      const fd = new FormData();
      images.forEach((img, index) => {
        fd.append("files", img.file, img.file.name);
        fd.append(`subjects_${index}`, img.subject || "");
      });

      const result = await organizeFiles(fd);
      if (!result?.success) {
        alert(result?.error || "Upload failed");
        setPhase("select");
        return;
      }

      setSummary(result.summary ?? null);
      setFolderId(result.folderId ?? null);
      setBatchPrefix(result.batchPrefix ?? null);

      // Build review table from backend items
      const raw = buildReviewRows(result.items || [], images);
      const unique = dedupeByKey(raw);
      setReviewRows(enforceUniqueDestinations(unique).rows);

      setPhase("review");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Upload failed");
      setPhase("select");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleRowChange = (idx: number, patch: Partial<ReviewRow>) => {
    setReviewRows((rows) =>
      rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
    );
  };

  const finalizeAndApplyMoves = async () => {
    if (!batchPrefix) {
      alert("Missing batch prefix");
      return;
    }

    const renameMap: RenamePair[] = reviewRows
      .filter((r) => /\/People\//.test(r.key))
      .map((r) => {
        const cleanFolder = safeFolder(r.suggestedFolder);
        const to = [batchPrefix, cleanFolder, r.filename]
          .join("/")
          .replace(/\/+/g, "/");
        return { from: r.key, to };
      });

    const res = await finalizeMove(renameMap, folderId);
    if (!res.success) {
      alert(res.error || "Finalize failed");
      return;
    }

    setImages([]);
    setReviewRows([]);
    setSummary(null);
    setPhase("select");
    onDone?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 flex flex-col items-center w-full"
    >
      {phase === "select" && (
        <>
          <div className="flex flex-wrap md:flex-nowrap justify-between items-start w-full mb-4 gap-x-5 gap-y-6">
            <div
              {...getRootProps()}
              className="flex flex-col items-center gap-y-4 border-2 border-dashed border-gray-300 rounded-lg p-6 w-full max-w-sm cursor-pointer transition hover:border-photo-green-300"
            >
              <Input {...getInputProps()} className="hidden" />
              <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-gray-600 text-center">
                <p className="text-lg">Drag and drop images here</p>
                <p className="text-sm">or click to browse</p>
              </div>
              <Button variant="outline" onClick={open} type="button">
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>

            <div className="flex flex-col items-start min-w-[200px]">
              <div className="text-xl font-semibold text-photo-green-300 mb-2">
                Select Location
              </div>
              <Radio
                options={[
                  { value: "google-drive", label: "Google Drive" },
                  { value: "local", label: "Local" },
                  { value: "dropbox", label: "Dropbox" },
                  { value: "immich", label: "Immich" },
                ]}
                onChange={setLocation}
              />
            </div>

            <Subjects
              subjects={subjects}
              setSubjects={setSubjects}
              images={images}
              setImages={setImages}
              activeSubject={activeSubject}
              setActiveSubject={setActiveSubject}
            />
          </div>

          <div className="w-full">
            <div className="text-lg font-medium mb-3 border-b-4 pb-1 border-photo-green-300">
              Photos Added: {images.length}
            </div>
            <ScrollArea className="w-full max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 p-2">
                {images.map(({ subject, file }, idx) => (
                  <div key={idx} className="relative group cursor-pointer">
                    <div
                      className="aspect-square rounded-lg overflow-hidden bg-black border-2 transition hover:border-photo-green-300"
                      onClick={() => assignSubjectToPhoto(idx)}
                      title={
                        subject
                          ? `Assigned to "${subject}"`
                          : activeSubject
                            ? `Assign to "${activeSubject}"`
                            : "Select a subject to assign"
                      }
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded image ${idx + 1}`}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                        onLoad={(e) =>
                          URL.revokeObjectURL(
                            (e.target as HTMLImageElement).src,
                          )
                        }
                      />
                      {subject && (
                        <div className="absolute bottom-1 left-1 bg-white/80 rounded px-2 text-xs z-10 font-semibold text-photo-green-700">
                          {subject}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      type="button"
                      aria-label="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="mt-4 flex w-full justify-end gap-2">
            <Button variant="outline" onClick={onDone} disabled={submitting}>
              Cancel
            </Button>
            <Button
              className="bg-photo-green-300 text-white"
              disabled={submitting || images.length === 0}
            >
              {submitting ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </>
      )}

      {phase === "processing" && (
        <div className="flex items-center justify-center min-h-[300px] w-full">
          <span className="text-photo-green-300">Processing photos…</span>
        </div>
      )}

      {phase === "review" && (
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold">Review & finalize</div>
              {summary && (
                <div className="text-sm text-gray-600">
                  Auto groups ready. You can rename files and folders below.
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {reviewRows.length} items
            </div>
          </div>

          <ScrollArea className="w-full max-h-[50vh] border rounded-md overflow-y-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[80px_1fr_1fr] gap-2 px-3 py-2 font-medium bg-gray-50 border-b">
                <div>Preview</div>
                <div>Folder (in batch)</div>
                <div>Filename</div>
              </div>

              {reviewRows.map(
                ({ key, previewURL, suggestedFolder, filename }, idx) => (
                  <div
                    key={key}
                    className="grid grid-cols-[80px_1fr_1fr] gap-2 px-3 py-2 border-b items-center"
                  >
                    <div className="w-20 h-20 overflow-hidden rounded bg-black">
                      {/* still show local preview; could optionally fetch a signed URL if needed */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewURL}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Input
                      value={suggestedFolder}
                      onChange={(e) =>
                        handleRowChange(idx, {
                          suggestedFolder: e.target.value,
                        })
                      }
                      placeholder="People/Alice"
                    />
                    <Input
                      value={filename}
                      onChange={(e) =>
                        handleRowChange(idx, {
                          filename: e.target.value.replace(/[\\/]/g, "_"),
                        })
                      }
                      placeholder="Alice_001.jpg"
                      readOnly
                    />
                  </div>
                ),
              )}
            </div>
          </ScrollArea>

          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => setPhase("select")}>
              Back
            </Button>
            <Button
              className="bg-photo-green-300 text-white"
              type="button"
              onClick={finalizeAndApplyMoves}
            >
              Finalize
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default UploadForm;
