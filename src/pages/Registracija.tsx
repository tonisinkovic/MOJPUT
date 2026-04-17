import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import {
  Mail,
  Lock,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Users as UsersIcon,
  Briefcase,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  MailCheck,
  KeyRound,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { authRegister, authResendVerification } from "@/lib/auth";

const Registracija = () => {
  const [verifyInfo, setVerifyInfo] = useState<{
    emailPreviewUrl?: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendInfo, setResendInfo] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    const username = `${formData.firstName} ${formData.lastName}`.trim();
    const res = await authRegister({
      username: username || formData.email.split("@")[0],
      email: formData.email,
      password: formData.password,
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    const data = res as {
      email?: string;
      user?: { email?: string };
      email_preview_url?: string;
    };
    const sentTo = data.email?.trim() || data.user?.email?.trim() || formData.email.trim();
    setRegisteredEmail(sentTo || null);
    setResendInfo("");
    setVerifyInfo({
      emailPreviewUrl: data.email_preview_url || undefined,
    });
    setSubmitted(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      status: "",
    });
  };

  // Visual-only password strength (NE mijenja validaciju; validaciju radi server/browser)
  const strength = useMemo(() => {
    const pw = formData.password;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 10) score += 1;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
    if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 1;
    return Math.min(score, 4);
  }, [formData.password]);

  const strengthLabel =
    strength === 0
      ? ""
      : strength <= 1
        ? "Slaba"
        : strength === 2
          ? "Osrednja"
          : strength === 3
            ? "Dobra"
            : "Jaka";

  const strengthTone =
    strength <= 1 ? "on-weak" : strength <= 2 ? "on-medium" : "on-strong";

  const statusOptions: {
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }[] = [
    { value: "srednjoskolac", label: "Srednjoškolac", icon: BookOpen },
    { value: "student", label: "Student", icon: GraduationCap },
    { value: "profesor", label: "Profesor", icon: Briefcase },
    { value: "roditelj", label: "Roditelj", icon: UsersIcon },
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: "Personalizirane preporuke",
      desc: "Rezultati kviza i smjerovi upisa spremni kad se vratiš.",
    },
    {
      icon: Clock,
      title: "Podsjetnici na rokove",
      desc: "Važni datumi mature, prijava i upisa — nikad više propušteno.",
    },
    {
      icon: CheckCircle2,
      title: "Sve na jednom mjestu",
      desc: "Kviz, kalkulator, domovi, forum i profil fakulteta.",
    },
  ];

  return (
    <Layout>
      <section className="auth-shell relative overflow-hidden bg-mesh-gradient">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.22] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          aria-hidden
        />
        <div className="aurora-orb top-[-12rem] right-[-8rem] h-[28rem] w-[28rem] opacity-40" aria-hidden />

        <div className="container relative px-4 py-12 md:py-20 max-w-6xl mx-auto">
          {!submitted ? (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 items-start">
              {/* Left — marketing column */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:sticky lg:top-24"
              >
                <div className="eyebrow mb-6 justify-start" aria-hidden>
                  <span>Registracija · Novi korisnik</span>
                </div>

                <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/70 backdrop-blur-sm text-primary text-[13px] font-semibold border border-primary/20 ring-1 ring-primary/5 shadow-soft">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <Sparkles className="w-3.5 h-3.5" />
                  Besplatno · za maturante HR
                </div>

                <h1 className="text-balance text-[2.125rem] sm:text-4xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] leading-[1.05] mb-5">
                  Kreiraj svoj{" "}
                  <span className="relative inline-block align-baseline">
                    <span
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[140%] rounded-full bg-gradient-to-r from-primary/30 via-accent/15 to-[hsl(232_68%_60%/0.25)] blur-2xl opacity-80"
                      aria-hidden
                    />
                    <span className="relative text-gradient drop-shadow-sm">MojPut</span>
                  </span>{" "}
                  račun
                </h1>

                <p className="text-pretty text-[15px] sm:text-base text-muted-foreground leading-[1.65] max-w-md mb-6">
                  Spremi svoje rezultate kviza, planiraj upise i prati važne datume na jednom mjestu.
                  Registracija traje <strong className="font-semibold text-foreground">manje od minute</strong>.
                </p>

                <p className="text-sm text-muted-foreground mb-7">
                  Već imaš račun?{" "}
                  <Link to="/prijava" className="font-semibold text-primary hover:underline underline-offset-4">
                    Idi na prijavu
                  </Link>
                </p>

                {/* Benefits list */}
                <ul className="space-y-3 mb-7">
                  {benefits.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <motion.li
                        key={b.title}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20 shadow-inner">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold tracking-[-0.005em] text-foreground">{b.title}</div>
                          <p className="text-[13px] text-muted-foreground leading-snug mt-0.5">{b.desc}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2" aria-hidden>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-soft">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Siguran pristup
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-soft">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    100% besplatno
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-soft">
                    <UsersIcon className="h-3.5 w-3.5 text-primary" />
                    500+ maturanata
                  </span>
                </div>
              </motion.div>

              {/* Right — form card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="relative"
              >
                <div
                  className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-[var(--hero-gradient-soft)] opacity-70 blur-2xl"
                  aria-hidden
                />
                <div className="hero-preview-frame relative overflow-hidden rounded-[1.5rem] border border-white/60 dark:border-white/10 p-6 sm:p-8">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                    aria-hidden
                  />

                  {/* Form header */}
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold tracking-[-0.015em] text-foreground">
                        Otvori besplatan račun
                      </h2>
                      <p className="text-[13px] text-muted-foreground mt-0.5">
                        Nekoliko detalja i spremno je.
                      </p>
                    </div>
                    <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/20 shadow-inner">
                      <User className="h-[1.15rem] w-[1.15rem]" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Ime / Prezime */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="auth-label">
                          <User className="h-3.5 w-3.5 auth-label-icon" aria-hidden />
                          Ime
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          autoComplete="given-name"
                          placeholder="npr. Ivana"
                          className="auth-input auth-input--plain"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="auth-label">
                          <User className="h-3.5 w-3.5 auth-label-icon" aria-hidden />
                          Prezime
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          autoComplete="family-name"
                          placeholder="npr. Horvat"
                          className="auth-input auth-input--plain"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="auth-label">
                        <Mail className="h-3.5 w-3.5 auth-label-icon" aria-hidden />
                        Email adresa
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
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                          placeholder="tvoja@email.com"
                          className="auth-input"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="auth-label">
                        <Sparkles className="h-3.5 w-3.5 auth-label-icon" aria-hidden />
                        Koji si ti?
                      </label>
                      <div className="grid grid-cols-2 gap-2.5" role="radiogroup">
                        {statusOptions.map((option) => {
                          const Icon = option.icon;
                          const active = formData.status === option.value;
                          return (
                            <label
                              key={option.value}
                              className={`radio-card ${active ? "radio-card--active" : ""}`}
                            >
                              <input
                                type="radio"
                                name="status"
                                value={option.value}
                                checked={active}
                                onChange={handleChange}
                                required
                                className="sr-only"
                              />
                              <span className="radio-card-icon">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="radio-card-label">{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Lozinke */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="password" className="auth-label">
                          <Lock className="h-3.5 w-3.5 auth-label-icon" aria-hidden />
                          Lozinka
                        </label>
                        <div className="relative">
                          <Lock
                            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                          />
                          <input
                            id="password"
                            type={showPw ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            placeholder="Min. 6 znakova"
                            className="auth-input pr-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            aria-label={showPw ? "Sakrij lozinku" : "Prikaži lozinku"}
                            tabIndex={-1}
                          >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex items-center gap-1">
                              {[0, 1, 2, 3].map((i) => (
                                <span
                                  key={i}
                                  className={`strength-bar ${i < strength ? `strength-bar--${strengthTone}` : ""}`}
                                />
                              ))}
                            </div>
                            <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                              Jačina lozinke:{" "}
                              <span
                                className={
                                  strength <= 1
                                    ? "text-destructive"
                                    : strength === 2
                                      ? "text-[hsl(38_90%_45%)]"
                                      : "text-[hsl(150_60%_38%)]"
                                }
                              >
                                {strengthLabel}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="auth-label">
                          <Lock className="h-3.5 w-3.5 auth-label-icon" aria-hidden />
                          Potvrdi lozinku
                        </label>
                        <div className="relative">
                          <Lock
                            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                          />
                          <input
                            id="confirmPassword"
                            type={showConfirmPw ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            placeholder="Ponovi lozinku"
                            className="auth-input pr-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPw((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            aria-label={showConfirmPw ? "Sakrij lozinku" : "Prikaži lozinku"}
                            tabIndex={-1}
                          >
                            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {formData.confirmPassword && formData.password && (
                          <p
                            className={`mt-2 flex items-center gap-1 text-[11px] font-semibold ${
                              formData.password === formData.confirmPassword
                                ? "text-[hsl(150_60%_38%)]"
                                : "text-destructive"
                            }`}
                          >
                            {formData.password === formData.confirmPassword ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                Lozinke se podudaraju
                              </>
                            ) : (
                              <>Lozinke se ne podudaraju</>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[13px] font-medium text-destructive"
                        role="alert"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive text-[10px] font-bold">
                          !
                        </span>
                        <span>{error}</span>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      className="group btn-primary-premium border-0 rounded-xl h-12 w-full text-[15px] font-semibold inline-flex items-center justify-center gap-2"
                    >
                      Registriraj se
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        ili
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                      Već imaš račun?{" "}
                      <Link
                        to="/prijava"
                        className="font-semibold text-primary hover:underline underline-offset-4"
                      >
                        Prijavi se
                      </Link>
                    </p>

                    <p className="pt-1 text-center text-[11px] text-muted-foreground/80">
                      Registracijom prihvaćaš{" "}
                      <Link to="/uvjeti" className="underline underline-offset-2 hover:text-foreground">
                        Uvjete korištenja
                      </Link>{" "}
                      i{" "}
                      <Link to="/privatnost" className="underline underline-offset-2 hover:text-foreground">
                        Pravila privatnosti
                      </Link>
                      .
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          ) : (
            // ===== SUCCESS STATE =====
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl"
            >
              <div className="relative">
                <div
                  className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-[var(--hero-gradient-soft)] opacity-80 blur-2xl"
                  aria-hidden
                />
                <div className="hero-preview-frame relative overflow-hidden rounded-[1.5rem] border border-white/60 dark:border-white/10 p-6 sm:p-10 text-center">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                    aria-hidden
                  />

                  {/* Animated success ring */}
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center"
                  >
                    <span
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 blur-lg"
                      aria-hidden
                    />
                    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(205_82%_54%)] text-primary-foreground shadow-[0_20px_40px_-12px_hsl(205_82%_54%/0.5)]">
                      <CheckCircle2 className="h-9 w-9" strokeWidth={2.5} />
                    </span>
                  </motion.div>

                  <h2 className="text-balance text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] mb-2">
                    Račun je kreiran!
                  </h2>
                  <p className="text-[14.5px] sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
                    {verifyInfo?.emailPreviewUrl
                      ? "Poslan je email s 6-znamenkastim kodom. U testnom inboxu otvori poruku i upiši kod na stranici za potvrdu."
                      : "Na email ti je stigao 6-znamenkasti kod. U Gmailu provjeri Promocije / Spam ako ne vidiš poruku odmah."}
                  </p>

                  {/* Email chip */}
                  {registeredEmail && (
                    <div className="mx-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-sm max-w-full">
                      <MailCheck className="h-4 w-4 shrink-0" />
                      <span className="truncate break-all">{registeredEmail}</span>
                    </div>
                  )}

                  {/* Stepper */}
                  <ol className="mx-auto mb-7 grid max-w-lg grid-cols-3 gap-2 text-left">
                    {[
                      { n: 1, label: "Registrirao/la si se", active: true, done: true, icon: User },
                      { n: 2, label: "Otvori email i kopiraj kod", active: true, done: false, icon: Mail },
                      { n: 3, label: "Upiši kod i potvrdi", active: false, done: false, icon: KeyRound },
                    ].map((step) => {
                      const Icon = step.icon;
                      return (
                        <li
                          key={step.n}
                          className={`relative rounded-xl border p-2.5 sm:p-3 ${
                            step.done
                              ? "border-primary/30 bg-primary/8"
                              : step.active
                                ? "border-primary/25 bg-card/60"
                                : "border-border/60 bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                                step.done
                                  ? "bg-gradient-to-br from-primary to-[hsl(205_82%_54%)] text-primary-foreground"
                                  : step.active
                                    ? "bg-primary/15 text-primary ring-1 ring-primary/25"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.done ? <CheckCircle2 className="h-3 w-3" /> : step.n}
                            </span>
                            <Icon
                              className={`h-3.5 w-3.5 ${step.done || step.active ? "text-primary" : "text-muted-foreground"}`}
                              aria-hidden
                            />
                          </div>
                          <p
                            className={`text-[11.5px] sm:text-xs font-semibold leading-snug ${
                              step.done || step.active ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                        </li>
                      );
                    })}
                  </ol>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    {registeredEmail && (
                      <Link
                        to={`/verify?email=${encodeURIComponent(registeredEmail)}`}
                        className="group btn-primary-premium border-0 rounded-xl h-12 w-full text-[15px] font-semibold inline-flex items-center justify-center gap-2"
                      >
                        <KeyRound className="h-4 w-4" />
                        Upiši kod za potvrdu
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    )}
                    {verifyInfo?.emailPreviewUrl && (
                      <a
                        href={verifyInfo.emailPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary-premium rounded-xl h-11 w-full text-sm font-semibold inline-flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Pregledaj poslani email
                      </a>
                    )}
                    {registeredEmail && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          disabled={resendLoading}
                          onClick={async () => {
                            setResendInfo("");
                            setResendLoading(true);
                            const r = await authResendVerification(registeredEmail);
                            setResendLoading(false);
                            if (r.success) {
                              setResendInfo("Ako račun postoji i nije potvrđen, poslan je novi 6-znamenkasti kod.");
                            } else {
                              setResendInfo(r.message);
                            }
                          }}
                          className="w-full h-11 rounded-xl border border-border/80 bg-background/70 backdrop-blur-sm text-sm font-semibold text-foreground hover:border-primary/35 hover:text-primary hover:bg-primary/5 transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          <RefreshCw className={`h-4 w-4 ${resendLoading ? "animate-spin" : ""}`} />
                          {resendLoading ? "Šaljem…" : "Pošalji ponovno kod"}
                        </button>
                        {resendInfo && (
                          <p className="text-xs text-muted-foreground">{resendInfo}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <Link
                      to="/prijava"
                      className="text-sm font-semibold text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
                    >
                      Idi na prijavu
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Registracija;
