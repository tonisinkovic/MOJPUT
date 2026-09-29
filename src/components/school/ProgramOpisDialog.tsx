import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { KalkulatorPrag } from "@/data/srednjaKalkulator";
import { calculatorHref } from "@/lib/juniorPath";
import {
  durationLabel,
  kindLabel,
  programOpisParagraphs,
  resolveProgramOpis,
} from "@/lib/srednjaProgramOpis";
import { cn } from "@/lib/utils";

function fmtScore(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString("hr-HR", { maximumFractionDigits: 2 });
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-semibold tracking-tight text-foreground/80">
      {children}
    </span>
  );
}

export default function ProgramOpisDialog({
  open,
  onOpenChange,
  programName,
  schoolId,
  programId,
  schoolLabel,
  sector,
  prag,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programName: string;
  schoolId: number | null;
  programId: number | null;
  schoolLabel?: string;
  sector?: string | null;
  prag?: KalkulatorPrag | null;
}) {
  const { opis, flags } = resolveProgramOpis(programName);
  const paragraphs = programOpisParagraphs(opis, flags);
  const href = calculatorHref(schoolId, programId ?? undefined);
  const chips: string[] = [
    durationLabel(opis.durationYears),
    kindLabel(opis.kind),
  ];
  if (opis.extraExam) chips.push("Prijemni ili mapa");
  if (flags.sports) chips.push("Odjel za sportaše");
  if (flags.adapted) chips.push("Prilagođeni program");
  if (flags.special) chips.push("Posebni program");
  if (flags.language) chips.push(`Nastava na ${flags.language} jeziku`);
  if (flags.instrument && flags.instrument !== "teorija" && flags.instrument !== "jazz") {
    chips.push(flags.instrument);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-[calc(100%-1.5rem)] max-w-[36rem] gap-0 overflow-hidden rounded-3xl border-border/60 p-0 shadow-2xl sm:rounded-3xl">
        <div className="max-h-[88vh] overflow-y-auto px-5 pb-5 pt-6 md:px-7 md:pb-6 md:pt-7">
          <DialogHeader className="space-y-2 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {sector && sector !== "Nema sektora" ? sector : "Smjer"}
            </p>
            <DialogTitle className="text-xl font-extrabold leading-tight tracking-tight md:text-2xl">
              {programName}
            </DialogTitle>
            {schoolLabel ? (
              <DialogDescription className="text-sm font-medium tracking-tight text-muted-foreground">
                {schoolLabel}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">Opis obrazovnog programa.</DialogDescription>
            )}
          </DialogHeader>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </div>

          {prag ? (
            <div className="mt-5 grid grid-cols-3 gap-2">
              {(
                [
                  ["Kvota", prag.kvota ?? "—"],
                  ["Prag", fmtScore(prag.min)],
                  ["Prosjek", fmtScore(prag.avg)],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border/60 bg-muted/30 px-3 py-2.5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-sm font-bold tabular-nums tracking-tight">{value}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {paragraphs.map((text, i) => (
              <p key={i} className="text-[0.95rem] leading-relaxed tracking-tight text-foreground/85">
                {text}
              </p>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Što se uči</p>
            <ul className="mt-2 space-y-1.5">
              {opis.learn.map((line) => (
                <li key={line} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                  <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl bg-muted/40 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Što poslije</p>
            <p className="mt-1 text-sm leading-relaxed tracking-tight">{opis.after}</p>
          </div>

          <Button asChild className="mt-6 h-11 w-full rounded-full text-[0.95rem] font-semibold">
            <Link to={href} onClick={() => onOpenChange(false)}>
              Vodič za kalkulator bodova
              <Calculator className="h-4 w-4" />
            </Link>
          </Button>
          <p className={cn("mt-3 text-center text-[11px] leading-relaxed text-muted-foreground")}>
            Opis je za nacionalni kurikulum smjera, ne za ovu školu posebno.
            {prag?.year ? ` Brojke su za ${prag.year}.` : ""}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
