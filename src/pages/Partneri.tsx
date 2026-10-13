import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { MATURABOT_LOGO_URL, MATURABOT_URL } from "@/components/matura/MaturaBotEmbedDialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, ExternalLink, Handshake, LineChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const aboutPoints = [
  {
    icon: Bot,
    title: "AI asistent",
    text: "MaturaBOT je asistent za pripremu državne mature. Pomaže dok rješavaš, umjesto da samo isporuči gotov odgovor.",
  },
  {
    icon: Sparkles,
    title: "Zadaci i vježba",
    text: "Priprema ide kroz zadatke: vježbaš, dobiješ pojašnjenje i vraćaš se na ono što još nije sjedilo.",
  },
  {
    icon: LineChart,
    title: "Napredak",
    text: "Vidiš gdje stojiš u pripremi, pa sljedeći korak nije nagađanje nego nastavak onoga što si već krenuo.",
  },
];

const Partneri = () => {
  return (
    <Layout>
      <PageSeo
        title="Partneri | MojPut"
        description="Partner MojPuta je MaturaBOT — AI asistent za pripremu državne mature na maturabot.hr."
      />
      <section className="container py-12 md:py-16">
        <div className="mx-auto max-w-5xl space-y-8 md:space-y-10">
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
              className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
                <Handshake className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
              </div>
              <div className="min-w-0 max-w-2xl">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  Suradnje
                </span>
                <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight md:text-5xl">
                  <span className="text-gradient">Partneri</span>
                </h1>
                <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  Alati s kojima dijelimo isti cilj: mirnija priprema i jasnija odluka pred državnu maturu.
                </p>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="overflow-hidden rounded-2xl border-2 border-[#2563EB]/25 bg-card shadow-card sm:rounded-3xl"
          >
            <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="relative flex flex-col justify-between gap-6 bg-gradient-to-br from-[#2563EB]/12 via-card to-card p-5 sm:p-7 md:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#2563EB]"
                />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563EB]">Partner</p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={MATURABOT_LOGO_URL}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-2xl bg-white object-cover shadow-sm ring-1 ring-black/10"
                    />
                    <div className="min-w-0">
                      <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-foreground md:text-3xl">
                        Matura<span className="text-[#2563EB]">BOT</span>
                      </h2>
                      <a
                        href={MATURABOT_URL}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-[#2563EB]"
                      >
                        maturabot.hr
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </div>
                  </div>
                  <p className="mt-5 max-w-sm text-pretty text-base leading-relaxed text-muted-foreground">
                    AI asistent za pripremu državne mature. Zadaci, pomoć dok rješavaš i pregled napretka.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]" asChild>
                    <a href={MATURABOT_URL} target="_blank" rel="noreferrer noopener">
                      Otvori maturabot.hr
                      <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/mature">
                      Otvori u MojPutu
                      <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-px bg-border/80 sm:grid-cols-1">
                {aboutPoints.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="bg-card p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-semibold tracking-tight text-foreground">{title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border-2 border-border bg-card p-5 shadow-card sm:rounded-3xl sm:p-7 md:p-8"
          >
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">O MaturaBOT-u</h2>
            <div className="mt-4 max-w-3xl space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
              <p>
                MaturaBOT je edukativna platforma za pripremu državne mature. Namijenjena je učenicima koji
                žele vježbati zadatke uz AI pomoć, a ne ostati sami s arhivom ispita. Projekt je javno
                pokrenut početkom 2026. Pokrenuo ga je Renato Dolić, student Fakulteta elektrotehnike i
                računarstva u Zagrebu.
              </p>
              <p>
                Na MojPutu je partner za pripremu. Kartica na početnoj otvara njihov sadržaj unutar platforme,
                a maturabot.hr ostaje njihova stranica — zadaci, pomoć i napredak na jednom mjestu.
              </p>
            </div>
          </motion.article>
        </div>
      </section>
    </Layout>
  );
};

export default Partneri;
