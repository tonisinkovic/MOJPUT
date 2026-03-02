import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, MessageCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const topics = [
  {
    title: "Koji fakultet za IT karijeru?",
    author: "Marko K.",
    category: "Fakulteti",
    replies: 24,
    likes: 18,
    time: "Prije 2 sata",
  },
  {
    title: "Kako se pripremiti za maturu iz matematike?",
    author: "Ana M.",
    category: "Matura",
    replies: 31,
    likes: 42,
    time: "Prije 5 sati",
  },
  {
    title: "Iskustva sa studentskim domom u Zagrebu",
    author: "Ivan P.",
    category: "Studentski život",
    replies: 15,
    likes: 22,
    time: "Jučer",
  },
  {
    title: "Medicina ili farmacija - pomoć pri odluci",
    author: "Lucija S.",
    category: "Fakulteti",
    replies: 19,
    likes: 14,
    time: "Jučer",
  },
  {
    title: "Najbolji načini za zaradu tijekom studija",
    author: "Petar R.",
    category: "Studentski život",
    replies: 38,
    likes: 55,
    time: "Prije 3 dana",
  },
];

const Forum = () => {
  return (
    <Layout>
      <section className="container py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Forum</span> za učenike
          </h1>
          <p className="text-muted-foreground text-lg">Razmijeni iskustva i postavi pitanja</p>
        </motion.div>

        <div className="space-y-3">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-5 rounded-xl bg-card shadow-card border hover:shadow-card-hover transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{topic.category}</Badge>
                    <span className="text-xs text-muted-foreground">{topic.time}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{topic.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{topic.author}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{topic.replies}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{topic.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Forum;
