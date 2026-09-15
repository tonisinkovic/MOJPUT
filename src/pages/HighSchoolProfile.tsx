import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  MapPin,
  School,
} from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import InfoPill from "@/components/faculty/InfoPill";
import SchoolPostCard from "@/components/school/SchoolPostCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { highSchools } from "@/data/highSchools";
import { schoolIdFromSlug, slugForSchool } from "@/lib/schoolSlug";
import { getSchoolPrograms } from "@/lib/schoolPrograms";
import { calculatorHref, findKalkulatorSchool } from "@/lib/juniorPath";
import { fetchSchoolPublic, schoolMediaUrl, type SchoolPost, type SchoolPublicPayload } from "@/lib/schoolCmsApi";

export default function HighSchoolProfile() {
  const { slug = "" } = useParams();
  const schoolId = schoolIdFromSlug(slug, highSchools);
  const school = useMemo(() => highSchools.find((s) => s.id === schoolId) || null, [schoolId]);
  const [remote, setRemote] = useState<SchoolPublicPayload | null>(null);
  const [posts, setPosts] = useState<SchoolPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!school || !slug) {
      setLoading(false);
      return;
    }
    let alive = true;
    fetchSchoolPublic(slug).then((res) => {
      if (!alive) return;
      if (res.success && res.data) {
        setRemote(res.data);
        setPosts(res.data.posts || []);
      } else {
        setRemote(null);
        setPosts([]);
      }
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [school, slug]);

  if (!school) {
    return (
      <Layout>
        <PageSeo
          title="Škola nije pronađena | MojPut"
          description="Tražena srednja škola ne postoji u MojPut katalogu."
        />
        <section className="container py-16">
          <h1 className="text-2xl font-bold">Škola nije pronađena</h1>
          <p className="mt-2 text-muted-foreground">Provjeri poveznicu ili se vrati na popis srednjih škola.</p>
          <Button className="mt-4" asChild>
            <Link to="/srednje-skole">Sve srednje škole</Link>
          </Button>
        </section>
      </Layout>
    );
  }

  const programs = getSchoolPrograms(school.name, school.city);
  const kalk = findKalkulatorSchool(school.name, school.city);
  const logo = schoolMediaUrl(remote?.profile.logoUrl);
  const cover = schoolMediaUrl(remote?.profile.coverUrl);
  const about = remote?.profile.aboutText?.trim() || "";
  const extraWeb = remote?.profile.extraWebsite || school.website;
  const canonical = `https://mojput.com/srednje-skole/${slugForSchool(school, highSchools)}`;
  const description = `${school.name} u mjestu ${school.city}. ${school.category}. Adresa: ${school.address}. Programi, kontakti i novosti škole na MojPutu.`;

  return (
    <Layout>
      <PageSeo
        title={`${school.name} – programi, upisi i informacije | MojPut`}
        description={description.slice(0, 180)}
        canonical={canonical}
        image={cover || logo}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: school.name,
          address: {
            "@type": "PostalAddress",
            streetAddress: school.address,
            addressLocality: school.city,
            postalCode: school.postalCode,
            addressCountry: "HR",
          },
          url: extraWeb || canonical,
          telephone: school.phones[0] || undefined,
          email: school.emails[0] || undefined,
        }}
      />
      <section className="container space-y-6 py-10 md:space-y-8 md:py-14">
        <article className="relative overflow-hidden rounded-3xl border bg-card shadow-card">
          {cover ? (
            <img src={cover} alt="" className="h-36 w-full object-cover md:h-48" />
          ) : (
            <div className="h-28 bg-gradient-to-r from-primary/25 via-primary/10 to-transparent md:h-36" />
          )}
          <div className="relative px-5 pb-6 md:px-8 md:pb-8">
            <div className="-mt-10 flex flex-col gap-4 md:-mt-12 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                {logo ? (
                  <img
                    src={logo}
                    alt={`Logo ${school.name}`}
                    className="h-20 w-20 rounded-2xl border-4 border-background object-cover shadow-lg md:h-24 md:w-24"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary text-xl font-bold text-primary-foreground shadow-lg md:h-24 md:w-24">
                    {school.name.trim().charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">{school.name}</h1>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">
                    {school.city} · {school.county}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link to="/srednje-skole">Sve škole</Link>
                </Button>
                <Button asChild>
                  <Link to={calculatorHref(kalk?.id ?? null)}>
                    Kalkulator
                    <Calculator className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {extraWeb && (
                  <Button variant="outline" asChild>
                    <a href={extraWeb} target="_blank" rel="noreferrer">
                      Web škole
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </article>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
          <InfoPill icon={<MapPin className="h-4 w-4" />} label="Grad" value={school.city} />
          <InfoPill icon={<School className="h-4 w-4" />} label="Vrsta" value={school.category} />
          <InfoPill
            icon={<BookOpen className="h-4 w-4" />}
            label="Programi"
            value={programs.length ? String(programs.length) : "nema u katalogu"}
          />
        </div>

        <article className="rounded-2xl border bg-card p-5 shadow-card md:p-7">
          <h2 className="text-xl font-semibold md:text-2xl">Informacije o školi</h2>
          {about ? <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted-foreground">{about}</p> : null}
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-muted-foreground">Adresa</dt>
              <dd className="text-sm font-medium">
                {school.address}, {school.postalCode} {school.city}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-muted-foreground">Županija</dt>
              <dd className="text-sm font-medium">{school.county}</dd>
            </div>
            {school.phones.length > 0 && (
              <div>
                <dt className="text-xs font-semibold uppercase text-muted-foreground">Telefon</dt>
                <dd className="text-sm font-medium">
                  {school.phones.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </dd>
              </div>
            )}
            {school.emails.length > 0 && (
              <div>
                <dt className="text-xs font-semibold uppercase text-muted-foreground">Email</dt>
                <dd className="text-sm font-medium">
                  {school.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="block text-primary hover:underline">
                      {e}
                    </a>
                  ))}
                </dd>
              </div>
            )}
            {school.principal && (
              <div>
                <dt className="text-xs font-semibold uppercase text-muted-foreground">Ravnatelj/ica</dt>
                <dd className="text-sm font-medium">{school.principal}</dd>
              </div>
            )}
            {school.founder && (
              <div>
                <dt className="text-xs font-semibold uppercase text-muted-foreground">Osnivač</dt>
                <dd className="text-sm font-medium">{school.founder}</dd>
              </div>
            )}
          </dl>
        </article>

        <section className="rounded-2xl border bg-card p-5 shadow-card md:p-7">
          <h2 className="text-xl font-semibold md:text-2xl">Obrazovni programi</h2>
          {kalk?.programs?.length ? (
            <div className="mt-4 space-y-3">
              {kalk.programs.map((program) => (
                <div key={program.id} className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <p className="font-semibold">{program.name}</p>
                  {program.sector && <p className="text-xs text-muted-foreground">{program.sector}</p>}
                  {program.prag && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {program.prag.year ? `${program.prag.year}. · ` : ""}
                      {program.prag.kvota != null ? `kvota ${program.prag.kvota}` : "kvota nije u katalogu"}
                      {program.prag.min != null ? ` · lanjski prag ${program.prag.min}` : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : programs.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {programs.map((program) => (
                <li key={program}>
                  <Badge variant="outline" className="rounded-lg px-2 py-1">
                    {program}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Za ovu školu u katalogu još nema popisa upisnih programa.
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Pragovi su lanjski, sljedeća godina može biti drugačija.{" "}
            <Link to="/kalkulator" className="font-semibold text-primary hover:underline">
              Otvori kalkulator
            </Link>
          </p>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold md:text-2xl">Novosti škole</h2>
            <p className="mt-1 text-sm text-muted-foreground">Objave koje je škola sama objavila na MojPutu.</p>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Učitavam objave...</p>
          ) : posts.length === 0 ? (
            <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
              Ova škola još nema javnih objava.
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <SchoolPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </section>
    </Layout>
  );
}
