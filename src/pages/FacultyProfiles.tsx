import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, GraduationCap, MapPin, Search, X } from "lucide-react";
import { CityTypeahead, matchesCity } from "@/components/CityTypeahead";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { facultyInitial } from "@/lib/facultyCatalog";
import { expandAliasQuery } from "@/lib/facultyAliases";
import { getFaculties } from "@/lib/facultyStore";
import type { Faculty } from "@/types/faculty";
import { cn } from "@/lib/utils";
import { CategoryTag, EmptyState, FilterChip, PageHero, SBack, SCARD, SeniorBlobs, STONE } from "@/components/senior-kit";

const PAGE_SIZE = 36;
const WORD_SPLIT = new RegExp("[\\s,;.()\\-/[\\]\"'·]+", "g");

type SortKey = "name" | "city" | "area";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "name", label: "A–Ž" },
  { id: "city", label: "Grad" },
  { id: "area", label: "Područje" },
];

const AREA_TINT: Record<string, string> = {
  Tehnika: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Ekonomija: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Zdravstvo: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  Pravo: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  Humanistika: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  Prirodoslovlje: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Biotehnika: "bg-lime-500/10 text-lime-800 dark:text-lime-400",
  Umjetnost: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400",
  Kineziologija: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  Teologija: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  Pomorstvo: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  Turizam: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  "Društvene znanosti": "bg-primary/10 text-primary",
  "Visoko obrazovanje": "bg-muted text-foreground",
};

const AREA_BAR: Record<string, string> = {
  Tehnika: "bg-sky-500",
  Ekonomija: "bg-amber-500",
  Zdravstvo: "bg-rose-500",
  Pravo: "bg-slate-500",
  Humanistika: "bg-violet-500",
  Prirodoslovlje: "bg-emerald-500",
  Biotehnika: "bg-lime-500",
  Umjetnost: "bg-fuchsia-500",
  Kineziologija: "bg-orange-500",
  Teologija: "bg-indigo-500",
  Pomorstvo: "bg-cyan-500",
  Turizam: "bg-teal-500",
  "Društvene znanosti": "bg-primary",
  "Visoko obrazovanje": "bg-muted-foreground",
};

function foldHr(s: string): string {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");
}

function wordsFromText(s: string): string[] {
  return s
    .toLowerCase()
    .split(WORD_SPLIT)
    .map((w) => w.replace(/^[^a-z0-9čćžšđ]+/i, ""))
    .filter(Boolean);
}

