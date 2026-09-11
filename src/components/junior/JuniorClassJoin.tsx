import { useEffect, useState } from "react";
import { CheckCircle2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  joinJuniorClass,
  loadLastClassCode,
  markClassConfirmed,
  normalizeClassCode,
  saveLastClassCode,
  wasClassConfirmed,
} from "@/lib/juniorClass";

export default function JuniorClassJoin({
  programId,
  programName,
  pathway,
  city,
  initialCode = "",
  prominent = false,
}: {
  programId: number;
  programName: string;
  pathway?: string | null;
  city?: string | null;
  initialCode?: string;
  prominent?: boolean;
}) {
  const preset = normalizeClassCode(initialCode) || loadLastClassCode() || "";
  const [code, setCode] = useState(preset);
  const [alias, setAlias] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(() => Boolean(preset && wasClassConfirmed(preset)));

  useEffect(() => {
    const next = normalizeClassCode(initialCode);
    if (next) {
      setCode(next);
      saveLastClassCode(next);
      if (wasClassConfirmed(next)) setDone(true);
    }
  }, [initialCode]);

  const submit = async () => {
    const normalized = normalizeClassCode(code);
    if (!normalized) {
      toast.error("Kod razreda ima 6 slova ili brojeva.");
      return;
    }
    setBusy(true);
    const res = await joinJuniorClass({
      code: normalized,
      programId,
      programName,
      pathway,
      city,
      alias,
    });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    markClassConfirmed(normalized);
    setDone(true);
    toast.success(res.already ? "Već si na ploči ovog razreda." : "Potvrđeno — razred te vidi kao smjer.");
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-4 sm:px-5">
        <p className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          Si na ploči razreda
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Stigao je tvoj smjer: <span className="font-semibold text-foreground">{programName}</span>. Ime nije na ploči.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        prominent
          ? "rounded-3xl border border-primary/35 bg-primary/[0.07] p-5 shadow-lg sm:p-6"
          : "rounded-2xl border border-border/70 bg-background/60 px-3.5 py-3"
      }
    >
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
        <Users className="h-3.5 w-3.5" />
        {preset ? "Zadnji korak za razred" : "Imaš kod razreda?"}
      </p>
      {prominent ? (
        <>
          <h3 className="mt-2 text-lg font-extrabold">Potvrdi kviz i pošalji na ploču</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Na ploči ide samo ovaj smjer, ne tvoje ime. Kad stisneš potvrdi, razrednik te vidi redom.
          </p>
          <p className="mt-3 rounded-2xl bg-background/70 px-3.5 py-2.5 text-sm font-semibold">{programName}</p>
        </>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">
          Ako si u školi dobio kod, pošalji samo prvi program. Ime nije obavezno.
        </p>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Kod razreda"
          maxLength={8}
          className="h-11 rounded-xl font-mono tracking-[0.18em] sm:w-36"
          aria-label="Kod razreda"
        />
        <Input
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Nadimak (neobavezno)"
          maxLength={24}
          className="h-11 rounded-xl sm:flex-1"
          aria-label="Nadimak"
        />
        <Button type="button" className="h-11 rounded-xl" disabled={busy} onClick={() => void submit()}>
          {busy ? "Šaljem…" : "Potvrdi kviz"}
        </Button>
      </div>
    </div>
  );
}
