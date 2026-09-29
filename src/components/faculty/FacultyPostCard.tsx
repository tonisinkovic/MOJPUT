import { useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import FacultyPostDialog, { formatFacultyPostDate } from "@/components/faculty/FacultyPostDialog";
import type { FacultyPost } from "@/types/faculty";
import { cn } from "@/lib/utils";

function excerpt(text: string, max = 88): string {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

type Props = {
  post: FacultyPost;
};

export default function FacultyPostCard({ post }: Props) {
  const [open, setOpen] = useState(false);
  const date = formatFacultyPostDate(post.createdAt);
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
        {post.imageUrl ? (
          <img src={post.imageUrl} alt="" className="h-[4.75rem] w-[5.5rem] shrink-0 rounded-xl object-cover sm:h-24 sm:w-28" />
        ) : (
          <span className="flex h-[4.75rem] w-[5.5rem] shrink-0 items-center justify-center rounded-xl bg-muted text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:h-24 sm:w-28">
            Objava
          </span>
        )}
        <span className="min-w-0 flex-1 py-0.5">
          {date ? (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {date}
            </span>
          ) : null}
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
      <FacultyPostDialog open={open} onOpenChange={setOpen} post={post} />
    </>
  );
}
