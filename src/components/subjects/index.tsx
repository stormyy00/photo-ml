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
import { handleDownload } from "@/utils/zip";
import Image from "next/image";

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
