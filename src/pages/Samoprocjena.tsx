import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const traits = [
  { label: "Analitičnost", value: 78, color: "bg-primary" },
  { label: "Kreativnost", value: 65, color: "bg-accent" },
  { label: "Komunikacija", value: 82, color: "bg-badge-info" },
  { label: "Organizacija", value: 70, color: "bg-badge-warning" },
  { label: "Empatija", value: 88, color: "bg-badge-success" },
];

const Samoprocjena = () => {
  return (
    <Layout>
      <section className="container py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Samoprocjena</h1>
          <p className="text-muted-foreground text-lg">Upoznaj svoje interese, vrijednosti i sposobnosti</p>
        </motion.div>

        {/* Demo result view */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-card shadow-card border mb-8"
        >
          <h3 className="font-semibold mb-6">Tvoj profil osobnosti</h3>
          <div className="space-y-5">
            {traits.map((trait) => (
              <div key={trait.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium">{trait.label}</span>
                  <span className="text-sm text-muted-foreground">{trait.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${trait.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full rounded-full ${trait.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-4">Ovo je primjer rezultata. Pokreni alat za samoprocjenu za personalizirane rezultate.</p>
          <Button size="lg" className="gradient-hero border-0 text-primary-foreground">
            Započni samoprocjenu <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Samoprocjena;
