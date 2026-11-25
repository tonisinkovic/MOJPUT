import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { AdventCountdown } from "./AdventCountdown";
import {
  adventStaggerContainer,
  adventStaggerItem,
} from "@/lib/adventMotion";

type AdventLandingHeroProps = {
  loggedIn: boolean;
  username?: string;
  playHref?: string;
};

export function AdventLandingHero({ loggedIn, username, playHref }: AdventLandingHeroProps) {
  return (
    <section className="relative text-center">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-1">
        <Link
          to="/"
          className="mb-5 inline-flex min-h-11 items-center justify-center gap-1.5 self-center text-sm font-extrabold advent-text-muted transition hover:text-[hsl(var(--advent-ivory))]"
        >
          <ArrowLeft className="h-4 w-4" />
          Početna
        </Link>

        <motion.div
          variants={adventStaggerContainer}
          initial="hidden"
          animate="visible"
          className="relative flex w-full flex-col items-center"
        >
          <motion.p
            variants={adventStaggerItem}
            className="advent-heading text-sm uppercase tracking-[0.12em] advent-text-gold"
          >
            🎄 MojPut · Adventska kviz liga 🎁
          </motion.p>

          <motion.h1
            variants={adventStaggerItem}
            className="advent-heading mx-auto mt-2 max-w-2xl text-4xl tracking-tight advent-text-ivory sm:text-5xl lg:text-6xl lg:leading-[1.08]"
          >
            20 dana{" "}
            <span className="advent-text-gold">znanja</span>{" "}
            i izazova
          </motion.h1>

          <motion.p
            variants={adventStaggerItem}
            className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-relaxed advent-text-muted sm:text-base"
          >
            Svaki kviz dan 10 pitanja o školovanju, studijima i karijeri — skupljaj bodove, penji se na ljestvici i
            otkrivaj MojPut na zabavan način.
          </motion.p>

          {loggedIn && username ? (
            <motion.p
              variants={adventStaggerItem}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full advent-glass-gold px-3 py-1 text-xs font-bold text-[hsl(var(--advent-gold))]"
            >
              <Sparkles className="h-3.5 w-3.5 animate-advent-twinkle" aria-hidden />
              Pozdrav, {username} — spreman/na si za današnji dan?
            </motion.p>
          ) : null}

          <motion.div variants={adventStaggerItem} className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={playHref || "#advent-cta"}
            className="advent-btn-gold advent-shimmer inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-extrabold shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--advent-gold)/0.5)]"
          >
            <Sparkles className="h-4 w-4 animate-advent-sparkle" aria-hidden />
            {loggedIn ? "Sudjeluj danas" : "Sudjeluj u ligi"}
          </a>
          <a
            href="#advent-leaderboard"
            className="advent-btn-ghost inline-flex min-h-12 items-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--advent-gold)/0.5)]"
          >
            <Trophy className="h-4 w-4 text-[hsl(var(--advent-gold))]" />
            Ljestvica
          </a>
        </motion.div>

          <motion.div variants={adventStaggerItem} className="mt-8 w-full max-w-2xl">
            <AdventCountdown />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
