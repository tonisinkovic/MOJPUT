import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, MapPin, School, Search, SlidersHorizontal, X } from "lucide-react";
import { CityTypeahead, matchesCity } from "@/components/CityTypeahead";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { highSchools, type HighSchool, type HighSchoolCategory } from "@/data/highSchools";
import { getSchoolPrograms } from "@/lib/schoolPrograms";
import { slugForSchool } from "@/lib/schoolSlug";
import { cn } from "@/lib/utils";

const CATEGORIES: HighSchoolCategory[] = [
  "Gimnazija",
  "Strukovna škola",
  "Umjetnička škola",
  "Srednja škola",
  "Posebni programi",
];

const CATEGORY_TINT: Record<HighSchoolCategory, string> = {
  Gimnazija: "bg-primary/10 text-primary",
  "Strukovna škola": "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  "Umjetnička škola": "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  "Srednja škola": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  "Posebni programi": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

const CATEGORY_BAR: Record<HighSchoolCategory, string> = {
  Gimnazija: "bg-primary",
  "Strukovna škola": "bg-sky-500",
  "Umjetnička škola": "bg-violet-500",
  "Srednja škola": "bg-emerald-500",
  "Posebni programi": "bg-amber-500",
};

const PAGE_SIZE = 36;
const WORD_SPLIT = new RegExp("[\\s,;.()\\-/[\\]\"'·]+", "g");

type SortKey = "name" | "city" | "category";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "name", label: "A–Ž" },
  { id: "city", label: "Grad" },
  { id: "category", label: "Vrsta" },
];

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

