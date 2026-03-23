import { motion } from "framer-motion";
import type { FacultyPost } from "@/types/faculty";

type FacultyPostCardProps = {
  post: FacultyPost;
};

const FacultyPostCard = ({ post }: FacultyPostCardProps) => {
  return (
    <motion.article
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border bg-card p-5 shadow-card"
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-44 object-cover rounded-xl mb-4"
        />
      )}
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <p className="text-muted-foreground mt-2 line-clamp-3">{post.content}</p>
      <p className="text-xs text-muted-foreground mt-4">
        {new Date(post.createdAt).toLocaleDateString("hr-HR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>
    </motion.article>
  );
};

export default FacultyPostCard;
