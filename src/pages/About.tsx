import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Target, Users } from "lucide-react";
import Layout from "@/components/Layout";
import { teamMembers } from "@/data/team";

const About = () => {
  return (
    <Layout>
      <section className="container py-12 md:py-16 space-y-8 md:space-y-10">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-10 shadow-card"
        >
          <div className="absolute -top-24 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-28 -left-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              Naša priča
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4">O nama</h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              MojPut je nastao kako bismo maturantima uklonili stres i nesigurnost pri odabiru fakulteta.
              Gradimo jedno jasno digitalno mjesto gdje mladi dobivaju alate, informacije i smjernice za
              donošenje odluka koje oblikuju njihovu budućnost.
            </p>
          </div>
        </motion.article>

        <article className="rounded-2xl border bg-card p-6 md:p-8 shadow-card">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Što radimo</h2>
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <div className="rounded-xl border p-4 bg-background/50">
              <Target className="w-5 h-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Pretvaramo složene informacije o fakultetima u jednostavne i korisne uvide.
              </p>
            </div>
            <div className="rounded-xl border p-4 bg-background/50">
              <Users className="w-5 h-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Pomažemo učenicima i roditeljima da zajedno planiraju sljedeći obrazovni korak.
              </p>
            </div>
            <div className="rounded-xl border p-4 bg-background/50">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Gradimo pouzdanu platformu koja spaja povjerenje, jasnoću i moderan digitalni pristup.
              </p>
            </div>
          </div>
        </article>

        <section className="rounded-3xl border bg-card p-6 shadow-card md:p-8">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Tim</h2>
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Mali, fokusiran tim koji spaja dizajn, razvoj i edukacijski kontekst u jednu platformu.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border bg-background/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-16 w-16 rounded-xl border object-cover"
                />
                <h3 className="mt-4 text-lg font-semibold leading-snug">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default About;
