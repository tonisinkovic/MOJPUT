import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import SchoolPostCard from "@/components/school/SchoolPostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { highSchools } from "@/data/highSchools";
import { slugForSchool } from "@/lib/schoolSlug";
import { fetchSchoolFeed, type SchoolPost } from "@/lib/schoolCmsApi";

const CATEGORIES = [
  { id: "sve", label: "Sve kategorije" },
  { id: "dogadaj", label: "Događaji" },
  { id: "upisi", label: "Upisi" },
  { id: "uspjeh", label: "Uspjeh učenika" },
  { id: "obavijest", label: "Obavijesti" },
  { id: "ostalo", label: "Ostalo" },
];

export default function JuniorSchoolFeed() {
  const [posts, setPosts] = useState<SchoolPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("sve");
  const [category, setCategory] = useState("sve");
  const [schoolSlug, setSchoolSlug] = useState("sve");
  const [from, setFrom] = useState("");

  const cities = useMemo(
    () => [...new Set(highSchools.map((s) => s.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr")),
    [],
  );
  const schoolOptions = useMemo(
    () =>
      [...highSchools]
        .sort((a, b) => a.name.localeCompare(b.name, "hr"))
        .map((s) => ({ slug: slugForSchool(s, highSchools), name: s.name, city: s.city })),
    [],
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchSchoolFeed({
      city: city === "sve" ? undefined : city,
      category: category === "sve" ? undefined : category,
      school: schoolSlug === "sve" ? undefined : schoolSlug,
      from: from || undefined,
    }).then((res) => {
      if (!alive) return;
      setPosts(res.success && Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [city, category, schoolSlug, from]);

  return (
    <Layout>
      <PageSeo
        title="Novosti srednjih škola | MojPut Junior"
        description="Najnovije objave srednjih škola — dani otvorenih vrata, upisi, uspjesi učenika i školske novosti."
        canonical="https://mojput.com/srednje-skole/objave"
      />
      <section className="container py-10 md:py-14">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">MojPut Junior</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Najnovije objave škola</h1>
          <p className="mt-2 text-muted-foreground">
            Centralni feed škola. Filtriraj po gradu, školi ili vrsti objave.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/srednje-skole">Pregledaj sve škole</Link>
          </Button>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="Grad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sve">Svi gradovi</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Kategorija" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={schoolSlug} onValueChange={setSchoolSlug}>
            <SelectTrigger>
              <SelectValue placeholder="Škola" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="sve">Sve škole</SelectItem>
              {schoolOptions.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Od datuma" />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Učitavam objave...</p>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
            Još nema objava za odabrane filtere. Škole mogu objaviti novosti nakon prijave.
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <SchoolPostCard key={post.id} post={post} showSchool />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
