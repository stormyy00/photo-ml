"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Users,
  Upload,
  History,
  Clock,
  FolderOpen,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFolders, getSubjectsCount } from "@/db/queries/subjects";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import UploadDialog from "./upload/dialog";

const PhotoDashboard = () => {
  const [openUpload, setOpenUpload] = useState(false);
  const router = useRouter();

  const {
    data: folders,
    isPending: foldersLoading,
    error: foldersError,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => await getFolders(),
  });

  const {
    data: subjectsCount,
    isPending: subjectsLoading,
    error: subjectsError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => await getSubjectsCount(),
  });

  if (foldersLoading || subjectsLoading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-photo-green-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-photo-green-300/70 font-medium">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );

  if (foldersError || subjectsError)
    return (
      <div className="min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-photo-green-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-photo-green-300" />
            </div>
            <p className="text-photo-green-300/70">
              Error loading dashboard. Please try again.
            </p>
          </div>
        </div>
      </div>
    );

  const recentBatches = folders?.slice(0, 3) || [];
  const totalPhotos =
    folders?.reduce((sum, folder) => sum + (folder.totalPhotos || 0), 0) || 0;
  const totalBatches = folders?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white p-6 mt-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-photo-green-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-photo-green-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-photo-green-300 mb-2">
            Welcome back
          </h1>
          <p className="text-photo-green-300/70 text-lg">
            Here&apos;s what&apos;s happening with your photos
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-photo-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-6 h-6 text-photo-green-300" />
                </div>
                <div>
                  <p className="text-xs text-photo-green-300/60 font-semibold uppercase tracking-wide">
                    Total Batches
                  </p>
                  <p className="text-2xl font-bold text-photo-green-300 mt-1">
                    {totalBatches}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-photo-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-photo-green-300" />
                </div>
                <div>
                  <p className="text-xs text-photo-green-300/60 font-semibold uppercase tracking-wide">
                    Total Photos
                  </p>
                  <p className="text-2xl font-bold text-photo-green-300 mt-1">
                    {totalPhotos}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border  shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-photo-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-photo-green-300" />
                </div>
                <div>
                  <p className="text-xs text-photo-green-300/60 font-semibold uppercase tracking-wide">
                    People Found
                  </p>
                  <p className="text-2xl font-bold text-photo-green-300 mt-1">
                    {subjectsCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-photo-green-100/50">
                <CardTitle className="flex items-center gap-3 text-photo-green-300">
                  <Clock className="w-5 h-5" />
                  Recent Batches
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {recentBatches.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-photo-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FolderOpen className="w-10 h-10 text-photo-green-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-photo-green-300 mb-2">
                      No batches yet
                    </h3>
                    <p className="text-photo-green-300/60 mb-6">
                      Upload your first photos to get started
                    </p>
                    <Button
                      onClick={() => setOpenUpload(true)}
                      className="bg-photo-green-300 hover:bg-photo-green-300/90 text-white rounded-full px-6 shadow-lg"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentBatches.map(
                      ({ name, createdAt, totalPhotos }, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-photo-green-100/30 transition-colors border border-photo-green-100/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-photo-green-100 rounded-xl flex items-center justify-center">
                              <FolderOpen className="w-6 h-6 text-photo-green-300" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-photo-green-300">
                                {name}
                              </h3>
                              <p className="text-sm text-photo-green-300/60">
                                {totalPhotos} photos •{" "}
                                {createdAt
                                  ? new Date(createdAt).toLocaleDateString()
                                  : "Unknown date"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/history`)}
                            className="rounded-full border-photo-green-300/40 text-photo-green-300 hover:bg-photo-green-100/50"
                          >
                            View
                          </Button>
                        </div>
                      ),
                    )}
                    {folders && folders.length > 3 && (
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-photo-green-300/40 text-photo-green-300 hover:bg-photo-green-100/50"
                          onClick={() => router.push(`/dashboard/history`)}
                        >
                          View All Batches ({folders.length})
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-photo-green-100/50">
                <CardTitle className="text-photo-green-300">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button
                  className="w-full justify-start rounded-full bg-photo-green-300 text-white hover:bg-photo-green-300/90 shadow-md"
                  onClick={() => setOpenUpload(true)}
                >
                  <Upload className="w-4 h-4 mr-3" />
                  Upload New Photos
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start rounded-full border-photo-green-300/40 text-photo-green-300 hover:bg-photo-green-100/50"
                  onClick={() => router.push("/dashboard/subjects")}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Manage People ({subjectsCount})
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start rounded-full border-photo-green-300/40 text-photo-green-300 hover:bg-photo-green-100/50"
                  onClick={() => router.push("/dashboard/history")}
                >
                  <History className="w-4 h-4 mr-3" />
                  View All Batches
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-photo-green-100/50">
                <CardTitle className="text-photo-green-300">Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-photo-green-300 rounded-full"></div>
                    <span className="text-sm text-photo-green-300/70">
                      {totalBatches > 0
                        ? `Latest: ${recentBatches[0]?.name}`
                        : "No batches yet"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-photo-green-200 rounded-full"></div>
                    <span className="text-sm text-photo-green-300/70">
                      {subjectsCount} people identified
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-photo-green-200 rounded-full"></div>
                    <span className="text-sm text-photo-green-300/70">
                      {totalPhotos} photos organized
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <UploadDialog open={openUpload} setOpen={setOpenUpload} />
    </div>
  );
};

export default PhotoDashboard;
