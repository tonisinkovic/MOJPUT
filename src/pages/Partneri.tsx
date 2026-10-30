import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { MATURABOT_LOGO_URL, MATURABOT_URL } from "@/components/matura/MaturaBotEmbedDialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, Bot, ExternalLink, Handshake, LineChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero, SBack, SCARD, SeniorBlobs } from "@/components/senior-kit";

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
      <section className="sr-page relative mx-auto max-w-5xl space-y-8 px-3 py-12 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:px-4 md:space-y-10 md:py-16">
        <SeniorBlobs />
        <SBack crumb="Partneri" />
        <div className="space-y-8 md:space-y-10">
          <PageHero
            icon={Handshake}
            tone="gold"
            kicker="Partneri"
            badge="Suradnje"
            title={
              <>
                <span className="text-[hsl(var(--sr-gold))]">Partneri</span>
              </>
            }
            lead="Alati s kojima dijelimo isti cilj: mirnija priprema i jasnija odluka pred državnu maturu."
          />

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="overflow-hidden rounded-2xl border border-[#2563EB]/25 bg-card sm:rounded-3xl"
          >
            <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="relative flex flex-col justify-between gap-6 bg-gradient-to-br from-[#2563EB]/12 via-card to-card p-5 sm:p-7 md:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#2563EB]"
                />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2563EB] dark:text-[#7DB0FF]">Partner</p>
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
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--sr-indigo)/0.12)] text-[hsl(var(--sr-indigo-t))]">
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
            className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-[var(--sr-page-shadow)] sm:p-7 md:p-8"
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
