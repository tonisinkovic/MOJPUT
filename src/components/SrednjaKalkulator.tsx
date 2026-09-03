import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronsUpDown,
  GraduationCap,
  Landmark,
  MapPin,
  School,
  Search,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  kalkulatorSchools,
  type KalkulatorPrag,
  type KalkulatorProgram,
  type KalkulatorSchool,
} from "@/data/srednjaKalkulator";
import { cn } from "@/lib/utils";

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

/** Procijeni tip programa iz maksimalnih bodova prošlogodišnjeg upisa. */
function programTypeFromPrag(prag: KalkulatorPrag | null): ProgramType | null {
  const reference = prag?.max ?? prag?.min ?? null;
  if (reference == null) return null;
  if (reference > 50) return "gimnazija4";
  if (reference > 20) return "trogodisnji";
  return "kraci";
}

type Chance = {
  label: string;
  desc: string;
  tone: "emerald" | "lime" | "amber" | "rose";
};

function chanceFor(points: number, pragMin: number): Chance {
  const diff = points - pragMin;
  if (diff >= 5) {
    return {
      label: "Velike šanse",
      desc: `Imaš ${diff.toFixed(2)} bodova više od prošlogodišnjeg praga. S ovakvim bodovima lani bi bio/la sigurno iznad crte.`,
      tone: "emerald",
    };
  }
  if (diff >= 0) {
    return {
      label: "Dobre šanse",
      desc: `Iznad si prošlogodišnjeg praga za ${diff.toFixed(2)} bodova. Prag se iz godine u godinu mijenja, pa pripremi i rezervnu opciju.`,
      tone: "lime",
    };
  }
  if (diff >= -3) {
    return {
      label: "Granične šanse",
      desc: `Nedostaje ti ${Math.abs(diff).toFixed(2)} bodova do prošlogodišnjeg praga. Ako prag padne ili se poveća kvota, još uvijek imaš priliku.`,
      tone: "amber",
    };
  }
  return {
    label: "Male šanse",
    desc: `Nedostaje ti ${Math.abs(diff).toFixed(2)} bodova do prošlogodišnjeg praga. Razmisli o sličnim programima s nižim pragom — provjeri ih u bazi.`,
    tone: "rose",
  };
}

