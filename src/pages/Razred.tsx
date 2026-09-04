import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Copy, RefreshCw, Users } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createJuniorClass,
  fetchJuniorClass,
  loadTeacherCodes,
  normalizeClassCode,
  type JuniorClassBoard,
} from "@/lib/juniorClass";
import { programHref } from "@/lib/juniorProgramGuide";

export default function Razred() {
  const [params] = useSearchParams();
  const [label, setLabel] = useState("");
  const [codeInput, setCodeInput] = useState(params.get("kod") ?? "");
  const [board, setBoard] = useState<JuniorClassBoard | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [busy, setBusy] = useState(false);
  const remembered = useMemo(() => loadTeacherCodes(), [board?.code]);

  const load = async (code: string) => {
    const res = await fetchJuniorClass(code);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    setBoard(res.board);
    setCodeInput(res.board.code);
  };

  useEffect(() => {
    const fromUrl = normalizeClassCode(params.get("kod") ?? "");
    if (fromUrl) void load(fromUrl);
    // samo pri prvom otvaranju
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!board?.code) return;
    const timer = window.setInterval(() => {
      void fetchJuniorClass(board.code).then((res) => {
        if (res.ok) setBoard(res.board);
      });
    }, 6000);
    return () => window.clearInterval(timer);
  }, [board?.code]);

  const create = async () => {
    setBusy(true);
    const res = await createJuniorClass(label);
    setBusy(false);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    setBoard(res.board);
    setCodeInput(res.board.code);
    toast.success("Kod je spreman. Napiši ga na ploču.");
  };

  const copyCode = async () => {
    if (!board) return;
    try {
      await navigator.clipboard.writeText(board.code);
      toast.success("Kod kopiran.");
    } catch {
      toast.message(board.code);
    }
  };

  const maxTrack = board?.tracks[0]?.count ?? 1;

  return (
    <Layout>
      <section className="container mx-auto max-w-3xl px-3 py-8 sm:px-4 md:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Za pedagoga i razrednika</p>
        <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Users className="h-7 w-7 text-primary" />
          Razred — jedan kod
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Napravi kod za cijeli 8. razred. Učenici nakon kviza pošalju samo top program. Na ploči vidiš
          smjerove, ne imena — osim ako to sam/a uključiš.
        </p>

        {!board ? (
          <div className="mt-8 space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <label className="block text-sm font-semibold">
              Naziv (npr. 8.a, OŠ Centar)
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-1.5 h-10 rounded-xl"
                placeholder="Nije obavezno"
                maxLength={40}
              />
            </label>
            <Button className="rounded-xl" disabled={busy} onClick={() => void create()}>
              {busy ? "Stvaram…" : "Napravi kod"}
            </Button>
            <div className="border-t border-border/60 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Već imam kod</p>
              <div className="mt-2 flex gap-2">
                <Input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  className="h-10 rounded-xl font-mono tracking-[0.16em]"
                  placeholder="XXXXXX"
                  maxLength={8}
                />
                <Button variant="outline" className="rounded-xl" onClick={() => void load(codeInput)}>
                  Otvori
                </Button>
              </div>
              {remembered.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {remembered.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className="rounded-full border border-border px-2.5 py-1 text-xs"
                      onClick={() => void load(item.code)}
                    >
                      {item.code}
                      {item.label ? ` · ${item.label}` : ""}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-3xl border border-primary/25 bg-primary/[0.05] p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {board.label || "Kod razreda"}
              </p>
              <p className="mt-1 font-mono text-4xl font-extrabold tracking-[0.28em]">{board.code}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {board.doneCount} {board.doneCount === 1 ? "učenik je riješio" : "učenika je riješilo"} kviz
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => void copyCode()}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Kopiraj kod
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => void load(board.code)}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Osvježi
                </Button>
                <Button asChild size="sm" className="rounded-xl">
                  <Link to={`/kviz-srednja?razred=${board.code}`}>Link za učenike</Link>
                </Button>
              </div>
            </div>

            <article className="rounded-3xl border border-border/70 bg-card p-5">
              <h2 className="text-base font-bold">Koji smjerovi iskaču</h2>
              {board.tracks.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Još nema prijava. Učenici otvore kviz i unesu ovaj kod na rezultatu.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {board.tracks.map((track) => (
                    <li key={track.programId}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                        <Link to={programHref({ name: track.name })} className="font-semibold hover:underline">
                          {track.name}
                        </Link>
                        <span className="tabular-nums text-muted-foreground">{track.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.max(8, (track.count / maxTrack) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showNames}
                onChange={(e) => setShowNames(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Prikaži nadimke (isključeno = ništa na ploči)
            </label>

            {showNames ? (
              <ul className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 text-sm">
                {board.entries.filter((e) => e.alias).length === 0 ? (
                  <li className="text-muted-foreground">Nitko nije upisao nadimak — ploča ostaje bez imena.</li>
                ) : (
                  board.entries
                    .filter((e) => e.alias)
                    .map((e, i) => (
                      <li key={`${e.alias}-${i}`} className="flex justify-between gap-3 py-1">
                        <span className="font-medium">{e.alias}</span>
                        <span className="text-muted-foreground">{e.programName}</span>
                      </li>
                    ))
                )}
              </ul>
            ) : null}

            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setBoard(null)}>
              Novi razred
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
}
