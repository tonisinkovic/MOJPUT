import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  Calculator,
  Lock,
  Mail,
  MapPin,
  Phone,
  School,
  User,
} from "lucide-react";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import InfoPill from "@/components/faculty/InfoPill";
import SchoolLoginForm from "@/components/school/SchoolLoginForm";
import SchoolPostCard from "@/components/school/SchoolPostCard";
import SchoolPostComposer from "@/components/school/SchoolPostComposer";
import ProgramOpisDialog from "@/components/school/ProgramOpisDialog";
import { Button } from "@/components/ui/button";
import { highSchools } from "@/data/highSchools";
import type { KalkulatorProgram } from "@/data/srednjaKalkulator";
import { schoolIdFromSlug, slugForSchool } from "@/lib/schoolSlug";
import { getSchoolPrograms } from "@/lib/schoolPrograms";
import { calculatorHref, findKalkulatorSchool } from "@/lib/juniorPath";
import { AUTH_CHANGED, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { fetchSchoolPublic, schoolMediaUrl, type SchoolPost, type SchoolPublicPayload } from "@/lib/schoolCmsApi";
import { mergeDemoSchoolPosts } from "@/data/schoolDemoPosts";
import { cn } from "@/lib/utils";

type ProgramKind = "gimnazija" | "umjetnost" | "struka";

const KIND_DOT: Record<ProgramKind, string> = {
  gimnazija: "bg-primary",
  umjetnost: "bg-violet-500",
  struka: "bg-sky-500",
};

function programKind(name: string): ProgramKind {
  const n = name.toLowerCase();
  if (n.includes("gimnazij")) return "gimnazija";
  if (
    n.includes("glazb") ||
    n.includes("likovn") ||
    n.includes("balet") ||
    n.includes("ples") ||
    n.includes("dizajn") ||
    n.includes("umjetnič")
  ) {
    return "umjetnost";
  }
  return "struka";
}

function fmtScore(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("hr-HR", { maximumFractionDigits: 2 });
}

function groupPrograms(programs: KalkulatorProgram[]): { sector: string; items: KalkulatorProgram[] }[] {
  const map = new Map<string, KalkulatorProgram[]>();
  for (const program of programs) {
    const sector = program.sector?.trim() && program.sector !== "Nema sektora" ? program.sector : "Ostali programi";
    const arr = map.get(sector);
    if (arr) arr.push(program);
    else map.set(sector, [program]);
  }
  return [...map.entries()].map(([sector, items]) => ({ sector, items }));
}

const PROGRAM_COLS = "grid-cols-[minmax(12rem,1fr)_4.75rem_5.25rem_5.75rem_1.5rem] gap-x-6 px-5 md:gap-x-8 md:px-6";

function ProgramStatsHeader() {
  return (
    <div
      className={cn(
        "grid items-end border-b border-border/60 bg-muted/30 py-3",
        PROGRAM_COLS,
      )}
    >
      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground">Program</span>
      <span className="translate-x-2 text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground">Kvota</span>
      <span className="translate-x-2 text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground">Prag</span>
      <span className="translate-x-2 text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground">Prosjek</span>
      <span />
    </div>
  );
}

function ProgramRow({
  program,
  onOpen,
}: {
  program: KalkulatorProgram;
  onOpen: (program: KalkulatorProgram) => void;
}) {
  const kind = programKind(program.name);
  const prag = program.prag;

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => onOpen(program)}
      className={cn(
        "group grid w-full cursor-pointer items-center border-0 bg-transparent py-3.5 text-left transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        PROGRAM_COLS,
      )}
    >
      <span className="flex min-w-0 items-start gap-2.5">
        <span className={cn("mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full", KIND_DOT[kind])} />
        <span className="text-sm font-semibold leading-snug tracking-tight">{program.name}</span>
      </span>
      <span className="text-right text-sm font-semibold tabular-nums tracking-tight">{prag?.kvota ?? "—"}</span>
      <span className="text-right text-sm font-semibold tabular-nums tracking-tight">{fmtScore(prag?.min)}</span>
      <span className="text-right text-sm font-semibold tabular-nums tracking-tight">{fmtScore(prag?.avg)}</span>
      <ArrowRight className="h-4 w-4 justify-self-end text-muted-foreground/40 transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
}

