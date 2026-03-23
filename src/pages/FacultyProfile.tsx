import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InfoPill from "@/components/faculty/InfoPill";
import FacultyPostCard from "@/components/faculty/FacultyPostCard";
import FacultyMediaCard from "@/components/faculty/FacultyMediaCard";
import { getFacultyById, getFacultyPosts } from "@/lib/facultyStore";

const FacultyProfile = () => {
  const { facultyId = "" } = useParams();
  const faculty = useMemo(() => getFacultyById(facultyId), [facultyId]);
  const posts = useMemo(() => getFacultyPosts(facultyId), [facultyId]);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);

  if (!faculty) {
    return (
      <Layout>
        <section className="container py-16">
          <h1 className="text-2xl font-bold">Fakultet nije pronađen</h1>
          <p className="text-muted-foreground mt-2">Provjeri URL ili odaberi fakultet iz liste profila.</p>
        </section>
      </Layout>
    );
  }

  const media = faculty.media ?? [];
  const activeMedia = media.find((item) => item.id === activeMediaId) || null;
  const infoItems = [
    { label: "Grad", value: faculty.city, icon: <MapPin className="w-4 h-4" /> },
    { label: "Područje", value: faculty.area, icon: <Sparkles className="w-4 h-4" /> },
    {
      label: "Broj studenata",
      value: faculty.studentCount ? `${faculty.studentCount.toLocaleString("hr-HR")}+` : "N/A",
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  return (
    <Layout>
      <section className="container py-12 md:py-16 space-y-6 md:space-y-8">
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl border bg-card shadow-card"
        >
          <img
            src={faculty.coverImageUrl || "https://placehold.co/1200x400?text=Faculty+Cover"}
            alt={`${faculty.name} naslovna`}
            className="h-36 md:h-48 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="relative px-5 pb-6 md:px-8 md:pb-8">
            <div className="-mt-10 md:-mt-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <img
                  src={faculty.logoUrl}
                  alt={`${faculty.name} logo`}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-background object-cover shadow-lg"
                />
                <div>
                  <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">{faculty.name}</h1>
                  <p className="text-sm md:text-base text-muted-foreground mt-1">{faculty.city}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {faculty.verified && (
                  <Badge className="gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verificiran fakultet
                  </Badge>
                )}
                <Button variant="outline" asChild>
                  <a href="#o-fakultetu">Saznaj više</a>
                </Button>
                <Button asChild>
                  <a href={faculty.websiteUrl || "#"} target="_blank" rel="noreferrer">
                    Posjeti stranicu
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {infoItems.map((item) => (
            <InfoPill key={item.label} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </div>

        <article id="o-fakultetu" className="rounded-2xl border bg-card p-5 md:p-7 shadow-card scroll-mt-24">
          <h2 className="text-xl md:text-2xl font-semibold">O fakultetu</h2>
          <p className={`mt-3 text-muted-foreground leading-relaxed ${descriptionExpanded ? "" : "line-clamp-5"}`}>
            {faculty.longDescription || faculty.description}
          </p>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 px-0 text-primary hover:text-primary"
            onClick={() => setDescriptionExpanded((current) => !current)}
          >
            {descriptionExpanded ? "Prikaži manje" : "Pročitaj više"}
          </Button>
        </article>

        <section>
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-semibold">Objave</h2>
            <p className="text-sm text-muted-foreground mt-1">Najnovije objave prikazane su prve.</p>
          </div>
          <div className="grid gap-4">
            {posts.length === 0 ? (
              <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
                Ovaj fakultet trenutno nema javnih objava.
              </div>
            ) : (
              posts.map((post) => <FacultyPostCard key={post.id} post={post} />)
            )}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-semibold">Mediji</h2>
            <p className="text-sm text-muted-foreground mt-1">Pogledaj fotografije i video sadržaje fakulteta.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => (
              <FacultyMediaCard key={item.id} item={item} onOpen={(entry) => setActiveMediaId(entry.id)} />
            ))}
          </div>
        </section>

        <Dialog open={Boolean(activeMedia)} onOpenChange={(open) => !open && setActiveMediaId(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>{activeMedia?.title}</DialogTitle>
              <DialogDescription>Medijski prikaz fakulteta</DialogDescription>
            </DialogHeader>
            {activeMedia?.type === "video" ? (
              <div className="aspect-video">
                <iframe
                  title={activeMedia.title}
                  src={activeMedia.url}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <img src={activeMedia?.url} alt={activeMedia?.title} className="w-full max-h-[70vh] object-contain bg-black/10" />
            )}
          </DialogContent>
        </Dialog>

        <div className="fixed left-0 right-0 bottom-4 z-40 px-4">
          <div className="container">
            <div className="ml-auto w-full md:w-fit rounded-2xl border bg-card/95 backdrop-blur px-4 py-3 shadow-card flex items-center justify-between gap-4">
              <p className="text-sm font-medium">Zanima te ovaj fakultet?</p>
              <Button asChild size="sm">
                <Link to="/kontakt">Saznaj više</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FacultyProfile;
