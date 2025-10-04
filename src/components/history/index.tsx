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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { getFolders } from "@/db/queries/subjects";
import { useQuery } from "@tanstack/react-query";
import { useDeleteFolderMutation } from "@/actions/folder";
import PhotoListItem from "../dashboard/list";
import PhotoCard from "../dashboard/cards";

const History = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    data: folders,
    isPending,
    error,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => await getFolders(),
  });

  const { mutate: deleteFolder } = useDeleteFolderMutation();

  const handleOpenDialog = (id: string, name: string) => {
    setSelectedFolder({ id, name });
    setOpen(!open);
  };

  const handleDelete = () => {
    if (selectedFolder) {
      deleteFolder({ folderId: selectedFolder.id });
      setOpen(false);
      setSelectedFolder(null);
    }
  };

  if (isPending)
    return (
      <div className="min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-photo-green-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-photo-green-300/70 font-medium">
              Loading your photo batches...
            </p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-photo-green-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-photo-green-300" />
            </div>
            <p className="text-photo-green-300/70">
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

  const thisMonthCount =
    folders?.filter((folder) => {
      if (!folder.createdAt) return false;
      const folderDate = new Date(folder.createdAt);
      const now = new Date();
      return (
        folderDate.getMonth() === now.getMonth() &&
        folderDate.getFullYear() === now.getFullYear()
      );
    }).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-photo-green-100/20 to-white p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-photo-green-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-photo-green-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-photo-green-100 rounded-2xl flex items-center justify-center">
                  <FolderOpen className="w-7 h-7 text-photo-green-300" />
                </div>
                <div>
                  <p className="text-sm text-photo-green-300/60 font-medium">
                    Total Batches
                  </p>
                  <p className="text-3xl font-bold text-photo-green-300">
                    {folders?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-photo-green-100 rounded-2xl flex items-center justify-center">
                  <Camera className="w-7 h-7 text-photo-green-300" />
                </div>
                <div>
                  <p className="text-sm text-photo-green-300/60 font-medium">
                    Total Photos
                  </p>
                  <p className="text-3xl font-bold text-photo-green-300">
                    {folders?.reduce(
                      (sum, folder) => sum + (folder.totalPhotos || 0),
                      0,
                    ) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-photo-green-100 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-photo-green-300" />
                </div>
                <div>
                  <p className="text-sm text-photo-green-300/60 font-medium">
                    This Month
                  </p>
                  <p className="text-3xl font-bold text-photo-green-300">
                    {thisMonthCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-photo-green-300/50 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search batches by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-photo-green-100 focus:border-photo-green-300 rounded-xl bg-white"
                  />
                </div>
              </div>
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="bg-photo-green-100/50 p-1 h-12">
                  <TabsTrigger
                    value="grid"
                    className="data-[state=active]:bg-photo-green-300 data-[state=active]:text-white rounded-lg px-6"
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-photo-green-300 data-[state=active]:text-white rounded-lg px-6"
                  >
                    <List className="w-4 h-4 mr-2" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filteredFolders.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-photo-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FolderOpen className="w-12 h-12 text-photo-green-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-photo-green-300">
                      {searchTerm ? "No batches found" : "No batches yet"}
                    </h3>
                    <p className="text-photo-green-300/70 max-w-md mx-auto">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Start organizing your photos by uploading them and letting our system automatically group them by people and scenes."}
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
                        onOpenDialog={handleOpenDialog}
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
                        onOpenDialog={handleOpenDialog}
                      />
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl">
          <DialogTitle className="text-2xl text-photo-green-300 font-bold">
            Delete Collection?
          </DialogTitle>
          <p className="text-photo-green-300/70 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-photo-green-300">
              &quot;{selectedFolder?.name}&quot;
            </span>
            ? This action cannot be undone and all associated data will be
            permanently removed.
          </p>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-2 border-photo-green-300/30 text-photo-green-300 hover:bg-photo-green-100/30 rounded-full"
            >
              Cancel
            </Button>
            <Button
              className="bg-photo-green-300 hover:bg-photo-green-300/90 text-white rounded-full shadow-lg"
              onClick={handleDelete}
            >
              Delete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
