import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { motion } from "framer-motion";
import CareerQuizFlow from "@/components/career-quiz/CareerQuizFlow";
import { SeniorPage } from "@/components/senior-kit";

const Kviz = () => {
  return (
    <Layout>
      <PageSeo title="Kviz: koji fakultet upisati? – MojPut" description="Besplatan kviz interesa s preporukom područja studija, fakulteta u tvom gradu i poveznicom na kalkulator bodova." />
      <SeniorPage crumb="Kviz" className="min-h-[70vh] max-w-5xl">
        <motion.div
          layout
          className="relative"
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
        >
          <CareerQuizFlow showIntroHeading={false} showKvizPageHero />
        </motion.div>
      </SeniorPage>
    </Layout>
  );
};

export default Kviz;
