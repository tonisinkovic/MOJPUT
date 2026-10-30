import { Link, useParams } from "react-router-dom";
import { BookOpen, MapPin, School, TriangleAlert } from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JCard, JuniorPage, PageHero } from "@/components/junior-kit";
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
        <JuniorPage homeTo="/programi" crumb="Programi">
          <PageHero icon={BookOpen} tone="violet" badge="Programi" title="Program nije pronađen" lead="Provjeri poveznicu ili otvori popis programa." />
          <Button asChild className="mt-2 rounded-2xl">
            <Link to="/programi">Svi programi</Link>
          </Button>
        </JuniorPage>
      </Layout>
    );
  }

  return (
    <Layout>
      <JuniorPage homeTo="/programi" crumb={guide.program.name}>
        <PageHero icon={BookOpen} tone="violet" kicker="Program" badge={guide.typeLabel} title={guide.program.name} lead={guide.program.description} />
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
        <div className="mt-5 space-y-4">
          <JCard as="article">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <BookOpen className="h-4 w-4 text-primary" />
              Što se uči
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {guide.learnWhat.map((line) => (
                <li key={line}>· {line}</li>
              ))}
            </ul>
          </JCard>

          <JCard as="article">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <TriangleAlert className="h-4 w-4 text-amber-500" />
              Za koga nije
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {guide.notFor.map((line) => (
                <li key={line}>· {line}</li>
              ))}
            </ul>
          </JCard>

          <JCard as="article">
            <h2 className="text-base font-bold">Što poslije</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.program.afterSchool}</p>
            <p className="mt-3 text-xs text-muted-foreground">{guide.program.entryNote}</p>
          </JCard>

          <JCard as="article">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <School className="h-4 w-4 text-primary" />
              Škole u bazi
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {guide.totalSchools} škola u Hrvatskoj nudi sličan program — to su primjeri iz naše baze, ne
              službeni katalog svih smjerova.
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
              <p className="mt-3 text-sm text-muted-foreground">
                U popisu škola nema pouzdanog poklapanja po imenu. Ne izmišljamo školu koja nije u bazi —
                potraži službeni naziv na stranici škole ili na karti.
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" className="rounded-xl">
                <Link to="/srednje-skole">Otvori kartu</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-xl">
                <Link to="/kviz-srednja">Kviz za 8. razred</Link>
              </Button>
            </div>
          </JCard>

          <JuniorNumbersNote />
          <JuniorNumbersNote catalog className="mt-2" />
        </div>
      </JuniorPage>
    </Layout>
  );
}
