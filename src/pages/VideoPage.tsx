import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Video as VideoIcon, Play, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const videos = [
  { title: "Kako odabrati pravi fakultet?", category: "Karijera", duration: "12:34", thumbnail: "🎓" },
  { title: "Iskustvo studiranja na FER-u", category: "Iskustva studenata", duration: "18:22", thumbnail: "💻" },
  { title: "Priprema za državnu maturu", category: "Matura", duration: "25:10", thumbnail: "📚" },
  { title: "Mentalno zdravlje maturanata", category: "Mentalno zdravlje", duration: "15:45", thumbnail: "🧠" },
  { title: "Studentski život u Zagrebu", category: "Iskustva studenata", duration: "20:00", thumbnail: "🏫" },
  { title: "Kako napisati motivacijsko pismo", category: "Karijera", duration: "10:15", thumbnail: "✍️" },
];

const categories = ["Sve", "Karijera", "Iskustva studenata", "Matura", "Mentalno zdravlje"];

const VideoPage = () => {
  const [activeCategory, setActiveCategory] = useState("Sve");

  const filtered = activeCategory === "Sve" ? videos : videos.filter((v) => v.category === activeCategory);

  return (
    <Layout>
      <section className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Video</span> sadržaji
          </h1>
          <p className="text-muted-foreground text-lg">Predavanja, iskustva studenata i edukativni materijali</p>
        </motion.div>

        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((c) => (
            <Badge
              key={c}
              variant={activeCategory === c ? "default" : "outline"}
              className={`cursor-pointer ${activeCategory === c ? "gradient-hero text-primary-foreground border-0" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video, i) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-card shadow-card border overflow-hidden group cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className="h-40 bg-muted flex items-center justify-center text-5xl relative">
                {video.thumbnail}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <Badge variant="secondary" className="text-xs mb-2">{video.category}</Badge>
                <h3 className="font-semibold text-sm mb-1">{video.title}</h3>
                <p className="text-xs text-muted-foreground">{video.duration}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default VideoPage;
