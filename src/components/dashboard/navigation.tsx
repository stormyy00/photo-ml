"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Upload, UserCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import UploadForm from "./upload/upload-form";
import { usePathname, useRouter } from "next/navigation";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const path = usePathname();
  const page = path
    ?.split("/")
    .pop()
    ?.replace(/^./, (c) => c.toUpperCase());

  return (
    <div className="sticky top-0 z-50 w-full flex justify-between items-center py-4 bg-photo-green-300 px-6">
      <div className="text-2xl font-bold text-photo-white-100">{page}</div>

      <div className="flex gap-4 items-center">
        <Button
          variant={"outline"}
          onClick={() => setOpen(!open)}
          className="bg-photo-green-100 border-2 rounded-2xl border-photo-green-300 text-photo-green-300"
        >
          Upload
          <Upload />
        </Button>
        <Button
          variant={"outline"}
          onClick={() => router.push("/dashboard/profile")}
          className="bg-photo-green-100 border-2 rounded-2xl border-photo-green-300 text-photo-green-300"
        >
          <UserCircleIcon />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[1000px] sm:max-h-[900px]">
          <DialogTitle className="text-3xl text-photo-green-300 font-bold">
            Upload
          </DialogTitle>
          <DialogDescription>
            <UploadForm onDone={() => setOpen(false)} />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navigation;
