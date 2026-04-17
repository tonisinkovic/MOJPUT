import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Info,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { authLogin, authLogout, authMe, authResendVerification, type AuthUser } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Skočni prozor nakon redirecta s API-ja (npr. verified=1). */
type EmailVerifyUi =
  | { kind: "closed" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const Prijava = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loggedUser, setLoggedUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");
  const [emailVerifyUi, setEmailVerifyUi] = useState<EmailVerifyUi>({ kind: "closed" });
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    const verifiedFlag = searchParams.get("verified");
    const verifyErr = searchParams.get("verify_error");
    const pwdResetOk = searchParams.get("reset") === "ok";
    const prefEmail = searchParams.get("email");

    if (prefEmail) {
      setLoginData((prev) => (prev.email ? prev : { ...prev, email: prefEmail }));
      const next = new URLSearchParams(searchParams);
      next.delete("email");
      setSearchParams(next, { replace: true });
    }

    if (verifiedFlag === "1") {
      setEmailVerifyUi({
        kind: "success",
        message: "Račun je potvrđen. Možeš se prijaviti s emailom i lozinkom.",
      });
      setSearchParams({}, { replace: true });
    } else if (verifyErr === "expired") {
      setEmailVerifyUi({
        kind: "error",
        message: "Kod za potvrdu je istekao. Registriraj se ponovno ili zatraži novi kod na stranici za potvrdu.",
      });
      setSearchParams({}, { replace: true });
    } else if (verifyErr === "invalid" || verifyErr === "missing") {
      setEmailVerifyUi({
        kind: "error",
        message: "Potvrda više nije linkom. Otvori stranicu za potvrdu i upiši email te kod iz pisma.",
      });
      setSearchParams({}, { replace: true });
    }

    if (pwdResetOk) {
      setInfo("Lozinka je promijenjena. Prijavi se s novom lozinkom.");
      setSearchParams({}, { replace: true });
    }

    authMe()
      .then((res) => {
        if (!alive) return;
        if (res.success) setLoggedUser(res.user ?? (res as any).user ?? (res as any).data?.user ?? null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [searchParams, setSearchParams]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setCapsOn(e.getModifierState("CapsLock"));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    setInfo("");
    setNeedsVerification(false);

    if (!loginData.email || !loginData.password) {
      setLoginError("Molimo ispuni sva polja.");
      return;
    }

    const res = await authLogin({
      email: loginData.email,
      password: loginData.password,
    });
    if (!res.success) {
      setLoginError(res.message || "Prijava nije uspjela.");
      if (
        (res as any).code === "EMAIL_NOT_VERIFIED" ||
        (res as any).code === "PENDING_VERIFICATION" ||
        /potvrdi email|nije aktiviran/i.test(res.message)
      ) {
        setNeedsVerification(true);
      }
      return;
    }
    const user = (res as any).user ?? (res as any).data?.user ?? null;
    if (!user) {
      setLoginError(
        "Server je odgovorio bez podataka o korisniku. Osvježi stranicu i pokušaj ponovno; ako se ponavlja, provjeri deploy API-ja.",
      );
      return;
    }
    setLoggedUser(user);
    setLoginData({ email: "", password: "" });
    const nextPath = searchParams.get("next");
    if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
      navigate(nextPath);
    } else {
      navigate("/profil");
    }
  };

  const handleResend = async () => {
    const email = loginData.email.trim();
    if (!email) {
      setLoginError("Unesi email da mogu poslati potvrdu.");
      return;
    }
    setResendLoading(true);
    setLoginError("");
    const res = await authResendVerification(email);
    setResendLoading(false);
    if (!res.success) {
      setLoginError(res.message);
      return;
    }
    setInfo("Ako email postoji i nije potvrđen, poslan je novi 6-znamenkasti kod.");
  };

  const handleLogout = async () => {
    await authLogout();
    setLoggedUser(null);
    setLoginData({ email: "", password: "" });
    setLoginError("");
  };

  const displayName = loggedUser?.username || "";
  const profileInitial = displayName?.trim()?.charAt(0)?.toUpperCase() || "?";

  const verifyOpen = emailVerifyUi.kind !== "closed";

  return (
    <Layout>
      {verifyOpen ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setEmailVerifyUi({ kind: "closed" });
          }}
        >
        <DialogContent
          className={
            emailVerifyUi.kind === "loading"
              ? "sm:max-w-md [&>button:last-child]:hidden"
              : "sm:max-w-md"
          }
          onPointerDownOutside={(e) => {
            if (emailVerifyUi.kind === "loading") e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (emailVerifyUi.kind === "loading") e.preventDefault();
          }}
        >
          {emailVerifyUi.kind === "loading" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
                  Potvrda računa
                </DialogTitle>
                <DialogDescription>
                  Potvrđujemo tvoj email. Pričekaj trenutak…
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center py-6">
                <Loader2 className="h-12 w-12 animate-spin text-primary/80" aria-hidden />
              </div>
            </>
          )}
          {emailVerifyUi.kind === "success" && (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden />
                </div>
                <DialogTitle className="text-center">Račun je potvrđen</DialogTitle>
                <DialogDescription className="text-center text-base text-slate-700">
                  {emailVerifyUi.message}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => setEmailVerifyUi({ kind: "closed" })}
                >
                  U redu
                </Button>
              </DialogFooter>
            </>
          )}
          {emailVerifyUi.kind === "error" && (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-7 w-7 text-red-600" aria-hidden />
                </div>
                <DialogTitle className="text-center">Potvrda nije uspjela</DialogTitle>
                <DialogDescription className="text-center text-base text-slate-700">
                  {emailVerifyUi.message}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => setEmailVerifyUi({ kind: "closed" })}
                >
                  Zatvori
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      ) : null}

      <section className="auth-shell relative overflow-hidden bg-mesh-gradient">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.22] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          aria-hidden
        />
        <div className="aurora-orb top-[-10rem] right-[-8rem] h-[24rem] w-[24rem] opacity-40" aria-hidden />
        <div className="aurora-orb bottom-[-12rem] left-[-8rem] h-[22rem] w-[22rem] opacity-30" aria-hidden />

        <div className="container relative px-4 py-10 sm:py-14 md:py-20 max-w-md mx-auto">
          {!loggedUser ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Soft glow wash behind card */}
              <div
                className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-[var(--hero-gradient-soft)] opacity-70 blur-2xl"
                aria-hidden
              />
              <div className="hero-preview-frame relative overflow-hidden rounded-[1.5rem] border border-white/60 dark:border-white/10 p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  aria-hidden
                />

                {/* Header */}
                <div className="mb-6 flex items-start gap-3.5">
                  <div
                    className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 shadow-inner"
                    aria-hidden
                  >
                    <LogIn className="h-[1.25rem] w-[1.25rem]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="eyebrow mb-2 justify-start" aria-hidden>
                      <span>Prijava</span>
                    </div>
                    <h1 className="text-balance text-[1.625rem] sm:text-[1.75rem] font-extrabold tracking-[-0.02em] leading-[1.15]">
                      Dobrodošao natrag
                    </h1>
                    <p className="mt-1 text-[13.5px] sm:text-sm text-muted-foreground leading-snug">
                      Prijavi se i nastavi gdje si stao.
                    </p>
                  </div>
                </div>

                {/* Transient alerts */}
                {loading && (
                  <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/40 px-3.5 py-2.5 text-[13px] font-medium text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
                    Provjeravam prijavu…
                  </div>
                )}

                {info && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-start gap-2.5 rounded-xl border border-primary/25 bg-primary/8 px-3.5 py-2.5 text-[13px] font-medium text-primary"
                    role="status"
                  >
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span>{info}</span>
                  </motion.div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="auth-label">
                      <Mail className="h-3.5 w-3.5 auth-label-icon" aria-hidden />
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        autoComplete="email"
                        inputMode="email"
                        placeholder="tvoj@email.com"
                        className="auth-input"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <label htmlFor="password" className="auth-label mb-0">
                        <Lock className="h-3.5 w-3.5 auth-label-icon" aria-hidden />
                        Lozinka
                      </label>
                      <Link
                        to="/zaboravljena-lozinka"
                        className="text-[11.5px] font-semibold text-primary hover:underline underline-offset-4"
                      >
                        Zaboravljena?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <input
                        id="password"
                        type={showPw ? "text" : "password"}
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        onKeyUp={handlePasswordKey}
                        onKeyDown={handlePasswordKey}
                        required
                        autoComplete="current-password"
                        placeholder="Unesi lozinku"
                        className="auth-input pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        aria-label={showPw ? "Sakrij lozinku" : "Prikaži lozinku"}
                        tabIndex={-1}
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {capsOn && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[hsl(38_90%_55%/0.1)] px-2.5 py-1 text-[11px] font-semibold text-[hsl(38_90%_38%)] dark:text-[hsl(38_90%_65%)]">
                        <AlertCircle className="h-3 w-3" />
                        Caps Lock je uključen
                      </p>
                    )}
                  </div>

                  {/* Login error */}
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[13px] font-medium text-destructive"
                      role="alert"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      <span>{loginError}</span>
                    </motion.div>
                  )}

                  {/* Needs verification */}
                  {needsVerification && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 rounded-xl border border-[hsl(38_90%_55%/0.35)] bg-[hsl(38_90%_55%/0.08)] p-3"
                    >
                      <p className="flex items-start gap-2 text-[12.5px] font-semibold text-[hsl(38_90%_38%)] dark:text-[hsl(38_90%_65%)]">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                        Email nije potvrđen. Upiši 6-znamenkasti kod da aktiviraš račun.
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Link
                          to={
                            loginData.email.trim()
                              ? `/verify?email=${encodeURIComponent(loginData.email.trim().toLowerCase())}`
                              : "/verify"
                          }
                          className="group inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground text-background h-11 text-[13px] font-semibold transition hover:opacity-90"
                        >
                          <KeyRound className="h-4 w-4" />
                          Upiši kod
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={resendLoading}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-background/70 h-11 text-[13px] font-semibold text-foreground backdrop-blur-sm transition hover:border-primary/35 hover:text-primary hover:bg-primary/5 disabled:opacity-60"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${resendLoading ? "animate-spin" : ""}`} />
                          {resendLoading ? "Šaljem…" : "Pošalji novi kod"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group btn-primary-premium border-0 rounded-xl h-12 w-full text-[15px] font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Prijavi se
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Nemaš račun?
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {/* Register link */}
                  <Link
                    to="/registracija"
                    className="btn-secondary-premium rounded-xl h-12 w-full text-[15px] font-semibold inline-flex items-center justify-center gap-1.5"
                  >
                    Kreiraj besplatni račun
                  </Link>
                </form>

                {/* Collapsible note */}
                <div className="mt-5 border-t border-border/60 pt-4">
                  <button
                    type="button"
                    onClick={() => setNoteOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1 text-left text-[12px] font-semibold text-muted-foreground transition hover:text-foreground"
                    aria-expanded={noteOpen}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" aria-hidden />
                      Prijava ne uspijeva?
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${noteOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {noteOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 text-[11.5px] text-muted-foreground leading-relaxed"
                    >
                      Račun s weba i račun s lokalnog testa nisu isti (različita baza). Email mora biti
                      potvrđen 6-znamenkastim kodom iz pisma. Ako te stranica ne drži prijavljenim nakon osvježenja,
                      osvježi deploy API-ja (session cookie za GitHub Pages).
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Trust chips (mobile too) */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-hidden>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-soft">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Siguran pristup
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-soft">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Bez reklama
                </span>
              </div>
            </motion.div>
          ) : (
            // ===== LOGGED-IN STATE =====
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div
                className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-[var(--hero-gradient-soft)] opacity-80 blur-2xl"
                aria-hidden
              />
              <div className="hero-preview-frame relative overflow-hidden rounded-[1.5rem] border border-white/60 dark:border-white/10 p-6 sm:p-8 text-center">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  aria-hidden
                />

                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 250, damping: 18 }}
                  className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center"
                >
                  <span
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-lg"
                    aria-hidden
                  />
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(205_82%_54%)] text-primary-foreground text-2xl font-extrabold shadow-[0_16px_32px_-10px_hsl(205_82%_54%/0.5)] ring-4 ring-background">
                    {profileInitial}
                  </span>
                </motion.div>

                <h1 className="text-balance text-xl sm:text-2xl font-extrabold tracking-[-0.02em]">
                  Bok, {displayName || "korisniče"}!
                </h1>
                <p className="mt-2 text-[13.5px] sm:text-sm text-muted-foreground leading-relaxed">
                  Već si prijavljen/a kao
                </p>
                <div className="mx-auto mt-2 mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1.5 text-[13px] font-semibold text-primary backdrop-blur-sm">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate break-all">{loggedUser.email}</span>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Link
                    to="/profil"
                    className="group btn-primary-premium border-0 rounded-xl h-12 flex-1 text-[14.5px] font-semibold inline-flex items-center justify-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Moj profil
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary-premium rounded-xl h-12 flex-1 text-[14.5px] font-semibold inline-flex items-center justify-center gap-2 text-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5"
                  >
                    <LogOut className="h-4 w-4" />
                    Odjava
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Prijava;
