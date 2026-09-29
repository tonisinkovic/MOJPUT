import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Building2, Calculator, GraduationCap, MapPin, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
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
import { facultyInitial } from "@/lib/facultyCatalog";
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
        <PageSeo
          title="Fakultet nije pronađen | MojPut"
          description="Traženi fakultet ne postoji u MojPut katalogu."
        />
        <section className="container py-16">
          <h1 className="text-2xl font-extrabold tracking-tight">Fakultet nije pronađen</h1>
          <p className="mt-2 text-muted-foreground">Provjeri poveznicu ili se vrati na popis fakulteta.</p>
          <Button className="mt-4" asChild>
            <Link to="/fakulteti">Svi fakulteti</Link>
          </Button>
        </section>
      </Layout>
    );
  }

  const media = faculty.media ?? [];
  const activeMedia = media.find((item) => item.id === activeMediaId) || null;
  const about = faculty.longDescription || faculty.description;
  const levelsLabel = faculty.levels.length ? faculty.levels.join(" · ") : "nije navedeno";
  const canonical = `https://mojput.com/fakulteti/${faculty.id}`;

  return (
    <Layout>
      <PageSeo
        title={`${faculty.name} – ${faculty.city} | MojPut`}
        description={`${faculty.name} pri ${faculty.university} u gradu ${faculty.city}. Opis, kontakti i novosti ustanove.`}
        canonical={canonical}
        image={faculty.coverImageUrl || faculty.logoUrl}
      />
      <section className="container space-y-6 py-10 md:space-y-8 md:py-14">
        <article className="relative overflow-hidden rounded-3xl border bg-card shadow-card">
          {faculty.coverImageUrl ? (
            <img src={faculty.coverImageUrl} alt="" className="h-36 w-full object-cover md:h-48" />
          ) : (
            <div className="h-28 bg-gradient-to-r from-primary/25 via-primary/10 to-transparent md:h-36" />
          )}
          <div className="relative px-5 pb-6 md:px-8 md:pb-8">
            <div className="-mt-10 flex flex-col gap-4 md:-mt-12 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                {faculty.logoUrl ? (
                  <img
                    src={faculty.logoUrl}
                    alt={`Logo ${faculty.name}`}
                    className="h-20 w-20 rounded-2xl border-4 border-background object-cover shadow-lg md:h-24 md:w-24"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary text-2xl font-extrabold tracking-tight text-primary-foreground shadow-lg md:h-24 md:w-24 md:text-3xl">
                    {facultyInitial(faculty.name)}
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{faculty.area}</p>
                  <h1 className="mt-0.5 text-2xl font-extrabold leading-tight tracking-tight md:text-4xl">
                    {faculty.name}
                  </h1>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium tracking-tight text-muted-foreground md:text-base">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {faculty.city} · {faculty.university}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {faculty.verified ? (
                  <Badge className="gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verificiran fakultet
                  </Badge>
                ) : null}
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/fakulteti">Svi fakulteti</Link>
                </Button>
                <Button className="rounded-full" asChild>
                  <Link to="/kalkulator-fakulteti">
                    Kalkulator
                    <Calculator className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {faculty.websiteUrl ? (
                  <Button variant="outline" className="rounded-full" asChild>
                    <a href={faculty.websiteUrl} target="_blank" rel="noreferrer">
                      Web fakulteta
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </article>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
          <InfoPill icon={<MapPin className="h-4 w-4" />} label="Grad" value={faculty.city} />
          <InfoPill icon={<Building2 className="h-4 w-4" />} label="Ustanova" value={faculty.universityType} />
          <InfoPill icon={<GraduationCap className="h-4 w-4" />} label="Razina" value={levelsLabel} />
        </div>

        <article id="o-fakultetu" className="scroll-mt-24 rounded-2xl border bg-card p-5 shadow-card md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">O fakultetu</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">{faculty.university}</h2>
          <p className={`mt-4 text-sm leading-relaxed text-foreground/80 md:text-[0.95rem] ${descriptionExpanded ? "" : "line-clamp-5"}`}>
            {about}
          </p>
          {about.length > 220 ? (
            <Button
              type="button"
              variant="ghost"
              className="mt-2 px-0 text-primary hover:text-primary"
              onClick={() => setDescriptionExpanded((current) => !current)}
            >
              {descriptionExpanded ? "Prikaži manje" : "Pročitaj više"}
            </Button>
          ) : null}
        </article>

        <section className="rounded-2xl border bg-card p-5 shadow-card md:p-7">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Novosti</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">Objave fakulteta</h2>
            <p className="mt-1 text-sm text-muted-foreground">Najnovije objave prikazane su prve.</p>
          </div>
          {posts.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
              Ovaj fakultet trenutno nema javnih objava.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {posts.map((post) => (
                <FacultyPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-card md:p-7">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Galerija</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">Mediji</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fotografije i video sadržaji koje je fakultet objavio.</p>
          </div>
          {media.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/20 p-5 text-sm text-muted-foreground">
              Još nema medija na profilu.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <FacultyMediaCard key={item.id} item={item} onOpen={(entry) => setActiveMediaId(entry.id)} />
              ))}
            </div>
          )}
        </section>

        <Dialog open={Boolean(activeMedia)} onOpenChange={(open) => !open && setActiveMediaId(null)}>
          <DialogContent className="max-w-4xl overflow-hidden p-0">
            <DialogHeader className="border-b p-4">
              <DialogTitle>{activeMedia?.title}</DialogTitle>
              <DialogDescription>Medijski prikaz fakulteta</DialogDescription>
            </DialogHeader>
            {activeMedia?.type === "video" ? (
              <div className="aspect-video">
                <iframe title={activeMedia.title} src={activeMedia.url} className="h-full w-full" allowFullScreen />
              </div>
            ) : (
              <img
                src={activeMedia?.url}
                alt={activeMedia?.title}
                className="max-h-[70vh] w-full bg-black/10 object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </section>
    </Layout>
  );
};

export default FacultyProfile;
