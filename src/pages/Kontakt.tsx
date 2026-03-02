import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send } from "lucide-react";

const Kontakt = () => {
  return (
    <Layout>
      <section className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Kontakt</h1>
          <p className="text-muted-foreground text-lg">
            Imate pitanja, prijedloge ili želite suradnju? Javite nam se!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Kontaktirajte nas
            </h2>
            <p className="text-muted-foreground mb-4">
              Za sve upite o platformi MojPut, suradnju ili povratne informacije,
              možete nas kontaktirati putem e-pošte:
            </p>
            <a
              href="mailto:moj-put@gmail.com"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" />
              moj-put@gmail.com
            </a>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Platformu su osmislili</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">Toni Šinković</span> – autor i dizajner
              </li>
              <li>
                <span className="font-semibold text-foreground">Ivano Perišić</span> – developer
              </li>
              <li>
                <span className="font-semibold text-foreground">Josip Šinković</span> – developer i UX dizajn
              </li>
            </ul>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Kontakt;
