import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import FacultyLoginForm from "@/components/faculty/FacultyLoginForm";
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
import { getFaculties } from "@/lib/facultyStore";

const FacultyProfiles = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("sve");
  const [area, setArea] = useState("sve");
  const faculties = useMemo(() => getFaculties(), []);

  const cities = useMemo(
    () => [...new Set(faculties.map((f) => f.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr")),
    [faculties],
  );
  const areas = useMemo(
    () => [...new Set(faculties.map((f) => f.area).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr")),
    [faculties],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return faculties.filter((faculty) => {
      if (city !== "sve" && faculty.city !== city) return false;
      if (area !== "sve" && faculty.area !== area) return false;
      if (!term) return true;
      return (
        faculty.name.toLowerCase().includes(term) ||
        faculty.city.toLowerCase().includes(term) ||
        faculty.area.toLowerCase().includes(term)
      );
    });
  }, [faculties, search, city, area]);

  return (
    <Layout>
      <PageSeo
        title="Profili fakulteta | MojPut"
        description="Odaberi fakultet i pogledaj profil, opis i novosti. Fakulteti se prijavljuju sa strane."
        canonical="https://mojput.com/fakulteti"
      />
      <section className="container py-8 md:py-12">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">MojPut Senior</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Profili fakulteta</h1>
          <p className="mt-2 text-muted-foreground">
            Odaberi fakultet koji želiš vidjeti. Otvori profil za opis, kontakte i novosti ustanove.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="relative sm:col-span-3 md:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Upiši naziv fakulteta..."
                  aria-label="Pretraži fakultete"
                  className="pl-9"
                />
              </div>
              <Select value={city} onValueChange={setCity}>
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
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger aria-label="Područje">
                  <SelectValue placeholder="Područje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sve">Sva područja</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "fakultet" : "fakulteta"} — odaberi koji želiš otvoriti
            </p>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
                Nema fakulteta za ovu pretragu. Promijeni naziv, grad ili područje.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filtered.map((faculty) => {
                  const initial = faculty.name.trim().charAt(0).toUpperCase() || "?";
                  return (
                    <article
                      key={faculty.id}
                      className="flex flex-col rounded-2xl border border-border/70 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        {faculty.logoUrl ? (
                          <img
                            src={faculty.logoUrl}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-xl object-cover border"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                            {initial}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h2 className="line-clamp-2 text-sm font-semibold leading-snug">{faculty.name}</h2>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {faculty.city}
                          </p>
                        </div>
                        {faculty.verified && (
                          <Badge variant="secondary" className="shrink-0 text-[10px]">
                            Verificiran
                          </Badge>
                        )}
                      </div>
                      <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{faculty.description}</p>
                      <div className="mt-3">
                        <Badge variant="outline" className="text-[10px]">
                          {faculty.area}
                        </Badge>
                      </div>
                      <Button asChild className="mt-4 w-full" size="sm">
                        <Link to={`/fakulteti/${faculty.id}`}>Pogledaj fakultet</Link>
                      </Button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="order-first lg:sticky lg:top-24 lg:order-none">
            <FacultyLoginForm compact />
            <p className="mt-3 text-center text-xs text-muted-foreground lg:text-left">
              Trebaš kartu i programe?{" "}
              <Link to="/karta" className="font-semibold text-primary hover:underline">
                Otvori kartu fakulteta
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default FacultyProfiles;
