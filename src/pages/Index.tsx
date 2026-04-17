import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import FeatureCard from "@/components/FeatureCard";
import {
  Map,
  Calculator,
  Video,
  MessageSquare,
  Calendar,
  ScrollText,
  Users,
  Bot,
  Target,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
  Home,
  Lock,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

type HomeFeature = {
  icon: ReactNode;
  title: string;
  description: string;
  path: string;
  locked?: boolean;
  highlighted?: boolean;
};

const features: HomeFeature[] = [
  {
    icon: <Map className="h-6 w-6 text-primary" />,
    title: "Karta fakulteta",
    description: "Interaktivna karta s detaljnim profilima svih fakulteta u Hrvatskoj.",
    path: "/karta",
    highlighted: true,
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    title: "Koji je fakultet za mene?",
    description: "Karijerni upitnik (50+50): interesi i kompetencije, profil osobina i preporuke smjerova upisa.",
    path: "/kviz",
    highlighted: true,
  },
  {
    icon: <Target className="h-6 w-6 text-primary" />,
    title: "Samoprocjena",
    description: "Upoznaj svoje interese, vrijednosti i sposobnosti kroz digitalni alat.",
    path: "/samoprocjena",
  },
  {
    icon: <Calculator className="h-6 w-6 text-primary" />,
    title: "Kalkulator bodova",
    description: "Izračunaj bodove za upis i saznaj koje fakultete možeš upisati.",
    path: "/kalkulator",
    highlighted: true,
  },
  {
    icon: <Home className="h-6 w-6 text-primary" />,
    title: "Studentski domovi",
    description: "Okvirni bodovi za natječaj; prag u alatu samo za Zagreb, za ostale gradove procjena šanse.",
    path: "/kalkulator-doma",
  },
  {
    icon: <Video className="h-6 w-6 text-primary" />,
    title: "Video sadržaji",
    description: "Predavanja, iskustva studenata i edukativni video materijali.",
    path: "/video",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Forum",
    description: "Razmijeni iskustva s drugim učenicima i studentima.",
    path: "/forum",
  },
  {
    icon: <Calendar className="h-6 w-6 text-primary" />,
    title: "Kalendar datuma",
    description: "Svi važni rokovi za maturu, prijave i upise na jednom mjestu.",
    path: "/kalendar",
  },
  {
    icon: <ScrollText className="h-6 w-6 text-primary" />,
    title: "Matura",
    description: "Kvizovi i PDF materijali za šk. god. 2024/2025. (matematika; ostali predmeti uskoro).",
    path: "/mature",
    locked: true,
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Roditeljski kutak",
    description: "Resursi i alati za roditelje koji podržavaju dijete u odabiru.",
    path: "/roditelji",
  },
  {
    icon: <Bot className="h-6 w-6 text-primary" />,
    title: "AI ChatBot",
    description: "Razgovaraj s umjetnom inteligencijom o odabiru fakulteta i karijere.",
    path: "/chatbot",
  },
];

const stats = [
  { value: "120+", label: "Fakulteta", icon: <GraduationCap className="w-5 h-5" /> },
  { value: "500+", label: "Korisnika", icon: <Users className="w-5 h-5" /> },
  { value: "5", label: "Video lekcija", icon: <Video className="w-5 h-5" /> },
  { value: "95%", label: "Zadovoljstvo", icon: <Award className="w-5 h-5" /> },
];

const Index = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const ctaEndRef = useRef<HTMLElement | null>(null);
  const [heroPassed, setHeroPassed] = useState(false);
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      setUser(userFromAuthMe(res));
    });
    const sync = () => {
      authMe().then((res) => setUser(userFromAuthMe(res)));
    };
    window.addEventListener("mojput-auth-changed", sync);
    return () => {
      alive = false;
      window.removeEventListener("mojput-auth-changed", sync);
    };
  }, []);

  // Mobile sticky dock visibility: show after hero CTA leaves viewport,
  // hide when bottom CTA section is reached.
  useEffect(() => {
    const heroEl = heroCtaRef.current;
    const endEl = ctaEndRef.current;
    if (!heroEl || !endEl) return;

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    const endObs = new IntersectionObserver(
      ([entry]) => {
        setEndReached(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    heroObs.observe(heroEl);
    endObs.observe(endEl);

    return () => {
      heroObs.disconnect();
      endObs.disconnect();
    };
  }, []);

  const showMobileDock = heroPassed && !endReached && !user;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-gradient">
        <div
          className="absolute inset-0 bg-grid-pattern opacity-[0.28] sm:opacity-[0.32] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]"
          aria-hidden
        />
        <div className="aurora-orb top-[-8rem] right-[-6rem] h-[20rem] w-[20rem] sm:h-[32rem] sm:w-[32rem]" aria-hidden />
        <div className="aurora-orb bottom-[-10rem] left-[-8rem] h-[18rem] w-[18rem] sm:h-[26rem] sm:w-[26rem] opacity-40" aria-hidden />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[640px] h-[320px] sm:h-[640px] bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden />

        <div className="container relative pb-10 pt-8 sm:pb-24 sm:pt-14 md:pb-36 md:pt-20 lg:pt-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
            {/* Copy column */}
            <div className="max-w-2xl mx-auto text-center lg:mx-0 lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="eyebrow mb-5 sm:mb-6 justify-center lg:justify-start"
                aria-hidden
              >
                <span className="hidden sm:inline">Za srednjoškolce · maturante · studente · roditelje</span>
                <span className="sm:hidden">Za srednjoškolce, maturante i roditelje</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-background/70 backdrop-blur-sm text-primary text-[12px] sm:text-sm font-semibold mb-5 sm:mb-7 border border-primary/20 ring-1 ring-primary/5 shadow-soft hover:border-primary/30 hover:shadow-md transition-all">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Tvoj vodič za budućnost
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-balance text-[1.75rem] leading-[1.1] xs:text-[2rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-extrabold tracking-[-0.025em] md:leading-[1.02] mb-4 sm:mb-6 break-words"
              >
                Pronađi svoj{" "}
                <span className="relative inline-block align-baseline">
                  <span
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[140%] rounded-full bg-gradient-to-r from-primary/30 via-accent/15 to-[hsl(232_68%_60%/0.25)] blur-2xl opacity-80"
                    aria-hidden
                  />
                  <span className="relative text-gradient drop-shadow-sm">put</span>
                </span>{" "}
                do savršenog fakulteta
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-pretty text-[14px] sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-10 leading-[1.55] sm:leading-[1.6] break-words"
              >
                <span className="hidden sm:inline">MojPut ti pomaže istražiti fakultete, otkriti svoje talente i donijeti informiranu odluku o budućoj karijeri — sve na jednom mjestu.</span>
                <span className="sm:hidden">Istraži fakultete, otkrij talente i donesi pravu odluku.</span>
              </motion.p>

              <motion.div
                ref={heroCtaRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 w-full"
              >
                <Button
                  size="lg"
                  className="group btn-primary-premium touch-tap border-0 rounded-xl px-5 sm:px-8 h-[3rem] sm:h-[3.25rem] text-[15px] sm:text-base font-semibold w-full sm:w-auto"
                  asChild
                >
                  <Link to="/kviz" className="inline-flex items-center justify-center">
                    Započni kviz
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-secondary-premium touch-tap rounded-xl px-5 sm:px-8 h-[3rem] sm:h-[3.25rem] text-[15px] sm:text-base font-semibold w-full sm:w-auto"
                  asChild
                >
                  <Link to="/karta" className="inline-flex items-center justify-center">Istraži fakultete</Link>
                </Button>
              </motion.div>

              {/* Mobile quick actions — vertikalno prilagođena 3×2 mreža (bez horizontalnog scrolla) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38 }}
                className="mt-6 lg:hidden"
                aria-label="Brze akcije"
              >
                <div className="mb-2.5 flex items-center justify-between px-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
                    Brze akcije
                  </span>
                  <Link
                    to="/karta"
                    className="text-[11px] font-semibold text-primary hover:underline underline-offset-4"
                  >
                    Svi alati →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { to: "/kviz", label: "Kviz", Icon: GraduationCap },
                    { to: "/karta", label: "Karta", Icon: Map },
                    { to: "/kalkulator", label: "Bodovi", Icon: Calculator },
                    { to: "/samoprocjena", label: "Profil", Icon: Target },
                    { to: "/kalendar", label: "Kalendar", Icon: Calendar },
                    { to: "/video", label: "Video", Icon: Video },
                  ].map(({ to, label, Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="quick-pill quick-pill--grid touch-tap"
                    >
                      <span className="quick-pill-icon">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="quick-pill-label">{label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-6 sm:mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2.5"
                aria-hidden
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/30 hover:text-foreground whitespace-nowrap">
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  Bez registracije
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/30 hover:text-foreground whitespace-nowrap">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  100% besplatno
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/30 hover:text-foreground whitespace-nowrap">
                  <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  500+ maturanata
                </span>
              </motion.div>
            </div>

            {/* Visual / preview column — decorative only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
              aria-hidden
            >
              <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]">
                {/* Glow wash behind frame */}
                <div
                  className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[var(--hero-gradient-soft)] opacity-80 blur-2xl"
                  aria-hidden
                />

                {/* Main frame */}
                <div className="hero-preview-frame relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/60 dark:border-white/10 p-5">
                  {/* Header bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      mojput.hr
                    </div>
                  </div>

                  {/* Mini "hero" inside preview */}
                  <div className="mt-5 rounded-2xl bg-background/60 p-4 ring-1 ring-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 items-center gap-1 rounded-full bg-primary/10 px-2 text-[10px] font-bold uppercase tracking-wide text-primary ring-1 ring-primary/15">
                        <Sparkles className="h-3 w-3" />
                        Preporuka
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">na temelju kviza</span>
                    </div>
                    <div className="mt-3 h-3 w-3/4 rounded-full bg-gradient-to-r from-primary/70 to-[hsl(232_68%_60%/0.6)]" />
                    <div className="mt-2 h-2.5 w-1/2 rounded-full bg-muted-foreground/25" />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-primary/8 px-2 py-1.5 text-center">
                        <div className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Poklapanje</div>
                        <div className="text-sm font-extrabold text-primary">92%</div>
                      </div>
                      <div className="rounded-lg bg-muted/60 px-2 py-1.5 text-center">
                        <div className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Bodovi</div>
                        <div className="text-sm font-extrabold text-foreground">845</div>
                      </div>
                      <div className="rounded-lg bg-muted/60 px-2 py-1.5 text-center">
                        <div className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Smjer</div>
                        <div className="text-sm font-extrabold text-foreground">STEM</div>
                      </div>
                    </div>
                  </div>

                  {/* Feature rows */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3 rounded-xl bg-background/60 p-2.5 ring-1 ring-border/50">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Map className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="h-2.5 w-3/4 rounded-full bg-foreground/70" />
                        <div className="mt-1.5 h-2 w-1/2 rounded-full bg-muted-foreground/30" />
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-background/60 p-2.5 ring-1 ring-border/50">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(232_68%_60%/0.12)] text-[hsl(232_68%_60%)]">
                        <Calculator className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="h-2.5 w-2/3 rounded-full bg-foreground/70" />
                        <div className="mt-1.5 h-2 w-2/5 rounded-full bg-muted-foreground/30" />
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Floating stat card */}
                <div className="hero-preview-card animate-float-slow absolute -left-6 bottom-10 rounded-2xl p-3.5 w-[11rem]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20">
                      <GraduationCap className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Fakulteta</div>
                      <div className="text-lg font-extrabold tracking-tight text-foreground leading-none">120+</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge card */}
                <div className="hero-preview-card animate-float-slower absolute -right-4 top-12 rounded-2xl p-3 w-[11rem]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(14_90%_62%/0.2)] to-[hsl(14_90%_62%/0.08)] text-accent ring-1 ring-accent/25">
                      <Award className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Zadovoljstvo</div>
                      <div className="text-lg font-extrabold tracking-tight text-foreground leading-none">95%</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background"
          aria-hidden
        />
      </section>

      {/* Faculty Hub — kompaktno, zaključano (u izradi) */}
      <section className="container py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-2xl border border-dashed border-muted-foreground/35 bg-gradient-to-br from-muted/45 via-background to-muted/30 px-4 py-4 md:px-6 md:py-[1.125rem] shadow-soft hover:shadow-elevated hover:border-primary/30 transition-all duration-300"
          role="status"
          aria-live="polite"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/8 blur-2xl pointer-events-none" aria-hidden />
          <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-accent/8 blur-2xl pointer-events-none" aria-hidden />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-muted-foreground/25 bg-background shadow-inner ring-1 ring-background"
              aria-hidden
            >
              <Lock className="h-5 w-5 text-muted-foreground transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
              <span className="absolute inset-0 rounded-2xl ring-2 ring-muted-foreground/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="text-[15px] md:text-lg font-semibold leading-tight tracking-[-0.01em]">
                  Profili fakulteta na zasebnom mjestu
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-muted-foreground/30 bg-background/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-muted-foreground/50 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-muted-foreground/70" />
                  </span>
                  U izradi
                </span>
              </div>
              <p className="text-[13px] md:text-sm text-muted-foreground leading-snug mt-1">
                Sekcija još nije dostupna — radimo na profilima s objavama i obavijestima. Uskoro ovdje.
              </p>
            </div>
            <div className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11px] font-medium text-muted-foreground/90 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-primary/80" aria-hidden />
              <span className="max-w-[150px] leading-tight">Verificirani profili · siguran pristup</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative border-y bg-gradient-to-b from-background via-muted/20 to-background">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-[var(--hero-gradient-soft)] opacity-60 blur-3xl"
          aria-hidden
        />
        <div className="container py-8 sm:py-12 md:py-14">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative flex flex-col items-center text-center p-4 sm:p-5 md:p-5 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-sm hover:bg-card hover:border-primary/35 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/[0.08] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden
                />
                <span className="mb-2 sm:mb-2.5 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/15 shadow-inner group-hover:from-primary/20 group-hover:to-primary/10 group-hover:ring-primary/35 group-hover:scale-105 transition-all duration-300">
                  {stat.icon}
                </span>
                <span className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.125rem] font-extrabold tracking-[-0.03em] tabular-nums leading-none bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-muted-foreground font-semibold tracking-[0.08em] leading-snug uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-muted/25 to-background"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.16] [mask-image:radial-gradient(ellipse_at_top,black_0%,transparent_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-primary/[0.08] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/[0.06] blur-3xl"
          aria-hidden
        />

        <div className="container relative">
          <div className="mx-auto mb-8 flex max-w-5xl flex-col items-center gap-5 sm:mb-12 sm:gap-6 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl text-center md:text-left"
            >
              <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-primary shadow-soft">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Alati platforme
              </div>
              <h2 className="text-balance text-[1.625rem] font-extrabold tracking-[-0.03em] leading-[1.1] sm:text-4xl md:text-[2.75rem] lg:text-[3rem]">
                Sve što trebaš na <span className="text-gradient">jednom mjestu</span>
              </h2>
              <p className="mx-auto mt-3 sm:mt-4 max-w-lg text-pretty text-[14px] text-muted-foreground sm:text-base md:text-lg leading-[1.55] sm:leading-[1.6] md:mx-0">
                Alati, informacije i zajednica koji te vode kroz najvažniju odluku.
              </p>
            </motion.div>

            {/* Counter chip hidden on mobile — da se ne troši vertikalni prostor */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative hidden md:block shrink-0 rounded-2xl border border-border/60 bg-card/80 px-5 py-4 backdrop-blur-sm shadow-soft"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                aria-hidden
              />
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20">
                  <Sparkles className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[22px] font-extrabold leading-none tracking-[-0.02em] text-foreground tabular-nums">
                      {features.filter((f) => !f.locked).length}
                    </span>
                    <span className="text-[13px] font-semibold text-muted-foreground/80 tabular-nums">
                      ({features.filter((f) => f.locked).length} u izradi)
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Alata na raspolaganju
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {features.map((feature, i) =>
              feature.locked ? (
                <div
                  key={feature.path}
                  className="block h-full min-h-[11rem] select-none sm:min-h-[12.5rem]"
                  aria-disabled
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={i * 0.06}
                    locked
                  />
                </div>
              ) : (
                <Link
                  key={feature.path}
                  to={feature.path}
                  className="block h-full min-h-[11rem] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[12.5rem]"
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={i * 0.06}
                    highlighted={feature.highlighted}
                  />
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaEndRef} className="container pb-14 pt-4 sm:pb-20 sm:pt-6 md:pb-28 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="eyebrow mx-auto w-fit mb-5 sm:mb-7"
          aria-hidden
        >
          <span>Sljedeći korak</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/20 gradient-hero px-5 py-8 text-center shadow-[0_30px_70px_-20px_hsl(205_82%_54%/0.5)] sm:px-6 sm:py-10 md:px-12 md:py-14"
        >
          {/* Decorative concentric rings */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 opacity-70"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-white/[0.06] blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-dots-pattern opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            aria-hidden
          />
          <div className="shine-overlay" aria-hidden />

          <div className="relative">
            {user ? (
              <>
                <div className="mb-5 flex justify-center">
                  <Link
                    to="/profil"
                    className="group/avatar flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground shadow-md ring-2 ring-primary-foreground/10 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/25 hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
                    title="Moj profil"
                    aria-label="Otvori svoj profil i pregled aktivnosti"
                  >
                    <User className="h-8 w-8 transition-transform duration-300 group-hover/avatar:scale-110" strokeWidth={2} />
                  </Link>
                </div>
                <h2 className="text-balance text-[1.375rem] font-extrabold tracking-[-0.02em] text-primary-foreground md:text-2xl lg:text-3xl">
                  Bok, {user.username}!
                </h2>
                <p className="mx-auto mt-2.5 sm:mt-3 max-w-md text-pretty text-[14px] sm:text-[15px] text-primary-foreground/85 md:text-base leading-[1.55] sm:leading-[1.6]">
                  Ovdje možeš otvoriti svoj profil — aktivnost, kviz i spremljeni fakulteti.
                </p>
                <Button
                  size="lg"
                  className="group/btn touch-tap mt-6 sm:mt-7 h-12 w-full sm:w-auto rounded-xl border-0 bg-card px-6 sm:px-7 text-[15px] font-semibold text-foreground shadow-[0_10px_24px_-8px_hsl(215_30%_12%/0.3)] hover:bg-card/95 hover:shadow-[0_14px_30px_-10px_hsl(215_30%_12%/0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  asChild
                >
                  <Link to="/profil">
                    <User className="mr-2 h-4 w-4" />
                    Pregledaj profil
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-balance text-[1.375rem] font-extrabold tracking-[-0.02em] text-primary-foreground sm:text-[1.5rem] md:text-[1.75rem] lg:text-3xl">
                  Spreman za prvi korak?
                </h2>
                <p className="mx-auto mt-2.5 sm:mt-3 max-w-md text-pretty text-[14px] sm:text-[15px] text-primary-foreground/85 md:text-base leading-[1.55] sm:leading-[1.6]">
                  <span className="hidden sm:inline">Pridruži se tisućama maturanata koji su pronašli svoj put uz MojPut platformu.</span>
                  <span className="sm:hidden">Pridruži se maturantima koji su pronašli svoj put.</span>
                </p>
                <Button
                  size="lg"
                  className="group/btn touch-tap mt-6 sm:mt-7 h-12 w-full sm:w-auto rounded-xl border-0 bg-card px-6 sm:px-7 text-[15px] font-semibold text-foreground shadow-[0_10px_24px_-8px_hsl(215_30%_12%/0.3)] hover:bg-card/95 hover:shadow-[0_14px_30px_-10px_hsl(215_30%_12%/0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  asChild
                >
                  <Link to="/registracija">
                    Kreiraj besplatni račun
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Mobile sticky bottom dock — appears after hero, hides on CTA */}
      <AnimatePresence>
        {showMobileDock && (
          <motion.div
            key="mobile-dock"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mobile-dock lg:hidden"
            role="region"
            aria-label="Brze akcije na dnu ekrana"
          >
            <div className="flex items-center gap-2 pr-16">
              <Link
                to="/karta"
                className="touch-tap flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-[13px] font-semibold text-foreground active:scale-[0.98] transition-transform"
              >
                <Map className="h-4 w-4 text-primary" aria-hidden />
                Karta
              </Link>
              <Link
                to="/kviz"
                className="group touch-tap flex h-11 flex-[1.2] items-center justify-center gap-1.5 rounded-xl border-0 btn-primary-premium text-[13px] font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Započni kviz
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </Layout>
  );
};

export default Index;