function matchesSchoolSearch(school: HighSchool, qRaw: string): boolean {
  const raw = qRaw.trim();
  if (!raw) return true;
  const tokens = raw
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/^['"]+|['"]+$/g, ""))
    .filter(Boolean);
  if (tokens.length === 0) return true;
  return tokens.every((token) => {
    if (token.length < 2) {
      return wordsFromText(`${school.name} ${school.city} ${school.county}`).some((w) => w.startsWith(token));
    }
    const hay = foldHr(`${school.name} ${school.city} ${school.county} ${school.category}`);
    return hay.includes(foldHr(token));
  });
}

function firstLetter(name: string): string {
  const ch = name.trim().charAt(0).toUpperCase();
  if (!ch || /[0-9]/.test(ch)) return "#";
  return ch;
}

function groupKey(school: HighSchool, sort: SortKey): string {
  if (sort === "city") return school.city || "Ostalo";
  if (sort === "category") return school.category;
  return firstLetter(school.name);
}

function compareSchools(a: HighSchool, b: HighSchool, sort: SortKey): number {
  const byName = a.name.localeCompare(b.name, "hr");
  if (sort === "city") return a.city.localeCompare(b.city, "hr") || byName;
  if (sort === "category") return a.category.localeCompare(b.category, "hr") || byName;
  return byName;
}

function schoolWord(n: number): string {
  const d100 = n % 100;
  const d10 = n % 10;
  if (d100 >= 11 && d100 <= 14) return "škola";
  if (d10 === 1) return "škola";
  if (d10 >= 2 && d10 <= 4) return "škole";
  return "škola";
}

export default function HighSchoolProfiles() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [cityInput, setCityInput] = useState("");
  const [category, setCategory] = useState("sve");
  const [sort, setSort] = useState<SortKey>("name");
  const [letter, setLetter] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const cities = useMemo(
    () => [...new Set(highSchools.map((s) => s.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr")),
    [],
  );

  const filtered = useMemo(() => {
    const next = highSchools.filter((school) => {
      if (category !== "sve" && school.category !== category) return false;
      if (!matchesCity(school.city, cityInput)) return false;
      return matchesSchoolSearch(school, search);
    });
    next.sort((a, b) => compareSchools(a, b, sort));
    return next;
  }, [search, cityInput, category, sort]);

  const letters = useMemo(() => {
    const set = new Set(filtered.map((s) => firstLetter(s.name)));
    return [...set].sort((a, b) => a.localeCompare(b, "hr"));
  }, [filtered]);

  const letterActive = sort === "name" && Boolean(letter) && letters.includes(letter);
  const listed = useMemo(() => {
    if (!letterActive) return filtered;
    return filtered.filter((s) => firstLetter(s.name) === letter);
  }, [filtered, letter, letterActive]);

  const browsingAll = !search.trim() && !cityInput.trim() && category === "sve" && !letterActive;
  const shownItems = browsingAll ? listed.slice(0, visible) : listed;

  const groups = useMemo(() => {
    const map = new Map<string, HighSchool[]>();
    for (const school of shownItems) {
      const key = groupKey(school, sort);
      const arr = map.get(key);
      if (arr) arr.push(school);
      else map.set(key, [school]);
    }
    return [...map.entries()].map(([key, items]) => ({ key, items }));
  }, [shownItems, sort]);

  const filtersOn = Boolean(search.trim() || cityInput.trim() || category !== "sve" || letter);

  const resetBrowse = () => setVisible(PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setCityInput("");
    setCategory("sve");
    setLetter("");
    setVisible(PAGE_SIZE);
  };

  return (
    <Layout>
      <PageSeo
        title="Profili srednjih škola | MojPut Junior"
        description="Pronađi srednju školu po nazivu, gradu ili vrsti i otvori profil — programi, kontakti i novosti."
        canonical="https://mojput.com/srednje-skole/profili"
      />
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(90vw,40rem)] -translate-x-1/2 rounded-full bg-[var(--hero-gradient-soft)] opacity-70 blur-3xl"
        />
        <div className="container relative py-6 md:py-10">
              <header className="mb-5 md:mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">MojPut Junior</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <h1 className="min-w-0 text-[1.65rem] font-extrabold tracking-tight md:text-4xl">Pronađi školu</h1>
                  <Link
                    to="/srednje-skole/prijava"
                    id="prijava-skole"
                    className="inline-flex shrink-0 items-center gap-2.5 rounded-2xl border border-border/70 bg-card py-2 pl-2 pr-4 shadow-sm transition hover:border-primary/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <School className="h-5 w-5" />
                    </span>
                    <span className="text-left leading-tight">
                      <span className="block text-sm font-bold text-foreground">Prijava za škole</span>
                      <span className="hidden text-xs text-muted-foreground sm:block">Uredi svoj profil</span>
                    </span>
                  </Link>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground md:text-base">
                  Upiši naziv ili grad — pa otvori profil.
                </p>
              </header>

              <div className="rounded-3xl border border-border/70 bg-card/90 p-3 shadow-[var(--shadow-elevated)] backdrop-blur-sm sm:p-4 md:p-5">
                <label className="relative block">
                  <span className="sr-only">Pretraži škole</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
                  <Input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setLetter("");
                      resetBrowse();
                    }}
                    placeholder="npr. III. gimnazija, Split, medicinska…"
                    aria-label="Pretraži škole"
                    className="h-12 rounded-2xl border-border/80 bg-background pl-11 pr-11 text-base shadow-inner md:h-14 md:text-[0.95rem]"
                  />
                  {search && (
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
                  )}
                </label>

                <div className="mt-3 flex flex-col gap-3 sm:mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <SlidersHorizontal className="h-3 w-3" />
                      Vrsta
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCategory("sve");
                        resetBrowse();
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition",
                        category === "sve"
                          ? "border-foreground/15 bg-foreground text-background"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                      )}
                    >
                      Sve
                    </button>
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          resetBrowse();
                        }}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-semibold transition",
                          category === c
                            ? "border-transparent bg-primary text-primary-foreground"
                            : cn("border-transparent", CATEGORY_TINT[c], "hover:opacity-90"),
                        )}
                      >
                        {c.replace(" škola", "")}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <CityTypeahead
                      cities={cities}
                      value={cityInput}
                      onChange={(next) => {
                        setCityInput(next);
                        setLetter("");
                        resetBrowse();
                      }}
                    />
                    <div className="inline-flex rounded-full bg-muted p-1" role="group" aria-label="Poredaj škole">
                      {SORTS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSort(item.id);
                            if (item.id !== "name") setLetter("");
                            resetBrowse();
                          }}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                            sort === item.id
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{listed.length}</span> {schoolWord(listed.length)}
                  {filtersOn ? " za ovu pretragu" : " u Hrvatskoj"}
                </p>
                {filtersOn && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Poništi filtere
                  </button>
                )}
              </div>

              {sort === "name" && letters.length > 1 && (
                <div className="-mx-1 mt-3 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setLetter("");
                      resetBrowse();
                    }}
                    className={cn(
                      "shrink-0 rounded-lg px-2 py-1 text-xs font-bold",
                      !letterActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    Sve
                  </button>
                  {letters.map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        setLetter(ch === letter ? "" : ch);
                        resetBrowse();
                      }}
                      className={cn(
                        "min-w-8 shrink-0 rounded-lg px-2 py-1 text-xs font-bold",
                        letter === ch ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              )}

              {listed.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed bg-card/80 px-5 py-12 text-center">
                  <p className="font-semibold">Nema škole za ovu pretragu</p>
                  <p className="mt-1 text-sm text-muted-foreground">Promijeni naziv, slovo, grad ili vrstu.</p>
                  <Button variant="outline" className="mt-4 rounded-full" onClick={clearFilters}>
                    Prikaži sve škole
                  </Button>
                </div>
              ) : (
                <div className="mt-4 space-y-6">
                  {groups.map((group) => (
                    <section key={group.key}>
                      <div className="sticky top-16 z-10 -mx-1 mb-2 flex items-center gap-2 bg-background/90 px-1 py-1.5 backdrop-blur-md">
                        <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-muted text-xs font-extrabold text-foreground">
                          {group.key}
                        </span>
                        <span className="h-px flex-1 bg-border/80" />
                        <span className="text-[11px] font-medium text-muted-foreground">{group.items.length}</span>
                      </div>
                      <ul className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
                        {group.items.map((school, idx) => {
                          const slug = slugForSchool(school, highSchools);
                          const programs = getSchoolPrograms(school.name, school.city);
                          const initial = firstLetter(school.name);
                          return (
                            <li key={school.id} className={idx > 0 ? "border-t border-border/60" : undefined}>
                              <Link
                                to={`/srednje-skole/${slug}`}
                                className="group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:py-3.5"
                              >
                                <span
                                  className={cn(
                                    "hidden h-10 w-1 shrink-0 rounded-full sm:block",
                                    CATEGORY_BAR[school.category],
                                  )}
                                />
                                <span
                                  className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                                    CATEGORY_TINT[school.category],
                                  )}
                                >
                                  {initial}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-semibold leading-snug sm:text-[0.95rem]">
                                    {school.name}
                                  </span>
                                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {school.city}
                                    </span>
                                    <Badge variant="outline" className="h-5 rounded-md px-1.5 text-[10px] font-semibold">
                                      {school.category}
                                    </Badge>
                                    {programs.length > 0 && (
                                      <span>
                                        {programs.length} {programs.length === 1 ? "program" : "programa"}
                                      </span>
                                    )}
                                  </span>
                                </span>
                                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>
              )}

              {browsingAll && visible < listed.length && (
                <div className="mt-5 flex justify-center">
                  <Button variant="outline" className="rounded-full" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
                    Prikaži još škola
                  </Button>
                </div>
              )}

              <p className="mt-6 text-center text-xs text-muted-foreground md:text-left">
                Trebaš kartu i adrese?{" "}
                <Link to="/srednje-skole" className="font-semibold text-primary hover:underline">
                  Otvori kartu
                </Link>
              </p>
        </div>
      </section>
    </Layout>
  );
}
