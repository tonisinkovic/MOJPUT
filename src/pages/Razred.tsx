import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Expand, Link2, RefreshCw, Volume2, VolumeX, Users } from "lucide-react";
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

function potvrdaWord(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "potvrda";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "potvrde";
  return "potvrda";
}

const RANK_BAR = ["bg-primary", "bg-primary/75", "bg-primary/50"];

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

  const qrSize = projector ? 320 : 220;

  return (
    <Layout hideChrome={projector}>
      <PageSeo
        title="Razred — kod za kviz | MojPut"
        description="Jedan kod za 8. razred. Učenici riješe kviz, potvrde rezultat, a na ploči se redom vide smjerovi — bez imena."
        canonical="/razred"
      />
      <section
        className={cn(
          "mx-auto w-full px-3 py-6 sm:px-5",
          projector ? "max-w-none px-4 py-4 sm:px-8" : "container max-w-6xl md:py-10",
        )}
      >
        {!(projector && board) && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Za pedagoga i razrednika</p>
            <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight">
              <Users className="h-7 w-7 text-primary" />
              Razred — jedan kod
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Učenici riješe kviz na svom mobitelu. Kad potvrde, ovdje se redom pojavi njihov smjer. Imena nisu na
              ploči — osim ako to sam uključiš.
            </p>
          </>
        )}

        {!board ? (
          <div className="mx-auto mt-8 max-w-3xl space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
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
          <div className={cn("space-y-5", projector ? "mt-0" : "mt-8")}>
            <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
              <div className="rounded-3xl border border-primary/25 bg-primary/[0.06] p-5 sm:p-7">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <p className={cn("font-semibold uppercase tracking-wide text-muted-foreground", projector ? "text-sm" : "text-xs")}>
                    {board.label || "Kod razreda"} · uživo
                  </p>
                </div>
                <p
                  className={cn(
                    "mt-3 font-mono font-extrabold leading-none tracking-[0.18em] text-foreground",
                    projector ? "text-7xl sm:text-8xl" : "text-5xl sm:text-7xl",
                  )}
                >
                  {board.code}
                </p>
                <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                  <img
                    src={qrImageSrc(studentLink, qrSize)}
                    alt={`QR za kviz razreda ${board.code}`}
                    width={qrSize}
                    height={qrSize}
                    className={cn("shrink-0 rounded-2xl bg-white p-2", projector ? "h-72 w-72" : "h-52 w-52")}
                  />
                  <p className={cn("text-center font-semibold sm:text-left", projector ? "text-2xl" : "text-lg")}>
                    Skeniraj i kreni.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-3xl border border-border/70 bg-card p-5 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Potvrde</p>
                <p className={cn("mt-2 font-extrabold tabular-nums leading-none", projector ? "text-7xl" : "text-6xl")}>
                  {board.doneCount}
                  {goal ? <span className="text-muted-foreground"> / {goal}</span> : null}
                </p>
                <p className={cn("mt-2 font-semibold text-muted-foreground", projector ? "text-xl" : "text-sm")}>
                  {board.doneCount === 0 ? "Čekamo prvu potvrdu" : potvrdaWord(board.doneCount)}
                </p>
                {goal ? (
                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, (board.doneCount / goal) * 100)}%` }}
                    />
                  </div>
                ) : null}
                {lead && board.doneCount > 0 ? (
                  <p className={cn("mt-5", projector ? "text-xl" : "text-base")}>
                    Najčešće: <span className="font-bold">{lead.name}</span>
                    <span className="ml-2 tabular-nums text-muted-foreground">({lead.count})</span>
                  </p>
                ) : null}
              </div>
            </div>

            <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
              <h2 className={cn("font-bold", projector ? "text-2xl" : "text-lg")}>Koji smjerovi iskaču</h2>
              {board.tracks.length === 0 ? (
                <p className={cn("mt-4 text-muted-foreground", projector ? "text-xl" : "text-sm")}>
                  Još prazno. Prva potvrda otvori listu.
                </p>
              ) : (
                <ul className={cn("mt-5 grid gap-4", projector && board.tracks.length > 1 && "md:grid-cols-2")}>
                  {board.tracks.map((track, index) => (
                    <li key={track.programId} className={cn(index < 3 && "rounded-2xl bg-background/70 p-3")}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-3">
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                              index < 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                              projector && "h-10 w-10 text-base",
                            )}
                          >
                            {index + 1}
                          </span>
                          <Link
                            to={programHref({ name: track.name })}
                            className={cn(
                              "truncate font-bold hover:underline",
                              projector ? "text-2xl" : "text-lg",
                            )}
                          >
                            {track.name}
                          </Link>
                        </span>
                        <span className={cn("shrink-0 font-bold tabular-nums", projector ? "text-2xl" : "text-lg")}>
                          {track.count}
                        </span>
                      </div>
                      <div className={cn("overflow-hidden rounded-full bg-muted", projector ? "h-4" : "h-3")}>
                        <div
                          className={cn("h-full rounded-full transition-all", RANK_BAR[index] ?? "bg-primary/35")}
                          style={{ width: `${Math.max(8, (track.count / maxTrack) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="rounded-3xl border border-border/70 bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className={cn("font-bold", projector ? "text-2xl" : "text-lg")}>Redom, kako potvrde</h2>
                <span className="text-xs text-muted-foreground">najnovije dolje</span>
              </div>
              {board.entries.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border/70 px-4 py-10 text-center">
                  <p className={cn("font-semibold", projector ? "text-3xl" : "text-lg")}>Čekamo prvu potvrdu…</p>
                  <p className={cn("mt-2 text-muted-foreground", projector ? "text-lg" : "text-sm")}>
                    Kad netko stisne Potvrdi kviz, ovdje se pojavi smjer.
                  </p>
                </div>
              ) : (
                <ol className="mt-4 space-y-3" data-tick={tick}>
                  {board.entries.map((entry, i) => {
                    const key = entry.id ?? `${entry.programId}-${i}`;
                    const fresh = newestId != null && entry.id === newestId;
                    return (
                      <motion.li
                        key={key}
                        initial={fresh ? { opacity: 0, y: 10 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex items-center justify-between gap-4 rounded-2xl px-4 py-4",
                          fresh ? "bg-primary/10 ring-1 ring-primary/30" : "bg-background/70",
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className={cn("w-8 shrink-0 font-mono font-bold text-muted-foreground", projector ? "text-lg" : "text-sm")}>
                            {i + 1}.
                          </span>
                          <span className={cn("truncate font-bold", projector ? "text-2xl" : "text-base")}>
                            {showNames && entry.alias ? `${entry.alias} · ${entry.programName}` : entry.programName}
                          </span>
                        </span>
                        <span className={cn("shrink-0 text-muted-foreground", projector ? "text-base" : "text-xs")}>
                          {arrivalLabel(entry.createdAt)}
                        </span>
                      </motion.li>
                    );
                  })}
                </ol>
              )}
            </article>

            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-card/80 px-3 py-3 text-sm">
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
              <label className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  checked={showNames}
                  onChange={(e) => setShowNames(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Prikaži nadimke
              </label>
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setBoard(null)}>
                Novi razred
              </Button>
              <Link
                to={classBoardPath(board.code)}
                className="ml-auto text-xs font-semibold text-primary underline-offset-2 hover:underline"
              >
                Link ploče
              </Link>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
