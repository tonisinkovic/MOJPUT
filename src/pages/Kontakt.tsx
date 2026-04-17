import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Copy, Mail, MessageSquare, Send, Sparkles, Users } from "lucide-react";
import { teamMembers } from "@/data/team";
import { toast } from "sonner";

const CONTACT_EMAIL = "mojputhr@gmail.com";

const Kontakt = () => {
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
      <section className="container py-12 md:py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto mb-10 max-w-3xl overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-5 shadow-card sm:rounded-3xl sm:p-7 md:p-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
              <Mail className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3 w-3" aria-hidden />
                Javi nam se
              </span>
              <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">
                <span className="text-gradient">Kontakt</span>
              </h1>
              <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                Imate pitanja, prijedloge ili želite suradnju? Javite nam se!
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mx-auto max-w-3xl space-y-6 sm:space-y-8"
        >
          {/* Email kartica */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-5 shadow-card sm:rounded-3xl sm:p-7 md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight md:text-2xl">Kontaktirajte nas</h2>
              </div>
              <p className="mb-5 text-muted-foreground leading-relaxed">
                Za sve upite o platformi MojPut, suradnju ili povratne informacije, možete nas kontaktirati putem e-pošte:
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-primary/25 bg-primary/10 px-4 py-2.5 font-semibold text-primary shadow-sm transition-all hover:-translate-y-px hover:border-primary/40 hover:bg-primary/15 hover:shadow"
                >
                  <Send className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  {CONTACT_EMAIL}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-border bg-background/60 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:-translate-y-px hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  <Copy className="h-4 w-4 shrink-0" aria-hidden />
                  Kopiraj
                </button>
              </div>
            </div>
          </div>

          {/* Tim */}
          <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-card sm:rounded-3xl sm:p-7 md:p-8">
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
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Kontakt;
