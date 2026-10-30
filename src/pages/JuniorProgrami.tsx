import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Hammer, Palette, Wrench } from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import { JuniorPage, PageHero, SectionHeader, TONE } from "@/components/junior-kit";
import { juniorProgramTypeLabels, type HighSchoolProgramType } from "@/lib/juniorQuizEngine";
import { programsByType } from "@/lib/juniorProgramGuide";

const TYPE_ICON: Record<HighSchoolProgramType, typeof GraduationCap> = {
  gimnazija: GraduationCap,
  tehnicka: Wrench,
  umjetnicka: Palette,
  obrtnicka: Hammer,
};

const TYPE_ORDER: HighSchoolProgramType[] = ["gimnazija", "tehnicka", "umjetnicka", "obrtnicka"];
const TYPE_TONE: Record<HighSchoolProgramType, "violet" | "sky" | "coral" | "amber"> = {
  gimnazija: "violet",
  tehnicka: "sky",
  umjetnicka: "coral",
  obrtnicka: "amber",
};

export default function JuniorProgrami() {
  const grouped = programsByType();

  return (
    <Layout>
      <JuniorPage crumb="Programi">
        <PageHero
          icon={BookOpen}
          tone="violet"
          kicker="Smjerovi"
          badge="MojPut Junior"
          title={
            <>
              Programi <span className="text-[hsl(var(--jh-violet))]">srednjih škola</span>
            </>
          }
          lead="Što se uči, za koga program nije, traje li 3 ili 4 godine, treba li prijemni i koje škole ga nude. Kviz i chatbot vode ovdje, ne samo na postotak."
        />
        <JuniorNumbersNote catalog className="mb-8 max-w-2xl" />

        <div className="space-y-8">
          {TYPE_ORDER.map((type) => {
            const Icon = TYPE_ICON[type];
            const tone = TONE[TYPE_TONE[type]];
            return (
              <div key={type}>
                <SectionHeader
                  title={
                    <span className="inline-flex items-center gap-2">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${tone.grad}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      {juniorProgramTypeLabels[type]}
                    </span>
                  }
                  tone={TYPE_TONE[type]}
                />
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {grouped[type].map((guide) => (
                    <li key={guide.slug}>
                      <Link
                        to={`/programi/${guide.slug}`}
                        className="block h-full rounded-[1.75rem] border border-border/70 bg-card p-5 shadow-[0_24px_50px_-34px_hsl(var(--jh-ink)/0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_60px_-30px_hsl(var(--jh-ink)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-extrabold leading-snug">{guide.program.name}</h3>
                          <Badge variant="secondary" className="shrink-0 rounded-full">
                            {guide.program.duration} god.
                          </Badge>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                          {guide.program.description}
                        </p>
                        <p className="mt-2 text-[11px] font-bold text-muted-foreground">
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
      </JuniorPage>
    </Layout>
  );
}
