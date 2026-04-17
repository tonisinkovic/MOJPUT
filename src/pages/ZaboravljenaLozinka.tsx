import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, CheckCircle2, Info, KeyRound, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { authForgotPassword, authResetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function ZaboravljenaLozinka() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token")?.trim() ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    setError("");
    setInfo("");
  }, [tokenFromUrl]);

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const clean = email.trim().toLowerCase();
    if (!clean) {
      setError("Upiši email adresu.");
      return;
    }
    setLoading(true);
    const res = await authForgotPassword(clean);
    setLoading(false);
    if (!res.success) {
      setError(res.message || "Zahtjev nije uspio.");
      return;
    }
    const msg =
      (res as { message?: string }).message ||
      "Ako račun postoji, poslana su uputstva na email.";
    const preview = (res as { email_preview_url?: string }).email_preview_url;
    setInfo(preview ? `${msg}\n\n(Dev: pregled testnog maila: ${preview})` : msg);
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 6) {
      setError("Lozinka mora imati barem 6 znakova.");
      return;
    }
    if (password !== password2) {
      setError("Lozinke se ne podudaraju.");
      return;
    }
    setLoading(true);
    const res = await authResetPassword({ token: tokenFromUrl, password });
    setLoading(false);
    if (!res.success) {
      setError(res.message || "Promjena lozinke nije uspjela.");
      return;
    }
    setPassword("");
    setPassword2("");
    navigate("/prijava?reset=ok");
  };

  const resetMode = Boolean(tokenFromUrl);

  const inputClass =
    "w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/10";

  return (
    <Layout>
      <section className="container mx-auto max-w-md px-4 py-10 md:py-16">
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-card sm:rounded-3xl sm:p-6 md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-48 sm:w-48"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-44 sm:w-44"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          <div className="relative">
            <div className="mb-6 flex items-start gap-3 sm:gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md"
                aria-hidden
              >
                <KeyRound className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  {resetMode ? "Postavi novu lozinku" : "Oporavak računa"}
                </span>
                <h1 className="mt-1.5 text-balance text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                  {resetMode ? (
                    <>
                      <span className="text-gradient">Nova</span> lozinka
                    </>
                  ) : (
                    <>
                      <span className="text-gradient">Zaboravljena</span> lozinka
                    </>
                  )}
                </h1>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">
                  {resetMode
                    ? "Upiši novu lozinku za svoj račun."
                    : "Upiši email — poslat \u0107emo poveznicu za novu lozinku (vrijedi 1 sat)."}
                </p>
              </div>
            </div>

            {info && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border-2 border-sky-300/60 bg-gradient-to-br from-sky-50/90 via-sky-50/60 to-transparent p-3 text-sm font-medium text-sky-900 shadow-sm dark:border-sky-900/40 dark:from-sky-950/40 dark:via-sky-950/20 dark:to-transparent dark:text-sky-100">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-700 ring-1 ring-sky-500/30 dark:text-sky-300 dark:ring-sky-400/25"
                  aria-hidden
                >
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="min-w-0 flex-1 whitespace-pre-wrap leading-snug">{info}</p>
              </div>
            )}

            {resetMode ? (
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Lock size={16} className="text-primary" aria-hidden />
                    Nova lozinka
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Najmanje 6 znakova"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Lock size={16} className="text-primary" aria-hidden />
                    Ponovi lozinku
                  </label>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={inputClass}
                  />
                </div>
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border-2 border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 leading-snug">{error}</span>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full shadow-sm transition-transform hover:-translate-y-px"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      Spremam…
                    </>
                  ) : (
                    "Spremi novu lozinku"
                  )}
                </Button>
                <Link
                  to="/prijava"
                  className="group inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                  Natrag na prijavu
                </Link>
              </form>
            ) : (
              <form onSubmit={handleRequestLink} className="space-y-4">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Mail size={16} className="text-primary" aria-hidden />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="tvoj@email.com"
                    className={inputClass}
                  />
                </div>
                {error && (
                  <div className="flex items-start gap-2 rounded-xl border-2 border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 leading-snug">{error}</span>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full shadow-sm transition-transform hover:-translate-y-px"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      Šaljem…
                    </>
                  ) : (
                    "Pošalji poveznicu"
                  )}
                </Button>
                <Link
                  to="/prijava"
                  className="group inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                  Natrag na prijavu
                </Link>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
