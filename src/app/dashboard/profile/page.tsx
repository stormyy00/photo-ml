"use client";

import React from "react";
import Image from "next/image";
import { useSession } from "@/utils/auth-client";
import { verifyUser } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  ShieldCheck,
  Camera,
  User as UserIcon,
  Settings,
  CheckCircle2,
  Cloud,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {
  const { data: session, isPending: sessionLoading } = useSession();
  const { data: drive } = useQuery({
    queryKey: ["drive-status"],
    queryFn: async () => {
      const res = await fetch("/api/drive/status", { cache: "no-store" });
      if (!res.ok) throw new Error("status failed");
      return (await res.json()) as { connected: boolean };
    },
  });

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
    <div className="min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white w-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-photo-green-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-photo-green-200/20 rounded-full blur-3xl"></div>
      </div>

      {sessionLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-photo-green-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-photo-green-300/70 font-medium">
              Loading your profile...
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-lg text-photo-green-300/70">
                Manage your account
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="rounded-full border-0 bg-photo-green-100 text-photo-green-300 px-4 py-1.5 font-medium">
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Active
              </Badge>
              <Button
                onClick={submit}
                className="bg-photo-green-300 hover:bg-photo-green-300/90 text-white rounded-full shadow-md transition-all duration-200"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verify Connection
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Card */}
            <Card className="lg:col-span-1 border border-photo-green-100/30 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4 border-b border-photo-green-100/20">
                <CardTitle className="text-lg text-photo-green-300 font-semibold">
                  Account
                </CardTitle>
                <CardDescription className="text-photo-green-300/60 text-sm">
                  Your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-20 w-20 mb-3">
                    <Image
                      src={session?.user?.image || "/default-avatar.png"}
                      alt="User Avatar"
                      fill
                      className="rounded-full object-cover border-3 border-photo-green-100 shadow-md"
                      sizes="80px"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const parent = (e.target as HTMLImageElement)
                          .parentElement;
                        if (parent) {
                          const initials =
                            session?.user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "U";
                          parent.innerHTML = `<div class="h-20 w-20 rounded-full bg-photo-green-100 flex items-center justify-center text-photo-green-300 font-bold text-xl border-3 border-photo-green-100 shadow-md">${initials}</div>`;
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2 w-full">
                    <div className="flex items-center justify-center gap-2">
                      <UserIcon className="h-4 w-4 text-photo-green-300/60 flex-shrink-0" />
                      <p className="font-semibold text-photo-green-300">
                        {session?.user?.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-photo-green-300/70">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm">{session?.user?.email}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 rounded-full border border-photo-green-200 text-photo-green-300 hover:bg-photo-green-50 transition-colors duration-200"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Update Photo
                  </Button>
                </div>

                <Separator className="bg-photo-green-100/30" />

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-photo-green-300/60">
                      Member since
                    </span>
                    <span className="text-photo-green-300 font-semibold">
                      Sept 2025
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-photo-green-300/60">Plan</span>
                    <span className="text-photo-green-300 font-semibold">
                      Free
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-photo-green-300/60">
                      Auth provider
                    </span>
                    <span className="text-photo-green-300 font-semibold">
                      Email
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats Card */}
              <Card className="border border-photo-green-100/30 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4 border-b border-photo-green-100/20">
                  <CardTitle className="text-lg text-photo-green-300 font-semibold">
                    Quick Stats
                  </CardTitle>
                  <CardDescription className="text-photo-green-300/60 text-sm">
                    Your recent activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-photo-green-100/30 bg-photo-green-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-photo-green-300/60 font-semibold">
                        Faces Organized
                      </p>
                      <p className="mt-2.5 text-3xl font-bold text-photo-green-300">
                        128
                      </p>
                      <p className="text-xs text-photo-green-300/60 mt-1">
                        +12 this week
                      </p>
                    </div>
                    <div className="rounded-xl border border-photo-green-100/30 bg-photo-green-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-photo-green-300/60 font-semibold">
                        Albums
                      </p>
                      <p className="mt-2.5 text-3xl font-bold text-photo-green-300">
                        14
                      </p>
                      <p className="text-xs text-photo-green-300/60 mt-1">
                        3 shared
                      </p>
                    </div>
                    <div className="rounded-xl border border-photo-green-100/30 bg-photo-green-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-photo-green-300/60 font-semibold">
                        Storage Used
                      </p>
                      <p className="mt-2.5 text-3xl font-bold text-photo-green-300">
                        6.2 GB
                      </p>
                      <p className="text-xs text-photo-green-300/60 mt-1">
                        of 15 GB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connections Card */}
              <Card className="border border-photo-green-100/30 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4 border-b border-photo-green-100/20">
                  <CardTitle className="text-lg text-photo-green-300 font-semibold">
                    Connections
                  </CardTitle>
                  <CardDescription className="text-photo-green-300/60 text-sm">
                    Manage integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  {/* Backend Connection */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-photo-green-100 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-5 w-5 text-photo-green-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-photo-green-300 text-sm">
                          Backend Connection
                        </p>
                        <p className="text-xs text-photo-green-300/60">
                          Verify API health & auth
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={submit}
                      className="bg-photo-green-300 hover:bg-photo-green-300/90 text-white rounded-full shadow-md transition-all duration-200 w-full sm:w-auto text-sm"
                    >
                      Verify
                    </Button>
                  </div>

                  <Separator className="bg-photo-green-100/30" />

                  {/* Google Drive Connection */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-photo-green-100 flex items-center justify-center flex-shrink-0">
                        <Cloud className="h-5 w-5 text-photo-green-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-photo-green-300 text-sm">
                          Google Drive
                        </p>
                        <p className="text-xs text-photo-green-300/60">
                          Read/write organized photos
                        </p>
                      </div>
                    </div>
                    {drive?.connected ? (
                      <Badge className="rounded-full border-0 bg-photo-green-100 text-photo-green-300 px-4 py-1.5 font-medium">
                        Connected
                      </Badge>
                    ) : (
                      <Button
                        asChild
                        className="bg-photo-green-300 hover:bg-photo-green-300/90 text-white rounded-full shadow-md transition-all duration-200 w-full sm:w-auto text-sm"
                      >
                        <Link href="/api/drive/authorize">Connect Drive</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <p className="mt-12 text-center text-xs text-photo-green-300/40">
            Need help? Contact support for assistance
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
