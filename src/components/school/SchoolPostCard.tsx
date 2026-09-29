import { useState } from "react";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import SchoolPostDialog, {
  SCHOOL_POST_CATEGORY_LABEL,
  formatSchoolPostDate,
} from "@/components/school/SchoolPostDialog";
import type { SchoolPost } from "@/lib/schoolCmsApi";
import { schoolMediaUrl } from "@/lib/schoolCmsApi";
import { cn } from "@/lib/utils";

function excerpt(text: string, max = 88): string {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

type Props = {
  post: SchoolPost;
  showSchool?: boolean;
};

export default function SchoolPostCard({ post, showSchool = false }: Props) {
  const [open, setOpen] = useState(false);
  const cover = schoolMediaUrl(post.images[0]?.url);
  const date = formatSchoolPostDate(post.publishedAt || post.createdAt);
  const preview = excerpt(post.content);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={cn(
          "group flex w-full gap-3 rounded-2xl border border-border/70 bg-card p-2.5 text-left shadow-sm transition",
          "hover:border-primary/35 hover:shadow-card",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        )}
      >
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-[4.75rem] w-[5.5rem] shrink-0 rounded-xl object-cover sm:h-24 sm:w-28"
          />
        ) : (
          <span className="flex h-[4.75rem] w-[5.5rem] shrink-0 items-center justify-center rounded-xl bg-muted text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:h-24 sm:w-28">
            Objava
          </span>
        )}
        <span className="min-w-0 flex-1 py-0.5">
          {showSchool && post.schoolName && (
            <span className="mb-1 flex items-center gap-1 truncate text-[11px] font-semibold text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {post.schoolName}
                {post.schoolCity ? ` · ${post.schoolCity}` : ""}
              </span>
            </span>
          )}
          <span className="flex flex-wrap items-center gap-1.5">
            {post.category && (
              <span className="rounded-full bg-primary/10 px-2 py-px text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                {SCHOOL_POST_CATEGORY_LABEL[post.category] || post.category}
              </span>
            )}
            {date && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {date}
              </span>
            )}
          </span>
          <span className="mt-1 block text-sm font-bold leading-snug tracking-tight">{post.title}</span>
          {preview ? (
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground line-clamp-2">{preview}</span>
          ) : null}
          <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-primary">
            Otvori
            <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
          </span>
        </span>
      </button>
      <SchoolPostDialog open={open} onOpenChange={setOpen} post={post} showSchool={showSchool} />
    </>
  );
}
