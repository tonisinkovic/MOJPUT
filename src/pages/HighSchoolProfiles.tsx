import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import SchoolLoginForm from "@/components/school/SchoolLoginForm";
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
import { highSchools, type HighSchoolCategory } from "@/data/highSchools";
import { getSchoolPrograms } from "@/lib/schoolPrograms";
import { slugForSchool } from "@/lib/schoolSlug";

const CATEGORIES: HighSchoolCategory[] = [
  "Gimnazija",
  "Strukovna škola",
  "Umjetnička škola",
  "Srednja škola",
  "Posebni programi",
];

const PAGE_SIZE = 48;

export default function HighSchoolProfiles() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("sve");
  const [category, setCategory] = useState("sve");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const cities = useMemo(
    () => [...new Set(highSchools.map((s) => s.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr")),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return highSchools.filter((school) => {
      if (city !== "sve" && school.city !== city) return false;
      if (category !== "sve" && school.category !== category) return false;
      if (!q) return true;
      return (
        school.name.toLowerCase().includes(q) ||
        school.city.toLowerCase().includes(q) ||
        school.county.toLowerCase().includes(q)
      );
    });
  }, [search, city, category]);

  const shown = filtered.slice(0, visible);

  return (
    <Layout>
      <PageSeo
        title="Profili srednjih škola | MojPut Junior"
        description="Odaberi srednju školu i pogledaj profil, programe i novosti. Škole se prijavljuju sa strane."
        canonical="https://mojput.com/srednje-skole/profili"
      />
      <section className="container py-8 md:py-12">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">MojPut Junior</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Profili srednjih škola</h1>
          <p className="mt-2 text-muted-foreground">
            Odaberi školu koju želiš vidjeti. Otvori profil za programe, kontakte i novosti škole.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="relative sm:col-span-3 md:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisible(PAGE_SIZE);
                  }}
                  placeholder="Upiši naziv škole..."
                  aria-label="Pretraži škole"
                  className="pl-9"
                />
              </div>
              <Select
                value={city}
                onValueChange={(v) => {
                  setCity(v);
                  setVisible(PAGE_SIZE);
                }}
              >
                <SelectTrigger aria-label="Grad">
                  <SelectValue placeholder="Grad" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="sve">Svi gradovi</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v);
                  setVisible(PAGE_SIZE);
                }}
              >
                <SelectTrigger aria-label="Vrsta škole">
                  <SelectValue placeholder="Vrsta škole" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sve">Sve vrste</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "škola" : "škola"} — odaberi koju želiš otvoriti
            </p>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
                Nema škole za ovu pretragu. Promijeni naziv, grad ili vrstu škole.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {shown.map((school) => {
                  const slug = slugForSchool(school, highSchools);
                  const programs = getSchoolPrograms(school.name, school.city);
                  const initial = school.name.trim().charAt(0).toUpperCase() || "?";
                  return (
                    <article
                      key={school.id}
                      className="flex flex-col rounded-2xl border border-border/70 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                          {initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="line-clamp-2 text-sm font-semibold leading-snug">{school.name}</h2>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {school.city}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px]">
                          {school.category}
                        </Badge>
                        {programs.length > 0 && (
                          <span className="text-[11px] text-muted-foreground">{programs.length} programa</span>
                        )}
                      </div>
                      <Button asChild className="mt-4 w-full" size="sm">
                        <Link to={`/srednje-skole/${slug}`}>Pogledaj školu</Link>
                      </Button>
                    </article>
                  );
                })}
              </div>
            )}

            {visible < filtered.length && (
              <div className="mt-5 flex justify-center">
                <Button variant="outline" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
                  Prikaži još škola
                </Button>
              </div>
            )}
          </div>

          <aside className="order-first lg:sticky lg:top-24 lg:order-none">
            <SchoolLoginForm compact />
            <p className="mt-3 text-center text-xs text-muted-foreground lg:text-left">
              Trebaš kartu i adrese?{" "}
              <Link to="/srednje-skole" className="font-semibold text-primary hover:underline">
                Otvori kartu
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
