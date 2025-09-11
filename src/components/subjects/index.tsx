"use client";

import * as React from "react";
import { Download, Images } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAllSubjectsByUserId } from "@/db/queries/subjects";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { downloadZipBlob, handleDownload } from "@/utils/zip";
import { fetchZip } from "@/app/dashboard/subjects/actions";
import { toPublicUrl } from "@/utils/storage";
import Image from "next/image";

const data = [
  {
    name: "Alice",
    image: "https://i.pravatar.cc/150?u=alice",
    stats: { photos: 124, sessions: 5, lastSeen: "2d" },
  },
  {
    name: "Howard",
    image: "https://i.pravatar.cc/150?u=howard",
    stats: { photos: 82, sessions: 3, lastSeen: "5h" },
  },
  {
    name: "Charlie",
    image: "https://i.pravatar.cc/150?u=charlie",
    stats: { photos: 41, sessions: 2, lastSeen: "1w" },
  },
  {
    name: "David",
    image: "https://i.pravatar.cc/150?u=david",
    stats: { photos: 210, sessions: 9, lastSeen: "3d" },
  },
  {
    name: "Eve",
    image: "https://i.pravatar.cc/150?u=eve",
    stats: { photos: 56, sessions: 1, lastSeen: "8h" },
  },
  {
    name: "Howard",
    image: "./public/howard.svg",
    stats: { photos: 82, sessions: 3, lastSeen: "5h" },
  },
  {
    name: "Charlie",
    image: "https://i.pravatar.cc/150?u=charlie",
    stats: { photos: 41, sessions: 2, lastSeen: "1w" },
  },
  {
    name: "David",
    image: "https://i.pravatar.cc/150?u=david",
    stats: { photos: 210, sessions: 9, lastSeen: "3d" },
  },
  {
    name: "Eve",
    image: "https://i.pravatar.cc/150?u=eve",
    stats: { photos: 56, sessions: 1, lastSeen: "8h" },
  },
  {
    name: "Frank",
    image: "https://i.pravatar.cc/150?u=frank",
    stats: { photos: 137, sessions: 4, lastSeen: "4d" },
  },
  {
    name: "Grace",
    image: "https://i.pravatar.cc/150?u=grace",
    stats: { photos: 29, sessions: 2, lastSeen: "6h" },
  },
  {
    name: "Heidi",
    image: "https://i.pravatar.cc/150?u=heidi",
    stats: { photos: 95, sessions: 3, lastSeen: "2w" },
  },
  {
    name: "Ivan",
    image: "https://i.pravatar.cc/150?u=ivan",
    stats: { photos: 63, sessions: 2, lastSeen: "1d" },
  },
  {
    name: "Judy",
    image: "https://i.pravatar.cc/150?u=judy",
    stats: { photos: 150, sessions: 6, lastSeen: "3h" },
  },
  {
    name: "Mallory",
    image: "https://i.pravatar.cc/150?u=mallory",
    stats: { photos: 47, sessions: 1, lastSeen: "5d" },
  },
  {
    name: "Niaj",
    image: "https://i.pravatar.cc/150?u=niaj",
    stats: { photos: 88, sessions: 4, lastSeen: "12h" },
  },
  {
    name: "Olivia",
    image: "https://i.pravatar.cc/150?u=olivia",
    stats: { photos: 73, sessions: 3, lastSeen: "2w" },
  },
  {
    name: "Peggy",
    image: "https://i.pravatar.cc/150?u=peggy",
    stats: { photos: 34, sessions: 2, lastSeen: "1d" },
  },
  {
    name: "Sybil",
    image: "https://i.pravatar.cc/150?u=sybil",
    stats: { photos: 119, sessions: 5, lastSeen: "4h" },
  },
  {
    name: "Trent",
    image: "https://i.pravatar.cc/150?u=trent",
    stats: { photos: 54, sessions: 2, lastSeen: "3d" },
  },
  {
    name: "Victor",
    image: "https://i.pravatar.cc/150?u=victor",
    stats: { photos: 101, sessions: 4, lastSeen: "6h" },
  },
  {
    name: "Wendy",
    image: "https://i.pravatar.cc/150?u=wendy",
    stats: { photos: 39, sessions: 1, lastSeen: "1w" },
  },
  {
    name: "Xander",
    image: "https://i.pravatar.cc/150?u=xander",
    stats: { photos: 77, sessions: 3, lastSeen: "2d" },
  },
  {
    name: "Yara",
    image: "https://i.pravatar.cc/150?u=yara",
    stats: { photos: 92, sessions: 4, lastSeen: "5d" },
  },
  {
    name: "Zara",
    image: "https://i.pravatar.cc/150?u=zara",
    stats: { photos: 85, sessions: 3, lastSeen: "2d" },
  },
];

// Types for actions so you can wire them up to your router/backend

const SubjectsGrid = () => {
  const {
    data: subjects,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => getAllSubjectsByUserId(),
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading subjects.</div>;

  console.log("Subjects from DB:", subjects);
  return (
    <TooltipProvider delayDuration={300}>
      <div className=" p-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {subjects.map(({ id, name, coverUrl, photoCount }, key) => (
            <SubjectCard
              key={key}
              id={id}
              name={name}
              coverUrl={coverUrl || ""}
              photoCount={photoCount || 0}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SubjectsGrid;

function SubjectCard({
  id,
  name,
  coverUrl,
  photoCount,
}: {
  id: string;
  name: string;
  coverUrl: string;
  photoCount: number;
}) {
  const router = useRouter();

  return (
    <Card className="group relative overflow-hidden border-none shadow-none hover:bg-gray-200 duration-300 ">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Image
              src={coverUrl ?? ""}
              alt={name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover ring-1 ring-border"
            />
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center rounded-full bg-black/40 backdrop-blur-sm group-hover:flex">
              <div className="pointer-events-auto flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => router.push(`/dashboard/subjects/${id}`)}
                    >
                      <Images className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View photos</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={async () => await handleDownload(id, "person")}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export / Download all</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          <span className="mt-3 text-sm font-medium tracking-tight">
            {name}
          </span>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full gap-1 border border-border/70 bg-background px-2 py-1 text-sm font-semibold">
              <Images className="h-3.5 w-3.5" /> {photoCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
