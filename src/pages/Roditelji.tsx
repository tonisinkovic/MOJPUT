import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Users, BookOpen, MessageSquare, Heart } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";

const resources = [
  {
    icon: <BookOpen className="w-6 h-6 text-primary-foreground" />,
    title: "Vodič za roditelje",
    description: "Kako podržati dijete u odabiru karijere bez pritiska.",
  },
  {
    icon: <Heart className="w-6 h-6 text-primary-foreground" />,
    title: "Mentalno zdravlje",
    description: "Prepoznajte stres i anksioznost kod tinejdžera tijekom mature.",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-primary-foreground" />,
    title: "Forum za roditelje",
    description: "Povežite se s drugim roditeljima i razmijenite iskustva.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary-foreground" />,
    title: "Zajednička procjena",
    description: "Alat za zajednički rad na odabiru karijere s djetetom.",
  },
];

const Roditelji = () => {
  return (
    <Layout>
      <section className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Roditeljski kutak</h1>
          <p className="text-muted-foreground text-lg">
            Resursi, alati i zajednica za roditelje koji žele podržati svoju djecu u odabiru karijere.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {resources.map((r, i) => (
            <FeatureCard key={r.title} icon={r.icon} title={r.title} description={r.description} delay={i * 0.1} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Roditelji;
