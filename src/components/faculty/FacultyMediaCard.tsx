import { Play } from "lucide-react";
import type { Faculty } from "@/types/faculty";

type MediaItem = NonNullable<Faculty["media"]>[number];

type FacultyMediaCardProps = {
  item: MediaItem;
  onOpen: (item: MediaItem) => void;
};

const FacultyMediaCard = ({ item, onOpen }: FacultyMediaCardProps) => {
  const preview = item.type === "video" ? item.thumbnailUrl : item.url;
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group relative overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      {preview ? (
        <img
          src={preview}
          alt={item.title}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-muted">
          <Play className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3 text-left text-white">
        <p className="text-sm font-medium">{item.title}</p>
      </div>
      {item.type === "video" && preview ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-background/90 p-3 text-foreground">
            <Play className="h-5 w-5" />
          </span>
        </div>
      ) : null}
    </button>
  );
};

export default FacultyMediaCard;
