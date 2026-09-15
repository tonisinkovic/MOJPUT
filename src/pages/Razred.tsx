import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Expand, Link2, QrCode, RefreshCw, Volume2, VolumeX, Users } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  arrivalLabel,
  classBoardPath,
  createJuniorClass,
  fetchJuniorClass,
  loadTeacherCodes,
  normalizeClassCode,
  qrImageSrc,
  rememberTeacherCode,
  studentQuizHref,
  studentQuizPath,
  type JuniorClassBoard,
} from "@/lib/juniorClass";
import { programHref } from "@/lib/juniorProgramGuide";

function playDing() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 784;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
    window.setTimeout(() => void ctx.close(), 300);
  } catch {
    /* ignore */
  }
}

export default function Razred() {
  const [params] = useSearchParams();
  const [label, setLabel] = useState("");
  const [expected, setExpected] = useState("24");
  const [codeInput, setCodeInput] = useState(params.get("kod") ?? "");
  const [board, setBoard] = useState<JuniorClassBoard | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [projector, setProjector] = useState(false);
  const [sound, setSound] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);
  const prevCount = useRef(0);
  const liveReady = useRef(false);
  const remembered = useMemo(() => loadTeacherCodes(), [board?.code]);

  const expectedN = Number.parseInt(expected, 10);
  const goal = Number.isFinite(expectedN) && expectedN > 0 ? Math.min(45, expectedN) : 0;

  const load = async (code: string) => {
    const res = await fetchJuniorClass(code);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    const mem = loadTeacherCodes().find((x) => x.code === res.board.code);
    if (mem?.expected) setExpected(String(mem.expected));
    setBoard(res.board);
    setCodeInput(res.board.code);
    rememberTeacherCode(res.board.code, res.board.label, mem?.expected ?? (goal || undefined));
  };

  useEffect(() => {
    const fromUrl = normalizeClassCode(params.get("kod") ?? "");
    if (fromUrl) void load(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!board?.code) return;
    const timer = window.setInterval(() => {
      void fetchJuniorClass(board.code).then((res) => {
        if (res.ok) setBoard(res.board);
      });
    }, 2500);
    return () => window.clearInterval(timer);
  }, [board?.code]);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 4000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!board) return;
    if (liveReady.current && board.doneCount > prevCount.current && sound) playDing();
    liveReady.current = true;
    prevCount.current = board.doneCount;
  }, [board?.doneCount, sound]);

  const create = async () => {
    setBusy(true);
    const res = await createJuniorClass(label);
    setBusy(false);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    rememberTeacherCode(res.board.code, res.board.label, goal || undefined);
    setBoard(res.board);
    setCodeInput(res.board.code);
    toast.success("Kod je spreman. Otvori link na projektoru ili napiši kod na ploču.");
  };

  const copyText = async (value: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(ok);
    } catch {
      toast.message(value);
    }
  };

  const studentLink = board ? studentQuizHref(board.code) : "";
  const maxTrack = board?.tracks[0]?.count ?? 1;
  const newestId = board?.entries.length ? board.entries[board.entries.length - 1]?.id ?? board.entries.length : null;
  const lead = board?.tracks[0];

  return (
    <Layout>
      <PageSeo
        title="Razred — kod za kviz | MojPut"
        description="Jedan kod za 8. razred. Učenici riješe kviz, potvrde rezultat, a na ploči se redom vide smjerovi — bez imena."
        canonical="/razred"
      />
      <section className={cn("container mx-auto max-w-3xl px-3 py-8 sm:px-4 md:py-12", projector && "max-w-5xl")}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Za pedagoga i razrednika</p>
        <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Users className="h-7 w-7 text-primary" />
          Razred — jedan kod
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Učenici riješe kviz na svom mobitelu. Kad potvrde, ovdje se redom pojavi njihov smjer. Imena nisu na
          ploči — osim ako to sam uključiš.
        </p>

        {!board ? (
          <div className="mt-8 space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <ol className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              <li className="rounded-2xl bg-background/70 px-3 py-2.5">
                <span className="font-bold text-foreground">1.</span> Napravi kod
              </li>
              <li className="rounded-2xl bg-background/70 px-3 py-2.5">
                <span className="font-bold text-foreground">2.</span> Učenici otvore link
              </li>
              <li className="rounded-2xl bg-background/70 px-3 py-2.5">
                <span className="font-bold text-foreground">3.</span> Na kraju stisnu Potvrdi
              </li>
            </ol>
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
            <label className="block text-sm font-semibold">
              Koliko ih je u razredu?
              <Input
                value={expected}
                onChange={(e) => setExpected(e.target.value.replace(/\D/g, "").slice(0, 2))}
                className="mt-1.5 h-10 rounded-xl"
                inputMode="numeric"
                placeholder="npr. 24"
              />
            </label>
            <Button className="rounded-xl" disabled={busy} onClick={() => void create()}>
              {busy ? "Stvaram…" : "Napravi kod i otvori ploču"}
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
              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {board.label || "Kod razreda"} · uživo
                </p>
              </div>
              <p className={cn("mt-1 font-mono font-extrabold tracking-[0.28em]", projector ? "text-6xl" : "text-4xl")}>
                {board.code}
              </p>
              <p className={cn("mt-2 font-semibold", projector ? "text-xl" : "text-sm text-muted-foreground")}>
                {board.doneCount === 0
                  ? "Čekamo prvu potvrdu"
                  : `${board.doneCount} ${board.doneCount === 1 ? "potvrda" : "potvrda"}`}
                {goal ? ` · od ${goal}` : ""}
              </p>
              {goal ? (
                <div className="mx-auto mt-3 h-2.5 max-w-sm overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, (board.doneCount / goal) * 100)}%` }}
                  />
                </div>
              ) : null}
              {lead && board.doneCount > 0 ? (
                <p className="mt-3 text-sm">
                  Najčešće zasad: <span className="font-bold">{lead.name}</span> ({lead.count})
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => void copyText(board.code, "Kod kopiran.")}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Kopiraj kod
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => void copyText(studentLink, "Link za učenike je kopiran.")}
                >
                  <Link2 className="mr-1.5 h-3.5 w-3.5" />
                  Kopiraj link
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => void load(board.code)}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Osvježi
                </Button>
                <Button asChild size="sm" className="rounded-xl">
                  <Link to={studentQuizPath(board.code)}>Otvori kviz</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
              <div className="rounded-3xl border border-border/70 bg-card p-4 text-center">
                <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  <QrCode className="h-3.5 w-3.5" />
                  Skeniraj
                </p>
                <img
                  src={qrImageSrc(studentLink, 200)}
                  alt={`QR za kviz razreda ${board.code}`}
                  width={160}
                  height={160}
                  className="mx-auto mt-2 rounded-xl bg-white p-2"
                />
                <p className="mt-2 text-[11px] text-muted-foreground">Učenik skenira i odmah krene u kviz.</p>
              </div>
              <article className="rounded-3xl border border-border/70 bg-card p-5">
                <h2 className="text-base font-bold">Kako ide sat</h2>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
                  <li>Napiši kod ili pokaži QR.</li>
                  <li>Učenici riješe kviz na svom telefonu.</li>
                  <li>Na kraju stisnu <span className="font-semibold text-foreground">Potvrdi kviz</span>.</li>
                  <li>Ovdje se redom pojavi smjer — bez imena.</li>
                </ol>
                <p className="mt-3 text-xs text-muted-foreground">
                  Ploča se sama osvježava. Link za ovu ploču:{" "}
                  <Link to={classBoardPath(board.code)} className="font-semibold text-primary underline-offset-2 hover:underline">
                    {classBoardPath(board.code)}
                  </Link>
                </p>
              </article>
            </div>

            <article className="rounded-3xl border border-border/70 bg-card p-5">
              <h2 className="text-base font-bold">Koji smjerovi iskaču</h2>
              {board.tracks.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">Još prazno. Prva potvrda otvori listu.</p>
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
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.max(8, (track.count / maxTrack) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="rounded-3xl border border-border/70 bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold">Redom, kako potvrde</h2>
                <span className="text-xs text-muted-foreground">najnovije dolje</span>
              </div>
              {board.entries.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border/70 px-4 py-8 text-center">
                  <p className={cn("font-semibold", projector && "text-2xl")}>Čekamo prvu potvrdu…</p>
                  <p className="mt-1 text-sm text-muted-foreground">Kad netko stisne Potvrdi kviz, ovdje se pojavi smjer.</p>
                </div>
              ) : (
                <ol className="mt-4 space-y-2" data-tick={tick}>
                  {board.entries.map((entry, i) => {
                    const key = entry.id ?? `${entry.programId}-${i}`;
                    const fresh = newestId != null && entry.id === newestId;
                    return (
                      <motion.li
                        key={key}
                        initial={fresh ? { opacity: 0, y: 10 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm",
                          fresh ? "bg-primary/10 ring-1 ring-primary/30" : "bg-background/60",
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="w-7 shrink-0 font-mono text-xs font-bold text-muted-foreground">{i + 1}.</span>
                          <span className={cn("truncate font-semibold", projector && "text-lg")}>
                            {showNames && entry.alias ? `${entry.alias} · ${entry.programName}` : entry.programName}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {arrivalLabel(entry.createdAt)}
                        </span>
                      </motion.li>
                    );
                  })}
                </ol>
              )}
            </article>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showNames}
                  onChange={(e) => setShowNames(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Prikaži nadimke
              </label>
              <Button
                type="button"
                size="sm"
                variant={projector ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => {
                  setProjector((v) => !v);
                  const root = document.documentElement;
                  if (!projector && root.requestFullscreen) void root.requestFullscreen();
                  else if (projector && document.fullscreenElement) void document.exitFullscreen();
                }}
              >
                <Expand className="mr-1.5 h-3.5 w-3.5" />
                {projector ? "Isključi projektor" : "Na projektor"}
              </Button>
              <Button type="button" size="sm" variant="ghost" className="rounded-xl" onClick={() => setSound((v) => !v)}>
                {sound ? <Volume2 className="mr-1.5 h-3.5 w-3.5" /> : <VolumeX className="mr-1.5 h-3.5 w-3.5" />}
                {sound ? "Zvuk uključen" : "Bez zvuka"}
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setBoard(null)}>
              Novi razred
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
}