function InfoTile({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-semibold leading-snug tracking-tight">{children}</div>
      </div>
    </div>
  );
}

export default function HighSchoolProfile() {
  const { slug = "" } = useParams();
  const schoolId = schoolIdFromSlug(slug, highSchools);
  const school = useMemo(() => highSchools.find((s) => s.id === schoolId) || null, [schoolId]);
  const [remote, setRemote] = useState<SchoolPublicPayload | null>(null);
  const [posts, setPosts] = useState<SchoolPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [openProgram, setOpenProgram] = useState<KalkulatorProgram | null>(null);
  const [openProgramName, setOpenProgramName] = useState<string | null>(null);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showSchoolLogin, setShowSchoolLogin] = useState(false);

  const reloadPublic = () => {
    if (!slug) return;
    fetchSchoolPublic(slug).then((res) => {
      if (res.success && res.data) {
        setRemote(res.data);
        setPosts(mergeDemoSchoolPosts(slug, res.data.posts || []));
      }
    });
  };

  useEffect(() => {
    const sync = () => {
      authMe().then((res) => setUser(userFromAuthMe(res)));
    };
    sync();
    window.addEventListener(AUTH_CHANGED, sync);
    return () => window.removeEventListener(AUTH_CHANGED, sync);
  }, []);

  useEffect(() => {
    if (!school || !slug) {
      setLoading(false);
      return;
    }
    let alive = true;
    fetchSchoolPublic(slug)
      .then((res) => {
        if (!alive) return;
        if (res.success && res.data) {
          setRemote(res.data);
          setPosts(mergeDemoSchoolPosts(slug, res.data.posts || []));
        } else {
          setRemote(null);
          setPosts(mergeDemoSchoolPosts(slug, []));
        }
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setRemote(null);
        setPosts(mergeDemoSchoolPosts(slug, []));
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
          <h1 className="text-2xl font-extrabold tracking-tight">Škola nije pronađena</h1>
          <p className="mt-2 text-muted-foreground">Provjeri poveznicu ili se vrati na popis srednjih škola.</p>
          <Button className="mt-4" asChild>
            <Link to="/srednje-skole/profili">Sve srednje škole</Link>
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
  const programGroups = kalk?.programs?.length ? groupPrograms(kalk.programs) : [];
  const isThisSchool = Boolean(
    user?.school &&
      (user.school.slug === slug || String(user.school.high_school_id) === String(school.id)),
  );
  const mustChangePassword = Boolean(isThisSchool && user?.school?.must_change_password);
  const loginNext = `/srednje-skole/${slug}`;

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
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary text-2xl font-extrabold tracking-tight text-primary-foreground shadow-lg md:h-24 md:w-24 md:text-3xl">
                    {school.name.trim().charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{school.category}</p>
                  <h1 className="mt-0.5 text-2xl font-extrabold leading-tight tracking-tight md:text-4xl">{school.name}</h1>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium tracking-tight text-muted-foreground md:text-base">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {school.city} · {school.county}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/srednje-skole/profili">Sve škole</Link>
                </Button>
                <Button className="rounded-full" asChild>
                  <Link to={calculatorHref(kalk?.id ?? null)}>
                    Kalkulator
                    <Calculator className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {extraWeb && (
                  <Button variant="outline" className="rounded-full" asChild>
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Kontakt</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">Informacije o školi</h2>
          {about ? (
            <p className="mt-4 rounded-2xl bg-muted/40 px-4 py-3 text-sm leading-relaxed tracking-tight text-foreground/80 md:text-[0.95rem]">
              {about}
            </p>
          ) : null}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoTile icon={<MapPin className="h-4 w-4" />} label="Adresa">
              {school.address}, {school.postalCode} {school.city}
            </InfoTile>
            <InfoTile icon={<Building2 className="h-4 w-4" />} label="Županija">
              {school.county}
            </InfoTile>
            {school.phones.length > 0 && (
              <InfoTile icon={<Phone className="h-4 w-4" />} label="Telefon">
                {school.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:text-primary">
                    {p}
                  </a>
                ))}
              </InfoTile>
            )}
            {school.emails.length > 0 && (
              <InfoTile icon={<Mail className="h-4 w-4" />} label="Email">
                {school.emails.map((e) => (
                  <a key={e} href={`mailto:${e}`} className="block break-all text-primary hover:underline">
                    {e}
                  </a>
                ))}
              </InfoTile>
            )}
            {school.principal && (
              <InfoTile icon={<User className="h-4 w-4" />} label="Ravnatelj/ica">
                {school.principal}
              </InfoTile>
            )}
            {school.founder && (
              <InfoTile icon={<School className="h-4 w-4" />} label="Osnivač">
                {school.founder}
              </InfoTile>
            )}
          </div>
        </article>

        <section className="rounded-2xl border bg-card p-5 shadow-card md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Upis</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">Obrazovni programi</h2>
            </div>
            {kalk?.programs?.length ? (
              <p className="text-sm font-medium text-muted-foreground">
                {kalk.programs.length} {kalk.programs.length === 1 ? "smjer" : "smjerova"}
              </p>
            ) : null}
          </div>

          {programGroups.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-xl border border-border/60">
              <div className="overflow-x-auto">
                <div className="min-w-[42rem]">
                  <ProgramStatsHeader />
                  {programGroups.map((group) => (
                    <div key={group.sector}>
                      <p className="bg-muted/25 px-5 py-2.5 text-xs font-medium text-muted-foreground md:px-6">{group.sector}</p>
                      <div className="divide-y divide-border/50">
                        {group.items.map((program) => (
                          <ProgramRow
                            key={program.id}
                            program={program}
                            onOpen={(item) => {
                              setOpenProgram(item);
                              setOpenProgramName(null);
                              setProgramDialogOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : programs.length > 0 ? (
            <ul className="mt-5 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60">
              {programs.map((program) => (
                <li key={program}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenProgram(null);
                      setOpenProgramName(program);
                      setProgramDialogOpen(true);
                    }}
                    className="flex w-full items-center justify-between gap-3 border-0 bg-transparent px-4 py-3 text-left text-sm font-semibold tracking-tight hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                  >
                    {program}
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Za ovu školu u katalogu još nema popisa upisnih programa.</p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {kalk?.programs?.[0]?.prag?.year ? `Podaci za ${kalk.programs[0].prag.year}. ` : ""}
            Pragovi su lanjski, sljedeća godina može biti drugačija. Klikni smjer za opis, zatim vodič za kalkulator
            bodova.
          </p>
        </section>

        <ProgramOpisDialog
          open={programDialogOpen}
          onOpenChange={setProgramDialogOpen}
          programName={openProgram?.name || openProgramName || ""}
          schoolId={kalk?.id ?? null}
          programId={openProgram?.id ?? null}
          schoolLabel={`${school.name} · ${school.city}`}
          sector={openProgram?.sector}
          prag={openProgram?.prag}
        />

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Škola piše</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl">Novosti škole</h2>
              <p className="mt-1 text-sm text-muted-foreground">Objave koje je škola sama objavila na MojPutu.</p>
            </div>
            {isThisSchool && (
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <Link to="/skola/dashboard">Uredi profil i objave</Link>
              </Button>
            )}
          </div>

          {mustChangePassword && (
            <div className="mt-4 rounded-2xl border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm dark:bg-amber-950/30">
              <p className="flex items-center gap-2 font-semibold">
                <Lock className="h-4 w-4" />
                Prvo postavi vlastitu lozinku
              </p>
              <p className="mt-1 text-muted-foreground">Nakon toga možeš objavljivati novosti na ovom profilu.</p>
              <Button className="mt-3 rounded-full" asChild>
                <Link to="/skola/dashboard">Otvori školski račun</Link>
              </Button>
            </div>
          )}

          {isThisSchool && !mustChangePassword && (
            <SchoolPostComposer className="mt-4" onPublished={reloadPublic} />
          )}

          {!user && (
            <div className="mt-4">
              {showSchoolLogin ? (
                <SchoolLoginForm compact quiet redirectTo={loginNext} />
              ) : (
                <button
                  type="button"
                  className="text-sm font-semibold text-primary hover:underline"
                  onClick={() => setShowSchoolLogin(true)}
                >
                  Radiš u ovoj školi? Prijavi se i objavi novost.
                </button>
              )}
            </div>
          )}

          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">Učitavam objave...</p>
          ) : posts.length === 0 ? (
            <div className="mt-4 rounded-xl border bg-card p-5 text-sm text-muted-foreground">
              {isThisSchool
                ? "Još nema javnih objava. Napiši prvu iznad."
                : "Ova škola još nema javnih objava."}
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
