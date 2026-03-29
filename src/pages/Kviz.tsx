import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import CareerQuizFlow from "@/components/career-quiz/CareerQuizFlow";

const Kviz = () => {
  return (
    <Layout>
      <section className="relative container min-h-[70vh] max-w-4xl px-3 pb-10 pt-6 sm:px-4 sm:pb-12 sm:pt-8 md:py-14">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 max-w-3xl rounded-full bg-primary/[0.06] blur-[80px] dark:bg-primary/12 sm:h-72 sm:blur-[100px]"
          aria-hidden
        />

        <motion.div
          layout
          className="relative -mx-0.5 sm:mx-0"
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
        >
          <CareerQuizFlow showIntroHeading={false} showKvizPageHero />
        </motion.div>
      </section>
    </Layout>
  );
};

export default Kviz;
