import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type LabeledImage = {
  id: string;
  file: File;
  subject: string | null;
};

type SubjectsProps = {
  subjects: string[];
  setSubjects: React.Dispatch<React.SetStateAction<string[]>>;
  images: LabeledImage[];
  setImages: React.Dispatch<React.SetStateAction<LabeledImage[]>>;
  activeSubject: string | null;
  setActiveSubject: React.Dispatch<React.SetStateAction<string | null>>;
};

const Subjects: React.FC<SubjectsProps> = ({
  subjects,
  setSubjects,
  images,
  setImages,
  activeSubject,
  setActiveSubject,
}) => {
  const [subjectInput, setSubjectInput] = useState<string>("");

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects((prev) => [...prev, trimmed]);
      setSubjectInput("");
      setActiveSubject(trimmed);
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects((prev) => prev.filter((s) => s !== subject));
    setImages((prev) =>
      prev.map((img) =>
        img.subject === subject ? { ...img, subject: null } : img,
      ),
    );
    setActiveSubject((prev) => (prev === subject ? null : prev));
  };

  const unassignPhotoFromSubject = (imgIdx: number) => {
    setImages((prev) =>
      prev.map((img, idx) =>
        idx === imgIdx ? { ...img, subject: null } : img,
      ),
    );
  };

  const imagesBySubject: Record<string, LabeledImage[]> = {};
  subjects.forEach((s) => {
    imagesBySubject[s] = images.filter((img) => img.subject === s);
  });

  return (
    <div className="flex flex-col items-start min-w-[270px] space-y-2">
      <div className="text-xl font-semibold text-photo-green-300">Subjects</div>

      <div className="grid grid-cols-3 gap-2 max-h-28 overflow-y-auto w-fit">
        {subjects.map((s) => (
          <button
            key={s}
            className={`flex items-center justify-between  bg-photo-green-200 rounded px-3 py-1 text-xs font-semibold transition 
                  ${activeSubject === s ? "ring-2  text-white" : "hover:bg-photo-green-200/80 text-white/70"}
                `}
            onClick={() => setActiveSubject(s)}
            type="button"
          >
            <span>{s}</span>
            <X
              className="ml-2 w-3 h-3 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                removeSubject(s);
              }}
              aria-label="Remove subject"
            />
          </button>
        ))}
      </div>

      <div className="flex w-full gap-2">
        <Input
          type="text"
          placeholder="Enter subject name"
          className="max-w-xs text-xs"
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSubject()}
        />
        <Button
          onClick={addSubject}
          disabled={!subjectInput.trim()}
          type="button"
          size="sm"
          className="text-xs"
        >
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Select a subject, then click a photo below to assign it.
      </p>

      <ScrollArea className="w-full max-h-28 mt-2 overflow-y-auto border-t border-gray-400 ">
        <div className="grid grid-cols-2 w-full">
          {subjects.map(
            (s) =>
              imagesBySubject[s].length > 0 && (
                <div key={s} className="mt-2">
                  <div className="text-sm font-bold mb-1 text-photo-green-300">
                    {s}
                  </div>
                  <div className="flex flex-wrap gap-2 max-w-xs ">
                    {imagesBySubject[s].map((img, idx) => {
                      const imgIdx = images.findIndex((i) => i === img);
                      return (
                        <div key={idx} className="relative">
                          <Image
                            src={URL.createObjectURL(img.file)}
                            alt={s}
                            width={100}
                            height={100}
                            className="rounded border"
                            onLoad={(e) =>
                              URL.revokeObjectURL(
                                (e.target as HTMLImageElement).src,
                              )
                            }
                          />
                          <button
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                            onClick={() => unassignPhotoFromSubject(imgIdx)}
                            type="button"
                            aria-label="Unassign from subject"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Subjects;
