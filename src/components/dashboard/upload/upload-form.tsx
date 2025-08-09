"use client";

import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../ui/button";
import { Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { Input } from "../../ui/input";
import Radio from "../../radio";
import { ScrollArea } from "../../ui/scroll-area";
import Subjects from "./subjects";
import { organizeFiles } from "../actions";

type LabeledImage = {
  id: string; // stable id for mapping
  file: File;
  subject: string | null;
};

const UploadForm = ({ onDone }: { onDone: () => void }) => {
  const [location, setLocation] = useState<string>("local");
  const [images, setImages] = useState<LabeledImage[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
    try {
      const fd = new FormData();

      for (const img of images) {
        if (!img.file) continue;
        const safeName = img.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        fd.append("files", img.file, `${img.id}__${safeName}`);
      }

      const assignments = images
        .filter((img) => !!img.subject)
        .map((img) => ({ id: img.id, subject: img.subject! }));

      fd.append("location", location ?? "");
      fd.append("subjects", JSON.stringify(subjects ?? []));
      fd.append("assignments", JSON.stringify(assignments ?? []));

      console.log({
        location,
        subjects,
        assignments,
        files: images.map((i) => i.file?.name),
      });
      const res = await organizeFiles(fd);
      console.log(res);
      if (!res.ok) throw new Error(res.error || "Upload failed");
      onDone();
    } catch (err) {
      console.error(err);
      setLoading;
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-4 flex flex-col items-center w-full"
    >
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
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <span className="text-photo-green-300">Loading...</span>
          </div>
        ) : (
          <ScrollArea className="w-full max-h-60 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 p-2">
              {images.map((img, idx) => (
                <div key={img.id} className="relative group cursor-pointer">
                  <div
                    className="aspect-square rounded-lg overflow-hidden bg-black border-2 transition hover:border-photo-green-300"
                    onClick={() => assignSubjectToPhoto(idx)}
                    title={
                      img.subject
                        ? `Assigned to "${img.subject}"`
                        : activeSubject
                          ? `Assign to "${activeSubject}"`
                          : "Select a subject to assign"
                    }
                  >
                    <Image
                      src={URL.createObjectURL(img.file)}
                      alt={`Uploaded image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                      onLoad={(e) =>
                        URL.revokeObjectURL((e.target as HTMLImageElement).src)
                      }
                    />
                    {img.subject && (
                      <div className="absolute bottom-1 left-1 bg-white/80 rounded px-2 text-xs z-10 font-semibold text-photo-green-700">
                        {img.subject}
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
        )}
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
    </form>
  );
};

export default UploadForm;
