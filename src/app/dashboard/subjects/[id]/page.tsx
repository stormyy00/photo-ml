"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getSubjectPhotosbyId } from "../actions";
import Image from "next/image";

type PageProps = {
  params: {
    id: string;
  };
};

const SubjectPage = ({ params }: PageProps) => {
  const { id } = params;
  const { data, isPending, error } = useQuery({
    queryKey: ["subjects", id],
    queryFn: async () => await getSubjectPhotosbyId(id),
  });

  if (error) return <div>Error loading subject photos.</div>;
  console.log(data);

  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const toggle = (id: string | number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  return (
    <div className="w-full p-4">
      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-32 sm:h-40 lg:h-48 animate-pulse rounded-xl bg-gray-200/70"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-lg font-semibold">
              {id} <span className="text-gray-500">(Total: {data.length})</span>
            </h2>
            {selected.size > 0 && (
              <div className="text-sm text-gray-600">
                {selected.size} selected
              </div>
            )}
          </div>

          <div className="columns-2 sm:columns-3 lg:columns-5 gap-2 sm:gap-3 [column-fill:_balance]">
            {data.map(({ photo_id, storage_path, upload_date }) => (
              <figure
                key={photo_id}
                className="group relative mb-2 sm:mb-3 break-inside-avoid rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-400/60"
              >
                <button
                  onClick={() => toggle(photo_id)}
                  className={[
                    "absolute left-2 top-2 z-10 h-6 w-6 rounded-md border bg-white/80 backdrop-blur text-transparent",
                    "group-hover:text-gray-900 group-hover:border-gray-300",
                    selected.has(photo_id)
                      ? "text-white border-blue-500 bg-blue-500"
                      : "",
                  ].join(" ")}
                  aria-label="Select photo"
                >
                  {selected.has(photo_id) ? "✓" : ""}
                </button>

                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                  <div className="truncate">ID: {String(photo_id)}</div>
                  {upload_date && (
                    <div className="opacity-90">
                      {new Date(upload_date).toLocaleString()}
                    </div>
                  )}
                </figcaption>

                <div className="relative w-full overflow-hidden">
                  <Image
                    src={storage_path}
                    alt={`Photo ${photo_id}`}
                    width={1000}
                    height={750}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] bg-gray-100"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    priority={true}
                  />
                </div>
              </figure>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectPage;
