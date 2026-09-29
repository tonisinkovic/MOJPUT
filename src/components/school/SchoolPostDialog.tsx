import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SchoolPost } from "@/lib/schoolCmsApi";
import { schoolMediaUrl } from "@/lib/schoolCmsApi";
import { cn } from "@/lib/utils";

export const SCHOOL_POST_CATEGORY_LABEL: Record<string, string> = {
  dogadaj: "Događaj",
  upisi: "Upisi",
  uspjeh: "Uspjeh učenika",
  obavijest: "Obavijest",
  ostalo: "Objava",
};

export function formatSchoolPostDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
}

export default function SchoolPostDialog({
  open,
  onOpenChange,
  post,
  showSchool = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: SchoolPost | null;
  showSchool?: boolean;
}) {
  if (!post) return null;
  const cover = schoolMediaUrl(post.images[0]?.url);
  const rest = post.images.slice(1);
  const date = formatSchoolPostDate(post.publishedAt || post.createdAt);
  const href = post.schoolSlug ? `/srednje-skole/${post.schoolSlug}` : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-[calc(100%-1.5rem)] max-w-[36rem] gap-0 overflow-hidden rounded-3xl border-border/60 p-0 shadow-2xl sm:rounded-3xl">
        <div className="max-h-[88vh] overflow-y-auto">
          {cover && (
            <img src={cover} alt={post.images[0]?.alt || post.title} className="h-44 w-full object-cover md:h-56" />
          )}
          <div className="px-5 pb-5 pt-5 md:px-7 md:pb-6">
            <DialogHeader className="space-y-2 text-left">
              {post.category && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {SCHOOL_POST_CATEGORY_LABEL[post.category] || post.category}
                </p>
              )}
              <DialogTitle className="text-xl font-extrabold leading-tight tracking-tight md:text-2xl">
                {post.title}
              </DialogTitle>
              {showSchool && post.schoolName && href ? (
                <DialogDescription asChild>
                  <Link to={href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    <MapPin className="h-3.5 w-3.5" />
                    {post.schoolName}
                    {post.schoolCity ? ` · ${post.schoolCity}` : ""}
                  </Link>
                </DialogDescription>
              ) : (
                <DialogDescription className="text-sm font-medium text-muted-foreground">
                  {date ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {date}
                    </span>
                  ) : (
                    "Objava škole"
                  )}
                </DialogDescription>
              )}
            </DialogHeader>
            {showSchool && date && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {date}
              </p>
            )}
            {post.content && (
              <p className="mt-4 whitespace-pre-wrap text-[0.95rem] leading-relaxed tracking-tight text-foreground/85">
                {post.content}
              </p>
            )}
            {post.linkUrl && (
              <a
                href={post.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Više na webu škole
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {rest.length > 0 && (
              <div className={cn("mt-5 grid gap-2.5", rest.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                {rest.map((img) => {
                  const src = schoolMediaUrl(img.url);
                  if (!src) return null;
                  return (
                    <img
                      key={img.id}
                      src={src}
                      alt={img.alt || ""}
                      className="h-32 w-full rounded-2xl object-cover md:h-40"
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