const CHANCE_TONE: Record<Chance["tone"], { box: string; badge: string; bar: string }> = {
  emerald: {
    box: "border-emerald-500/40 bg-emerald-500/5",
    badge: "bg-emerald-500 text-white",
    bar: "from-emerald-500 to-emerald-400",
  },
  lime: {
    box: "border-lime-500/40 bg-lime-500/5",
    badge: "bg-lime-600 text-white",
    bar: "from-lime-500 to-emerald-400",
  },
  amber: {
    box: "border-amber-500/40 bg-amber-500/5",
    badge: "bg-amber-500 text-white",
    bar: "from-amber-500 to-amber-400",
  },
  rose: {
    box: "border-rose-500/40 bg-rose-500/5",
    badge: "bg-rose-500 text-white",
    bar: "from-rose-500 to-rose-400",
  },
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

function fmt(n: number | null): string {
  return n == null ? "—" : n.toLocaleString("hr-HR", { maximumFractionDigits: 2 });
}

/** Animirani kalkulator s prstom i brojevima koji iskaču */
function CalculatorAnimation() {
  const keyLabels = [
    ["1", "2", "3", "+"],
    ["4", "5", "6", "−"],
    ["7", "8", "9", "×"],
    [".", "0", "=", "÷"],
  ];
  const seq = [
    { r: 2, c: 0, ch: "7" },
    { r: 2, c: 1, ch: "8" },
    { r: 3, c: 0, ch: "." },
    { r: 1, c: 0, ch: "4" },
    { r: 1, c: 1, ch: "5" },
  ];

  const positions = seq.map((k) => ({
    x: 34 + k.c * 39 + 16.5,
    y: 100 + k.r * 38 + 15,
  }));

  const animDur = "5.5s";
  const stepPct = 100 / seq.length;
  const movePct = 6;

  let fingerKF = "";
  const pressKFs: string[] = seq.map(() => "");
  const popKFs: string[] = seq.map(() => "");
  // Ekran: brojevi se pojavljuju jedan po jedan
  const screenKFs: string[] = [];

  for (let i = 0; i < seq.length; i++) {
    const arriveAt = i * stepPct + movePct;
    const pressAt = arriveAt + 3;
    const leaveAt = (i + 1) * stepPct - 1;
    const p = positions[i];

    // Prst
    fingerKF += `${arriveAt.toFixed(1)}% { left: ${p.x}px; top: ${p.y - 26}px; }\n`;
    fingerKF += `${pressAt.toFixed(1)}% { left: ${p.x}px; top: ${p.y - 16}px; }\n`;
    fingerKF += `${(pressAt + 2).toFixed(1)}% { left: ${p.x}px; top: ${p.y - 24}px; }\n`;
    fingerKF += `${leaveAt.toFixed(1)}% { left: ${p.x}px; top: ${p.y - 24}px; }\n`;

    // Tipka glow
    pressKFs[i] += `0% { opacity: 0.3; transform: scale(1); }`;
    pressKFs[i] += `${arriveAt.toFixed(1)}% { opacity: 0.3; transform: scale(1); }`;
    pressKFs[i] += `${pressAt.toFixed(1)}% { opacity: 0.85; transform: scale(0.92); }`;
    pressKFs[i] += `${(pressAt + 3).toFixed(1)}% { opacity: 0.45; transform: scale(1); }`;
    pressKFs[i] += `100% { opacity: 0.3; transform: scale(1); }`;

    // Ripple efekt na tipki (kratki bljesak, ne leti)
    popKFs[i] += `0% { opacity: 0; transform: scale(0.5); }`;
    popKFs[i] += `${arriveAt.toFixed(1)}% { opacity: 0; transform: scale(0.5); }`;
    popKFs[i] += `${pressAt.toFixed(1)}% { opacity: 0.5; transform: scale(1.8); }`;
    popKFs[i] += `${(pressAt + 4).toFixed(1)}% { opacity: 0; transform: scale(2.2); }`;
    popKFs[i] += `100% { opacity: 0; transform: scale(0.5); }`;

    // Ekran: svaki karakter se pojavi nakon svog pritiska
    screenKFs.push(`${pressAt.toFixed(1)}`);
  }

  // Svaki znak na ekranu: nevidljiv → vidljiv u trenutku pritiska, ostaje vidljiv do kraja ciklusa
  const charKFs: string[] = [];
  for (let i = 0; i < seq.length; i++) {
    const showAt = Number(screenKFs[i]);
    let kf = `0% { opacity: 0; transform: scale(0.5); }\n`;
    kf += `${(showAt - 0.1).toFixed(1)}% { opacity: 0; transform: scale(0.5); }\n`;
    kf += `${showAt}% { opacity: 0.8; transform: scale(1.15); }\n`;
    kf += `${(showAt + 2).toFixed(1)}% { opacity: 0.65; transform: scale(1); }\n`;
    kf += `92% { opacity: 0.65; transform: scale(1); }\n`;
    kf += `100% { opacity: 0; transform: scale(0.5); }`;
    charKFs.push(kf);
  }

  fingerKF = `0% { left: ${positions[0].x}px; top: ${positions[0].y + 40}px; opacity: 0; }\n4% { opacity: 1; }\n${fingerKF}95% { opacity: 1; }\n100% { left: ${positions[seq.length - 1].x + 30}px; top: ${positions[seq.length - 1].y - 60}px; opacity: 0; }`;

  return (
    <div className="relative h-full w-full">
      <style>{`
        @keyframes calcFinger { ${fingerKF} }
        ${pressKFs.map((kf, i) => `@keyframes calcGlow${i} { ${kf} }`).join("\n")}
        ${popKFs.map((kf, i) => `@keyframes calcPop${i} { ${kf} }`).join("\n")}
        ${charKFs.map((kf, i) => `@keyframes calcChar${i} { ${kf} }`).join("\n")}
        .calc-finger { animation: calcFinger ${animDur} cubic-bezier(.4,0,.2,1) infinite; }
        ${pressKFs.map((_, i) => `.calc-glow-${i} { animation: calcGlow${i} ${animDur} ease-out infinite; transform-origin: center; }`).join("\n")}
        ${popKFs.map((_, i) => `.calc-pop-${i} { animation: calcPop${i} ${animDur} ease-out infinite; }`).join("\n")}
        ${charKFs.map((_, i) => `.calc-char-${i} { animation: calcChar${i} ${animDur} ease-out infinite; }`).join("\n")}
      `}</style>
      <svg viewBox="0 0 220 290" fill="none" className="h-full w-full">
        {/* Tijelo */}
        <rect x="20" y="20" width="180" height="250" rx="22" className="fill-current text-foreground" opacity="0.85" />
        {/* Ekran */}
        <rect x="34" y="34" width="152" height="50" rx="10" className="fill-current text-background" opacity="0.35" />
        {/* Ekran glow kada se pritisne */}
        <rect x="34" y="34" width="152" height="50" rx="10" fill="url(#screenGlow)" opacity="0.15">
          <animate attributeName="opacity" values="0.05;0.05;0.2;0.05;0.05;0.2;0.05;0.05;0.2;0.05;0.05;0.2;0.05;0.05;0.2;0.05" dur={animDur} repeatCount="indefinite" />
        </rect>
        <defs>
          <linearGradient id="screenGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Brojevi na ekranu: pojavljuju se jedan po jedan i ostaju */}
        {seq.map((s, i) => (
          <text
            key={i}
            x={108 + i * 18}
            y="66"
            textAnchor="middle"
            className={`fill-current text-foreground calc-char-${i}`}
            fontSize="22"
            fontWeight="bold"
            fontFamily="monospace"
            opacity="0"
          >
            {s.ch}
          </text>
        ))}

        {/* Tipke */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => {
            const kx = 34 + col * 39;
            const ky = 100 + row * 38;
            const pressIdx = seq.findIndex((k) => k.r === row && k.c === col);
            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={kx} y={ky} width="33" height="30" rx="7"
                  className={cn("fill-current text-background", pressIdx >= 0 && `calc-glow-${pressIdx}`)}
                  opacity="0.3"
                />
                {/* Ripple za pritisnute tipke */}
                {pressIdx >= 0 && (
                  <circle
                    cx={kx + 16.5} cy={ky + 15} r="16"
                    className={`fill-current text-background calc-pop-${pressIdx}`}
                    opacity="0"
                  />
                )}
                <text
                  x={kx + 16.5} y={ky + 20} textAnchor="middle"
                  className="fill-current text-foreground"
                  fontSize="13" fontWeight="700" fontFamily="system-ui" opacity="0.8"
                >
                  {keyLabels[row][col]}
                </text>
              </g>
            );
          }),
        )}
      </svg>

      {/* Prst */}
      <div
        className="calc-finger absolute"
        style={{ width: 30, height: 44, marginLeft: -15, marginTop: -22 }}
      >
        <svg viewBox="0 0 30 44" fill="none" className="h-full w-full drop-shadow-md">
          {/* Sjena */}
          <ellipse cx="15" cy="41" rx="11" ry="3" className="fill-current text-foreground" opacity="0.25" />
          {/* Tijelo prsta */}
          <path
            d="M9 40 C9 40 6 30 6 20 C6 11 10 4 15 4 C20 4 24 11 24 20 C24 30 21 40 21 40 Z"
            className="fill-current text-foreground"
            opacity="0.6"
          />
          {/* Nokat */}
          <ellipse cx="15" cy="10" rx="5.5" ry="4.5" className="fill-current text-foreground" opacity="0.3" />
          {/* Vrh prsta */}
          <ellipse cx="15" cy="37" rx="6.5" ry="4.5" className="fill-current text-foreground" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}

