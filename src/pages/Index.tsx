import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

const features = [
  {
    icon: <Map className="h-6 w-6 text-primary" />,
    title: "Karta fakulteta",
    description: "Interaktivna karta s detaljnim profilima svih fakulteta u Hrvatskoj.",
    path: "/karta",
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    title: "Koji je fakultet za mene?",
    description: "Karijerni upitnik (50+50): interesi i kompetencije, profil osobina i preporuke smjerova upisa.",
    path: "/kviz",
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

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-gradient">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 shadow-sm">
                <Sparkles className="w-4 h-4" />
                Tvoj vodič za budućnost
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6"
            >
              Pronađi svoj{" "}
              <span className="text-gradient drop-shadow-sm">put</span>{" "}
              do savršenog fakulteta
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              MojPut ti pomaže istražiti fakultete, otkriti svoje talente i donijeti
              informiranu odluku o budućoj karijeri — sve na jednom mjestu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="gradient-hero border-0 text-primary-foreground px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all" asChild>
                <Link to="/kviz">
                  Započni kviz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 h-12 text-base hover:bg-primary/5 hover:border-primary/30 transition-colors" asChild>
                <Link to="/karta">Istraži fakultete</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Faculty Hub — kompaktno, zaključano (u izradi) */}
      <section className="container py-4 md:py-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-dashed border-muted-foreground/35 bg-muted/30 px-4 py-3 md:px-5 md:py-3.5 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" aria-hidden />
          <div className="relative flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-muted-foreground/25 bg-background shadow-inner"
              aria-hidden
            >
              <Lock className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="text-base md:text-lg font-semibold leading-tight">
                  Profili fakulteta na zasebnom mjestu
                </h2>
                <span className="inline-flex items-center rounded-full border border-muted-foreground/30 bg-background/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  U izradi
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground leading-snug mt-1">
                Sekcija još nije dostupna — radimo na profilima s objavama i obavijestima. Uskoro ovdje.
              </p>
            </div>
            <div className="hidden sm:flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground/90">
              <ShieldCheck className="h-3.5 w-3.5 text-primary/80" aria-hidden />
              <span className="max-w-[140px] leading-tight">Verificirani profili · siguran pristup</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-4 rounded-2xl bg-card/60 border border-border/50 hover:bg-card hover:border-primary/20 hover:shadow-card transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-primary">{stat.icon}</span>
                  <span className="text-2xl md:text-3xl font-extrabold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-muted/35 to-background"
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
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Alati platforme
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Sve što trebaš na <span className="text-gradient">jednom mjestu</span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-pretty text-base text-muted-foreground md:text-lg">
                Alati, informacije i zajednica koji te vode kroz najvažniju odluku.
              </p>
            </motion.div>
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {features.map((feature, i) => (
              <Link key={feature.path} to={feature.path} className="block h-full min-h-[11rem] sm:min-h-[12.5rem]">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={i * 0.06}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 pt-2 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-primary/15 gradient-hero px-6 py-7 text-center shadow-md shadow-primary/10 md:px-10 md:py-8"
        >
          <div
            className="pointer-events-none absolute -right-16 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />

          <div className="relative">
            {user ? (
              <>
                <div className="mb-4 flex justify-center">
                  <Link
                    to="/profil"
                    className="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground shadow-md ring-2 ring-primary-foreground/10 transition hover:bg-primary-foreground/25 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
                    title="Moj profil"
                    aria-label="Otvori svoj profil i pregled aktivnosti"
                  >
                    <User className="h-8 w-8 transition group-hover:scale-105" strokeWidth={2} />
                  </Link>
                </div>
                <h2 className="text-balance text-xl font-bold text-primary-foreground md:text-2xl">
                  Bok, {user.username}!
                </h2>
                <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-primary-foreground/85 md:text-base">
                  Ovdje možeš otvoriti svoj profil — aktivnost, kviz i spremljeni fakulteti.
                </p>
                <Button
                  size="default"
                  className="mt-5 border-0 bg-card font-semibold text-foreground shadow-sm hover:bg-card/95 hover:shadow-md"
                  asChild
                >
                  <Link to="/profil">
                    <User className="mr-2 h-4 w-4" />
                    Pregledaj profil
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-balance text-xl font-bold text-primary-foreground md:text-2xl">
                  Spreman za prvi korak?
                </h2>
                <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-primary-foreground/85 md:text-base">
                  Pridruži se tisućama maturanata koji su pronašli svoj put uz MojPut platformu.
                </p>
                <Button
                  size="default"
                  className="mt-5 border-0 bg-card font-semibold text-foreground shadow-sm hover:bg-card/95 hover:shadow-md"
                  asChild
                >
                  <Link to="/registracija">
                    Kreiraj besplatni račun
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </section>

    </Layout>
  );
};

export default Index;
