import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { MapPin, Search, ExternalLink, X, University as UniversityIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { croatianUniversities } from "@/data/universities";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FacultyItem = {
  name: string;
  city: string;
  university: string;
  type: string;
  url: string;
  levels?: string[];
};

// Izravnaj sve programe i ukloni duplikate po (naziv + grad)
const faculties: FacultyItem[] = (() => {
  const flat = croatianUniversities.flatMap((u) =>
    u.faculties.map((f) => ({
      name: f.name,
      city: u.city,
      university: u.name,
      type: u.type,
      url: f.url,
      levels: f.levels,
    })),
  );

  const byKey = new Map<string, FacultyItem>();

  for (const f of flat) {
    const key = `${f.name}__${f.city}`;
    if (!byKey.has(key)) {
      byKey.set(key, f);
    }
  }

  return Array.from(byKey.values());
})();

const KartaFakulteta = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [showFerModal, setShowFerModal] = useState(false);
  const [showEfzgModal, setShowEfzgModal] = useState(false);
  const [showFsbModal, setShowFsbModal] = useState(false);
  const [showGradModal, setShowGradModal] = useState(false);
  const [showMefModal, setShowMefModal] = useState(false);
  const [showPravoModal, setShowPravoModal] = useState(false);

  const types = useMemo(() => {
    const order = [
      "Javno sveučilište",
      "Privatno sveučilište",
      "Javno veleučilište",
      "Privatno veleučilište",
    ];
    const set = new Set(faculties.map((f) => f.type));
    return order.filter((t) => set.has(t));
  }, []);
  const cities = useMemo(() => [...new Set(faculties.map((f) => f.city))].sort(), []);

  const filtered = faculties.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.city.toLowerCase().includes(search.toLowerCase());
    const typeNormalized = (t: string) => t.trim().toLowerCase();
    const matchType =
      !filterType || typeNormalized(f.type) === typeNormalized(filterType);
    const matchCity =
      !filterCity ||
      f.city.trim().toLowerCase() === filterCity.trim().toLowerCase();
    return matchSearch && matchType && matchCity;
  });

  return (
    <Layout>
      <section className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Karta</span> fakulteta
          </h1>
          <p className="text-muted-foreground text-lg">
            Istraži sve fakultete u Hrvatskoj i pronađi onaj pravi za tebe.
          </p>
        </motion.div>

        {/* Google karta s markerima fakulteta */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-2xl overflow-hidden border bg-muted mb-10"
        >
          <div className="h-64 md:h-80 w-full">
            <iframe
              title="Karta fakulteta – Google My Maps"
              src="https://www.google.com/maps/d/embed?mid=1hfnNynhIABrOthygSpdz0RnzAtJdHAU"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <p className="text-xs text-muted-foreground px-4 py-2 border-t border-border">
            Na karti su prikazani markeri fakulteta. Koristi odabir grada i fakulteta ispod za pretragu liste.{" "}
            <a
              href="https://www.google.com/maps/d/viewer?mid=1hfnNynhIABrOthygSpdz0RnzAtJdHAU"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Otvori punu kartu (Google My Maps)
            </a>
          </p>
          {/* Pretraži s karte – odabir grada ili fakulteta filtrira listu ispod */}
          <div className="p-4 bg-muted/60 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">Pretraži fakultete s karte</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-0">
                <label className="text-xs text-muted-foreground mb-1 block">Grad</label>
                <Select
                  value={filterCity ?? "svi"}
                  onValueChange={(v) => setFilterCity(v === "svi" ? null : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Svi gradovi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="svi">Svi gradovi</SelectItem>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-xs text-muted-foreground mb-1 block">Fakultet / ustanova</label>
                <Select
                  value={
                    search && filterCity && faculties.some((f) => f.name === search && f.city === filterCity)
                      ? `${search}__${filterCity}`
                      : "svi"
                  }
                  onValueChange={(v) => {
                    if (v === "svi") {
                      setSearch("");
                      setFilterCity(null);
                      return;
                    }
                    const [name, city] = v.split("__");
                    if (name && city) {
                      setSearch(name);
                      setFilterCity(city);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Svi fakulteti" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[280px]">
                    <SelectItem value="svi">Svi fakulteti</SelectItem>
                    {cities.map((city) => {
                      const inCity = faculties.filter((f) => f.city === city);
                      if (inCity.length === 0) return null;
                      return (
                        <SelectGroup key={city}>
                          <SelectLabel>{city}</SelectLabel>
                          {inCity.map((f) => (
                            <SelectItem key={`${f.name}__${f.city}`} value={`${f.name}__${f.city}`}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(filterCity || search) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilterCity(null);
                }}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Poništi pretragu s karte
              </button>
            )}
          </div>
        </motion.div>

        {/* Search & filters */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pretraži fakultete..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Tip sveučilišta */}
            <div className="flex flex-col gap-2 min-w-0">
              <span className="text-sm font-semibold text-foreground">Tip sveučilišta</span>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={!filterType ? "default" : "outline"}
                  className={`cursor-pointer ${!filterType ? "gradient-hero text-primary-foreground border-0" : ""}`}
                  onClick={() => setFilterType(null)}
                >
                  Svi tipovi
                </Badge>
                {types.map((t) => (
                  <Badge
                    key={t}
                    variant={filterType === t ? "default" : "outline"}
                    className={`cursor-pointer ${filterType === t ? "gradient-hero text-primary-foreground border-0" : ""}`}
                    onClick={() => setFilterType(t)}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Grad */}
            <div className="flex flex-col gap-2 min-w-0 sm:border-l sm:border-border sm:pl-8">
              <span className="text-sm font-semibold text-foreground">Grad</span>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={!filterCity ? "default" : "outline"}
                  className={`cursor-pointer ${!filterCity ? "gradient-hero text-primary-foreground border-0" : ""}`}
                  onClick={() => setFilterCity(null)}
                >
                  Svi gradovi
                </Badge>
                {cities.map((c) => (
                  <Badge
                    key={c}
                    variant={filterCity === c ? "default" : "outline"}
                    className={`cursor-pointer ${filterCity === c ? "gradient-hero text-primary-foreground border-0" : ""}`}
                    onClick={() => setFilterCity(c)}
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Faculty list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((faculty, i) => (
            <motion.div
              key={faculty.name + faculty.city}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-card shadow-card border hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer group"
              onClick={() => {
                if (faculty.name.includes("elektrotehnike i računarstva")) {
                  setShowFerModal(true);
                }
                if (faculty.name === "Ekonomski fakultet" && faculty.city === "Zagreb") {
                  setShowEfzgModal(true);
                }
                if (faculty.name === "Fakultet strojarstva i brodogradnje") {
                  setShowFsbModal(true);
                }
                if (faculty.name === "Građevinski fakultet") {
                  setShowGradModal(true);
                }
                if (faculty.name === "Medicinski fakultet") {
                  setShowMefModal(true);
                }
                if (faculty.name === "Pravni fakultet") {
                  setShowPravoModal(true);
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="pr-2">
                  <h3 className="font-semibold text-sm leading-tight">{faculty.name}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                    <UniversityIcon className="w-3 h-3" />
                    <span>{faculty.university}</span>
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {faculty.city}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {faculty.type}
                  {faculty.levels && faculty.levels.length > 0 && (
                    <span className="ml-1 text-[10px] opacity-80">
                      ({faculty.levels.join(", ")})
                    </span>
                  )}
                </Badge>
                <a
                  href={faculty.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  Posjeti stranicu
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nema rezultata za zadanu pretragu.</p>
          </div>
        )}

        {showFerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowFerModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    FER – Fakultet elektrotehnike i računarstva
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na FER‑u
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od najprestižnijih tehničkih fakulteta u Hrvatskoj u području elektrotehnike,
                    računarstva i informacijskih tehnologija.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span>{" "}
                      Fakultet elektrotehnike i računarstva
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Electrical Engineering and Computing, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Unska 3, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 6129 999
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:fer@fer.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        fer@fer.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.fer.unizg.hr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.fer.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studiji obično traju 3 godine i nose 180 ECTS bodova.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Elektrotehnika i informacijska tehnologija</li>
                    <li>Računarstvo</li>
                  </ul>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Uvjeti za upis uključuju:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>završenu srednju školu</li>
                      <li>
                        položenu državnu maturu s naglaskom na matematiku (viša razina, često i fizika)
                      </li>
                      <li>bodovanje na temelju ocjena, rezultata mature i mogućih dodatnih bodova (npr. natjecanja)</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata koristi se nacionalni sustav prijava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Za strane (non‑EU) studente prijave se često podnose izravno putem FER stranice (na engleskom),
                    uz dokaz znanja engleskog jezika, matematike i fizike (npr. SAT, IELTS, TOEFL).
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon preddiplomskog studija moguće je nastaviti obrazovanje na:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Diplomskim studijima (npr. Elektrotehnika i informacijska tehnologija, Računarstvo)</li>
                    <li>
                      Doktorskim studijima u područjima elektrotehnike i računarstva (uz završeni diplomski/magistarski
                      studij i prijemni postupak)
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    FER je snažno orijentiran na istraživanje i suradnju s industrijom u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>računalna znanost i inženjering</li>
                    <li>sustavi i kontrola</li>
                    <li>mreže i komunikacije</li>
                    <li>automatizacija i robotika</li>
                    <li>umjetna inteligencija i podatkovna znanost</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Fakultet redovito organizira događanja, dane otvorenih vrata, sajmove i konferencije za
                    srednjoškolce i studente.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Unska 3, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 6129 999</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:fer@fer.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        fer@fer.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.fer.unizg.hr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.fer.unizg.hr/
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showFsbModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowFsbModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    FSB – Fakultet strojarstva i brodogradnje
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Fakultetu strojarstva i brodogradnje
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od vodećih tehničkih fakulteta u Hrvatskoj u području strojarstva, brodogradnje i industrijskog
                    inženjerstva. Fakultet je dio University of Zagreb i poznat je po snažnoj povezanosti s industrijom,
                    istraživanjima i praktičnim projektima.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span>{" "}
                      Fakultet strojarstva i brodogradnje
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Mechanical Engineering and Naval Architecture, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Ivana Lučića 5, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 6168 111
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:dekanat@fsb.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        dekanat@fsb.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.fsb.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.fsb.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij obično traje <strong className="text-foreground">3 godine</strong> i nosi{" "}
                    <strong className="text-foreground">180 ECTS bodova</strong>.
                  </p>
                  <p className="text-sm font-semibold text-foreground">Glavni studijski programi:</p>
                  <p className="text-sm font-medium text-foreground">Strojarstvo</p>
                  <p className="text-sm text-muted-foreground">Pokriva područja kao što su:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>konstrukcija strojeva</li>
                    <li>proizvodno inženjerstvo</li>
                    <li>energetika</li>
                    <li>mehatronika</li>
                    <li>automatizacija</li>
                  </ul>
                  <p className="text-sm font-medium text-foreground mt-2">Brodogradnja</p>
                  <p className="text-sm text-muted-foreground">Obuhvaća:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>projektiranje brodova</li>
                    <li>pomorske konstrukcije</li>
                    <li>hidrodinamiku</li>
                    <li>pomorske tehnologije</li>
                  </ul>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Uvjeti za upis</p>
                    <p>Za upis je potrebno:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>završena srednja škola</li>
                      <li>
                        položena <strong className="text-foreground">državna matura</strong> (poseban naglasak na{" "}
                        <strong className="text-foreground">matematiku – viša razina</strong>)
                      </li>
                      <li>često se vrednuju i rezultati iz <strong className="text-foreground">fizike</strong></li>
                      <li>
                        bodovanje se temelji na: ocjenama iz srednje škole, rezultatima državne mature, dodatnim
                        bodovima (npr. natjecanja)
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata prijave se podnose putem nacionalnog sustava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Za <strong className="text-foreground">strane (non-EU) studente</strong> prijava se obično podnosi
                    izravno putem fakultetske stranice, uz: dokaz znanja engleskog jezika (npr. IELTS, TOEFL),
                    dokumentaciju o završenom obrazovanju, ponekad dokaz znanja matematike i fizike.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon preddiplomskog studija moguće je nastaviti obrazovanje na:
                  </p>
                  <p className="text-sm font-semibold text-foreground">Diplomski studiji (2 godine – 120 ECTS)</p>
                  <p className="text-sm text-muted-foreground">Neka od područja uključuju:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>konstrukcijsko inženjerstvo</li>
                    <li>proizvodno inženjerstvo</li>
                    <li>energetika i procesna tehnika</li>
                    <li>mehatronika i robotika</li>
                    <li>brodogradnja i pomorske tehnologije</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studij</p>
                  <p className="text-sm text-muted-foreground">
                    Doktorski studij iz područja strojarstva i brodogradnje moguć je nakon završenog diplomskog studija
                    i prijemnog postupka.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Fakultet aktivno sudjeluje u znanstvenim projektima i industrijskoj suradnji u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>napredni proizvodni sustavi</li>
                    <li>robotika i mehatronika</li>
                    <li>energetika i obnovljivi izvori energije</li>
                    <li>računalne simulacije i modeliranje</li>
                    <li>brodogradnja i pomorske tehnologije</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Fakultet redovito organizira: <strong className="text-foreground">dane otvorenih vrata</strong>,{" "}
                    <strong className="text-foreground">studentska natjecanja i projekte</strong>,{" "}
                    <strong className="text-foreground">znanstvene konferencije</strong>, prezentacije za srednjoškolce.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Ivana Lučića 5, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 6168 111</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:dekanat@fsb.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        dekanat@fsb.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.fsb.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.fsb.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showEfzgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowEfzgModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    Ekonomski fakultet – Sveučilište u Zagrebu
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Ekonomskom fakultetu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od najvećih i najpoznatijih fakulteta u Hrvatskoj u području ekonomije, poslovanja i
                    menadžmenta. Fakultet je dio University of Zagreb i obrazuje stručnjake za ekonomiju, financije,
                    marketing, menadžment i poduzetništvo.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span> Ekonomski fakultet Sveučilišta u Zagrebu
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Economics and Business, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Trg J. F. Kennedyja 6, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 2383 333
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:info@efzg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        info@efzg.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.efzg.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.efzg.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fakultet ima veliku modernu zgradu i svake godine upisuje velik broj studenata na različite studijske programe.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij traje <strong className="text-foreground">3 godine</strong> i nosi{" "}
                    <strong className="text-foreground">180 ECTS bodova</strong>.
                  </p>
                  <p className="text-sm font-semibold text-foreground">Glavni studijski programi:</p>
                  <p className="text-sm font-medium text-foreground">Ekonomija</p>
                  <p className="text-sm text-muted-foreground">
                    Fokusira se na razumijevanje ekonomskih sustava i analizu tržišta. Područja uključuju:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>makroekonomiju</li>
                    <li>mikroekonomiju</li>
                    <li>ekonomsku analizu</li>
                    <li>ekonomsku politiku</li>
                    <li>međunarodnu ekonomiju</li>
                  </ul>
                  <p className="text-sm font-medium text-foreground mt-2">Poslovna ekonomija</p>
                  <p className="text-sm text-muted-foreground">
                    Studij usmjeren na poslovanje i upravljanje organizacijama. Studenti se mogu usmjeriti u područja poput:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>marketing</li>
                    <li>menadžment</li>
                    <li>financije</li>
                    <li>računovodstvo i revizija</li>
                    <li>trgovina i međunarodno poslovanje</li>
                    <li>poduzetništvo</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">Primjeri predmeta:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Osnove ekonomije</li>
                    <li>Matematika za ekonomiste</li>
                    <li>Statistika</li>
                    <li>Menadžment</li>
                    <li>Marketing</li>
                    <li>Financije</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata prijave se podnose putem sustava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">Uvjeti za upis uključuju: završenu srednju školu, položenu državnu maturu. Najvažniji predmeti za bodovanje često su: matematika, hrvatski jezik, strani jezik. Bodovi se računaju na temelju ocjena iz srednje škole, rezultata državne mature i dodatnih bodova (npr. natjecanja).</p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm font-semibold text-foreground">Diplomski studiji (2 godine – 120 ECTS)</p>
                  <p className="text-sm text-muted-foreground">
                    Studenti mogu nastaviti studij u brojnim specijalizacijama, primjerice:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>financije</li>
                    <li>marketing</li>
                    <li>menadžment</li>
                    <li>računovodstvo i revizija</li>
                    <li>međunarodno poslovanje</li>
                    <li>turizam</li>
                    <li>poslovna analiza</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studij</p>
                  <p className="text-sm text-muted-foreground">
                    Fakultet nudi doktorski studij iz područja ekonomije i poslovne ekonomije, koji uključuje
                    znanstveno istraživanje, objavu znanstvenih radova i izradu doktorske disertacije.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Fakultet sudjeluje u brojnim međunarodnim projektima i suradnjama s gospodarstvom u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>financijska tržišta</li>
                    <li>ekonomska politika</li>
                    <li>poduzetništvo</li>
                    <li>digitalna ekonomija</li>
                    <li>marketing i ponašanje potrošača</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Studenti sudjeluju u: studentskim udrugama i projektima, poslovnim natjecanjima, konferencijama i
                    radionicama, stručnim praksama u tvrtkama.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📍 Trg J. F. Kennedyja 6, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 2383 333</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:info@efzg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        info@efzg.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.efzg.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.efzg.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showGradModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowGradModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    Građevinski fakultet – Sveučilište u Zagrebu
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Građevinskom fakultetu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od najvažnijih tehničkih fakulteta u Hrvatskoj u području građevinarstva, infrastrukture i
                    urbanog razvoja. Fakultet je dio University of Zagreb i najstarija je institucija za obrazovanje
                    građevinskih inženjera u Hrvatskoj. (
                    <a
                      href="https://www.grad.unizg.hr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/90"
                    >
                      grad.unizg.hr
                    </a>
                    )
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span> Građevinski fakultet
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Civil Engineering, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Fra Andrije Kačića-Miošića 26,
                      10000 Zagreb, Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 4800 800
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:ured.dekana@grad.unizg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        ured.dekana@grad.unizg.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.grad.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.grad.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fakultet obrazuje studente u svim glavnim granama građevinarstva i ima stotine studenata na
                    preddiplomskim, diplomskim i poslijediplomskim programima. (
                    <a
                      href="https://www.grad.unizg.hr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/90"
                    >
                      grad.unizg.hr
                    </a>
                    )
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij traje <strong className="text-foreground">3 godine</strong> i nosi{" "}
                    <strong className="text-foreground">180 ECTS bodova</strong>.
                  </p>
                  <p className="text-sm font-semibold text-foreground">Glavni program: Građevinarstvo</p>
                  <p className="text-sm text-muted-foreground">Studenti tijekom studija uče područja poput:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>statike i mehanike konstrukcija</li>
                    <li>geotehničkog inženjerstva</li>
                    <li>hidrotehnike i vodnog gospodarstva</li>
                    <li>prometne infrastrukture</li>
                    <li>projektiranja zgrada i mostova</li>
                    <li>građevinskih materijala</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">Primjeri predmeta uključuju:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Građevinska statika</li>
                    <li>Otpornost materijala</li>
                    <li>Geotehnika</li>
                    <li>Ceste i prometna infrastruktura</li>
                    <li>Inženjerska geologija</li>
                    <li>Projektiranje zgrada (ISVU)</li>
                  </ul>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Uvjeti za upis</p>
                    <p>Za upis je potrebno:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>završena srednja škola</li>
                      <li>položena <strong className="text-foreground">državna matura</strong></li>
                      <li>važna je <strong className="text-foreground">matematika (viša razina)</strong></li>
                      <li>često se boduje i <strong className="text-foreground">fizika</strong></li>
                    </ul>
                    <p>Bodovi se računaju na temelju: ocjena iz srednje škole, rezultata državne mature, dodatnih bodova (npr. natjecanja).</p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i EU studente prijava ide preko nacionalnog sustava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Za <strong className="text-foreground">strane studente</strong> prijave se obično podnose putem
                    fakultetske stranice uz: dokaz znanja engleskog jezika, dokumente o prethodnom obrazovanju,
                    ponekad dokaz znanja matematike i fizike.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm font-semibold text-foreground">Diplomski studij (2 godine – 120 ECTS)</p>
                  <p className="text-sm text-muted-foreground">
                    Studenti se mogu specijalizirati u područjima poput:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>konstrukcije (mostovi, zgrade)</li>
                    <li>geotehnika</li>
                    <li>hidrotehnika</li>
                    <li>prometnice i infrastruktura</li>
                    <li>upravljanje projektima u graditeljstvu</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studij</p>
                  <p className="text-sm text-muted-foreground">
                    Doktorski studij iz građevinarstva dostupan je nakon završenog diplomskog studija i uključuje
                    znanstveno istraživanje i izradu doktorske disertacije.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Fakultet provodi istraživanja u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>konstrukcije i potresno inženjerstvo</li>
                    <li>geotehničko inženjerstvo</li>
                    <li>vodno gospodarstvo</li>
                    <li>prometna infrastruktura</li>
                    <li>građevinski materijali</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Fakultet je organiziran u više odjela, uključujući geotehniku, hidrotehniku, konstrukcije, promet i
                    materijale. (
                    <a
                      href="https://www.grad.unizg.hr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/90"
                    >
                      grad.unizg.hr
                    </a>
                    )
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Studenti također sudjeluju u: istraživačkim projektima, stručnim praksama, konferencijama i stručnim
                    radionicama.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Fra Andrije Kačića-Miošića 26, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 4800 800</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:ured.dekana@grad.unizg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        ured.dekana@grad.unizg.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.grad.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.grad.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showMefModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowMefModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    Medicinski fakultet – Sveučilište u Zagrebu
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Medicinskom fakultetu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Najstariji medicinski fakultet u Republici Hrvatskoj.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span> Medicinski fakultet
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      University of Zagreb School of Medicine
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Šalata 3, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 4566 777
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:web@mef.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        web@mef.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.mef.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.mef.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski i diplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Integrirani preddiplomski i diplomski studij medicine</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Trajanje: <strong className="text-foreground">6 godina</strong> | ECTS bodovi:{" "}
                    <strong className="text-foreground">360</strong>
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Medicina u hrvatskom jeziku</li>
                    <li>Medicina u engleskom jeziku</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Diplomski studiji</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Medicinski studij za doktore medicine</li>
                    <li>Magistarski studij zdravstvene njege</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studiji</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Biomedicina i zdravstvo (hrvatski i engleski)</li>
                    <li>Neuroznanost</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">✅ Uvjeti za upis</h3>
                  <p className="text-sm text-muted-foreground">Uvjeti za upis uključuju:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>završenu srednju školu</li>
                    <li>
                      položenu državnu maturu s naglaskom na matematiku, biologiju i kemiju (viša razina)
                    </li>
                    <li>bodovanje na temelju ocjena, rezultata mature i mogućih dodatnih bodova (npr. natjecanja)</li>
                    <li>Medicinski fakultet ima vrlo kompetitivan upis s visokim minimalnim bodovima</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata koristi se nacionalni sustav prijava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Za <strong className="text-foreground">strane (non-EU) studente</strong>: prijave se podnose izravno
                    putem stranice Medicinskog fakulteta (na engleskom), potreban je dokaz znanja engleskog jezika
                    (TOEFL, IELTS), dokazi znanja matematike, biologije i kemije (SAT, A-Levels ili slično), diploma o
                    završenoj srednjoj školi s nostrifikacijom (ako je iz inozemstva).
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon preddiplomskog studija moguće je nastaviti obrazovanje na:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Diplomskim studijima (npr. Medicinski studij za doktore medicine, Zdravstvena njega)</li>
                    <li>
                      Doktorskim studijima u biomedicini i zdravstvu (uz završeni diplomski studij i prijemni postupak)
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧬 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Medicinski fakultet je snažno orijentiran na istraživanje i suradnju s industrijom u područjima kao
                    što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>biomedicina i zdravstvo</li>
                    <li>klinička medicinska istraživanja</li>
                    <li>javno zdravstvo i epidemiologija</li>
                    <li>neuroznanost</li>
                    <li>medicinska informatika i digitalizacija zdravstva</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Fakultet redovito organizira događanja, dane otvorenih vrata, sajmove i konferencije za
                    srednjoškolce i studente.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Šalata 3, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 4566 777</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:web@mef.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        web@mef.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.mef.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.mef.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showPravoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowPravoModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    Pravni fakultet – Sveučilište u Zagrebu
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Pravnom fakultetu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od najstarijih i najvećih pravnih fakulteta u Hrvatskoj. Fakultet je dio University of Zagreb
                    i obrazuje pravnike, socijalne radnike i stručnjake za javnu upravu. Poznat je po dugoj tradiciji,
                    velikom broju studenata i značajnom utjecaju na pravni sustav Hrvatske.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span> Pravni fakultet Sveučilišta u Zagrebu
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Law, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Trg Republike Hrvatske 14, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 4895 111
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:info@pravo.unizg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        info@pravo.unizg.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.pravo.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.pravo.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fakultet ima nekoliko zgrada u centru Zagreba i velik broj studenata na različitim studijskim programima.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Na fakultetu postoji više preddiplomskih studijskih programa.
                  </p>
                  <p className="text-sm font-semibold text-foreground">Pravo (integrirani studij)</p>
                  <p className="text-sm text-muted-foreground">
                    Studij <strong className="text-foreground">Pravo</strong> je integrirani preddiplomski i diplomski studij
                    koji traje <strong className="text-foreground">5 godina</strong> i nosi <strong className="text-foreground">300 ECTS bodova</strong>.
                    Tijekom studija studenti uče područja kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>ustavno pravo</li>
                    <li>građansko pravo</li>
                    <li>kazneno pravo</li>
                    <li>upravno pravo</li>
                    <li>međunarodno pravo</li>
                    <li>trgovačko pravo</li>
                    <li>europsko pravo</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">Primjeri predmeta:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Uvod u pravo</li>
                    <li>Rimsko pravo</li>
                    <li>Ustavno pravo</li>
                    <li>Građansko pravo</li>
                    <li>Kazneno pravo</li>
                    <li>Financijsko pravo</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Socijalni rad</p>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij koji traje 3 godine (180 ECTS). Područja uključuju: socijalnu politiku,
                    socijalni rad s pojedincima i obiteljima, socijalne institucije, psihologiju i sociologiju.
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-2">Javna uprava</p>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij javne uprave također traje 3 godine (180 ECTS) i priprema studente za rad u
                    državnoj upravi, lokalnoj samoupravi i javnim institucijama.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata prijave se podnose putem sustava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Uvjeti za upis uključuju: završenu srednju školu, položenu državnu maturu, bodovanje na temelju
                    ocjena iz srednje škole, rezultata državne mature i dodatnih bodova (npr. natjecanja). Za studij
                    Pravo važni su rezultati iz hrvatskog jezika, stranog jezika, matematike ili drugih izbornih predmeta.
                    Strani studenti često moraju dokazati znanje hrvatskog ili engleskog jezika.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon završetka studija moguće je nastaviti obrazovanje na:
                  </p>
                  <p className="text-sm font-semibold text-foreground">Diplomski studiji</p>
                  <p className="text-sm text-muted-foreground">
                    Za programe poput Socijalnog rada i Javne uprave postoji nastavak na diplomskom studiju (2 godine – 120 ECTS).
                    Studij Pravo je već integriran i završava se nakon 5 godina s titulom magistar prava.
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studij</p>
                  <p className="text-sm text-muted-foreground">
                    Fakultet nudi doktorski studij iz područja pravnih znanosti, koji uključuje: znanstveno istraživanje,
                    objavu radova i izradu doktorske disertacije.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Fakultet je aktivan u istraživanju i javnim raspravama o pravnim pitanjima u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>europsko pravo</li>
                    <li>međunarodno pravo</li>
                    <li>ustavno pravo</li>
                    <li>socijalna politika</li>
                    <li>javna uprava</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Studenti sudjeluju u: moot court natjecanjima, pravnim klinikama, znanstvenim konferencijama,
                    studentskim udrugama i projektima.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Trg Republike Hrvatske 14, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 4895 111</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:info@pravo.unizg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        info@pravo.unizg.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.pravo.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.pravo.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default KartaFakulteta;
