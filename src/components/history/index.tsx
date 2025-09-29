"use client";

import React, { useState } from "react";
import {
  Grid,
  List,
  FolderOpen,
  AlertCircle,
  Search,
  Calendar,
  Camera,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFolders } from "@/db/queries/subjects";
import { useQuery } from "@tanstack/react-query";
import { useDeleteFolderMutation } from "@/actions/folder";
import PhotoListItem from "../dashboard/list";
import PhotoCard from "../dashboard/cards";

const History = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const {
    data: folders,
    isPending,
    error,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => await getFolders(),
  });

  const { mutate: deleteFolder } = useDeleteFolderMutation();

  if (isPending)
    return (
      <div className="min-h-screen bg-photo-stone-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-photo-green-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-photo-stone-600">
              Loading your photo batches...
            </p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-photo-stone-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-photo-rose-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-photo-rose-500" />
            </div>
            <p className="text-photo-stone-600">
              Error loading batches. Please try again.
            </p>
          </div>
        </div>
      </div>
    );

  const filteredFolders =
    folders?.filter((folder) =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="min-h-screen bg-photo-stone-50 p-6">
      <div className="mb-8">
        {/* <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-photo-stone-800">
              Photo Batches
            </h1>
            <p className="text-photo-stone-600 mt-1">
              View and manage all your photo processing batches
            </p>
          </div>
        </div> */}

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
                    {folders?.length || 0}
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
                    {folders?.reduce(
                      (sum, folder) => sum + (folder.totalPhotos || 0),
                      0,
                    ) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-photo-stone-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-photo-emerald-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-photo-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-photo-stone-600">This Month</p>
                  <p className="text-3xl font-bold text-photo-stone-800">
                    {folders?.filter((folder) => {
                      if (!folder.createdAt) return false;
                      const folderDate = new Date(folder.createdAt);
                      const now = new Date();
                      return (
                        folderDate.getMonth() === now.getMonth() &&
                        folderDate.getFullYear() === now.getFullYear()
                      );
                    }).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-photo-stone-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-photo-stone-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search batches by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-photo-stone-300 focus:border-photo-green-300"
                  />
                </div>
              </div>
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="bg-photo-stone-100">
                  <TabsTrigger
                    value="grid"
                    className="data-[state=active]:bg-photo-green-300 data-[state=active]:text-white"
                  >
                    <Grid className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-photo-green-300 data-[state=active]:text-white"
                  >
                    <List className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {filteredFolders.length === 0 ? (
          <Card className="border-none bg-transparent shadow-none">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-photo-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FolderOpen className="w-12 h-12 text-photo-green-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-photo-stone-800">
                    {searchTerm ? "No batches found" : "No batches yet"}
                  </h3>
                  <p className="text-photo-stone-600 max-w-md mx-auto">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Start organizing your photos by uploading them and letting our AI automatically group them by people and scenes."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFolders.map(
                  ({ id, name, createdAt, totalPhotos }, index) => (
                    <PhotoCard
                      key={index}
                      id={id}
                      name={name}
                      createdAt={createdAt}
                      totalPhotos={totalPhotos}
                      open={open}
                      setOpen={setOpen}
                      onDelete={(folderId) => deleteFolder(folderId)}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFolders.map(
                  ({ id, name, createdAt, totalPhotos }, index) => (
                    <PhotoListItem
                      key={index}
                      id={id}
                      name={name}
                      createdAt={createdAt}
                      totalPhotos={totalPhotos}
                      open={open}
                      setOpen={setOpen}
                      onDelete={(folderId) => deleteFolder(folderId)}
                    />
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
