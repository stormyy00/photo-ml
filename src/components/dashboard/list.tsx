import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  Users,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "../ui/badge";

const PhotoListItem = ({
  id,
  name,
  createdAt,
  totalPhotos,
  onOpenDialog,
}: {
  id: string;
  name: string;
  createdAt: Date | null;
  totalPhotos: number | null;
  onOpenDialog: (id: string, name: string) => void;
}) => {
  return (
    <>
      <Card className="transition-all duration-300 border-0 shadow-lg hover:shadow-xl bg-white/90 backdrop-blur-sm group">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-photo-green-100 via-photo-green-100/50 to-photo-green-200/30 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                <div className="absolute top-1 right-1 w-8 h-8 bg-white/20 rounded-full blur-lg"></div>
                <FolderCheck className="w-10 h-10 text-photo-green-300 relative z-10" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-photo-green-300 mb-2 truncate">
                    {name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-photo-green-300/70">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {createdAt
                          ? new Date(createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No date"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-photo-green-300/70">
                      <Image className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {totalPhotos || 0} photos
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="bg-photo-green-100 text-photo-green-300 text-xs font-semibold border-0 rounded-full"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      People
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-photo-green-100 text-photo-green-300 text-xs font-semibold border-0 rounded-full"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Scenes
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full hover:bg-photo-green-100/50"
                  >
                    <Heart
                      className={`w-5 h-5 ${true ? "fill-photo-green-300 text-photo-green-300" : "text-photo-green-300/60"}`}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full hover:bg-photo-green-100/50"
                      >
                        <MoreHorizontal className="w-5 h-5 text-photo-green-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border-0 shadow-xl"
                    >
                      <DropdownMenuItem className="rounded-lg cursor-pointer">
                        <Eye className="w-4 h-4 mr-2 text-photo-green-300" />
                        <span className="text-photo-green-300">
                          View Collection
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">
                        <Download className="w-4 h-4 mr-2 text-photo-green-300" />
                        <span className="text-photo-green-300">
                          Download All
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-photo-green-100/50" />
                      <DropdownMenuItem
                        className="rounded-lg cursor-pointer text-photo-green-300 focus:text-photo-green-300"
                        onClick={() => onOpenDialog(id, name)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Collection
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PhotoListItem;
