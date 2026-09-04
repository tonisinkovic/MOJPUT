import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkX, Calculator, Columns3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { juniorProgramTypeLabels } from "@/lib/juniorQuizEngine";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import { programHref } from "@/lib/juniorProgramGuide";
import {
  CHANCE_TONE,
  calculatorHref,
  chanceFor,
  effectiveJuniorPoints,
  loadShortlist,
  mapSchoolHref,
  onJuniorPointsChange,
  onShortlistChange,
  removeFromShortlist,
  type JuniorShortlistItem,
} from "@/lib/juniorPath";

const ENTRY_LABEL = {
  visok: "Viši prag",
  srednji: "Srednji prag",
  nizi: "Niži prag",
} as const;

function highlight<T>(
  items: T[],
  pick: (item: T) => number | null,
  prefer: "min" | "max",
): Set<string> {
  const scored = items
    .map((item) => ({ item, n: pick(item) }))
    .filter((x): x is { item: T; n: number } => x.n != null);
  if (scored.length === 0) return new Set();
  const best = prefer === "min" ? Math.min(...scored.map((x) => x.n)) : Math.max(...scored.map((x) => x.n));
  return new Set(
    scored
      .filter((x) => x.n === best)
      .map((x) => (x.item as JuniorShortlistItem).key),
  );
}

export default function JuniorSchoolCompare({ compact = false }: { compact?: boolean }) {
  const [items, setItems] = useState<JuniorShortlistItem[]>(() => loadShortlist());
  const [points, setPoints] = useState<number | null>(() => effectiveJuniorPoints());

  useEffect(() => {
    const offA = onShortlistChange(() => setItems(loadShortlist()));
    const offB = onJuniorPointsChange(() => setPoints(effectiveJuniorPoints()));
    return () => {
      offA();
      offB();
    };
  }, []);

  const closest = useMemo(() => highlight(items, (i) => i.distanceKm, "min"), [items]);
  const lowestPrag = useMemo(() => highlight(items, (i) => i.pragMin, "min"), [items]);
  const bestMatch = useMemo(() => highlight(items, (i) => i.matchPercentage, "max"), [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-center">
        <Columns3 className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-semibold">Još nemaš spremljenih škola</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Na rezultatu kviza spremi do 5 škola (najviše 3 programa) pa ih usporedi ovdje.
        </p>
        <Button asChild size="sm" className="mt-3 rounded-xl">
          <Link to="/kviz-srednja">Otvori kviz</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!compact && items.length >= 2 ? (
        <p className="text-xs text-muted-foreground">
          Istaknuto: najbliža škola, najniži prag i najbolje podudaranje s kvizom.
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const chance = points != null && item.pragMin != null ? chanceFor(points, item.pragMin) : null;
          return (
            <article
              key={item.key}
              className="flex flex-col rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold leading-snug">{item.schoolName}</h3>
                  <p className="text-xs text-muted-foreground">{item.city}</p>
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeFromShortlist(item.key)}
                  aria-label="Ukloni"
                >
                  <BookmarkX className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-2 text-sm font-semibold">
                <Link to={programHref({ name: item.programName })} className="hover:underline">
                  {item.programName}
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                {juniorProgramTypeLabels[item.programType]} · {item.duration} god.
              </p>

              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className={cn("rounded-xl bg-muted/40 px-2.5 py-2", closest.has(item.key) && "ring-1 ring-primary/40")}>
                  <dt className="text-muted-foreground">Udaljenost</dt>
                  <dd className="font-semibold">{item.distanceKm != null ? `~${item.distanceKm} km` : "—"}</dd>
                </div>
                <div className={cn("rounded-xl bg-muted/40 px-2.5 py-2", lowestPrag.has(item.key) && "ring-1 ring-primary/40")}>
                  <dt className="text-muted-foreground">Lanjski prag</dt>
                  <dd className="font-semibold">
                    {item.pragMin != null ? item.pragMin.toLocaleString("hr-HR") : "—"}
                  </dd>
                </div>
                <div className={cn("rounded-xl bg-muted/40 px-2.5 py-2", bestMatch.has(item.key) && "ring-1 ring-primary/40")}>
                  <dt className="text-muted-foreground">Kviz</dt>
                  <dd className="font-semibold">
                    {item.matchPercentage != null ? `${item.matchPercentage}%` : "—"}
                  </dd>
                </div>
                <div className="rounded-xl bg-muted/40 px-2.5 py-2">
                  <dt className="text-muted-foreground">Upis</dt>
                  <dd className="font-semibold">{ENTRY_LABEL[item.entryBar]}</dd>
                </div>
              </dl>

              {chance ? (
                <p
                  className={cn(
                    "mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-bold",
                    CHANCE_TONE[chance.tone].badge,
                  )}
                >
                  {chance.label}
                </p>
              ) : null}

              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{item.afterSchool}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Button asChild size="sm" variant="outline" className="h-8 rounded-lg text-xs">
                  <Link to={mapSchoolHref(item.mapSchoolId, item.schoolName, item.city)}>
                    <MapPin className="mr-1 h-3 w-3" />
                    Karta
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-8 rounded-lg text-xs">
                  <Link to={calculatorHref(item.kalkulatorSchoolId, item.kalkulatorProgramId)}>
                    <Calculator className="mr-1 h-3 w-3" />
                    Bodovi
                  </Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      <JuniorNumbersNote compact />
    </div>
  );
}
