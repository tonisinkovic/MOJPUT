import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MojPutExperience = "junior" | "senior";

type MojPutEntryIntroProps = {
  onEnterJunior: () => void;
  onEnterSenior: () => void;
};

const MojPutEntryIntro = ({ onEnterJunior, onEnterSenior }: MojPutEntryIntroProps) => {
  const [leaving, setLeaving] = useState<MojPutExperience | null>(null);

  const enter = (experience: MojPutExperience) => {
    if (leaving) return;
    setLeaving(experience);
    window.setTimeout(() => {
      if (experience === "junior") onEnterJunior();
      else onEnterSenior();
    }, 280);
  };

  const cards = [
    {
      experience: "junior" as const,
      badge: "MojPut Junior",
      title: "Pronađi svoju",
      highlight: "srednju školu",
      who: "Za učenike osnovnih škola",
      cta: "Istraži srednje škole",
      bar: "bg-amber-400",
      badgeClass: "text-amber-600",
      highlightClass: "text-amber-600",
      pill: "bg-amber-50 text-amber-800",
      arrow: "bg-amber-500",
    },
    {
      experience: "senior" as const,
      badge: "MojPut Senior",
      title: "Pronađi svoj",
      highlight: "fakultet",
      who: "Za srednjoškolce i maturante",
      cta: "Istraži fakultete",
      bar: "bg-teal-500",
      badgeClass: "text-teal-700",
      highlightClass: "text-teal-600",
      pill: "bg-teal-50 text-teal-800",
      arrow: "bg-teal-600",
    },
  ];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#fbfcfe,#f4f7fb)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-28 top-[18%] h-[22rem] w-[22rem] rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute -right-28 top-[16%] h-[22rem] w-[22rem] rounded-full bg-teal-200/45 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[68rem] flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="mb-7 flex h-[4.35rem] w-[4.35rem] items-center justify-center rounded-[1.35rem] bg-white shadow-[0_16px_40px_-24px_hsl(215_30%_18%/0.35)] sm:mb-8 sm:h-[5rem] sm:w-[5rem] sm:rounded-[1.5rem]">
          <img
            src={`${import.meta.env.BASE_URL}mojput-logo.png`}
            alt="MojPut"
            className="h-[76%] w-[76%] object-contain"
          />
        </div>

        <p className="mb-8 text-center text-[15px] font-medium text-slate-500 sm:mb-10 sm:text-base">
          Srednja škola ili fakultet.
        </p>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {cards.map((card) => (
            <button
              key={card.experience}
              type="button"
              disabled={!!leaving}
              aria-label={`${card.badge}: ${card.title} ${card.highlight}`}
              onClick={() => enter(card.experience)}
              className="group relative flex min-h-[17.5rem] flex-col overflow-hidden rounded-[1.75rem] border border-white bg-white p-6 text-left shadow-[0_22px_55px_-32px_hsl(215_25%_20%/0.28)] outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-slate-200 disabled:cursor-wait sm:min-h-[19.5rem] sm:rounded-[2rem] sm:p-8"
            >
              <span className={cn("absolute inset-x-8 top-0 h-[3px] rounded-b-full", card.bar)} aria-hidden />
              <span className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", card.badgeClass)}>
                {card.badge}
              </span>
              <span className="mt-4 block text-[1.85rem] font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-[2.35rem]">
                {card.title}
                <br />
                <span className={card.highlightClass}>{card.highlight}</span>
              </span>
              <span className={cn("mt-5 inline-flex w-fit rounded-full px-3 py-1 text-[12px] font-medium", card.pill)}>
                {card.who}
              </span>
              <span className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="text-[15px] font-semibold text-slate-900">{card.cta}</span>
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-full text-white", card.arrow)}>
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </span>
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!!leaving}
          onClick={() => enter("senior")}
          className="mt-8 text-sm font-semibold text-slate-400 transition-colors hover:text-slate-700 disabled:cursor-wait"
        >
          Preskoči
        </button>
      </section>

      {leaving && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[80] bg-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          aria-hidden
        />
      )}
    </main>
  );
};

export default MojPutEntryIntro;
