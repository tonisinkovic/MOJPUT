import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getFaculties } from "@/lib/facultyStore";
import { Building2, Search } from "lucide-react";

const FacultyProfiles = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("svi");
  const faculties = useMemo(() => getFaculties(), []);

  const filterOptions = useMemo(() => {
    const cityOptions = faculties.map((f) => f.city);
    const areaOptions = faculties.map((f) => f.area);
    return ["svi", ...new Set([...cityOptions, ...areaOptions])];
  }, [faculties]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return faculties.filter((faculty) => {
      const matchesSearch = !term || faculty.name.toLowerCase().includes(term);
      const matchesFilter =
        filter === "svi" || faculty.city.toLowerCase() === filter.toLowerCase() || faculty.area.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [faculties, filter, search]);

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <div className="relative overflow-hidden rounded-3xl border bg-card/70 p-6 md:p-8 mb-8">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Building2 className="w-4 h-4" />
              Fakultetski hub
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">Profili fakulteta</h1>
            <p className="mt-2 text-muted-foreground">
            Istraži verificirane i javne profile fakulteta te njihove najnovije objave.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link to="/fakulteti/prijava">Prijava za fakultete</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr] mb-8 p-4 rounded-2xl border bg-card/60">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži fakultet po nazivu..."
              aria-label="Pretraži fakultet"
              className="pl-9"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Filtriraj po gradu ili području"
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option === "svi" ? "Svi gradovi i područja" : option}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((faculty) => (
            <article key={faculty.id} className="rounded-2xl border bg-card shadow-card p-6 flex flex-col hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between gap-3">
                <img
                  src={faculty.logoUrl}
                  alt={`${faculty.name} logo`}
                  className="w-14 h-14 rounded-lg object-cover border"
                />
                {faculty.verified && <Badge variant="secondary">Verificiran</Badge>}
              </div>
              <h2 className="text-lg font-semibold mt-4">{faculty.name}</h2>
              <p className="text-sm text-muted-foreground mt-2 flex-1">{faculty.description}</p>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>{faculty.city}</span>
                <span>•</span>
                <span>{faculty.area}</span>
              </div>
              <Button asChild className="mt-5">
                <Link to={`/fakulteti/${faculty.id}`}>Pogledaj profil</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default FacultyProfiles;
