"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Upload, UserCircleIcon, LogOut, User } from "lucide-react";
import UploadDialog from "./upload/dialog";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { signOut } from "@/utils/auth-client";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              className="bg-photo-green-100 border-2 rounded-2xl border-photo-green-300 text-photo-green-300"
            >
              <UserCircleIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <UploadDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Navigation;
