import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Calendar,
  Download,
  Eye,
  FolderCheck,
  Heart,
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

const PhotoCard = ({
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
    <>
      <Card className="group overflow-hidden transition-all duration-300  border-photo-stone-200 hover:border-photo-green-300">
        <div className="relative">
          <div className="w-full h-48 bg-gradient-to-br from-photo-green-100 to-photo-sage-100 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-photo-green-300/20 rounded-full flex items-center justify-center mx-auto">
                <FolderCheck className="w-8 h-8 text-photo-green-300" />
              </div>
              <p className="text-photo-stone-600 text-sm font-medium">
                Photo Collection
              </p>
            </div>
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/95 hover:bg-white shadow-lg"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/95 hover:bg-white shadow-lg"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/95 hover:bg-white text-photo-rose-500 hover:text-photo-rose-600 shadow-lg"
                onClick={() => setOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-photo-stone-600 backdrop-blur-sm"
          >
            <Heart
              className={`w-4 h-4 ${true ? "fill-photo-rose-500 text-photo-rose-500" : ""}`}
            />
          </Button>
        </div>

        <CardContent className="p-5">
          <CardTitle className="text-lg mb-2 truncate text-photo-stone-800">
            {name}
          </CardTitle>
          <CardDescription className="mb-4 text-photo-stone-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {createdAt ? new Date(createdAt).toLocaleDateString() : "No date"}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Image className="w-4 h-4" />
              {totalPhotos || 0} photos
            </div>
          </CardDescription>
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className="bg-photo-sage-100 text-photo-sage-700 text-xs"
            >
              <Users className="w-3 h-3 mr-1" />
              People
            </Badge>
            <Badge
              variant="secondary"
              className="bg-photo-amber-100 text-photo-amber-700 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Scenes
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-xl text-photo-stone-800 font-semibold">
            Delete Collection
          </DialogTitle>
          <p className="text-photo-stone-600">
            Are you sure you want to delete {'"'}
            {name}
            {'"'}? This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-photo-stone-300 text-photo-stone-600 hover:bg-photo-stone-100"
            >
              Cancel
            </Button>
            <Button
              className="bg-photo-rose-500 hover:bg-photo-rose-600 text-white"
              onClick={() => {
                onDelete({ folderId: id });
                setOpen(false);
              }}
            >
              Delete Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoCard;
