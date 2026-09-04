import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, MapPin, School, TriangleAlert } from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import { buildProgramGuide, findProgramBySlug } from "@/lib/juniorProgramGuide";
import { mapSchoolHref } from "@/lib/juniorPath";

export default function JuniorProgramDetail() {
  const { slug = "" } = useParams();
  const program = findProgramBySlug(slug);
  const guide = program ? buildProgramGuide(program) : null;

  if (!guide) {
    return (
      <Layout>
        <section className="container mx-auto max-w-3xl px-3 py-12">
          <h1 className="text-2xl font-bold">Program nije pronađen</h1>
          <p className="mt-2 text-sm text-muted-foreground">Provjeri poveznicu ili otvori popis programa.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/programi">Svi programi</Link>
          </Button>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto max-w-3xl px-3 py-8 sm:px-4 md:py-12">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 rounded-xl">
          <Link to="/programi">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Svi programi
          </Link>
        </Button>

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{guide.typeLabel}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{guide.program.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="secondary">{guide.program.duration} godine</Badge>
          <Badge variant="outline">
            {guide.program.entryBar === "visok"
              ? "Viši prag"
              : guide.program.entryBar === "srednji"
                ? "Srednji prag"
                : "Niži prag"}
          </Badge>
          {guide.extraExam ? <Badge className="bg-amber-500 text-white hover:bg-amber-500">Prijemni / provjera</Badge> : null}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{guide.program.description}</p>

        <div className="mt-6 space-y-4">
          <article className="rounded-2xl border border-border/70 bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <BookOpen className="h-4 w-4 text-primary" />
              Što se uči
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {guide.learnWhat.map((line) => (
                <li key={line}>· {line}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border/70 bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <TriangleAlert className="h-4 w-4 text-amber-500" />
              Za koga nije
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {guide.notFor.map((line) => (
                <li key={line}>· {line}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border/70 bg-card p-5">
            <h2 className="text-base font-bold">Što poslije</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.program.afterSchool}</p>
            <p className="mt-3 text-xs text-muted-foreground">{guide.program.entryNote}</p>
          </article>

          <article className="rounded-2xl border border-border/70 bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <School className="h-4 w-4 text-primary" />
              Škole u bazi
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {guide.totalSchools} škola u Hrvatskoj nudi sličan program.
            </p>
            {guide.exampleSchools.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {guide.exampleSchools.map((s) => (
                  <li key={`${s.name}-${s.city}`} className="flex items-center justify-between gap-3">
                    <span>
                      {s.name} <span className="text-muted-foreground">({s.city})</span>
                    </span>
                    <Button asChild size="sm" variant="ghost" className="h-8 rounded-lg px-2 text-xs">
                      <Link to={mapSchoolHref(null, s.name, s.city)}>
                        <MapPin className="mr-1 h-3 w-3" />
                        Karta
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">U popisu škola nema pouzdanog poklapanja po imenu.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" className="rounded-xl">
                <Link to="/srednje-skole">Otvori kartu</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-xl">
                <Link to="/kviz-srednja">Kviz za 8. razred</Link>
              </Button>
            </div>
          </article>

          <JuniorNumbersNote />
        </div>
      </section>
    </Layout>
  );
}
