import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { MapPin, Search, ExternalLink, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const faculties = [
  { name: "FER - Fakultet elektrotehnike i računarstva", city: "Zagreb", field: "Tehničke", prag: 850 },
  { name: "Ekonomski fakultet", city: "Zagreb", field: "Društvene", prag: 650 },
  { name: "Medicinski fakultet", city: "Zagreb", field: "Biomedicina", prag: 900 },
  { name: "Pravni fakultet", city: "Zagreb", field: "Društvene", prag: 700 },
  { name: "PMF - Matematika", city: "Zagreb", field: "Prirodne", prag: 600 },
  { name: "FESB", city: "Split", field: "Tehničke", prag: 500 },
  { name: "Filozofski fakultet", city: "Rijeka", field: "Humanističke", prag: 450 },
  { name: "Agronomski fakultet", city: "Zagreb", field: "Biotehničke", prag: 400 },
  { name: "Grafički fakultet", city: "Zagreb", field: "Tehničke", prag: 550 },
  { name: "Fakultet strojarstva", city: "Slavonski Brod", field: "Tehničke", prag: 350 },
  { name: "Medicinski fakultet", city: "Split", field: "Biomedicina", prag: 880 },
  { name: "Ekonomski fakultet", city: "Osijek", field: "Društvene", prag: 500 },
];

const KartaFakulteta = () => {
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState<string | null>(null);
  const [showFerModal, setShowFerModal] = useState(false);
  const [showEfzgModal, setShowEfzgModal] = useState(false);

  const fields = [...new Set(faculties.map((f) => f.field))];

  const filtered = faculties.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.city.toLowerCase().includes(search.toLowerCase());
    const matchField = !filterField || f.field === filterField;
    return matchSearch && matchField;
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

        {/* Interaktivna karta */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border bg-muted mb-10"
        >
          <iframe
            title="Interaktivna karta Hrvatske"
            src="https://free-map.org/croatia/"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </motion.div>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pretraži fakultete..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={!filterField ? "default" : "outline"}
              className={`cursor-pointer ${!filterField ? "gradient-hero text-primary-foreground border-0" : ""}`}
              onClick={() => setFilterField(null)}
            >
              Sve
            </Badge>
            {fields.map((f) => (
              <Badge
                key={f}
                variant={filterField === f ? "default" : "outline"}
                className={`cursor-pointer ${filterField === f ? "gradient-hero text-primary-foreground border-0" : ""}`}
                onClick={() => setFilterField(f)}
              >
                {f}
              </Badge>
            ))}
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
                if (faculty.name === "FER - Fakultet elektrotehnike i računarstva") {
                  setShowFerModal(true);
                }
                if (faculty.name === "Ekonomski fakultet" && faculty.city === "Zagreb") {
                  setShowEfzgModal(true);
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-sm leading-tight pr-2">{faculty.name}</h3>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {faculty.city}
                </span>
                <Badge variant="secondary" className="text-xs">{faculty.field}</Badge>
                <span className="text-xs text-muted-foreground ml-auto">Prag: {faculty.prag}</span>
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
                    Detaljne informacije o studiju na EFZG‑u
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedna od vodećih institucija za ekonomsko i poslovno obrazovanje u Hrvatskoj, s jakom međunarodnom
                    reputacijom i akreditacijama.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span>{" "}
                      Ekonomski fakultet – Sveučilište u Zagrebu
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Economics &amp; Business, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Trg J. F. Kennedyja 6,
                      10000 Zagreb, Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 1 238 3333
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Fax:</span> +385 1 233 5633
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email (press):</span>{" "}
                      <a
                        href="mailto:pr@efzg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        pr@efzg.hr
                      </a>
                    </p>
                    <p className="md:col-span-2">
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.efzg.unizg.hr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.efzg.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi</h3>
                  <h4 className="text-sm font-semibold text-foreground">
                    📘 Preddiplomski i stručni studiji
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    EFZG nudi različite sveučilišne i stručne programe s naglaskom na ekonomiju i poslovnu
                    ekonomiju, uz mogućnosti stručne prakse i suradnje s industrijom.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>kvalificirani preddiplomski sveučilišni i stručni studiji</li>
                    <li>integrirani sveučilišni programi</li>
                    <li>stručno osposobljavanje kroz prakse i projekte s gospodarstvom</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📗 Programi na engleskom jeziku</h3>
                  <p className="text-sm text-muted-foreground">
                    Za studente koji žele studirati na engleskom jeziku, EFZG nudi cijele programe na engleskom,
                    otvorene i za međunarodne studente.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Bachelor Degree in Business (4 godine)</li>
                    <li>Bachelor Degree in Economics (4 godine)</li>
                    <li>Master Degree in Economics</li>
                    <li>
                      Master Degree in Business s nizom specijalizacija (Marketing, Management, Trade, Leadership…)
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📚 Specijalistički i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Na poslijediplomskoj razini EFZG nudi:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>sveučilišne specijalističke programe iz različitih područja ekonomije i poslovanja</li>
                    <li>
                      doktorski studij Ekonomija i poslovna ekonomija te programe vezane uz upravljanje digitalnim
                      inovacijama
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Detaljni uvjeti upisa (prosjek studija, dokumentacija, intervjui) navedeni su na službenoj
                    stranici fakulteta.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i uvjeti</h3>
                  <p className="text-sm text-muted-foreground">
                    Uvjeti upisa ovise o razini i vrsti programa, ali općenito uključuju završenu srednju školu ili
                    prethodni studijski ciklus, rezultate državne mature ili međunarodne kvalifikacije za programe na
                    engleskom jeziku.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Za specijalističke i doktorske programe često se traži viši prosjek studija, motivacijsko pismo i
                    dodatna dokumentacija.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📊 Ostale informacije</h3>
                  <p className="text-sm text-muted-foreground">
                    EFZG je poznat po snažnim vezama s poslovnim sektorom i međunarodnim institucijama:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>suradnja s tvrtkama, institucijama i poduzetnicima</li>
                    <li>internacionalna partnerstva i razmjene (npr. Erasmus+)</li>
                    <li>mnogobrojne mogućnosti za studentske prakse i projekte</li>
                    <li>
                      bogata ponuda kolegija iz ekonomije, menadžmenta, financija, marketinga, statistike, projektnog
                      menadžmenta i drugih područja
                    </li>
                  </ul>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📍 Adresa i kontakti</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      📍 Ekonomski fakultet – Sveučilište u Zagrebu, Trg J. F. Kennedyja 6, 10000 Zagreb, Hrvatska
                    </p>
                    <p>📞 +385 1 238 3333</p>
                    <p>📠 Fax: +385 1 233 5633</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:pr@efzg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        pr@efzg.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.efzg.unizg.hr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.efzg.unizg.hr/
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
