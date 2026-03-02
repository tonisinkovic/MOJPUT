import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const UvjetiKoristenja = () => {
  return (
    <Layout>
      <section className="container py-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Uvjeti korištenja web stranice</h1>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground"
        >
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Opće odredbe</h2>
            <p>
              Dobrodošli na našu web stranicu. Pristupanjem i korištenjem ove web stranice
              prihvaćate ove Uvjete korištenja u cijelosti. Ako se ne slažete s bilo kojim
              dijelom ovih uvjeta, molimo vas da ne koristite ovu web stranicu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Korištenje sadržaja</h2>
            <p>
              Sav sadržaj objavljen na ovoj web stranici (tekstovi, fotografije, grafike,
              logotipi, dokumenti i drugi materijali) zaštićen je autorskim pravima i drugim
              pravima intelektualnog vlasništva.
            </p>
            <p className="font-medium text-foreground">Nije dopušteno:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Kopirati, distribuirati ili objavljivati sadržaj bez prethodnog odobrenja vlasnika</li>
              <li>Koristiti sadržaj u komercijalne svrhe bez pisane suglasnosti</li>
              <li>Mijenjati, uređivati ili zloupotrebljavati objavljene materijale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Odgovornost korisnika</h2>
            <p className="font-medium text-foreground">Korisnik se obvezuje da:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Neće koristiti web stranicu u nezakonite svrhe</li>
              <li>Neće unositi netočne, lažne ili obmanjujuće podatke</li>
              <li>Neće pokušavati narušiti sigurnost ili funkcionalnost web stranice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Ograničenje odgovornosti</h2>
            <p>
              Vlasnik web stranice ne odgovara za eventualne pogreške u sadržaju niti za
              štetu nastalu korištenjem informacija s ove stranice. Sadržaj se pruža „kakav
              jest“ bez jamstva potpune točnosti ili dostupnosti u bilo kojem trenutku.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Vanjske poveznice</h2>
            <p>
              Web stranica može sadržavati poveznice na druge web stranice. Ne preuzimamo
              odgovornost za sadržaj ili politiku privatnosti tih stranica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Zaštita privatnosti</h2>
            <p>
              Korištenje osobnih podataka regulirano je našom Politikom privatnosti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Izmjene uvjeta</h2>
            <p>
              Zadržavamo pravo izmjene ovih Uvjeta korištenja u bilo kojem trenutku. Izmjene
              stupaju na snagu objavom na ovoj web stranici.
            </p>
          </section>
        </motion.article>
      </section>
    </Layout>
  );
};

export default UvjetiKoristenja;
