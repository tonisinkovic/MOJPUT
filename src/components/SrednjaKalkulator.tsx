import { useMemo, useState, type ChangeEvent } from "react";
import { Calculator, GraduationCap, School, Trophy } from "lucide-react";

type ProgramType = "gimnazija4" | "trogodisnji" | "kraci";

type SevenEightGrades = {
  prosjek: string;
  matematika: string;
  hrvatski: string;
  strani: string;
  predmet1: string;
  predmet2: string;
  predmet3: string;
};

type SchoolThreshold = {
  naziv: string;
  zupanija: string;
  program: ProgramType;
  minBodovi: number;
  prosjekBodovi: number;
  maxBodovi: number;
};

const SCHOOLS: SchoolThreshold[] = [
  {
    naziv: "XV. gimnazija",
    zupanija: "Grad Zagreb",
    program: "gimnazija4",
    minBodovi: 76,
    prosjekBodovi: 78.4,
    maxBodovi: 80,
  },
  {
    naziv: "Tehnička škola Ruđera Boškovića",
    zupanija: "Grad Zagreb",
    program: "gimnazija4",
    minBodovi: 64,
    prosjekBodovi: 70.2,
    maxBodovi: 80,
  },
  {
    naziv: "Ekonomska i upravna škola Split",
    zupanija: "Splitsko-dalmatinska",
    program: "gimnazija4",
    minBodovi: 58,
    prosjekBodovi: 65.1,
    maxBodovi: 80,
  },
  {
    naziv: "Obrtnička škola Osijek",
    zupanija: "Osječko-baranjska",
    program: "trogodisnji",
    minBodovi: 31,
    prosjekBodovi: 39.5,
    maxBodovi: 50,
  },
  {
    naziv: "Industrijsko-obrtnička škola Rijeka",
    zupanija: "Primorsko-goranska",
    program: "kraci",
    minBodovi: 12,
    prosjekBodovi: 16.2,
    maxBodovi: 20,
  },
];

const ZUPANIJE = [
  "Bjelovarsko-bilogorska",
  "Brodsko-posavska",
  "Dubrovačko-neretvanska",
  "Grad Zagreb",
  "Istarska",
  "Karlovačka",
  "Koprivničko-križevačka",
  "Krapinsko-zagorska",
  "Ličko-senjska",
  "Međimurska",
  "Osječko-baranjska",
  "Požeško-slavonska",
  "Primorsko-goranska",
  "Šibensko-kninska",
  "Sisačko-moslavačka",
  "Splitsko-dalmatinska",
  "Varaždinska",
  "Virovitičko-podravska",
  "Vukovarsko-srijemska",
  "Zadarska",
  "Zagrebačka",
];

const PROGRAM_LABELS: Record<ProgramType, string> = {
  gimnazija4: "Gimnazija / 4-godišnji program",
  trogodisnji: "Trogodišnji strukovni program",
  kraci: "Program kraći od 3 godine",
};

const MAX_BY_PROGRAM: Record<ProgramType, number> = {
  gimnazija4: 80,
  trogodisnji: 50,
  kraci: 20,
};

const emptySevenEight = (): SevenEightGrades => ({
  prosjek: "",
  matematika: "",
  hrvatski: "",
  strani: "",
  predmet1: "",
  predmet2: "",
  predmet3: "",
});

