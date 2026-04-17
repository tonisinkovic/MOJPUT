import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const PRIVACY_EMAIL = "mojputhr@gmail.com";

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

const Privatnost = () => {
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
              <Lock className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3 w-3" aria-hidden />
                Pravni dokument
              </span>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Politika <span className="text-gradient">privatnosti</span>
              </h1>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                Vaša privatnost nam je važna. Ova politika privatnosti objašnjava koje podatke prikupljamo, kako ih
                koristimo i kako ih štitimo prilikom korištenja platforme MojPut.
              </p>
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
          <SectionBlock number={1} title="Koje podatke prikupljamo">
            <p>Prilikom korištenja platforme možemo prikupljati sljedeće podatke:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>osnovne korisničke podatke (npr. e-mail adresa prilikom registracije)</li>
              <li>tehničke podatke (IP adresa, tip uređaja, preglednik)</li>
              <li>podatke o korištenju platforme (posjećene stranice, vrijeme provedeno na stranici)</li>
            </ul>
          </SectionBlock>

          <SectionBlock number={2} title="Kako koristimo vaše podatke">
            <p>Prikupljene podatke koristimo kako bismo:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>omogućili normalno funkcioniranje platforme</li>
              <li>poboljšali korisničko iskustvo</li>
              <li>personalizirali sadržaj (npr. preporuke fakulteta)</li>
              <li>analizirali korištenje platforme</li>
              <li>osigurali sigurnost i spriječili zlouporabe</li>
            </ul>
          </SectionBlock>

          <SectionBlock number={3} title="Korištenje AI tehnologije">
            <p>Platforma MojPut koristi AI alate za generiranje odgovora i preporuka.</p>
            <p className="font-semibold text-foreground">Važno:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>AI odgovori služe isključivo kao pomoć i informacija</li>
              <li>ne predstavljaju službene ili konačne odluke</li>
              <li>korisnici su odgovorni za vlastite odluke</li>
            </ul>
          </SectionBlock>

          <SectionBlock number={4} title="Zaštita podataka">
            <p>Poduzimamo odgovarajuće tehničke i organizacijske mjere kako bismo zaštitili vaše podatke od:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>neovlaštenog pristupa</li>
              <li>gubitka ili zlouporabe</li>
              <li>neovlaštenog mijenjanja</li>
            </ul>
          </SectionBlock>

          <SectionBlock number={5} title="Dijeljenje podataka">
            <p>
              Vaše osobne podatke ne prodajemo niti dijelimo s trećim stranama, osim u slučajevima kada je to:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>nužno za funkcioniranje platforme (npr. hosting, analitika)</li>
              <li>zakonski obvezno</li>
            </ul>
          </SectionBlock>

          <SectionBlock number={6} title="Kolačići (cookies)">
            <p>MojPut koristi kolačiće kako bi:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>omogućio rad stranice</li>
              <li>analizirao korištenje</li>
              <li>poboljšao korisničko iskustvo</li>
            </ul>
            <p>Korištenjem stranice pristajete na upotrebu kolačića.</p>
          </SectionBlock>

          <SectionBlock number={7} title="Čuvanje podataka">
            <p>
              Vaše podatke čuvamo samo onoliko dugo koliko je potrebno za svrhe za koje su prikupljeni ili koliko to
              zakon zahtijeva.
            </p>
          </SectionBlock>

          <SectionBlock number={8} title="Vaša prava">
            <p>Imate pravo:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>zatražiti pristup svojim podacima</li>
              <li>zatražiti ispravak ili brisanje podataka</li>
              <li>povući privolu za korištenje podataka</li>
            </ul>
            <p>Za sve zahtjeve možete nas kontaktirati putem e-pošte.</p>
          </SectionBlock>

          <SectionBlock number={9} title="Kontakt">
            <p>Za pitanja vezana uz privatnost možete nam se obratiti na:</p>
            <p>
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {PRIVACY_EMAIL}
              </a>
            </p>
          </SectionBlock>

          <SectionBlock number={10} title="Izmjene politike privatnosti">
            <p>
              Zadržavamo pravo izmjene ove politike privatnosti u bilo kojem trenutku. Sve promjene bit{" "}
              {"\u0107"}e pravovremeno objavljene na ovoj stranici.
            </p>
          </SectionBlock>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Privatnost;
