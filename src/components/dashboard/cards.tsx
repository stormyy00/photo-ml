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
import { Badge } from "../ui/badge";

const PhotoCard = ({
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
    <Card className="group overflow-hidden transition-all duration-300 border-0 shadow-lg hover:shadow-2xl bg-white/90 backdrop-blur-sm hover:-translate-y-1">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-photo-green-100 via-photo-green-100/50 to-photo-green-200/30 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-photo-green-200/30 rounded-full blur-xl"></div>

          <div className="text-center space-y-3 relative z-10">
            <div className="w-16 h-16 bg-photo-green-300/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border-2 border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FolderCheck className="w-8 h-8 text-photo-green-300" />
            </div>
            <p className="text-photo-green-300/80 text-sm font-semibold">
              Photo Collection
            </p>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-photo-green-300/95 via-photo-green-300/80 to-photo-green-300/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Button
              size="sm"
              className="bg-white hover:bg-white/90 text-photo-green-300 shadow-xl rounded-xl h-10 w-10 p-0"
            >
              <Eye className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              className="bg-white hover:bg-white/90 text-photo-green-300 shadow-xl rounded-xl h-10 w-10 p-0"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              className="bg-white hover:bg-white/90 text-photo-green-300 shadow-xl rounded-xl h-10 w-10 p-0"
              onClick={() => onOpenDialog(id, name)}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full h-9 w-9 p-0 shadow-md"
        >
          <Heart
            className={`w-4 h-4 ${true ? "fill-photo-green-300 text-photo-green-300" : "text-photo-green-300/60"}`}
          />
        </Button>
      </div>

      <CardContent className="p-6">
        <CardTitle className="text-lg mb-3 truncate text-photo-green-300 font-bold">
          {name}
        </CardTitle>

        <CardDescription className="mb-4 space-y-2">
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
        </CardDescription>

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
      </CardContent>
    </Card>
  );
};

export default PhotoCard;
