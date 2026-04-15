import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Users } from "lucide-react";
import { teamMembers } from "@/data/team";

const Kontakt = () => {
  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 max-w-2xl mx-auto text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero shadow-card">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Kontakt</h1>
          <p className="text-lg text-muted-foreground">
            Imate pitanja, prijedloge ili želite suradnju? Javite nam se!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-2xl space-y-8"
        >
          <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-card md:p-8">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <MessageSquare className="h-5 w-5 text-primary" />
                Kontaktirajte nas
              </h2>
              <p className="mb-4 text-muted-foreground">
                Za sve upite o platformi MojPut, suradnju ili povratne informacije, možete nas kontaktirati putem e-pošte:
              </p>
              <a
                href="mailto:mojputhr@gmail.com"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-primary/20 bg-primary/5 px-4 py-2.5 font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm"
              >
                <Send className="h-4 w-4 shrink-0" />
                mojputhr@gmail.com
              </a>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-card md:p-8">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Platformu su osmislili</h2>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              Tim koji stoji iza sadržaja i razvoja — isti ljudi i isti prikaz kao na stranici O nama.
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
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Kontakt;
