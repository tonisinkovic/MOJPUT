import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Loader2, CheckCircle2, Lock } from "lucide-react";

const MAX_LEN = 4000;

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

  return (
    <aside
      className="border-t border-border/80 bg-muted/25"
      aria-label="Povratna informacija o stranici"
    >
      <div className="container max-w-2xl py-8 md:py-10">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm md:p-6">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
              aria-hidden
            >
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-base font-semibold leading-tight">Pomozi nam unaprijediti MojPut</h2>
              <p className="text-sm text-muted-foreground leading-snug">
                Prijedlozi, greške ili ideje za nove značajke. Šalju se samo timu koji održava stranicu — drugi
                korisnici ih ne vide.
              </p>
            </div>
          </div>

          {authLoading ? (
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Provjera prijave…
            </div>
          ) : !user ? (
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 shrink-0" aria-hidden />
                <span>Povratnu informaciju mogu poslati samo prijavljeni korisnici.</span>
              </div>
              <Button variant="secondary" size="sm" className="shrink-0" asChild>
                <Link to="/prijava">Prijava</Link>
              </Button>
            </div>
          ) : done ? (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
              Hvala! Zaprimili smo tvoju poruku.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
                placeholder="Npr. što bi ti olakšalo korištenje, što nedostaje ili što ne radi kako očekuješ…"
                rows={4}
                className="resize-y min-h-[100px] text-sm"
                disabled={submitting}
                maxLength={MAX_LEN}
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-muted-foreground">
                  {text.length}/{MAX_LEN} znakova · prijavljen kao {user.email}
                </span>
                <Button type="submit" size="sm" disabled={submitting || text.trim().length < 3}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      Šaljem…
                    </>
                  ) : (
                    "Pošalji povratnu informaciju"
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SiteFeedback;
