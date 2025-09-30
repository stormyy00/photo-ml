"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Users,
  Sparkles,
  Upload,
  History,
  TrendingUp,
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
      <div className="min-h-screen bg-photo-stone-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-photo-green-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-photo-stone-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );

  if (foldersError || subjectsError)
    return (
      <div className="min-h-screen bg-photo-stone-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-photo-rose-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-photo-rose-500" />
            </div>
            <p className="text-photo-stone-600">
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
    <div className="min-h-screen bg-photo-stone-50 p-6 mt-4">
      {/* Header */}
      {/* <div className="mb-4"> */}
      {/* <div className="flex items-center justify-between mb-6"> */}
      {/* <div>
            <h1 className="text-3xl font-bold text-photo-stone-800">
              Photo Dashboard
            </h1>
            <p className="text-photo-stone-600 mt-1">
              Overview of your photo collections and recent activity
            </p>
          </div> */}
      {/* <Button 
            onClick={() => setOpenUpload(true)}
            className="bg-photo-green-300 hover:bg-photo-green-400 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photos
          </Button> */}
      {/* </div> */}
      {/* </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-photo-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-photo-sage-100 rounded-full flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-photo-sage-600" />
              </div>
              <div>
                <p className="text-sm text-photo-stone-600">Total Batches</p>
                <p className="text-3xl font-bold text-photo-stone-800">
                  {totalBatches}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-photo-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-photo-amber-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-photo-amber-600" />
              </div>
              <div>
                <p className="text-sm text-photo-stone-600">Total Photos</p>
                <p className="text-3xl font-bold text-photo-stone-800">
                  {totalPhotos}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-photo-stone-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-photo-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-photo-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-photo-stone-600">
                  People Identified
                </p>
                <p className="text-3xl font-bold text-photo-stone-800">
                  {subjectsCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-photo-stone-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-photo-green-300" />
                Recent Batches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBatches.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-photo-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-8 h-8 text-photo-green-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-photo-stone-800 mb-2">
                    No batches yet
                  </h3>
                  <p className="text-photo-stone-600 mb-4">
                    Upload your first photos to see them here
                  </p>
                  <Button
                    onClick={() => setOpenUpload(true)}
                    className="bg-photo-green-300 hover:bg-photo-green-400 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBatches.map(
                    ({  name, createdAt, totalPhotos }, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-photo-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-photo-green-100 rounded-lg flex items-center justify-center">
                            <FolderOpen className="w-6 h-6 text-photo-green-300" />
                          </div>
                          <div>
                            <h3 className="font-medium text-photo-stone-800">
                              {name}
                            </h3>
                            <p className="text-sm text-photo-stone-600">
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
                        >
                          View
                        </Button>
                      </div>
                    ),
                  )}
                  {folders && folders.length > 3 && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
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
          <Card className="border-photo-stone-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-photo-green-300" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/subjects")}
              >
                <Users className="w-4 h-4 mr-3" />
                Manage People ({subjectsCount})
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/history")}
              >
                <History className="w-4 h-4 mr-3" />
                View All Batches
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setOpenUpload(true)}
              >
                <Upload className="w-4 h-4 mr-3" />
                Upload New Photos
              </Button>
            </CardContent>
          </Card>

          <Card className="border-photo-stone-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-photo-green-300" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-photo-green-300 rounded-full"></div>
                  <span className="text-photo-stone-600">
                    {totalBatches > 0
                      ? `Latest batch: ${recentBatches[0]?.name}`
                      : "No activity yet"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-photo-amber-300 rounded-full"></div>
                  <span className="text-photo-stone-600">
                    {subjectsCount} people identified
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-photo-emerald-300 rounded-full"></div>
                  <span className="text-photo-stone-600">
                    {totalPhotos} photos processed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UploadDialog open={openUpload} setOpen={setOpenUpload} />
    </div>
  );
};

export default PhotoDashboard;
