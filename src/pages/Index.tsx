import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import FeatureCard from "@/components/FeatureCard";
import {
  Map,
  Brain,
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
  TrendingUp,
  Award,
} from "lucide-react";

const features = [
  {
    icon: <Map className="w-6 h-6 text-primary-foreground" />,
    title: "Karta fakulteta",
    description: "Interaktivna karta s detaljnim profilima svih fakulteta u Hrvatskoj.",
    path: "/karta",
  },
  {
    icon: <Brain className="w-6 h-6 text-primary-foreground" />,
    title: "Kviz za odabir",
    description: "Otkrij koji fakultet i karijera odgovaraju tvojim interesima.",
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
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
              <span className="text-gradient">put</span>{" "}
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
              <Button size="lg" className="gradient-hero border-0 text-primary-foreground px-8 h-12 text-base" asChild>
                <Link to="/kviz">
                  Započni kviz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 h-12 text-base" asChild>
                <Link to="/karta">Istraži fakultete</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-primary">{stat.icon}</span>
                  <span className="text-2xl md:text-3xl font-extrabold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="text-center mb-14">
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
      <section className="container pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-16 text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Spreman za prvi korak?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-lg mx-auto mb-8">
              Pridruži se tisućama maturanata koji su pronašli svoj put uz MojPut platformu.
            </p>
            <Button
              size="lg"
              className="bg-card text-foreground hover:bg-card/90 border-0 px-8 h-12 text-base font-semibold"
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

      {/* AI Chatbot Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="gradient-hero border-0 text-primary-foreground rounded-full w-14 h-14 p-0 shadow-lg glow-primary hover:scale-110 transition-transform"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    </Layout>
  );
};

export default Index;
