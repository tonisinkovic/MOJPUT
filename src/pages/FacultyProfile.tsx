import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Building2, Calculator, ChevronDown, GraduationCap, MapPin, ShieldCheck } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { facultyInitial } from "@/lib/facultyCatalog";
import { facultySummaryText, getFacultyPrograms, type FacultyProgramRow } from "@/lib/facultyPrograms";
import { getFacultyById, getFacultyPosts } from "@/lib/facultyStore";
import { CategoryTag, EmptyState, SBack, SCARD, SeniorBlobs } from "@/components/senior-kit";
import { cn } from "@/lib/utils";

function ProgramRow({ program, homeCity }: { program: FacultyProgramRow; homeCity: string }) {
  return (
    <li className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-snug">{program.name}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {program.city !== homeCity && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {program.city}
            </span>
          )}
          <span>
            {program.cutoff2025 !== null
              ? `Prag 2025.: ${program.cutoff2025}${program.maxBodovi ? ` / ${program.maxBodovi}` : ""} bod.`
              : "Prag 2025. nije objavljen"}
          </span>
        </p>
      </div>
      {program.programId && (
        <Button asChild size="sm" variant="outline" className="shrink-0 rounded-lg">
          <Link to={`/kalkulator-fakulteti?program=${encodeURIComponent(program.programId)}`}>
            Izračunaj bodove
            <Calculator className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
    </li>
  );
}

const FacultyProfile = () => {
  const { facultyId = "" } = useParams();
  const faculty = useMemo(() => getFacultyById(facultyId), [facultyId]);
  const posts = useMemo(() => getFacultyPosts(facultyId), [facultyId]);
  const programSummary = useMemo(
    () => (faculty ? getFacultyPrograms(faculty) : null),
    [faculty],
  );
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);

  if (!faculty || !programSummary) {
    return (
      <Layout>
        <PageSeo
          title="Fakultet nije pronađen | MojPut"
          description="Traženi fakultet ne postoji u MojPut katalogu."
        />
        <section className="sr-page relative mx-auto max-w-3xl px-3 py-16">
          <SeniorBlobs />
          <SBack crumb="Profil fakulteta" to="/fakulteti" label="Svi fakulteti" />
          <div className="mx-auto w-full max-w-xl">
          <EmptyState
            titleAs="h1"
            title="Fakultet nije pronađen"
            text="Provjeri poveznicu ili se vrati na popis fakulteta."
            action={
              <Link to="/fakulteti" className="inline-flex min-h-12 items-center rounded-xl sr-gold-btn px-6 text-base font-extrabold">
                Svi fakulteti
              </Link>
            }
          />
          </div>
        </section>
      </Layout>
    );
  }

  const media = faculty.media ?? [];
  const activeMedia = media.find((item) => item.id === activeMediaId) || null;
  const about = faculty.longDescription || facultySummaryText(faculty, programSummary);
  const regularPrograms = programSummary.programs.filter((p) => p.tags.length === 0);
  const variantPrograms = programSummary.programs.filter((p) => p.tags.length > 0);
  const levelsLabel = faculty.levels.length
    ? faculty.levels.join(" · ")
    : regularPrograms.length
      ? `${regularPrograms.length} programa`
      : "nije navedeno";
  const calculatorSearch = `/kalkulator-fakulteti?q=${encodeURIComponent(faculty.name.toLowerCase())}`;
  const canonical = `https://mojput.com/fakulteti/${faculty.id}`;

  return (
    <Layout>
      <PageSeo
        title={`${faculty.name} – ${faculty.city} | MojPut`}
        description={`${faculty.name} (${faculty.city}): studijski programi, pragovi za upis 2025. i izračun bodova.`}
        canonical={canonical}
        image={faculty.coverImageUrl || faculty.logoUrl}
      />
      <section className="sr-page relative mx-auto max-w-5xl space-y-6 px-3 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-5 sm:px-4 md:space-y-8 md:py-12">
        <SeniorBlobs />
        <SBack crumb={faculty.name} to="/fakulteti" label="Svi fakulteti" />
        <article className={cn(SCARD, "relative overflow-hidden p-0")}>
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
                  <CategoryTag>{faculty.area}</CategoryTag>
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
                <Button variant="outline" className="min-h-11 rounded-xl" asChild>
                  <Link to="/fakulteti">Svi fakulteti</Link>
                </Button>
                <Button className="min-h-11 rounded-xl sr-gold-btn border-0 text-[hsl(var(--sr-night))] hover:bg-transparent" asChild>
                  <Link to={calculatorSearch}>
                    Kalkulator
                    <Calculator className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {faculty.websiteUrl ? (
                  <Button variant="outline" className="min-h-11 rounded-xl" asChild>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <InfoPill icon={<MapPin className="h-4 w-4" />} label="Grad" value={faculty.city} />
          <InfoPill icon={<Building2 className="h-4 w-4" />} label="Ustanova" value={faculty.universityType} />
          <InfoPill
            icon={<GraduationCap className="h-4 w-4" />}
            label={faculty.levels.length ? "Razina" : "Studiji"}
            value={levelsLabel}
          />
        </div>

        <article id="o-fakultetu" className={cn(SCARD, "scroll-mt-24 p-5 md:p-7")}>
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

        <section id="programi" className={cn(SCARD, "scroll-mt-24 p-5 md:p-7")}>
          <div className="mb-4">
            <p className="sr-type-label text-[hsl(var(--sr-cyan-t))]">Upisi</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">Studijski programi i pragovi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Prag je broj bodova zadnjeg upisanog kandidata na upisima 2025. (izvor: postani-student.hr). Pragovi se
              mijenjaju svake godine — uzmi ih kao orijentir.
            </p>
          </div>
          {regularPrograms.length === 0 && variantPrograms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-5 text-sm text-muted-foreground">
              Za ovo učilište još nemamo popis programa. Provjeri na{" "}
              <a href="https://www.postani-student.hr" target="_blank" rel="noreferrer" className="text-primary underline">
                postani-student.hr
              </a>
              .
            </div>
          ) : (
            <ul className="divide-y rounded-xl border">
              {regularPrograms.map((p) => (
                <ProgramRow key={`${p.city}|${p.name}`} program={p} homeCity={faculty.city} />
              ))}
            </ul>
          )}
          {variantPrograms.length > 0 && (
            <Collapsible className="mt-4">
              <CollapsibleTrigger asChild>
                <Button type="button" variant="ghost" className="gap-1 px-0 text-primary hover:text-primary">
                  Izvanredni, stručni i posebni natječaji ({variantPrograms.length})
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="mb-2 text-xs text-muted-foreground">
                  Ovi natječaji imaju vlastite uvjete — kalkulator za njih ne računa bodove.
                </p>
                <ul className="divide-y rounded-xl border">
                  {variantPrograms.map((p) => (
                    <ProgramRow key={`${p.city}|${p.name}`} program={p} homeCity={faculty.city} />
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )}
        </section>

        <section className={cn(SCARD, "p-5 md:p-7")}>
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Novosti</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">Objave fakulteta</h2>
            <p className="mt-1 text-sm text-muted-foreground">Najnovije objave prikazane su prve.</p>
          </div>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-5 text-sm text-muted-foreground">
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

        <section className={cn(SCARD, "p-5 md:p-7")}>
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Galerija</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">Mediji</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fotografije i video sadržaji koje je fakultet objavio.</p>
          </div>
          {media.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 p-5 text-sm text-muted-foreground">
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
