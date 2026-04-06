import { getYouTubeEmbedSrc } from "@/lib/youtube";

type Props = {
  videoId: string;
  title?: string;
  className?: string;
  /** Ispuni roditelja s fiksnim aspect-video (npr. kartica) umjesto vlastitog omotača */
  fillParent?: boolean;
};

/**
 * Responsive 16:9 YouTube embed (iframe). Ne otvara vanjski tab.
 */
const YouTubeEmbed = ({ videoId, title = "YouTube video", className = "", fillParent }: Props) => {
  const src = getYouTubeEmbedSrc(videoId);

  const iframe = (
    <iframe
      className="absolute inset-0 h-full w-full border-0"
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );

  if (fillParent) {
    return <div className={`absolute inset-0 overflow-hidden bg-black ${className}`}>{iframe}</div>;
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-black shadow-md ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      {iframe}
    </div>
  );
};

export default YouTubeEmbed;
