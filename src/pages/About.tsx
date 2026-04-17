import { motion } from "framer-motion";
import { Compass, Heart, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import Layout from "@/components/Layout";
import { teamMembers } from "@/data/team";

const About = () => {
  return (
    <Layout>
      <section className="container py-12 md:py-16 space-y-8 md:space-y-10">
        {/* Hero */}
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-5 shadow-card sm:rounded-3xl sm:p-7 md:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/15 blur-3xl sm:h-64 sm:w-64"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl sm:h-56 sm:w-56"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
              <Compass className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
            </div>
            <div className="min-w-0 max-w-3xl flex-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3 w-3" aria-hidden />
                Naša priča
              </span>
              <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight md:text-5xl">
                O <span className="text-gradient">nama</span>
              </h1>
              <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                MojPut je nastao kako bismo maturantima uklonili stres i nesigurnost pri odabiru fakulteta.
                Gradimo jedno jasno digitalno mjesto gdje mladi dobivaju alate, informacije i smjernice za
                donošenje odluka koje oblikuju njihovu budućnost.
              </p>
            </div>
          </div>
        </motion.article>

        {/* Što radimo */}
        <article className="rounded-2xl border-2 border-border bg-card p-5 shadow-card sm:p-7 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Heart className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Što radimo</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Target,
                text: "Pretvaramo složene informacije o fakultetima u jednostavne i korisne uvide.",
              },
              {
                icon: Users,
                text: "Pomažemo učenicima i roditeljima da zajedno planiraju sljedeći obrazovni korak.",
              },
              {
                icon: ShieldCheck,
                text: "Gradimo pouzdanu platformu koja spaja povjerenje, jasnoću i moderan digitalni pristup.",
              },
            ].map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border-2 border-border bg-background/50 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Tim */}
        <section className="rounded-2xl border-2 border-border bg-card p-5 shadow-card sm:rounded-3xl sm:p-7 md:p-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Tim</h2>
          </div>
          <p className="mt-2 ml-1 max-w-2xl text-muted-foreground">
            Mali, fokusiran tim koji spaja dizajn, razvoj i edukacijski kontekst u jednu platformu.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="group relative overflow-hidden rounded-2xl border-2 border-border bg-background/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-16 w-16 rounded-xl border-2 border-border object-cover shadow-sm"
                />
                <h3 className="mt-4 text-lg font-semibold leading-snug">{member.name}</h3>
                <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {member.role}
                </p>
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
