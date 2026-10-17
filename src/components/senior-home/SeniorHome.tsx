import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { QUIZ_QUESTIONS_PER_BLOCK } from "@/lib/careerQuizEngine";
import SeniorBento from "./SeniorBento";
import SeniorCalc from "./SeniorCalc";
import SeniorDorms from "./SeniorDorms";
import SeniorFinale from "./SeniorFinale";
import SeniorForum from "./SeniorForum";
import SeniorHero from "./SeniorHero";
import SeniorQuiz from "./SeniorQuiz";
import SeniorTicker from "./SeniorTicker";
import SeniorTimeline from "./SeniorTimeline";

// Karta i chat koriste cijeli popis ustanova, pa se učitavaju tek kad zatrebaju.
const SeniorMap = lazy(() => import("./SeniorMap"));
const SeniorChat = lazy(() => import("./SeniorChat"));

type Experience = "junior" | "senior";

function Placeholder({ h }: { h: string }) {
  return <div className={h} aria-hidden />;
}

/** Nova Senior početna: tamni hero s orbitom, bento alata, rokovi, profil, karta, bodovi, domovi, chat, forum. */
export default function SeniorHome({
  user,
  onReturn,
  onSwitch,
}: {
  user: AuthUser | null;
  onReturn: () => void;
  onSwitch: (e: Experience) => void;
}) {
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLElement | null>(null);
  const [heroPassed, setHeroPassed] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const heroEl = heroCtaRef.current;
    const endEl = endRef.current;
    if (!heroEl || !endEl) return;
    const heroObs = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    const endObs = new IntersectionObserver(([entry]) => setEndReached(entry.isIntersecting), { threshold: 0.1 });
    heroObs.observe(heroEl);
    endObs.observe(endEl);
    return () => {
      heroObs.disconnect();
      endObs.disconnect();
    };
  }, []);

  const showDock = heroPassed && !endReached && !user;

  return (
    <div className="overflow-x-clip">
      <motion.div
        className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-gradient-to-r from-[hsl(var(--sr-indigo))] via-[hsl(var(--sr-cyan))] to-[hsl(var(--sr-gold))]"
        style={{ scaleX: scrollYProgress }}
        aria-hidden
      />

      <SeniorHero onReturn={onReturn} onSwitch={onSwitch} heroCtaRef={heroCtaRef} />
      <SeniorTicker />
      <SeniorBento />
      <SeniorTimeline />
      <SeniorQuiz />
      <Suspense fallback={<Placeholder h="min-h-[48rem]" />}>
        <SeniorMap />
      </Suspense>
      <SeniorCalc />
      <SeniorDorms />
      <Suspense fallback={<Placeholder h="min-h-[40rem]" />}>
        <SeniorChat />
      </Suspense>
      <SeniorForum />
      <SeniorFinale user={user} ctaEndRef={endRef} />

      <AnimatePresence>
        {showDock ? (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-3 z-40 sm:hidden"
            style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            <Link
              to="/kviz"
              className="flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] text-base font-extrabold text-[hsl(var(--sr-night))] shadow-[0_18px_36px_-12px_hsl(var(--sr-gold)/0.8)]"
            >
              Otkrij svoj smjer · 2 × {QUIZ_QUESTIONS_PER_BLOCK}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
