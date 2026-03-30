import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
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
} from "lucide-react";

const features = [
  {
    icon: <Map className="w-6 h-6 text-primary-foreground" />,
    title: "Karta fakulteta",
    description: "Interaktivna karta s detaljnim profilima svih fakulteta u Hrvatskoj.",
    path: "/karta",
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-primary-foreground" />,
    title: "Koji je fakultet za mene?",
    description: "Kviz interesa i kompetencija (47+47) — RIASEC i preporuke smjerova upisa.",
    path: "/kviz",
  },
  {
    icon: <Target className="w-6 h-6 text-primary-foreground" />,
    title: "Samoprocjena",
    description: "Upoznaj svoje interese, vrijednosti i sposobnosti kroz digitalni alat.",
    path: "/samoprocjena",
  },
  {
    icon: <Calculator className="w-6 h-6 text-primary-foreground" />,
    title: "Kalkulator bodova",
    description: "Izračunaj bodove za upis i saznaj koje fakultete možeš upisati.",
    path: "/kalkulator",
  },
  {
    icon: <Home className="w-6 h-6 text-primary-foreground" />,
    title: "Studentski domovi",
    description: "Okvirni bodovi za natječaj; prag u alatu samo za Zagreb, za ostale gradove procjena šanse.",
    path: "/kalkulator-doma",
  },
  {
    icon: <Video className="w-6 h-6 text-primary-foreground" />,
    title: "Video sadržaji",
    description: "Predavanja, iskustva studenata i edukativni video materijali.",
    path: "/video",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-primary-foreground" />,
    title: "Forum",
    description: "Razmijeni iskustva s drugim učenicima i studentima.",
    path: "/forum",
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary-foreground" />,
    title: "Kalendar datuma",
    description: "Svi važni rokovi za maturu, prijave i upise na jednom mjestu.",
    path: "/kalendar",
  },
  {
    icon: <Users className="w-6 h-6 text-primary-foreground" />,
    title: "Roditeljski kutak",
    description: "Resursi i alati za roditelje koji podržavaju dijete u odabiru.",
    path: "/roditelji",
  },
  {
    icon: <Bot className="w-6 h-6 text-primary-foreground" />,
    title: "AI ChatBot",
    description: "Razgovaraj s umjetnom inteligencijom o odabiru fakulteta i karijere.",
    path: "/chatbot",
  },
];

const stats = [
  { value: "120+", label: "Fakulteta", icon: <GraduationCap className="w-5 h-5" /> },
  { value: "10k+", label: "Korisnika", icon: <Users className="w-5 h-5" /> },
  { value: "50+", label: "Video lekcija", icon: <Video className="w-5 h-5" /> },
  { value: "95%", label: "Zadovoljstvo", icon: <Award className="w-5 h-5" /> },
];

const Index = () => {
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

      {/* Studentski domovi — kalkulator (ispod pregleda fakultetskih profila) */}
      <section className="container py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/8 via-card to-accent/10 p-6 md:p-8 shadow-card"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                <Home className="w-4 h-4" />
                Novo na MojPutu
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mt-4">
                Kalkulator bodova za studentske domove
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
                Unesi prosjek, prihod, godinu studija i što se tiče tebe — dobiješ okvirni broj bodova. Za Zagreb usporedba
                s objavljenim pragom; za druge gradove procjena šanse bez točnog praga u aplikaciji.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button asChild className="gradient-hero border-0 text-primary-foreground shadow-md">
                  <Link to="/kalkulator-doma">
                    Otvori kalkulator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/kalkulator">Kalkulator za upis</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border bg-background/80 backdrop-blur-sm p-5 space-y-3">
              <p className="text-sm font-semibold text-foreground">Što uključuje</p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Prosjek ocjena, prihod po članu kućanstva, godina studija</li>
                <li>Posebni uvjeti — označi što imaš (uz prijavu ide dokumentacija)</li>
                <li>Za Zagreb traka do praga; za ostale gradove procjena prema bodovima</li>
              </ul>
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
      <section className="container py-24 bg-muted/20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sve što trebaš na{" "}
              <span className="text-gradient">jednom mjestu</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Alati, informacije i zajednica koji te vode kroz najvažniju odluku.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Link key={feature.path} to={feature.path} className="block">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 0.08}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-16 text-center shadow-xl shadow-primary/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 drop-shadow-sm">
              Spreman za prvi korak?
            </h2>
            <p className="text-primary-foreground/90 text-lg max-w-lg mx-auto mb-8">
              Pridruži se tisućama maturanata koji su pronašli svoj put uz MojPut platformu.
            </p>
            <Button
              size="lg"
              className="bg-card text-foreground hover:bg-card/95 border-0 px-8 h-12 text-base font-semibold shadow-lg hover:scale-[1.02] transition-all"
              asChild
            >
              <Link to="/registracija">
                Kreiraj besplatni račun
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

    </Layout>
  );
};

export default Index;
