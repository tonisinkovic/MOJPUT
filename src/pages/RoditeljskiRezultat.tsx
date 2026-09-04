import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, School, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import JuniorShareParents from "@/components/junior/JuniorShareParents";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import { programHref } from "@/lib/juniorProgramGuide";
import {
  decodeParentBrief,
  loadParentBrief,
  type ParentBrief,
} from "@/lib/juniorParentBrief";

export default function RoditeljskiRezultat() {
  const [params] = useSearchParams();
  const brief = useMemo<ParentBrief | null>(() => {
    const fromUrl = params.get("d");
    if (fromUrl) return decodeParentBrief(fromUrl);
    return loadParentBrief();
  }, [params]);

  return (
    <Layout>
      <section className="container mx-auto max-w-3xl px-3 py-8 sm:px-4 md:py-12">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 rounded-xl">
          <Link to="/roditelji?experience=junior">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Roditeljski kutak
          </Link>
        </Button>

        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Za roditelje</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Rezultat kviza djeteta</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Isti rezultat koji je dijete dobilo, napisan za kućni razgovor. Ovo nije dijagnoza ni
          naredba upisa — i nije kviz koji vi rješavate umjesto djeteta.
        </p>

        {!brief ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-center">
            <p className="text-sm font-semibold">Nema spremljenog rezultata</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Dijete prvo riješi kviz za 8. razred, zatim pošalje ovu stranicu.
            </p>
            <Button asChild size="sm" className="mt-3 rounded-xl">
              <Link to="/kviz-srednja">Otvori kviz</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-4 text-sm leading-relaxed">
              <p className="flex items-start gap-2 font-semibold">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
                {brief.confidence}
              </p>
            </div>

            <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
              <h2 className="text-lg font-bold">{brief.pathwayTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{brief.pathwayWhy}</p>
              {brief.city ? (
                <p className="mt-2 text-xs text-muted-foreground">Mjesto koje je dijete odabralo: {brief.city}</p>
              ) : null}
            </article>

            {brief.programs.map((p, i) => (
              <article key={p.name} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Program {i + 1}
                </p>
                <h3 className="mt-1 text-base font-bold">
                  <Link to={programHref({ name: p.name })} className="hover:underline">
                    {p.name}
                  </Link>{" "}
                  <span className="font-normal text-muted-foreground">
                    · {p.typeLabel} · {p.duration} god.
                  </span>
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {p.why.map((w) => (
                    <li key={w} className="leading-relaxed text-muted-foreground">
                      · {w}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Nakon škole: </span>
                  {p.after}
                </p>
                {p.schools.length > 0 ? (
                  <div className="mt-3 rounded-xl bg-muted/40 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                      <School className="h-3.5 w-3.5" />
                      Škole u blizini
                    </p>
                    <ul className="mt-1.5 space-y-1 text-sm">
                      {p.schools.map((s) => (
                        <li key={`${s.name}-${s.city}`} className="flex justify-between gap-3">
                          <span>
                            {s.name} <span className="text-muted-foreground">({s.city})</span>
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {s.km != null ? `~${s.km} km` : ""}
                            {s.prag != null ? ` · prag ${s.prag}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : brief.city ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    U krugu od 30 km nije bilo škole s ovim programom u bazi.
                  </p>
                ) : null}
              </article>
            ))}

            <article className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
              <h2 className="flex items-center gap-2 text-base font-bold">
                <MessageCircle className="h-4 w-4 text-primary" />
                Četiri pitanja za razgovor
              </h2>
              <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed">
                {brief.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">
                Ako želite usporediti očekivanja, koristite{" "}
                <Link
                  to="/roditeljski-kutak/zajednicka-procjena?experience=junior"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  zajedničku procjenu
                </Link>
                — dijete i roditelj odgovaraju odvojeno.
              </p>
            </article>

            <JuniorNumbersNote />
            <JuniorShareParents brief={brief} variant="outline" />
          </div>
        )}
      </section>
    </Layout>
  );
}
