import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Copy, Mail, MessageSquare, Send, Users } from "lucide-react";
import { teamMembers } from "@/data/team";
import TeamMemberAvatar from "@/components/TeamMemberAvatar";
import { toast } from "sonner";
import { experiencePageClass, resolveExperienceMode } from "@/lib/experience";
import { useSearchParams } from "react-router-dom";
import { CARD, JBack, JuniorBlobs, PageHero, PrimaryButton, SecondaryButton } from "@/components/junior-kit";
import {
  PageHero as SeniorHero,
  PrimaryButton as SeniorPrimary,
  SBack,
  SCARD,
  SecondaryButton as SeniorSecondary,
  SeniorBlobs,
  STONE,
} from "@/components/senior-kit";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "mojputhr@gmail.com";

const Kontakt = () => {
  const [searchParams] = useSearchParams();
  const isJunior = resolveExperienceMode(searchParams) === "junior";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      toast.success("Email kopiran u međuspremnik.");
    } catch {
      toast.error("Kopiranje nije uspjelo.");
    }
  };

  return (
    <Layout>
      <section className={cn(experiencePageClass(isJunior), "relative mx-auto max-w-3xl px-3 py-12 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:px-4 md:py-16")}>
        {isJunior ? <JuniorBlobs /> : <SeniorBlobs />}
        {isJunior ? <JBack crumb="Kontakt" /> : <SBack crumb="Kontakt" />}
        {/* Hero */}
        {isJunior ? (
          <PageHero
            icon={Mail}
            tone="sky"
            badge="Javi nam se"
            title="Kontakt"
            lead="Imate pitanja, prijedloge ili želite suradnju? Javite nam se!"
          />
        ) : (
          <SeniorHero
            icon={Mail}
            tone="cyan"
            kicker="Informacije"
            badge="Javi nam se"
            title={
              <>
                <span className="text-[hsl(var(--sr-cyan))]">Kontakt</span>
              </>
            }
            lead="Imate pitanja, prijedloge ili želite suradnju? Javite nam se!"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mx-auto max-w-3xl space-y-6 sm:space-y-8"
        >
          {/* Email kartica */}
          <div className={cn("relative overflow-hidden p-5 sm:p-7 md:p-8", isJunior ? cn(CARD, "border-border/70") : SCARD)}>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", isJunior ? "bg-primary/10 text-primary ring-1 ring-primary/20" : cn("text-white", STONE.cyan.grad))}>
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight md:text-2xl">Kontaktirajte nas</h2>
              </div>
              <p className="mb-5 text-muted-foreground leading-relaxed">
                Za sve upite o platformi MojPut, suradnju ili povratne informacije, možete nas kontaktirati putem e-pošte:
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                {isJunior ? (
                  <>
                    <a href={`mailto:${CONTACT_EMAIL}`}>
                      <PrimaryButton type="button">
                        <Send className="h-4 w-4" aria-hidden />
                        {CONTACT_EMAIL}
                      </PrimaryButton>
                    </a>
                    <SecondaryButton type="button" onClick={copyEmail}>
                      <Copy className="h-4 w-4" aria-hidden />
                      Kopiraj
                    </SecondaryButton>
                  </>
                ) : (
                  <>
                    <a href={`mailto:${CONTACT_EMAIL}`}>
                      <SeniorPrimary type="button">
                        <Send className="h-4 w-4" aria-hidden />
                        {CONTACT_EMAIL}
                      </SeniorPrimary>
                    </a>
                    <SeniorSecondary type="button" onClick={copyEmail}>
                      <Copy className="h-4 w-4" aria-hidden />
                      Kopiraj
                    </SeniorSecondary>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tim */}
          <div className={cn("p-5 sm:p-7 md:p-8", isJunior ? cn(CARD, "border-border/70") : SCARD)}>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">Platformu su osmislili</h2>
            </div>
            <p className="ml-1 mb-5 text-sm text-muted-foreground">
              Tim koji stoji iza sadržaja i razvoja — isti ljudi i isti prikaz kao na stranici O nama.
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
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Kontakt;
