import { useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinJuniorClass, loadLastClassCode, normalizeClassCode } from "@/lib/juniorClass";

export default function JuniorClassJoin({
  programId,
  programName,
  pathway,
  city,
  initialCode = "",
}: {
  programId: number;
  programName: string;
  pathway?: string | null;
  city?: string | null;
  initialCode?: string;
}) {
  const [code, setCode] = useState(initialCode || loadLastClassCode() || "");
  const [alias, setAlias] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

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
    setDone(true);
    toast.success(res.already ? "Već si na ploči ovog razreda." : "Poslano razredu — bez imena na ploči.");
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
        <Users className="h-3.5 w-3.5" />
        Razred / pedagog
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Ako ste u školi dobili kod, pošalji samo top program. Ime nije obavezno.
      </p>
      {done ? (
        <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">Na ploči razreda.</p>
      ) : (
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Kod razreda"
            maxLength={8}
            className="h-9 rounded-xl font-mono tracking-[0.18em] sm:w-36"
            aria-label="Kod razreda"
          />
          <Input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Nadimak (neobavezno)"
            maxLength={24}
            className="h-9 rounded-xl sm:flex-1"
            aria-label="Nadimak"
          />
          <Button type="button" size="sm" className="h-9 rounded-xl" disabled={busy} onClick={() => void submit()}>
            {busy ? "Šaljem…" : "Pošalji"}
          </Button>
        </div>
      )}
    </div>
  );
}
