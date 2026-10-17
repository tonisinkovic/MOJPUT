import { Phone, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { setSamoprocjenaSaveConsent, useSamoprocjenaSaveConsent } from "@/lib/samoprocjenaConsent";

const CRISIS_LINES = [
  { name: "Hitna pomoć", number: "112", tel: "112", note: "neposredna opasnost, 0–24" },
  { name: "Hrabri telefon", number: "116 111", tel: "116111", note: "za djecu i mlade, besplatno" },
  { name: "Plavi telefon", number: "01 4833 888", tel: "014833888", note: "savjetodavna linija" },
] as const;

export function CrisisLines({ className, emphasized = false }: { className?: string; emphasized?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        emphasized ? "border-destructive/40 bg-destructive/10" : "border-border/70 bg-muted/30",
        className,
      )}
    >
      <p className="font-semibold text-foreground">Ne moraš biti sam/a s tim. Možeš nazvati:</p>
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
        {CRISIS_LINES.map((line) => (
          <li key={line.tel}>
            <a
              href={`tel:${line.tel}`}
              className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-2 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {line.name} <span className="whitespace-nowrap">{line.number}</span>
            </a>
            <span className="block text-xs text-muted-foreground">{line.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SaveResultsConsent({ className }: { className?: string }) {
  const granted = useSamoprocjenaSaveConsent();
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={granted}
        onChange={(e) => setSamoprocjenaSaveConsent(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
      />
      <span>
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
          Spremi rezultate na moj profil
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          Zadano se ništa ne sprema — rezultat vidiš samo ti, u ovom pregledniku. Ako uključiš, sažetak sljedećih
          rezultata sprema se na tvoj MojPut račun (samo kad si prijavljen/a). Isključiti možeš bilo kad.
        </span>
      </span>
    </label>
  );
}