function toNum(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function SrednjaKalkulator() {
  const [program, setProgram] = useState<ProgramType>("gimnazija4");
  const [prosjek5, setProsjek5] = useState("");
  const [prosjek6, setProsjek6] = useState("");
  const [razred7, setRazred7] = useState<SevenEightGrades>(emptySevenEight());
  const [razred8, setRazred8] = useState<SevenEightGrades>(emptySevenEight());
  const [dodatniBodovi, setDodatniBodovi] = useState("");
  const [filterZupanija, setFilterZupanija] = useState("");
  const [rezultatIzracunat, setRezultatIzracunat] = useState(false);

  const rezultat = useMemo(() => {
    const opciUspjeh = clamp(
      clamp(toNum(prosjek5), 0, 5) +
        clamp(toNum(prosjek6), 0, 5) +
        clamp(toNum(razred7.prosjek), 0, 5) +
        clamp(toNum(razred8.prosjek), 0, 5),
      0,
      20,
    );

    const kljucniPredmeti = clamp(
      clamp(toNum(razred7.matematika), 0, 5) +
        clamp(toNum(razred8.matematika), 0, 5) +
        clamp(toNum(razred7.hrvatski), 0, 5) +
        clamp(toNum(razred8.hrvatski), 0, 5) +
        clamp(toNum(razred7.strani), 0, 5) +
        clamp(toNum(razred8.strani), 0, 5),
      0,
      30,
    );

    const posebniPredmeti = clamp(
      clamp(toNum(razred7.predmet1), 0, 5) +
        clamp(toNum(razred8.predmet1), 0, 5) +
        clamp(toNum(razred7.predmet2), 0, 5) +
        clamp(toNum(razred8.predmet2), 0, 5) +
        clamp(toNum(razred7.predmet3), 0, 5) +
        clamp(toNum(razred8.predmet3), 0, 5),
      0,
      30,
    );

    let zajednicki = opciUspjeh;
    if (program === "gimnazija4" || program === "trogodisnji") zajednicki += kljucniPredmeti;
    if (program === "gimnazija4") zajednicki += posebniPredmeti;

    const max = MAX_BY_PROGRAM[program];
    const dodatni = Math.max(0, toNum(dodatniBodovi));

    return {
      opciUspjeh,
      kljucniPredmeti,
      posebniPredmeti,
      dodatni,
      zajednicki,
      ukupno: zajednicki + dodatni,
      max,
      postotak: clamp((zajednicki / max) * 100, 0, 100),
    };
  }, [dodatniBodovi, program, prosjek5, prosjek6, razred7, razred8]);

  const filtriraneSkole = useMemo(
    () => SCHOOLS.filter((school) => !filterZupanija || school.zupanija === filterZupanija),
    [filterZupanija],
  );

  const updateSeven = (field: keyof SevenEightGrades, value: string) =>
    setRazred7((prev) => ({ ...prev, [field]: value }));

  const updateEight = (field: keyof SevenEightGrades, value: string) =>
    setRazred8((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="mx-auto max-w-4xl">
      <header className="relative mb-6 overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-amber-500/10 p-5 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            <School className="h-3.5 w-3.5" />
            Upis u srednju školu
          </span>
          <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
            Kalkulator bodova
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Unesi ocjene iz osnovne škole i dodatne bodove. Formula se prilagođava odabranom tipu programa i računa
            zajednički element prema javnoj metodologiji za upis u 1. razred srednje škole.
          </p>
        </div>
      </header>

      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Trenutni rezultat</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-primary">
              {rezultat.zajednicki.toFixed(2)}
              <span className="ml-1 text-base font-semibold text-muted-foreground">/ {rezultat.max}</span>
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Calculator className="h-7 w-7" />
          </div>
        </div>
        <div className="relative h-4 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-500"
            style={{ width: `${rezultat.postotak}%` }}
          />
        </div>
      </section>

      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <h2 className="mb-3 text-lg font-bold">Tip programa</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PROGRAM_LABELS) as ProgramType[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setProgram(key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                program === key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40"
              }`}
            >
              {PROGRAM_LABELS[key]}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <h2 className="mb-3 text-lg font-bold">5. i 6. razred</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Ukupan prosjek, 5. razred" value={prosjek5} onChange={setProsjek5} placeholder="npr. 4.85" />
          <NumberField label="Ukupan prosjek, 6. razred" value={prosjek6} onChange={setProsjek6} placeholder="npr. 4.90" />
        </div>
      </section>

      <RazredCard
        naslov="7. razred"
        podaci={razred7}
        onChange={updateSeven}
        pokaziKljucne={program !== "kraci"}
        pokaziPosebne={program === "gimnazija4"}
      />
      <RazredCard
        naslov="8. razred"
        podaci={razred8}
        onChange={updateEight}
        pokaziKljucne={program !== "kraci"}
        pokaziPosebne={program === "gimnazija4"}
      />

      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <h2 className="mb-2 text-lg font-bold">Dodatni bodovi</h2>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          Natjecanja, sportski rezultati i druga posebna postignuća unose se ručno kao ukupni dodatni bodovi.
        </p>
        <NumberField label="Dodatni bodovi" value={dodatniBodovi} onChange={setDodatniBodovi} placeholder="0" />
      </section>

      <button
        type="button"
        onClick={() => setRezultatIzracunat(true)}
        className="mb-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-card transition hover:bg-primary/90"
      >
        <GraduationCap className="h-5 w-5" />
        Izračunaj svoje bodove
      </button>

      {rezultatIzracunat && (
        <section className="mb-5 rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-card sm:p-5">
          <h2 className="mb-3 text-xl font-extrabold">Pregled bodova</h2>
          <ResultRow label="Opći uspjeh (5.-8. razred)" value={`${rezultat.opciUspjeh.toFixed(2)} / 20`} />
          {(program === "gimnazija4" || program === "trogodisnji") && (
            <ResultRow label="Hrvatski, Matematika, Strani jezik (7.-8.)" value={`${rezultat.kljucniPredmeti.toFixed(2)} / 30`} />
          )}
          {program === "gimnazija4" && (
            <ResultRow label="Predmeti značajni za upis (7.-8.)" value={`${rezultat.posebniPredmeti.toFixed(2)} / 30`} />
          )}
          <ResultRow label="Dodatni bodovi" value={rezultat.dodatni.toFixed(2)} />
          <div className="mt-4 rounded-2xl bg-background p-4">
            <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
              <span>Zajednički element</span>
              <strong className="text-foreground">{rezultat.zajednicki.toFixed(2)}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 text-lg font-bold">
              <span>Ukupno bodova</span>
              <strong className="text-2xl text-primary">{rezultat.ukupno.toFixed(2)}</strong>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Škole i pragovi</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Tablica je spremna za podatke o školama i pragovima. Kad se niz `SCHOOLS` popuni, ovdje će se prikazati
              filtrirani rezultati po županiji.
            </p>
          </div>
        </div>

        <label className="mb-4 block max-w-xs text-sm font-semibold">
          Županija
          <select
            value={filterZupanija}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setFilterZupanija(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">Sve županije</option>
            {ZUPANIJE.map((zupanija) => (
              <option key={zupanija} value={zupanija}>
                {zupanija}
              </option>
            ))}
          </select>
        </label>

        {filtriraneSkole.length === 0 ? (
          <p className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
            Nema unesenih škola za odabrani filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="border-b px-3 py-2">Škola</th>
                  <th className="border-b px-3 py-2">Županija</th>
                  <th className="border-b px-3 py-2">Min.</th>
                  <th className="border-b px-3 py-2">Prosjek</th>
                  <th className="border-b px-3 py-2">Max.</th>
                </tr>
              </thead>
              <tbody>
                {filtriraneSkole.map((school) => (
                  <tr key={school.naziv}>
                    <td className="border-b px-3 py-2">{school.naziv}</td>
                    <td className="border-b px-3 py-2">{school.zupanija}</td>
                    <td className="border-b px-3 py-2">{school.minBodovi}</td>
                    <td className="border-b px-3 py-2">{school.prosjekBodovi}</td>
                    <td className="border-b px-3 py-2">{school.maxBodovi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function RazredCard({
  naslov,
  podaci,
  onChange,
  pokaziKljucne,
  pokaziPosebne,
}: {
  naslov: string;
  podaci: SevenEightGrades;
  onChange: (field: keyof SevenEightGrades, value: string) => void;
  pokaziKljucne: boolean;
  pokaziPosebne: boolean;
}) {
  return (
    <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
      <h2 className="mb-3 text-lg font-bold">{naslov}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Ukupan prosjek" value={podaci.prosjek} onChange={(value) => onChange("prosjek", value)} placeholder="npr. 4.75" />
        {pokaziKljucne && (
          <>
            <GradeSelect label="Matematika" value={podaci.matematika} onChange={(value) => onChange("matematika", value)} />
            <GradeSelect label="Hrvatski jezik" value={podaci.hrvatski} onChange={(value) => onChange("hrvatski", value)} />
            <GradeSelect label="Prvi strani jezik" value={podaci.strani} onChange={(value) => onChange("strani", value)} />
          </>
        )}
        {pokaziPosebne && (
          <>
            <GradeSelect label="1. predmet značajan za upis" value={podaci.predmet1} onChange={(value) => onChange("predmet1", value)} />
            <GradeSelect label="2. predmet značajan za upis" value={podaci.predmet2} onChange={(value) => onChange("predmet2", value)} />
            <GradeSelect label="3. predmet značajan za upis" value={podaci.predmet3} onChange={(value) => onChange("predmet3", value)} />
          </>
        )}
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {label}
      <input
        type="number"
        min={0}
        max={5}
        step={0.01}
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function GradeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {label}
      <select
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="">-</option>
        {[1, 2, 3, 4, 5].map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <strong className="tabular-nums text-foreground">{value}</strong>
    </div>
  );
}
