import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2, CheckCircle2, Lock, Sparkles, Send, LogIn, Youtube, Instagram } from "lucide-react";

const MAX_LEN = 4000;

/** Lucide u ovoj verziji nema TikTok ikonu — jednostavni glyph u istom stilu kao ostale. */
function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://www.youtube.com/@Projekt30dana",
    label: "YouTube — Projekt 30dana",
    Icon: Youtube,
    iconClassName: "h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]",
  },
  {
    href: "https://www.tiktok.com/@projekt30dana",
    label: "TikTok — Projekt 30dana",
    Icon: TikTokGlyph,
    iconClassName: "h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5",
  },
  {
    href: "https://www.instagram.com/projekt30dana?igsh=MWdxbHBtdW0ybGxrcA==",
    label: "Instagram — Projekt 30dana",
    Icon: Instagram,
    iconClassName: "h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]",
  },
] as const;

const SiteFeedback = () => {
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const refreshUser = useCallback(() => {
    setAuthLoading(true);
    authMe()
      .then((res) => {
        setUser(userFromAuthMe(res));
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const onAuth = () => {
      setDone(false);
      setText("");
      refreshUser();
    };
    window.addEventListener("mojput-auth-changed", onAuth);
    return () => window.removeEventListener("mojput-auth-changed", onAuth);
  }, [refreshUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = text.trim();
    if (trimmed.length < 3) {
      setError("Napiši barem nekoliko riječi.");
      return;
    }
    setSubmitting(true);
    const res = await apiPost<{ success: boolean }>("/api/feedback", {
      message: trimmed,
      pagePath: `${location.pathname}${location.search || ""}`.slice(0, 500),
    });
    setSubmitting(false);
    if (res.success) {
      setDone(true);
      setText("");
      return;
    }
    setError(res.message || "Slanje nije uspjelo.");
  };

  const pct = Math.min(100, (text.length / MAX_LEN) * 100);

  return (
    <aside
      className="relative overflow-hidden border-t border-border/80 bg-gradient-to-b from-muted/10 via-muted/25 to-background"
      aria-label="Povratna informacija o stranici"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-primary/[0.07] blur-3xl"
      />

      <div className="container relative max-w-2xl py-8 md:py-10">
        <div className="relative overflow-hidden rounded-2xl border-2 border-border/70 bg-card/90 p-5 shadow-card backdrop-blur md:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md"
              aria-hidden
            >
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3 w-3" aria-hidden />
                Povratna informacija
              </span>
              <h2 className="text-base font-bold leading-tight sm:text-lg">Pomozi nam unaprijediti MojPut</h2>
              <p className="text-sm text-muted-foreground leading-snug">
                Prijedlozi, greške ili ideje za nove značajke. Šalju se samo timu koji održava stranicu — drugi
                korisnici ih ne vide.
              </p>
            </div>
          </div>

          {authLoading ? (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Provjera prijave…
            </div>
          ) : !user ? (
            <div className="mt-5 flex flex-col gap-3 rounded-xl border-2 border-dashed border-primary/25 bg-gradient-to-br from-primary/[0.06] to-transparent px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5 text-sm">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
                  aria-hidden
                >
                  <Lock className="h-4 w-4" />
                </div>
                <span className="leading-snug text-foreground/90">
                  Povratnu informaciju mogu poslati samo prijavljeni korisnici.
                </span>
              </div>
              <Button size="sm" className="shrink-0 shadow-sm" asChild>
                <Link to="/prijava">
                  <LogIn className="mr-1.5 h-4 w-4" aria-hidden />
                  Prijava
                </Link>
              </Button>
            </div>
          ) : done ? (
            <div className="mt-5 flex items-start gap-3 rounded-xl border-2 border-emerald-300/70 bg-gradient-to-br from-emerald-50/90 via-emerald-50/60 to-transparent px-4 py-3.5 text-sm text-emerald-900 dark:border-emerald-800/50 dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-transparent dark:text-emerald-100">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-300 dark:ring-emerald-400/25"
                aria-hidden
              >
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold leading-tight">Hvala! Zaprimili smo tvoju poruku.</p>
                <p className="mt-0.5 text-xs opacity-80">Tvoj feedback pomaže nam da MojPut bude bolji.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="group relative rounded-xl border-2 border-border bg-background/60 p-0.5 transition-colors focus-within:border-primary/60 focus-within:shadow-sm focus-within:ring-4 focus-within:ring-primary/10">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
                  placeholder="Npr. što bi ti olakšalo korištenje, što nedostaje ili što ne radi kako očekuješ…"
                  rows={4}
                  className="resize-y min-h-[110px] border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={submitting}
                  maxLength={MAX_LEN}
                />
              </div>

              <div className="space-y-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct < 50 ? "bg-primary/60" : pct < 85 ? "bg-primary/80" : "bg-primary"
                    }`}
                    style={{ width: `${pct}%` }}
                    aria-hidden
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-muted-foreground">
                    <span className="font-semibold tabular-nums text-foreground">{text.length}</span>
                    <span className="tabular-nums">/{MAX_LEN}</span> znakova · prijavljen kao{" "}
                    <span className="font-medium text-foreground/80">{user.email}</span>
                  </span>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitting || text.trim().length < 3}
                    className="shadow-sm transition-transform hover:-translate-y-px"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                        Šaljem…
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" aria-hidden />
                        Pošalji povratnu informaciju
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <p
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        <nav
          className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-7 sm:gap-4"
          aria-label="Društvene mreže — Projekt 30dana"
        >
          {SOCIAL_LINKS.map(({ href, label, Icon, iconClassName }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground shadow-sm transition hover:border-primary/40 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Icon className={iconClassName} />
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SiteFeedback;
