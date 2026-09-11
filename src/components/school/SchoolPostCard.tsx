import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import type { SchoolPost } from "@/lib/schoolCmsApi";
import { schoolMediaUrl } from "@/lib/schoolCmsApi";

const CATEGORY_LABEL: Record<string, string> = {
  dogadaj: "Događaj",
  upisi: "Upisi",
  uspjeh: "Uspjeh učenika",
  obavijest: "Obavijest",
  ostalo: "Objava",
};

type Props = {
  post: SchoolPost;
  showSchool?: boolean;
};

export default function SchoolPostCard({ post, showSchool = false }: Props) {
  const cover = schoolMediaUrl(post.images[0]?.url);
  const dateRaw = post.publishedAt || post.createdAt;
  const date = dateRaw
    ? new Date(dateRaw).toLocaleDateString("hr-HR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";
  const href = post.schoolSlug ? `/srednje-skole/${post.schoolSlug}` : undefined;

  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-card sm:p-5">
      {cover && (
        <img src={cover} alt={post.images[0]?.alt || post.title} className="mb-4 h-44 w-full rounded-xl object-cover" />
      )}
      {showSchool && post.schoolName && href && (
        <Link to={href} className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          <MapPin className="h-3 w-3" />
          {post.schoolName}
          {post.schoolCity ? ` · ${post.schoolCity}` : ""}
        </Link>
      )}
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {post.category && <span>{CATEGORY_LABEL[post.category] || post.category}</span>}
        {date && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
        )}
      </div>
      <h3 className="mt-1 text-lg font-semibold leading-snug">{post.title}</h3>
      {post.content && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{post.content}</p>}
      {post.linkUrl && (
        <a
          href={post.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Otvori poveznicu
        </a>
      )}
      {post.images.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {post.images.slice(1, 4).map((img) => {
            const src = schoolMediaUrl(img.url);
            if (!src) return null;
            return <img key={img.id} src={src} alt={img.alt || ""} className="h-20 w-full rounded-lg object-cover" />;
          })}
        </div>
      )}
    </article>
  );
}
