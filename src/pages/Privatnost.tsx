import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const PRIVACY_EMAIL = "mojputhr@gmail.com";

const Privatnost = () => {
  return (
    <Layout>
      <section className="container mx-auto max-w-3xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero">
            <Lock className="h-8 w-8 text-primary-foreground" strokeWidth={2} aria-hidden />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Politika privatnosti</h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Vaša privatnost nam je važna. Ova politika privatnosti objašnjava koje podatke prikupljamo, kako ih
            koristimo i kako ih štitimo prilikom korištenja platforme MojPut.
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground"
        >
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Koje podatke prikupljamo</h2>
            <p>Prilikom korištenja platforme možemo prikupljati sljedeće podatke:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>osnovne korisničke podatke (npr. e-mail adresa prilikom registracije)</li>
              <li>tehničke podatke (IP adresa, tip uređaja, preglednik)</li>
              <li>podatke o korištenju platforme (posjećene stranice, vrijeme provedeno na stranici)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Kako koristimo vaše podatke</h2>
            <p>Prikupljene podatke koristimo kako bismo:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>omogućili normalno funkcioniranje platforme</li>
              <li>poboljšali korisničko iskustvo</li>
              <li>personalizirali sadržaj (npr. preporuke fakulteta)</li>
              <li>analizirali korištenje platforme</li>
              <li>osigurali sigurnost i spriječili zlouporabe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Korištenje AI tehnologije</h2>
            <p>Platforma MojPut koristi AI alate za generiranje odgovora i preporuka.</p>
            <p className="font-medium text-foreground">Važno:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>AI odgovori služe isključivo kao pomoć i informacija</li>
              <li>ne predstavljaju službene ili konačne odluke</li>
              <li>korisnici su odgovorni za vlastite odluke</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Zaštita podataka</h2>
            <p>
              Poduzimamo odgovarajuće tehničke i organizacijske mjere kako bismo zaštitili vaše podatke od:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>neovlaštenog pristupa</li>
              <li>gubitka ili zlouporabe</li>
              <li>neovlaštenog mijenjanja</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Dijeljenje podataka</h2>
            <p>
              Vaše osobne podatke ne prodajemo niti dijelimo s trećim stranama, osim u slučajevima kada je to:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>nužno za funkcioniranje platforme (npr. hosting, analitika)</li>
              <li>zakonski obvezno</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Kolačići (cookies)</h2>
            <p>MojPut koristi kolačiće kako bi:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>omogućio rad stranice</li>
              <li>analizirao korištenje</li>
              <li>poboljšao korisničko iskustvo</li>
            </ul>
            <p>Korištenjem stranice pristajete na upotrebu kolačića.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Čuvanje podataka</h2>
            <p>
              Vaše podatke čuvamo samo onoliko dugo koliko je potrebno za svrhe za koje su prikupljeni ili koliko to
              zakon zahtijeva.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Vaša prava</h2>
            <p>Imate pravo:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>zatražiti pristup svojim podacima</li>
              <li>zatražiti ispravak ili brisanje podataka</li>
              <li>povući privolu za korištenje podataka</li>
            </ul>
            <p>Za sve zahtjeve možete nas kontaktirati putem e-pošte.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Kontakt</h2>
            <p>Za pitanja vezana uz privatnost možete nam se obratiti na:</p>
            <p>
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                {PRIVACY_EMAIL}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Izmjene politike privatnosti</h2>
            <p>
              Zadržavamo pravo izmjene ove politike privatnosti u bilo kojem trenutku. Sve promjene bit{" "}
              {"\u0107"}e pravovremeno objavljene na ovoj stranici.
            </p>
          </section>
        </motion.article>
      </section>
    </Layout>
  );
};

export default Privatnost;
