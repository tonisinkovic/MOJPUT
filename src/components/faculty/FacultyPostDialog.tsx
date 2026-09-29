import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FacultyPost } from "@/types/faculty";

export function formatFacultyPostDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
}

export default function FacultyPostDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: FacultyPost | null;
}) {
  if (!post) return null;
  const date = formatFacultyPostDate(post.createdAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-[calc(100%-1.5rem)] max-w-[36rem] gap-0 overflow-hidden rounded-3xl border-border/60 p-0 shadow-2xl">
        <div className="max-h-[88vh] overflow-y-auto">
          {post.imageUrl ? <img src={post.imageUrl} alt="" className="h-44 w-full object-cover md:h-56" /> : null}
          <div className="px-5 pb-5 pt-5 md:px-7 md:pb-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-xl font-extrabold leading-tight tracking-tight md:text-2xl">
                {post.title}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground">
                {date ? (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {date}
                  </span>
                ) : (
                  "Objava fakulteta"
                )}
              </DialogDescription>
            </DialogHeader>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{post.content}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
