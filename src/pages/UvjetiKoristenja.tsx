import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type SectionBlockProps = {
  number: number;
  title: string;
  children: ReactNode;
};

const SectionBlock = ({ number, title, children }: SectionBlockProps) => (
  <section className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-card md:p-6">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/70 via-primary/30 to-transparent opacity-60 transition-opacity group-hover:opacity-100"
    />
    <div className="flex items-start gap-3 sm:gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-hero text-sm font-extrabold text-primary-foreground shadow-sm"
        aria-hidden
      >
        {number}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-bold text-foreground md:text-xl">{title}</h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          {children}
        </div>
      </div>
    </div>
  </section>
);

const UvjetiKoristenja = () => {
  return (
    <Layout>
      <section className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-5 shadow-card sm:rounded-3xl sm:p-7 md:p-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-44 sm:w-44"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3 w-3" aria-hidden />
                Pravni dokument
              </span>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Uvjeti <span className="text-gradient">korištenja</span> web stranice
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Sadržaj */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-4 sm:space-y-5"
        >
          <SectionBlock number={1} title="Opće odredbe">
            <p>
              Dobrodošli na našu web stranicu. Pristupanjem i korištenjem ove web stranice
              prihvaćate ove Uvjete korištenja u cijelosti. Ako se ne slažete s bilo kojim
              dijelom ovih uvjeta, molimo vas da ne koristite ovu web stranicu.
            </p>
          </SectionBlock>

          <SectionBlock number={2} title="Korištenje sadržaja">
            <p>
              Sav sadržaj objavljen na ovoj web stranici (tekstovi, fotografije, grafike,
              logotipi, dokumenti i drugi materijali) zaštićen je autorskim pravima i drugim
              pravima intelektualnog vlasništva.
            </p>
            <p className="font-semibold text-foreground">Nije dopušteno:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Kopirati, distribuirati ili objavljivati sadržaj bez prethodnog odobrenja vlasnika</li>
              <li>Koristiti sadržaj u komercijalne svrhe bez pisane suglasnosti</li>
              <li>Mijenjati, uređivati ili zloupotrebljavati objavljene materijale</li>
            </ul>
          </SectionBlock>

          <SectionBlock number={3} title="Odgovornost korisnika">
            <p className="font-semibold text-foreground">Korisnik se obvezuje da:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Neće koristiti web stranicu u nezakonite svrhe</li>
              <li>Neće unositi netočne, lažne ili obmanjujuće podatke</li>
              <li>Neće pokušavati narušiti sigurnost ili funkcionalnost web stranice</li>
            </ul>
          </SectionBlock>

          <SectionBlock number={4} title="Ograničenje odgovornosti">
            <p>
              Vlasnik web stranice ne odgovara za eventualne pogreške u sadržaju niti za
              štetu nastalu korištenjem informacija s ove stranice. Sadržaj se pruža „kakav
              jest" bez jamstva potpune točnosti ili dostupnosti u bilo kojem trenutku.
            </p>
          </SectionBlock>

          <SectionBlock number={5} title="Vanjske poveznice">
            <p>
              Web stranica može sadržavati poveznice na druge web stranice. Ne preuzimamo
              odgovornost za sadržaj ili politiku privatnosti tih stranica.
            </p>
          </SectionBlock>

          <SectionBlock number={6} title="Zaštita privatnosti">
            <p>
              Korištenje osobnih podataka regulirano je našom{" "}
              <Link
                to="/privatnost"
                className="inline-flex items-center gap-1 rounded-md px-1 font-semibold text-primary underline-offset-4 transition-colors hover:bg-primary/10 hover:underline"
              >
                Politikom privatnosti
              </Link>
              .
            </p>
          </SectionBlock>

          <SectionBlock number={7} title="Izmjene uvjeta">
            <p>
              Zadržavamo pravo izmjene ovih Uvjeta korištenja u bilo kojem trenutku. Izmjene
              stupaju na snagu objavom na ovoj web stranici.
            </p>
          </SectionBlock>
        </motion.div>
      </section>
    </Layout>
  );
};

export default UvjetiKoristenja;