function matchesFacultySearch(faculty: Faculty, qRaw: string): boolean {
  const raw = qRaw.trim();
  if (!raw) return true;
  const tokens = expandAliasQuery(raw)
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/^['"]+|['"]+$/g, ""))
    .filter(Boolean);
  if (tokens.length === 0) return true;
  return tokens.every((token) => {
    const hayParts = `${faculty.name} ${faculty.city} ${faculty.area} ${faculty.university}`;
    if (token.length < 2) {
      return wordsFromText(hayParts).some((w) => w.startsWith(token));
    }
    return foldHr(hayParts).includes(foldHr(token));
  });
}

function groupKey(faculty: Faculty, sort: SortKey): string {
  if (sort === "city") return faculty.city || "Ostalo";
  if (sort === "area") return faculty.area;
  return facultyInitial(faculty.name);
}

function compareFaculties(a: Faculty, b: Faculty, sort: SortKey): number {
  const byName = a.name.localeCompare(b.name, "hr");
  if (sort === "city") return a.city.localeCompare(b.city, "hr") || byName;
  if (sort === "area") return a.area.localeCompare(b.area, "hr") || byName;
  return byName;
}

function facultyWord(n: number): string {
  const d100 = n % 100;
  const d10 = n % 10;
  if (d100 >= 11 && d100 <= 14) return "fakulteta";
  if (d10 === 1) return "fakultet";
  if (d10 >= 2 && d10 <= 4) return "fakulteta";
  return "fakulteta";
}

const FacultyProfiles = () => {
  const faculties = useMemo(() => getFaculties(), []);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [cityInput, setCityInput] = useState("");
  const [area, setArea] = useState("sve");
  const [sort, setSort] = useState<SortKey>("name");
  const [letter, setLetter] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const cities = useMemo(
    () => [...new Set(faculties.map((f) => f.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr")),
    [faculties],
  );
  const areas = useMemo(
    () => [...new Set(faculties.map((f) => f.area).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr")),
    [faculties],
  );

  const filtered = useMemo(() => {
    const next = faculties.filter((faculty) => {
      if (!matchesCity(faculty.city, cityInput)) return false;
      if (area !== "sve" && faculty.area !== area) return false;
      return matchesFacultySearch(faculty, search);
    });
    next.sort((a, b) => compareFaculties(a, b, sort));
    return next;
  }, [faculties, search, cityInput, area, sort]);

  const letters = useMemo(() => {
    const set = new Set(filtered.map((f) => facultyInitial(f.name)));
    return [...set].sort((a, b) => a.localeCompare(b, "hr"));
  }, [filtered]);

  const letterActive = sort === "name" && Boolean(letter) && letters.includes(letter);
  const listed = useMemo(() => {
    if (!letterActive) return filtered;
    return filtered.filter((f) => facultyInitial(f.name) === letter);
  }, [filtered, letter, letterActive]);

  const browsingAll = !search.trim() && !cityInput.trim() && area === "sve" && !letterActive;
  const shownItems = browsingAll ? listed.slice(0, visible) : listed;

  const groups = useMemo(() => {
    const map = new Map<string, Faculty[]>();
    for (const faculty of shownItems) {
      const key = groupKey(faculty, sort);
      const arr = map.get(key);
      if (arr) arr.push(faculty);
      else map.set(key, [faculty]);
    }
    return [...map.entries()].map(([key, items]) => ({ key, items }));
  }, [shownItems, sort]);

  const filtersOn = Boolean(search.trim() || cityInput.trim() || area !== "sve" || letter);

  const resetBrowse = () => setVisible(PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setCityInput("");
    setArea("sve");
    setLetter("");
    setVisible(PAGE_SIZE);
  };

  return (
    <Layout>
      <PageSeo
        title="Profili fakulteta | MojPut"
        description="Pronađi fakultet po nazivu, gradu ili području i otvori profil — opis, kontakti i novosti ustanove."
        canonical="https://mojput.com/fakulteti"
      />
      <section className="sr-page relative mx-auto max-w-7xl px-3 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-5 sm:px-4 sm:pb-14 sm:pt-8 md:py-12">
        <SeniorBlobs />
        <SBack crumb="Profili fakulteta" />
        <div className="relative">
          <PageHero
            icon={GraduationCap}
            tone="indigo"
            kicker="Profili"
            badge="MojPut Senior"
            title={
              <>
                Pronađi <span className="text-[hsl(var(--sr-indigo))]">fakultet</span>
              </>
            }
            lead="Upiši naziv, grad ili sveučilište — pa otvori profil."
            actions={
              <Link
                to="/fakulteti/prijava"
                id="prijava-fakulteta"
                className="inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-xl border border-white/15 bg-white/8 py-2 pl-2 pr-4 text-white transition hover:bg-white/12"
              >
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", STONE.indigo.grad)}>
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-sm font-bold">Prijava za fakultete</span>
                  <span className="hidden text-xs text-white/65 sm:block">Uredi svoj profil</span>
                </span>
              </Link>
            }
          />

          <div className={cn(SCARD, "mt-8 p-3 sm:mt-10 sm:p-4 md:p-5")}>
            <label className="relative block">
              <span className="sr-only">Pretraži fakultete</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setLetter("");
                  resetBrowse();
                }}
                placeholder="npr. FER, Split, medicinski…"
                aria-label="Pretraži fakultete"
                className="h-12 rounded-2xl border-border/80 bg-background pl-11 pr-11 text-base shadow-inner md:h-14 md:text-[0.95rem]"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    resetBrowse();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Očisti pretragu"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              <FilterChip
                active={area === "sve"}
                count={faculties.length}
                onClick={() => {
                  setArea("sve");
                  resetBrowse();
                }}
              >
                Sva područja
              </FilterChip>
              {areas.map((a) => (
                <FilterChip
                  key={a}
                  active={area === a}
                  count={faculties.filter((f) => f.area === a).length}
                  onClick={() => {
                    setArea(a);
                    resetBrowse();
                  }}
                >
                  {a}
                </FilterChip>
              ))}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <CityTypeahead
                cities={cities}
                value={cityInput}
                onChange={(next) => {
                  setCityInput(next);
                  setLetter("");
                  resetBrowse();
                }}
              />
              <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                <SelectTrigger aria-label="Razvrstaj" className="h-11 rounded-xl">
                  <SelectValue placeholder="Razvrstaj" />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {sort === "name" && letters.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-1">
                {letters.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setLetter((cur) => (cur === ch ? "" : ch))}
                    className={cn(
                      "inline-flex h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xs font-bold",
                      letter === ch ? "bg-[hsl(var(--sr-night))] text-white" : "bg-muted text-foreground hover:bg-muted/80",
                    )}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                {listed.length} {facultyWord(listed.length)} u katalogu
                {filtersOn ? " za ovu pretragu" : ""}
              </p>
              {filtersOn ? (
                <Button variant="ghost" size="sm" className="rounded-full" onClick={clearFilters}>
                  Poništi filtere
                </Button>
              ) : null}
            </div>
          </div>

          {listed.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="Nema fakulteta za ovu pretragu"
                text="Promijeni naziv, slovo, grad ili područje."
                action={
                  <Button variant="outline" className="rounded-xl" onClick={clearFilters}>
                    Prikaži sve fakultete
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              {groups.map((group) => (
                <section key={group.key}>
                  <div className="sticky top-16 z-10 -mx-1 mb-2 flex items-center gap-2 bg-background/90 px-1 py-1.5 backdrop-blur-md">
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-muted px-2 text-xs font-extrabold text-foreground">
                      {group.key}
                    </span>
                    <span className="h-px flex-1 bg-border/80" />
                    <span className="text-[11px] font-medium text-muted-foreground">{group.items.length}</span>
                  </div>
                  <ul className={cn(SCARD, "overflow-hidden p-0")}>
                    {group.items.map((faculty, idx) => {
                      const initial = facultyInitial(faculty.name);
                      return (
                        <li key={faculty.id} className={idx > 0 ? "border-t border-border/60" : undefined}>
                          <Link
                            to={`/fakulteti/${faculty.id}`}
                            className="group flex min-h-11 items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-cyan))] sm:px-4 sm:py-3.5"
                          >
                            <span
                              className={cn(
                                "hidden h-10 w-1 shrink-0 rounded-full sm:block",
                                AREA_BAR[faculty.area] || "bg-muted-foreground",
                              )}
                            />
                            <span
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                                AREA_TINT[faculty.area] || "bg-muted text-foreground",
                              )}
                            >
                              {initial}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold leading-snug sm:text-[0.95rem]">
                                {faculty.name}
                              </span>
                              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {faculty.city}
                                </span>
                                <CategoryTag>{faculty.area}</CategoryTag>
                                <span className="truncate">{faculty.university}</span>
                              </span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[hsl(var(--sr-cyan-t))]" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {browsingAll && visible < listed.length ? (
            <div className="mt-5 flex justify-center">
              <Button variant="outline" className="rounded-full" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
                Prikaži još fakulteta
              </Button>
            </div>
          ) : null}

          <p className="mt-6 text-center text-xs text-muted-foreground md:text-left">
            Trebaš kartu i programe?{" "}
            <Link to="/karta" className="font-semibold text-primary hover:underline">
              Otvori kartu fakulteta
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default FacultyProfiles;
