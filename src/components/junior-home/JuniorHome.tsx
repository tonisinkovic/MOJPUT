import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { JUNIOR_QUIZ_QUESTION_COUNT } from "@/lib/juniorHonesty";
import JuniorCalc from "./JuniorCalc";
import JuniorCalendar from "./JuniorCalendar";
import JuniorChat from "./JuniorChat";
import JuniorDemo from "./JuniorDemo";
import JuniorFamily from "./JuniorFamily";
import JuniorFinale from "./JuniorFinale";
import JuniorForum from "./JuniorForum";
import JuniorHero from "./JuniorHero";
import JuniorTools from "./JuniorTools";
import JuniorYear from "./JuniorYear";

type Experience = "junior" | "senior";

/** Nova Junior početna: hero s cestom, godina do upisa, demo kviza/karte, bodovi, rokovi, forum, chatbot, obitelj. */
export default function JuniorHome({
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
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

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
        className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-gradient-to-r from-[hsl(var(--jh-teal))] via-[hsl(var(--jh-sky))] to-[hsl(var(--jh-violet))]"
        style={{ scaleX: progress }}
        aria-hidden
      />

      <JuniorHero onReturn={onReturn} onSwitch={onSwitch} heroCtaRef={heroCtaRef} />
      <JuniorTools />
      <JuniorYear />
      <JuniorDemo />
      <JuniorCalc />
      <JuniorCalendar />
      <JuniorForum />
      <JuniorChat />
      <JuniorFamily />
      <JuniorFinale user={user} ctaEndRef={endRef} />

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
              to="/kviz-srednja"
              className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[hsl(174_66%_36%)] to-[hsl(174_60%_50%)] text-base font-extrabold text-white shadow-[0_18px_36px_-12px_hsl(174_66%_30%/0.8)]"
            >
              Započni kviz · {JUNIOR_QUIZ_QUESTION_COUNT} pitanja
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
