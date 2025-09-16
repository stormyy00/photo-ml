"use client";

import React, { useState, useRef } from "react";
import {
  Search,
  Grid,
  List,
  Image,
  Heart,
  Download,
  Trash2,
  Eye,
  MoreHorizontal,
  FolderCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getFolders } from "@/db/queries/subjects";
import { useQuery } from "@tanstack/react-query";
import { useDeleteFolderMutation } from "@/actions/folder";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";

const PhotoDashboard = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const {
    data: photos,
    isPending,
    error,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => await getFolders(),
  });

  const { mutate: deleteFolder } = useDeleteFolderMutation();

  const fileInputRef = useRef(null);

  const categories = ["all", "Landscapes", "Nature", "Urban", "Art"];

  // const filteredPhotos = photos.filter((photo) => {
  //   const matchesSearch =
  //     photo.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     // photo.tags.some((tag) =>
  //     //   tag.toLowerCase().includes(searchTerm.toLowerCase()),
  //     // );
  // //   const matchesFilter =
  // //     selectedFilter === "all" || photo.category === selectedFilter;
  // //   return matchesSearch && matchesFilter;
  // });
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error loading photos.</div>;

  const PhotoCard = ({
    id,
    name,
    createdAt,
    totalPhotos,
    open,
    setOpen,
  }: {
    id: string;
    name: string;
    createdAt: Date | null;
    totalPhotos: number | null;
    open: boolean;
    setOpen: (open: boolean) => void;
  }) => (
    <Card className="group overflow-hidden  transition-all duration-200">
      <div className="relative">
        {/* <img
          src={photo.thumbnail}
          alt={photo.name}
          className="w-full h-36 object-cover"
        /> */}
        <FolderCheck className="w-full h-36 text-muted-foreground" />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
              onClick={() => setOpen(true)}
            >
              <Trash2 className="w-4 h-4" />

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[1000px] sm:max-h-[900px]">
                  <DialogTitle className="text-3xl text-photo-green-300 font-bold">
                    Are you sure you want to delete this folder?
                  </DialogTitle>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => {
                        deleteFolder({ folderId: id });
                        setOpen(false);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Button>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white"
          // onClick={() => toggleFavorite(photo.id)}
        >
          <Heart
            className={`w-4 h-4 ${true ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <CardTitle className="text-base mb-1 truncate">{name}</CardTitle>
        <CardDescription className="mb-3">
          {createdAt ? new Date(createdAt).toLocaleDateString() : "No date"} •{" "}
          {totalPhotos} photos
        </CardDescription>
      </CardContent>
    </Card>
  );

  const PhotoListItem = ({
    id,
    name,
    createdAt,
    totalPhotos,
    open,
    setOpen,
  }: {
    id: string;
    name: string;
    createdAt: Date | null;
    totalPhotos: number | null;
    open: boolean;
    setOpen: (open: boolean) => void;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* <img
            src={photo.thumbnail}
            alt={photo.name}
            className="w-16 h-16 object-cover rounded-lg"
          /> */}
          <FolderCheck className="w-16 h-16 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : "No date"}{" "}
                  • {totalPhotos} photos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  // onClick={() => toggleFavorite(photo.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${true ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogContent className="sm:max-w-[1000px] sm:max-h-[900px]">
                        <DialogTitle className="text-3xl text-photo-green-300 font-bold">
                          Are you sure you want to delete this folder?
                        </DialogTitle>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => {
                              deleteFolder({ folderId: id });
                              setOpen(false);
                            }}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <Input
        type="file"
        ref={fileInputRef}
        // onChange={handleFileUpload}
        multiple
        accept="image/*"
        className="hidden"
      />

      <Card className="mb-6 border-none shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search photos by name or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-none shadow-none">
        <CardContent className="p-6">
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-semibold mb-2">No photos found</div>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map(({ id, name, createdAt, totalPhotos }, index) => (
                <PhotoCard
                  key={index}
                  id={id}
                  name={name}
                  createdAt={createdAt}
                  totalPhotos={totalPhotos}
                  open={open}
                  setOpen={setOpen}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {photos.map(({ id, name, createdAt, totalPhotos }, index) => (
                <PhotoListItem
                  key={index}
                  id={id}
                  name={name}
                  createdAt={createdAt}
                  totalPhotos={totalPhotos}
                  open={open}
                  setOpen={setOpen}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoDashboard;
