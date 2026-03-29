import Layout from "@/components/Layout";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import CareerQuizFlow, { type CareerQuizPhase } from "@/components/career-quiz/CareerQuizFlow";
import { useState } from "react";

const Kviz = () => {
  const [flowPhase, setFlowPhase] = useState<CareerQuizPhase>("intro");
  const showHero = flowPhase === "intro";

  return (
    <Layout>
      <section className="relative container min-h-[70vh] max-w-4xl px-3 pb-10 pt-6 sm:px-4 sm:pb-12 sm:pt-8 md:py-14">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 max-w-3xl rounded-full bg-primary/[0.06] blur-[80px] dark:bg-primary/12 sm:h-72 sm:blur-[100px]"
          aria-hidden
        />

        <AnimatePresence mode="wait">
          {showHero && (
            <motion.div
              key="kviz-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
              className="relative mx-auto mb-6 max-w-3xl text-center sm:mb-10"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card/95 to-muted/30 px-4 py-8 shadow-card ring-1 ring-black/5 backdrop-blur-md dark:from-card/85 dark:to-muted/20 dark:ring-white/10 sm:rounded-3xl sm:px-8 sm:py-10 md:px-10 md:py-12">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,hsl(var(--primary)/0.16),transparent)]"
                  aria-hidden
                />
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.88, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 22 }}
                    className="mx-auto mb-5 flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 sm:mb-6 sm:h-24 sm:w-24 sm:rounded-3xl"
                  >
                    <GraduationCap className="h-10 w-10 text-primary-foreground sm:h-14 sm:w-14" aria-hidden />
                  </motion.div>
                  <div className="mb-3 inline-flex max-w-[95vw] items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-medium leading-tight text-primary sm:text-xs">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>Kviz za maturante · upis na faks</span>
                  </div>
                  <h1 className="text-foreground mb-3 text-[1.65rem] font-bold leading-tight tracking-tight sm:mb-4 sm:text-4xl md:text-[2.5rem] md:leading-tight">
                    Koji je fakultet za mene?
                  </h1>
                  <p className="text-muted-foreground mx-auto mb-4 max-w-xl text-[0.95rem] leading-relaxed sm:text-lg">
                    Odgovori na pitanja o tipu studija i vještinama za fakultet.{" "}
                    <span className="font-medium text-foreground">Okvirno</span> nakon prve faze,{" "}
                    <span className="font-medium text-foreground">jasnije</span> nakon druge.
                  </p>
                  <div className="text-muted-foreground/90 mx-auto flex max-w-md flex-col items-center justify-center gap-2 text-xs leading-snug sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-0 sm:text-sm">
                    <span className="tabular-nums">47 + 47 pitanja</span>
                    <span className="hidden text-border sm:inline" aria-hidden>
                      ·
                    </span>
                    <span>RIASEC profil</span>
                    <span className="hidden text-border sm:inline" aria-hidden>
                      ·
                    </span>
                    <span className="text-center sm:text-left">Smjerovi i upis u HR</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="relative -mx-0.5 sm:mx-0"
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
        >
          <CareerQuizFlow showIntroHeading={false} onPhaseChange={setFlowPhase} />
        </motion.div>
      </section>
    </Layout>
  );
};

export default Kviz;
