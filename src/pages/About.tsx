import { Compass, Heart, ShieldCheck, Target, Users } from "lucide-react";
import Layout from "@/components/Layout";
import { teamMembers } from "@/data/team";
import TeamMemberAvatar from "@/components/TeamMemberAvatar";
import { experiencePageClass, resolveExperienceMode } from "@/lib/experience";
import { useSearchParams } from "react-router-dom";
import { CARD, JBack, JuniorBlobs, PageHero } from "@/components/junior-kit";
import { PageHero as SeniorHero, SBack, SCARD, SeniorBlobs } from "@/components/senior-kit";
import { cn } from "@/lib/utils";

const About = () => {
  const [searchParams] = useSearchParams();
  const isJunior = resolveExperienceMode(searchParams) === "junior";

  return (
    <Layout>
      <section className={cn(experiencePageClass(isJunior), "relative mx-auto max-w-6xl space-y-8 px-3 py-12 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:px-4 md:space-y-10 md:py-16")}>
        {isJunior ? <JuniorBlobs /> : <SeniorBlobs />}
        {isJunior ? <JBack crumb="O nama" /> : <SBack crumb="O nama" />}
        {/* Hero */}
        {isJunior ? (
          <PageHero
            icon={Compass}
            tone="teal"
            badge="Naša priča"
            title={
              <>
                O nama
              </>
            }
            lead="MojPut je nastao kako bismo maturantima uklonili stres i nesigurnost pri odabiru fakulteta. Gradimo jedno jasno digitalno mjesto gdje mladi dobivaju alate, informacije i smjernice za donošenje odluka koje oblikuju njihovu budućnost."
          />
        ) : (
          <SeniorHero
            icon={Compass}
            tone="indigo"
            kicker="Informacije"
            badge="Naša priča"
            title={
              <>
                O <span className="text-[hsl(var(--sr-indigo))]">nama</span>
              </>
            }
            lead="MojPut je nastao kako bismo maturantima uklonili stres i nesigurnost pri odabiru fakulteta. Gradimo jedno jasno digitalno mjesto gdje mladi dobivaju alate, informacije i smjernice za donošenje odluka koje oblikuju njihovu budućnost."
          />
        )}

        {/* Što radimo */}
        <article className={cn("p-5 sm:p-7 md:p-8", isJunior ? cn(CARD, "border-border/70") : SCARD)}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Heart className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Što radimo</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
        <section className={cn("p-5 sm:p-7 md:p-8", isJunior ? cn(CARD, "border-border/70") : SCARD)}>
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
                <TeamMemberAvatar member={member} />
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
