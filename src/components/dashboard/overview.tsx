"use client";

import React, { useState, useRef } from "react";
import {
	Grid,
	List,
	Image,
	AlertCircle,
	Users,
	Sparkles,
	Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFolders } from "@/db/queries/subjects";
import { useQuery } from "@tanstack/react-query";
import { useDeleteFolderMutation } from "@/actions/folder";
import UploadDialog from "./upload/dialog";
import PhotoListItem from "./list";
import PhotoCard from "./cards";

const PhotoDashboard = () => {
	const [viewMode, setViewMode] = useState("grid");
	// const [searchTerm, setSearchTerm] = useState("");
	// const [selectedFilter, setSelectedFilter] = useState("all");
	const [open, setOpen] = useState(false);
	const [openUpload, setOpenUpload] = useState(false);
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

	// const categories = ["all", "Landscapes", "Nature", "Urban", "Art"];

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
	if (isPending)
		return (
			<div className="min-h-screen bg-photo-stone-50 p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center space-y-4">
						<div className="w-12 h-12 border-4 border-photo-green-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
						<p className="text-photo-stone-600">
							Loading your photo collections...
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
							Error loading photos. Please try again.
						</p>
					</div>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-photo-stone-50 p-6">
			<Input
				type="file"
				ref={fileInputRef}
				// onChange={handleFileUpload}
				multiple
				accept="image/*"
				className="hidden"
			/>

			{/* Header Section */}
			<div className="mb-8">
				{/* <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-photo-stone-800">
              Photo Collections
            </h1>
            <p className="text-photo-stone-600 mt-1">
              Organize and manage your photo collections
            </p>
          </div>
          <Button className="bg-photo-green-300 hover:bg-photo-green-400 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div> */}

				<Card className="border-photo-stone-200 shadow-sm">
					<CardContent className="p-6">
						<div className="flex flex-col lg:flex-row gap-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full">
								<Card className="border-photo-stone-200">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-photo-sage-100 rounded-full flex items-center justify-center">
												<Users className="w-5 h-5 text-photo-sage-600" />
											</div>
											<div>
												<p className="text-sm text-photo-stone-600">
													Total Collections
												</p>
												<p className="text-2xl font-bold text-photo-stone-800">
													{photos.length}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
								<Card className="border-photo-stone-200">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-photo-amber-100 rounded-full flex items-center justify-center">
												<Image className="w-5 h-5 text-photo-amber-600" />
											</div>
											<div>
												<p className="text-sm text-photo-stone-600">
													Total Photos
												</p>
												<p className="text-2xl font-bold text-photo-stone-800">
													{photos.reduce(
														(sum, photo) => sum + (photo.totalPhotos || 0),
														0,
													)}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
								<Card className="border-photo-stone-200">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-photo-emerald-100 rounded-full flex items-center justify-center">
												<Sparkles className="w-5 h-5 text-photo-emerald-600" />
											</div>
											<div>
												<p className="text-sm text-photo-stone-600">
													People Identified
												</p>
												<p className="text-2xl font-bold text-photo-stone-800">
													{Math.floor(photos.length * 2.3)} {/* Mock data */}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
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

			{/* Photo Collections Grid */}
			<div className="space-y-6">
				{photos.length === 0 ? (
					<Card className="border-none bg-transparent shadow-none">
						<CardContent className="p-12">
							<div className="text-center space-y-6">
								<div className="w-24 h-24 bg-photo-green-100 rounded-full flex items-center justify-center mx-auto">
									<Image className="w-12 h-12 text-photo-green-300" />
								</div>
								<div className="space-y-2">
									<h3 className="text-xl font-semibold text-photo-stone-800">
										No collections yet
									</h3>
									<p className="text-photo-stone-600 max-w-md mx-auto">
										Start organizing your photos by uploading them and letting
										our AI automatically group them by people and scenes.
									</p>
								</div>
								<Button
									onClick={() => setOpenUpload(!openUpload)}
									className="bg-photo-green-300 hover:bg-photo-green-400 text-white px-8"
								>
									<Plus className="w-4 h-4 mr-2" />
									Upload Your First Photos
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<>
						{/* Collections Grid/List */}
						{viewMode === "grid" ? (
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
										onDelete={(folderId) => deleteFolder(folderId)}
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
										onDelete={(folderId) => deleteFolder(folderId)}
									/>
								))}
							</div>
						)}
					</>
				)}
			</div>
			<UploadDialog open={openUpload} setOpen={setOpenUpload} />
		</div>
	);
};

export default PhotoDashboard;
