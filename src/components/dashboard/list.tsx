import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	Calendar,
	Download,
	Eye,
	FolderCheck,
	Heart,
	MoreHorizontal,
	Trash2,
	Image,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "../ui/separator";

const PhotoListItem = ({
	id,
	name,
	createdAt,
	totalPhotos,
	open,
	setOpen,
	onDelete,
}: {
	id: string;
	name: string;
	createdAt: Date | null;
	totalPhotos: number | null;
	open: boolean;
	setOpen: (open: boolean) => void;
	onDelete: ({ folderId }: { folderId: string }) => void;
}) => {
	return (
		<Card className="transition-all duration-200 border-photo-stone-200 hover:border-photo-green-300">
			<CardContent className="p-6">
				<div className="flex items-center gap-6">
					<div className="w-20 h-20 bg-gradient-to-br from-photo-green-100 to-photo-sage-100 rounded-xl flex items-center justify-center">
						<FolderCheck className="w-10 h-10 text-photo-green-300" />
					</div>
					<div className="flex-1">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-semibold text-lg text-photo-stone-800">
									{name}
								</h3>
								<p className="text-sm text-photo-stone-600">
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2">
											<Calendar className="w-4 h-4" />
											{createdAt
												? new Date(createdAt).toLocaleDateString()
												: "No date"}
										</div>
										<div className="flex items-center gap-2">
											<Image className="w-4 h-4" />
											{totalPhotos || 0} photos
										</div>
									</div>
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
															onDelete({ folderId: id });
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
};

export default PhotoListItem;
