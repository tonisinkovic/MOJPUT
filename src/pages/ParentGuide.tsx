import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useSearchParams } from "react-router-dom";
import {
  guideCategoriesFor,
  guideChecklistFor,
  guideVideosFor,
  parentArticlesFor,
} from "@/data/parentHub";
import { resolveExperienceMode } from "@/lib/experience";
import { readParentHubState, setLastVisited, toggleChecklist, toggleReadArticle } from "@/lib/parentHubStore";
import { AUTH_CHANGED, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { createParentDnevnik, deleteParentDnevnik, fetchParentDnevnik } from "@/lib/parentDnevnikApi";
import {
  clearLocalEntries,
  filterEntriesWithinDays,
  formatEntriesForExport,
  loadEntries,
  type DnevnikEntry,
} from "@/lib/parentDnevnikStore";
import HeaderDecor, { HeaderHero } from "@/components/header-animations/HeaderDecor";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, ClipboardCopy, NotebookPen, Sparkles, Trash2, Check as CheckIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const listStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 380, damping: 28 } },
};

const ParentGuide = () => {
  const [searchParams] = useSearchParams();
  const audience = resolveExperienceMode(searchParams);
  const isJunior = audience === "junior";
  const [state, setState] = useState(readParentHubState());
  const categories = guideCategoriesFor(audience);
  const checklist = guideChecklistFor(audience);
  const videos = guideVideosFor(audience);
  const allArticles = parentArticlesFor(audience);
  const guideArticles = allArticles.filter((item) => item.category === "vodic");
  const readCount = useMemo(
    () => allArticles.filter((item) => state.readArticles.includes(item.slug)).length,
    [allArticles, state.readArticles],
  );
  const progress = allArticles.length ? Math.round((readCount / allArticles.length) * 100) : 0;

  // Dnevnik razgovora (samo Junior)
  const [dnevnikEntries, setDnevnikEntries] = useState<DnevnikEntry[]>([]);
  const [parentUser, setParentUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dnevnikError, setDnevnikError] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [draftDate, setDraftDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [draftTeme, setDraftTeme] = useState("");
  const [draftDjeteKaze, setDraftDjeteKaze] = useState("");
  const [draftKorak, setDraftKorak] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "ok" | "err">("idle");

  // Scroll na #dnevnik anchor nakon mounta (iz hub-a).
  useEffect(() => {
    if (!isJunior) return;
    if (typeof window === "undefined") return;
    if (window.location.hash === "#dnevnik") {
      const el = document.getElementById("dnevnik");
      if (el) {
        // Mala odgoda da layout postoji.
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    }
  }, [isJunior]);

  useEffect(() => {
    if (!isJunior) return;
    let cancelled = false;
    const load = async () => {
      const res = await authMe();
      if (cancelled) return;
      const user = userFromAuthMe(res);
      setParentUser(user);
      setAuthReady(true);
      if (user?.user_type !== "roditelj") {
        setDnevnikEntries([]);
        return;
      }
      const local = loadEntries();
      if (local.length > 0) {
        for (const entry of local) {
          await createParentDnevnik({
            dateIso: entry.dateIso,
            teme: entry.teme,
            djeteKaze: entry.djeteKaze,
            sljedeciKorak: entry.sljedeciKorak,
          });
        }
        clearLocalEntries();
      }
      const list = await fetchParentDnevnik();
      if (!cancelled && list.success && Array.isArray(list.data)) setDnevnikEntries(list.data);
    };
    void load();
    const onAuth = () => void load();
    window.addEventListener(AUTH_CHANGED, onAuth);
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_CHANGED, onAuth);
    };
  }, [isJunior]);

  const handleAddDnevnik = async () => {
    if (parentUser?.user_type !== "roditelj") return;
    if (!draftTeme.trim() && !draftDjeteKaze.trim() && !draftKorak.trim()) return;
    setSavingNote(true);
    setDnevnikError("");
    const res = await createParentDnevnik({
      dateIso: draftDate || new Date().toISOString().slice(0, 10),
      teme: draftTeme,
      djeteKaze: draftDjeteKaze,
      sljedeciKorak: draftKorak,
    });
    setSavingNote(false);
    if (!res.success || !res.data) {
      setDnevnikError(res.success ? "Zapis nije spremljen." : res.message);
      return;
    }
    setDnevnikEntries((prev) => [res.data as DnevnikEntry, ...prev.filter((e) => e.id !== res.data?.id)]);
    setDraftTeme("");
    setDraftDjeteKaze("");
    setDraftKorak("");
  };

  const handleRemoveDnevnik = async (id: string) => {
    const res = await deleteParentDnevnik(id);
    if (!res.success) {
      setDnevnikError(res.message);
      return;
    }
    setDnevnikEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCopyDnevnik = async () => {
    try {
      const recent = filterEntriesWithinDays(dnevnikEntries, 30);
      const text = formatEntriesForExport(recent);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: textarea trick
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopyState("ok");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("err");
      setTimeout(() => setCopyState("idle"), 2500);
    }
  };

  return (
    <Layout>
      <section className="mx-auto max-w-6xl space-y-5 px-3 pb-10 pt-6 sm:space-y-8 sm:px-4 sm:pb-12 sm:pt-8 md:py-14 md:pb-16 [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-4 shadow-card sm:rounded-3xl sm:p-5 md:p-6"
        >
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52" />
          <div aria-hidden className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48" />

          <HeaderHero
            icon={
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
                <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            }
            decor={
              <HeaderDecor className="opacity-[0.4] sm:opacity-[0.3]">
                <div className="flex h-full w-full items-center justify-center">
                  <NotebookPen className="h-20 w-20 text-primary/70 sm:h-24 sm:w-24" />
                </div>
              </HeaderDecor>
            }
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-3 w-3" />
              {isJunior ? "Vodič za srednju" : "Vodič za fakultet"}
            </span>
            <h1 className="mt-2 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              Vodič za roditelje
            </h1>
            <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {isJunior
                ? "Praktični sadržaj za odabir srednje škole — kratki ritam razgovora, checklista i dnevnik."
                : "Praktični sadržaj koji možete odmah primijeniti kod kuće."}
            </p>
          </HeaderHero>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl border-2 border-border bg-card p-4 shadow-card sm:p-5"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Napredak čitanja (svi članci)</span>
            <span className="tabular-nums font-semibold">
              {readCount} / {allArticles.length} · {progress}%
            </span>
          </div>
          <Progress value={progress} className="mt-3" />
        </motion.div>

        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-4"
        >
          {categories.map((category) => (
            <motion.article
              key={category.id}
              variants={listItem}
              className="rounded-2xl border-2 border-border/70 bg-card p-5 shadow-card transition-all sm:hover:border-primary/30 sm:hover:shadow-card-hover"
            >
              <h2 className="font-semibold">{category.title}</h2>
              <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                {category.items.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </motion.article>
          ))}
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="rounded-2xl border-2 border-border bg-card p-5 shadow-card"
        >
          <h2 className="font-semibold">Checklista</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Oznaka ostaje u ovom pregledniku — pomaže vam pratiti što ste već prošli.
          </p>
          <div className="mt-4 space-y-3">
            {checklist.map((item) => {
              const done = state.checklistDone.includes(item.text);
              return (
                <label
                  key={item.text}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-2 text-sm transition-colors hover:border-border/60 hover:bg-muted/30"
                >
                  <Checkbox
                    className="mt-0.5"
                    checked={done}
                    onCheckedChange={() => {
                      toggleChecklist(item.text);
                      setState(readParentHubState());
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className={`block font-medium leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.text}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{item.explain}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl border-2 border-border bg-card p-4 shadow-card sm:p-5"
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-semibold">Članci</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {guideArticles.filter((a) => state.readArticles.includes(a.slug)).length} od {guideArticles.length} pročitano
              </p>
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(showAllArticles ? guideArticles : guideArticles.slice(0, 4)).map((article, index) => {
              const read = state.readArticles.includes(article.slug);
              const expQ = isJunior ? "?experience=junior" : "";
              const href = `/roditeljski-kutak/preporuceni-clanak/${article.slug}${expQ}`;
              const accent = ["border-l-primary", "border-l-sky-500", "border-l-amber-500", "border-l-violet-500"][index % 4];
              return (
                <div
                  key={article.id}
                  className={`flex items-start gap-2 rounded-xl border border-border/70 border-l-4 bg-background/60 p-3 ${accent} ${read ? "opacity-70" : ""}`}
                >
                  <Link to={href} onClick={() => setLastVisited(href)} className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary">{article.title}</h3>
                    {article.isNew ? (
                      <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wide text-primary">Novo</span>
                    ) : null}
                  </Link>
                  <button
                    type="button"
                    aria-label={read ? "Označi kao nepročitano" : "Označi kao pročitano"}
                    title={read ? "Pročitano" : "Označi kao pročitano"}
                    onClick={() => {
                      toggleReadArticle(article.slug);
                      setState(readParentHubState());
                    }}
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${read ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
          {guideArticles.length > 4 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 h-9 rounded-xl px-2 text-muted-foreground"
              onClick={() => setShowAllArticles((v) => !v)}
            >
              {showAllArticles ? "Prikaži manje" : `Prikaži sve (${guideArticles.length})`}
              <ChevronRight className={`h-4 w-4 transition-transform ${showAllArticles ? "rotate-90" : ""}`} />
            </Button>
          ) : null}
        </motion.article>

        {isJunior && (
          <article
            id="dnevnik"
            className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.05] via-card to-card p-5 mt-6 scroll-mt-20"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">Dnevnik razgovora</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Zapis ostaje na vašem roditeljskom računu. Možete ga otvoriti i u profilu, i kopirati za pedagoga.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-xl"
                onClick={handleCopyDnevnik}
                disabled={dnevnikEntries.length === 0}
              >
                {copyState === "ok" ? (
                  <>
                    <CheckIcon className="mr-1.5 h-4 w-4" />
                    Kopirano
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="mr-1.5 h-4 w-4" />
                    Kopiraj kao tekst za pedagoga
                  </>
                )}
              </Button>
            </div>

            {!authReady ? (
              <p className="mt-4 text-sm text-muted-foreground">Provjera prijave…</p>
            ) : parentUser?.user_type !== "roditelj" ? (
              <div className="mt-4 rounded-xl border border-border bg-background/70 p-4 text-sm">
                <p className="font-medium text-foreground">Zapis je moguć samo s roditeljskim računom.</p>
                <p className="mt-1 text-muted-foreground">
                  {parentUser
                    ? "Ovaj račun nije označen kao Roditelj / skrbnik. Promijenite tip u profilu ili se prijavite roditeljskim računom."
                    : "Prijavite se na MojPut kao roditelj da biste spremili razgovor. Zapis se onda vidi i u profilu."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild size="sm" className="rounded-xl">
                    <Link
                      to={
                        parentUser
                          ? "/profil?tab=postavke"
                          : `/prijava?next=${encodeURIComponent("/roditeljski-kutak/vodic-za-roditelje?experience=junior#dnevnik")}`
                      }
                    >
                      {parentUser ? "Otvori postavke računa" : "Prijava kao roditelj"}
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
            <>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="dn-date" className="text-xs font-medium text-muted-foreground">
                  Datum
                </label>
                <Input
                  id="dn-date"
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  className="h-10 rounded-xl border-2"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="dn-korak" className="text-xs font-medium text-muted-foreground">
                  Sljedeći korak
                </label>
                <Input
                  id="dn-korak"
                  value={draftKorak}
                  onChange={(e) => setDraftKorak(e.target.value)}
                  placeholder="npr. Posjet škole X, razgovor s pedagogom"
                  className="h-10 rounded-xl border-2"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="dn-teme" className="text-xs font-medium text-muted-foreground">
                  Što smo pričali
                </label>
                <Textarea
                  id="dn-teme"
                  value={draftTeme}
                  onChange={(e) => setDraftTeme(e.target.value)}
                  placeholder="Kratka natuknica o temi razgovora…"
                  rows={2}
                  className="min-h-[72px] rounded-xl border-2"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="dn-dijete" className="text-xs font-medium text-muted-foreground">
                  Što je dijete reklo
                </label>
                <Textarea
                  id="dn-dijete"
                  value={draftDjeteKaze}
                  onChange={(e) => setDraftDjeteKaze(e.target.value)}
                  placeholder="Riječi, osjećaji, nedoumice koje je dijete podijelilo…"
                  rows={2}
                  className="min-h-[72px] rounded-xl border-2"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {dnevnikEntries.length === 0
                  ? "Još nema zapisa."
                  : `Spremljeno: ${dnevnikEntries.length} ${dnevnikEntries.length === 1 ? "zapis" : "zapisa"}.`}
              </p>
              <Button
                type="button"
                size="sm"
                className="rounded-xl"
                onClick={handleAddDnevnik}
                disabled={savingNote || (!draftTeme.trim() && !draftDjeteKaze.trim() && !draftKorak.trim())}
              >
                {savingNote ? "Spremam…" : "Spremi zapis"}
              </Button>
            </div>
            {dnevnikError ? <p className="mt-2 text-xs text-red-600">{dnevnikError}</p> : null}

            {dnevnikEntries.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Zadnjih {Math.min(5, dnevnikEntries.length)} zapisa
                </p>
                <ul className="space-y-2">
                  {dnevnikEntries.slice(0, 5).map((entry) => {
                    const d = new Date(`${entry.dateIso}T00:00:00`);
                    const dateStr = Number.isNaN(d.getTime())
                      ? entry.dateIso
                      : d.toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
                    return (
                      <li
                        key={entry.id}
                        className="rounded-xl border border-border/60 bg-background/70 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground">{dateStr}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDnevnik(entry.id)}
                            aria-label="Obriši zapis"
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {entry.teme && (
                          <p className="mt-1 text-sm text-foreground/85">
                            <span className="font-medium text-muted-foreground">Teme:</span> {entry.teme}
                          </p>
                        )}
                        {entry.djeteKaze && (
                          <p className="mt-1 text-sm text-foreground/85">
                            <span className="font-medium text-muted-foreground">Dijete kaže:</span> {entry.djeteKaze}
                          </p>
                        )}
                        {entry.sljedeciKorak && (
                          <p className="mt-1 text-sm text-foreground/85">
                            <span className="font-medium text-muted-foreground">Sljedeći korak:</span> {entry.sljedeciKorak}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {copyState === "err" && (
              <p className="mt-2 text-xs text-red-600">
                Nismo mogli kopirati automatski. Odaberite tekst ručno i kopirajte.
              </p>
            )}
            </>
            )}
          </article>
        )}

        {videos.length > 0 && (
          <article className="rounded-2xl border bg-card p-5 mt-6">
            <h2 className="font-semibold">Video sadržaj</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              {videos.map((video) => (
                <div key={video.id} className="rounded-xl border p-3">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe title={video.title} src={video.url} className="w-full h-full" allowFullScreen />
                  </div>
                  <p className="text-sm font-medium mt-2">{video.title}</p>
                </div>
              ))}
            </div>
          </article>
        )}
      </section>
    </Layout>
  );
};

export default ParentGuide;
