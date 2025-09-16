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
} from "lucide-react";

const ProfilePage = () => {
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

  const name = session?.user?.name ?? "Anonymous User";
  const email = session?.user?.email ?? "no-email@unknown.com";
  const imageSrc =
    session?.user?.image?.startsWith("/") ||
    session?.user?.image?.startsWith("http")
      ? session?.user?.image!
      : "/default-avatar.png";

  return (
    <div className="bg-photo-white-100 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-gray-700">Profile</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account, preferences, and quick insights.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className="rounded-full border border-gray-200 bg-photo-white-200 text-gray-800"
              variant="outline"
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Active
            </Badge>
            <Button
              onClick={submit}
              className="bg-photo-green-300 hover:opacity-90 text-photo-white-100"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verify Connection
            </Button>
          </div>
        </div>

        <Separator className="mt-6" />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-900">Account</CardTitle>
              <CardDescription className="text-gray-500">
                Your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20">
                  <Image
                    src={imageSrc}
                    alt="User Avatar"
                    fill
                    className="rounded-full object-cover border border-gray-200"
                    sizes="80px"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/default-avatar.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <p className="truncate font-medium text-gray-900">{name}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="truncate">{email}</p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="h-8 text-gray-700 border-gray-200"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Update photo
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Member since</span>
                  <span className="text-gray-800">Sept 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Plan</span>
                  <span className="text-gray-800">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Auth provider</span>
                  <span className="text-gray-800">Email</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-900">
                  Quick Stats
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Snapshot of your recent activity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Faces Organized
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      128
                    </p>
                    <p className="text-xs text-gray-400 mt-1">+12 this week</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Albums
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      14
                    </p>
                    <p className="text-xs text-gray-400 mt-1">3 shared</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Storage Used
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">
                      6.2 GB
                    </p>
                    <p className="text-xs text-gray-400 mt-1">of 15 GB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-900">
                  Preferences
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Toggle features and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smart-grouping" className="text-gray-800">
                      Smart grouping
                    </Label>
                    <p className="text-sm text-gray-500">
                      Auto-cluster landscapes and scenes.
                    </p>
                  </div>
                  <Switch id="smart-grouping" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="face-rec" className="text-gray-800">
                      Face recognition
                    </Label>
                    <p className="text-sm text-gray-500">
                      Use InsightFace to group by person.
                    </p>
                  </div>
                  <Switch id="face-rec" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts" className="text-gray-800">
                      Email alerts
                    </Label>
                    <p className="text-sm text-gray-500">
                      Weekly summary & important updates.
                    </p>
                  </div>
                  <Switch id="email-alerts" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme-accents" className="text-gray-800">
                      Theme accents
                    </Label>
                    <p className="text-sm text-gray-500">
                      Use brand accents from your photo palette.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-5 w-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: "#E5FEF3" }}
                    />
                    <span
                      className="h-5 w-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: "#6CAD9D" }}
                    />
                    <span
                      className="h-5 w-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: "#09392D" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-900">
                  Connections
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Manage integrations & data links
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-photo-green-200" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Backend Connection
                      </p>
                      <p className="text-xs text-gray-500">
                        Verify API health & auth.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={submit}
                    className="bg-photo-green-300 hover:opacity-90 text-photo-white-100"
                  >
                    Verify Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Tip: Contact <span className="font-medium text-gray-600">photo</span>{" "}
          palette.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
