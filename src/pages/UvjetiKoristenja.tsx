import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero, SBack, SCARD, SeniorBlobs } from "@/components/senior-kit";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionBlockProps = {
  number: number;
  title: string;
  children: ReactNode;
};

const SectionBlock = ({ number, title, children }: SectionBlockProps) => (
  <section className={cn(SCARD, "group p-5 transition-transform duration-300 hover:-translate-y-0.5 md:p-6")}>
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
      <section className="sr-page relative mx-auto max-w-3xl px-3 py-10 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:px-4 md:py-14">
        <SeniorBlobs />
        <SBack crumb="Uvjeti korištenja" />
        <PageHero
          icon={FileText}
          tone="cyan"
          kicker="Informacije"
          badge="Pravni dokument"
          title={
            <>
              Uvjeti <span className="text-[hsl(var(--sr-cyan))]">korištenja</span> web stranice
            </>
          }
        />
        {/* Sadržaj */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mx-auto w-full max-w-3xl space-y-6 sm:space-y-8"
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
