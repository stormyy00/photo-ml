"use client";
import Reset from "@/components/auth/reset";
import ResetPassword from "@/components/auth/reset-passowrd";
import Error from "@/components/error";
import { useSearchParams } from "next/navigation";
import React from "react";

const page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return token ? <Reset token={token} /> : <ResetPassword />;
};

export default page;