/** Pretraživi dropdown za odabir županije */
function SearchableCountySelect({
  counties,
  schoolCounts,
  selectedCounty,
  onSelect,
}: {
  counties: string[];
  schoolCounts: Map<string, number>;
  selectedCounty: string;
  onSelect: (county: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return counties;
    return counties.filter((c) => c.toLowerCase().includes(q));
  }, [counties, q]);

  const handleOpen = () => {
    setOpen(true);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSelect = (county: string) => {
    onSelect(county);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-xl border bg-background px-4 text-left text-sm transition",
          "hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          open ? "border-primary ring-2 ring-primary/20" : "border-input",
        )}
      >
        {selectedCounty ? (
          <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Landmark className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-foreground">{selectedCounty}</span>
              <span className="block text-xs text-muted-foreground">
                {schoolCounts.get(selectedCounty) || 0} škola
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect(""); setOpen(false); }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Očisti odabir"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <Landmark className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-muted-foreground">
              Sve županije ({kalkulatorSchools.length} škola)
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQuery(""); }} />
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pretraži županiju..."
                className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5">
              {/* "Sve županije" opcija */}
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  !selectedCounty
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted/70",
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                  !selectedCounty ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block font-medium">Sve županije</span>
                  <span className="text-xs text-muted-foreground">{kalkulatorSchools.length} škola</span>
                </div>
                {!selectedCounty && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
              </button>

              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nema rezultata za „{query}"
                </div>
              ) : (
                filtered.map((county) => {
                  const isActive = selectedCounty === county;
                  const cnt = schoolCounts.get(county) || 0;
                  return (
                    <button
                      key={county}
                      type="button"
                      onClick={() => handleSelect(county)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/70",
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}>
                        <Landmark className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{county}</span>
                        <span className="text-xs text-muted-foreground">{cnt} škola</span>
                      </div>
                      {isActive && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Pretraživi dropdown za odabir škole */
function SearchableSchoolSelect({
  schools,
  selectedId,
  onSelect,
}: {
  schools: KalkulatorSchool[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = selectedId != null ? schools.find((s) => s.id === selectedId) ?? null : null;

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return schools;
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q),
    );
  }, [schools, q]);

  const handleOpen = () => {
    setOpen(true);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSelect = (school: KalkulatorSchool) => {
    onSelect(school.id);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-xl border bg-background px-4 text-left text-sm transition",
          "hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          open ? "border-primary ring-2 ring-primary/20" : "border-input",
        )}
      >
        {selected ? (
          <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {selected.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-foreground">{selected.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {selected.city} · {selected.programs.length} programa
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Očisti odabir"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-muted-foreground">
              Pretraži i odaberi školu ({schools.length})
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQuery(""); }} />
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Naziv škole ili grad..."
                className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-64 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nema rezultata za „{query}"
                </div>
              ) : (
                filtered.slice(0, 80).map((school) => {
                  const isActive = selectedId === school.id;
                  return (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => handleSelect(school)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted/70",
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}>
                        {school.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{school.name}</span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {school.city}
                          <span className="text-muted-foreground/50">·</span>
                          {school.programs.length} programa
                        </span>
                      </div>
                      {isActive && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })
              )}
              {filtered.length > 80 && (
                <p className="px-3 py-2 text-center text-xs text-muted-foreground">
                  Prikazano 80 od {filtered.length} — suzi pretragu
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function SrednjaKalkulator() {
  const [program, setProgram] = useState<ProgramType>("gimnazija4");
  const [prosjek5, setProsjek5] = useState("");
  const [prosjek6, setProsjek6] = useState("");
  const [razred7, setRazred7] = useState<SevenEightGrades>(emptySevenEight());
  const [razred8, setRazred8] = useState<SevenEightGrades>(emptySevenEight());
  const [dodatniBodovi, setDodatniBodovi] = useState("");
  const [rezultatIzracunat, setRezultatIzracunat] = useState(false);

  // Odabir škole i programa (baza: srednja.hr kalkulator)
  const [selCounty, setSelCounty] = useState("");
  const [selSchoolId, setSelSchoolId] = useState<number | null>(null);
  const [selProgramId, setSelProgramId] = useState<number | null>(null);

  const counties = useMemo(
    () => [...new Set(kalkulatorSchools.map((s) => s.county))].sort((a, b) => a.localeCompare(b, "hr")),
    [],
  );

  const countySchoolCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of kalkulatorSchools) {
      map.set(s.county, (map.get(s.county) || 0) + 1);
    }
    return map;
  }, []);

  const schoolsInCounty = useMemo<KalkulatorSchool[]>(() => {
    const list = selCounty ? kalkulatorSchools.filter((s) => s.county === selCounty) : kalkulatorSchools;
    return [...list].sort(
      (a, b) => a.city.localeCompare(b.city, "hr") || a.name.localeCompare(b.name, "hr"),
    );
  }, [selCounty]);

  const selSchool = useMemo<KalkulatorSchool | null>(
    () => (selSchoolId != null ? kalkulatorSchools.find((s) => s.id === selSchoolId) ?? null : null),
    [selSchoolId],
  );

  const selProgram = useMemo<KalkulatorProgram | null>(
    () => (selSchool && selProgramId != null ? selSchool.programs.find((p) => p.id === selProgramId) ?? null : null),
    [selSchool, selProgramId],
  );

  const selPrag = selProgram?.prag ?? null;

  const handleCountyChange = (value: string) => {
    setSelCounty(value);
    setSelSchoolId(null);
    setSelProgramId(null);
  };

  const handleSchoolChange = (value: string) => {
    const id = Number(value);
    setSelSchoolId(Number.isFinite(id) && id > 0 ? id : null);
    setSelProgramId(null);
  };

  const handleProgramChange = (value: string) => {
    const id = Number(value);
    const nextId = Number.isFinite(id) && id > 0 ? id : null;
    setSelProgramId(nextId);
    // Automatski uskladi tip programa s pragom (korisnik i dalje može promijeniti)
    if (nextId != null && selSchool) {
      const prog = selSchool.programs.find((p) => p.id === nextId);
      const inferred = programTypeFromPrag(prog?.prag ?? null);
      if (inferred) setProgram(inferred);
    }
  };

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

  const chance = useMemo(() => {
    if (!rezultatIzracunat || selPrag?.min == null) return null;
    return chanceFor(rezultat.ukupno, selPrag.min);
  }, [rezultat.ukupno, rezultatIzracunat, selPrag]);

  const updateSeven = (field: keyof SevenEightGrades, value: string) =>
    setRazred7((prev) => ({ ...prev, [field]: value }));

  const updateEight = (field: keyof SevenEightGrades, value: string) =>
    setRazred8((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="mx-auto max-w-4xl">
      <header className="relative mb-6 overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-amber-500/10 p-5 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />

        {/* Animirani kalkulator u pozadini s prstom koji tipka */}
        <div className="pointer-events-none absolute -right-2 bottom-0 top-0 aspect-[3/4] w-48 opacity-[0.13] sm:right-6 sm:w-60 md:w-72" aria-hidden>
          <CalculatorAnimation />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            <School className="h-3.5 w-3.5" />
            Upis u srednju školu
          </span>
          <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">
            Kalkulator bodova
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Odaberi školu i program, unesi ocjene iz osnovne škole i saznaj prošlogodišnji prag bodova te
            svoje šanse za upis. Baza pokriva sve srednje škole i programe u Hrvatskoj.
          </p>
        </div>
      </header>

      {/* Odabir škole i programa */}
      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Škola i program</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Odaberi željenu školu i program — prikazat ćemo prošlogodišnji prag bodova s ljetnog upisnog roka.
            </p>
          </div>
        </div>

        {/* Županija: pretraživi dropdown */}
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <Landmark className="h-3.5 w-3.5 text-primary" />
            Županija
          </p>
          <SearchableCountySelect
            counties={counties}
            schoolCounts={countySchoolCounts}
            selectedCounty={selCounty}
            onSelect={handleCountyChange}
          />
        </div>

        {/* Škola: pretraživi dropdown */}
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <School className="h-3.5 w-3.5 text-primary" />
            Škola
          </p>
          <SearchableSchoolSelect
            schools={schoolsInCounty}
            selectedId={selSchoolId}
            onSelect={(id) => { handleSchoolChange(String(id ?? 0)); }}
          />
        </div>

        {/* Program */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            Program
          </p>
          {!selSchool ? (
            <div className="flex h-11 items-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 text-sm text-muted-foreground">
              Prvo odaberi školu ↑
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selSchool.programs.map((prog) => {
                const isActive = selProgramId === prog.id;
                const hasPrag = prog.prag?.min != null;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => handleProgramChange(String(isActive ? 0 : prog.id))}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-all",
                      isActive
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border/70 bg-background text-foreground hover:border-primary/40 hover:bg-primary/5",
                    )}
                  >
                    <GraduationCap className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )} />
                    <span className="min-w-0">
                      <span className="block leading-snug">{prog.name}</span>
                      {hasPrag && (
                        <span className={cn(
                          "block text-[11px]",
                          isActive ? "text-primary/70" : "text-muted-foreground",
                        )}>
                          Prag: {prog.prag!.min!.toLocaleString("hr-HR", { maximumFractionDigits: 2 })} bod.
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selProgram && selSchool && (
          <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Odabrani program
                </p>
                <p className="mt-1 text-base font-bold text-foreground">{selProgram.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {selSchool.name}, {selSchool.city}
                </p>
                {selProgram.sector && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Sektor: {selProgram.sector}</p>
                )}
              </div>
              {selPrag && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Upisni rok {selPrag.year}
                </span>
              )}
            </div>

            {selPrag && selPrag.min != null ? (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
                <PragStat label="Prag (min.)" value={fmt(selPrag.min)} highlight />
                <PragStat label="Prosječni" value={fmt(selPrag.avg)} />
                <PragStat label="Maksimalni" value={fmt(selPrag.max)} />
                <PragStat label="Kvota" value={fmt(selPrag.kvota)} />
                <PragStat label="Upisani" value={fmt(selPrag.upisani)} />
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                Za ovaj program nema objavljenih pragova za prošlu školsku godinu.
              </p>
            )}
            <p className="mt-2 text-[11px] text-muted-foreground">
              * Bodovi se odnose na ljetni upisni rok. Izvor:{" "}
              <a
                href="https://www.srednja.hr/srednja-kalkulator"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                srednja.hr
              </a>
            </p>
          </div>
        )}
      </section>

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
          {selPrag?.min != null && (
            <div
              className="absolute top-0 h-full w-0.5 bg-foreground/70"
              style={{ left: `${clamp((selPrag.min / rezultat.max) * 100, 0, 100)}%` }}
              title={`Prošlogodišnji prag: ${fmt(selPrag.min)}`}
            />
          )}
        </div>
        {selPrag?.min != null && (
          <p className="mt-2 text-xs text-muted-foreground">
            Crna crtica označava prošlogodišnji prag ({fmt(selPrag.min)} bodova) za odabrani program.
          </p>
        )}
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
        {selProgram && (
          <p className="mt-2 text-xs text-muted-foreground">
            Tip programa automatski je postavljen prema odabranom programu — po potrebi ga promijeni.
          </p>
        )}
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

      {/* Usporedba s prošlogodišnjim pragom i procjena šansi */}
      {rezultatIzracunat && selProgram && selSchool && selPrag?.min != null && chance && (
        <section className={`mb-5 rounded-2xl border-2 p-4 shadow-card sm:p-5 ${CHANCE_TONE[chance.tone].box}`}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-background text-foreground shadow-sm">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold">Tvoje šanse za upis</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {selProgram.name} · {selSchool.name}, {selSchool.city}
                </p>
              </div>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-sm font-bold shadow-sm ${CHANCE_TONE[chance.tone].badge}`}>
              {chance.label}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-background p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tvoji bodovi</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-primary">{rezultat.ukupno.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-background p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Prag {selPrag.year}
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">{fmt(selPrag.min)}</p>
            </div>
            <div className="rounded-2xl bg-background p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Razlika</p>
              <p
                className={`mt-1 text-2xl font-extrabold tabular-nums ${
                  rezultat.ukupno >= selPrag.min ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {rezultat.ukupno >= selPrag.min ? "+" : ""}
                {(rezultat.ukupno - selPrag.min).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Vizualna usporedba */}
          <div className="mt-4">
            <div className="relative h-5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${CHANCE_TONE[chance.tone].bar}`}
                style={{ width: `${clamp((rezultat.ukupno / rezultat.max) * 100, 0, 100)}%` }}
              />
              <div
                className="absolute top-0 h-full w-1 rounded-full bg-foreground/80"
                style={{ left: `${clamp((selPrag.min / rezultat.max) * 100, 0, 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
              <span>0</span>
              <span>
                Prag: {fmt(selPrag.min)} · Max: {rezultat.max}
              </span>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-background p-4 text-sm leading-relaxed text-muted-foreground">
            {chance.tone === "emerald" || chance.tone === "lime" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            )}
            {chance.desc}
          </p>

          {(selPrag.kvota != null || selPrag.upisani != null) && (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Prošle godine: kvota {fmt(selPrag.kvota)}, upisano {fmt(selPrag.upisani)} učenika.
            </p>
          )}

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Procjena je informativna — pragovi se svake godine mijenjaju ovisno o interesu i kvoti. Podaci o
            pragovima: srednja.hr (ljetni upisni rok).
          </p>
        </section>
      )}

      {rezultatIzracunat && !selProgram && (
        <section className="mb-5 rounded-2xl border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground sm:p-5">
          Odaberi školu i program na vrhu stranice da vidiš prošlogodišnji prag i svoje šanse za upis.
        </section>
      )}
    </div>
  );
}

function PragStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        highlight ? "border-primary/40 bg-background shadow-sm" : "border-border/60 bg-background/70"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-lg font-extrabold tabular-nums ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
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
