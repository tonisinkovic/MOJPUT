import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Hammer, Palette, Wrench } from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { juniorProgramTypeLabels, type HighSchoolProgramType } from "@/lib/juniorQuizEngine";
import { programsByType } from "@/lib/juniorProgramGuide";

const TYPE_ICON: Record<HighSchoolProgramType, typeof GraduationCap> = {
  gimnazija: GraduationCap,
  tehnicka: Wrench,
  umjetnicka: Palette,
  obrtnicka: Hammer,
};

const TYPE_ORDER: HighSchoolProgramType[] = ["gimnazija", "tehnicka", "umjetnicka", "obrtnicka"];

export default function JuniorProgrami() {
  const grouped = programsByType();

  return (
    <Layout>
      <section className="container mx-auto max-w-5xl px-3 py-8 sm:px-4 md:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">MojPut Junior</p>
        <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight">
          <BookOpen className="h-7 w-7 text-primary" />
          Programi srednjih škola
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Što se uči, za koga program nije, traje li 3 ili 4 godine, treba li prijemni i koje škole ga nude.
          Kviz i chatbot vode ovdje, ne samo na postotak.
        </p>

        <div className="mt-8 space-y-8">
          {TYPE_ORDER.map((type) => {
            const Icon = TYPE_ICON[type];
            return (
              <div key={type}>
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Icon className="h-5 w-5 text-primary" />
                  {juniorProgramTypeLabels[type]}
                </h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {grouped[type].map((guide) => (
                    <li key={guide.slug}>
                      <Link
                        to={`/programi/${guide.slug}`}
                        className="block rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold leading-snug">{guide.program.name}</h3>
                          <Badge variant="secondary" className="shrink-0">
                            {guide.program.duration} god.
                          </Badge>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                          {guide.program.description}
                        </p>
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          {guide.totalSchools} škola
                          {guide.extraExam ? " · prijemni / provjera" : ""}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
