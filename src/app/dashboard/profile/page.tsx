"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/utils/auth-client";
import Image from "next/image";
import React from "react";
import { verifyUser } from "./actions";

const page = () => {
  const { data: session } = useSession();
  const submit = async () => {
    try {
      const data = await verifyUser();
      console.log("User verified:", data);
      alert("User verified successfully!");
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Failed to verify user. Please try again.");
    }
  };
  return (
    <div className="p-4">
      <p className="text-2xl font-bold text-photo-green-300">Profile</p>
      <span className="text-gray-500 text-sm">Name:</span>
      <p className="flex flex-col items-start gap-2 mt-4 text-lg text-gray-600">
        {session?.user?.name}
        <span className="text-gray-500 text-sm">Email:</span>
        <span className="text-gray-700">{session?.user?.email}</span>

        <Image
          src={session?.user?.image ?? "/default-avatar.png"}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
      </p>
      <p className="mt-4 text-gray-500">
        This is your profile page. You can update your information here.
      </p>
      <Button onClick={submit} className="mt-4 bg-photo-green-300 text-white">
        Verify Connection
      </Button>
    </div>
  );
};

export default page;
