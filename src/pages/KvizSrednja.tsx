import Layout from "@/components/Layout";
import JuniorQuizFlow from "@/components/junior-quiz/JuniorQuizFlow";

const KvizSrednja = () => {
  return (
    <Layout>
      <section className="relative mx-auto min-h-[70vh] max-w-5xl px-3 pb-10 pt-6 sm:px-4 sm:pb-12 sm:pt-8 md:py-14 md:pb-16 [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 rounded-full bg-primary/[0.06] blur-[80px] dark:bg-primary/12 sm:h-80 sm:blur-[110px]"
        />
        <JuniorQuizFlow />
      </section>
    </Layout>
  );
};

export default KvizSrednja;
