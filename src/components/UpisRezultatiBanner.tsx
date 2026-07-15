import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const POSTANI_STUDENT_URL = "https://www.postani-student.hr/";

const STEPS = [
  { label: "Prijavi se", sub: "Na portal" },
  { label: "Provjeri status", sub: "Rang lista" },
  { label: "Prati rokove", sub: "Upis i dokumenti" },
] as const;

type UpisRezultatiBannerProps = {
  className?: string;
};

export default function UpisRezultatiBanner({ className }: UpisRezultatiBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative", className)}
      role="status"
      aria-label="Konačne rang liste su objavljene — provjeri status na Postani student"
    >
      <div className="results-glow group relative overflow-hidden rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 p-[1px] shadow-[0_24px_60px_-20px_hsl(160_70%_32%/0.75)] sm:rounded-3xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl countdown-orb-drift"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-14 -right-10 h-44 w-44 rounded-full bg-teal-200/20 blur-3xl countdown-orb-drift-reverse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-24 w-24 -translate-x-1/2 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.16)_50%,transparent_82%)] countdown-shine"
        />

        {/* Confetti dots */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { top: "12%", left: "8%", delay: 0 },
            { top: "22%", left: "88%", delay: 0.4 },
            { top: "68%", left: "6%", delay: 0.8 },
            { top: "78%", left: "92%", delay: 0.2 },
            { top: "45%", left: "94%", delay: 0.6 },
          ].map((dot, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.8, 1.2, 0.8], y: [0, -6, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
              className="absolute h-2 w-2 rounded-full bg-white/50 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              style={{ top: dot.top, left: dot.left }}
            />
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-gradient-to-br from-emerald-900/95 via-emerald-800/98 to-teal-950/95 sm:rounded-[calc(1.5rem-1px)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />

          {/* Top bar */}
          <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-50 backdrop-blur-sm sm:text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
                Upis 2026
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85 sm:text-[11px]">
                <Sparkles className="h-3 w-3 text-amber-200" />
                Objavljeno
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-md sm:self-auto sm:px-4 sm:py-2.5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-100 ring-1 ring-white/20">
                <PartyPopper className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">15. srpanj 2026</p>
                <p className="mt-0.5 text-sm font-extrabold text-white sm:text-base">Konačne rang liste</p>
              </div>
            </motion.div>
          </div>

          {/* Body */}
          <div className="grid gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
            <div className="min-w-0 space-y-4">
              <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                <motion.span
                  animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.06, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white shadow-lg ring-1 ring-white/25 sm:h-14 sm:w-14"
                >
                  <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
                </motion.span>
                <div className="min-w-0">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.45 }}
                    className="text-balance text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl md:text-3xl"
                  >
                    Rezultati su stigli!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.45 }}
                    className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-white/80 sm:text-base"
                  >
                    Provjerite koji ste fakultet upisali na stranici{" "}
                    <a
                      href={POSTANI_STUDENT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-0.5 font-bold text-white underline decoration-white/40 underline-offset-[3px] transition-colors hover:text-emerald-100 hover:decoration-emerald-200/80"
                    >
                      Postani student
                      <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </a>
                    . Tamo možete vidjeti status prijave, rang na listi i sljedeće korake za upis.
                  </motion.p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.4 }}
                className="grid grid-cols-3 gap-2 sm:gap-3"
              >
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.35 }}
                    className="rounded-xl border border-white/15 bg-white/8 px-2.5 py-2.5 text-center backdrop-blur-sm sm:rounded-2xl sm:px-3 sm:py-3"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/90 sm:text-[11px]">
                      {i + 1}. korak
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-white sm:text-sm">{step.label}</p>
                    <p className="mt-0.5 text-[10px] text-white/55 sm:text-xs">{step.sub}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 140, damping: 16 }}
              className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[15rem]"
            >
              <a
                href={POSTANI_STUDENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/25 bg-white px-5 py-4 text-sm font-extrabold text-emerald-900 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.4)] sm:text-base"
              >
                Otvori Postani student
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <p className="text-center text-[11px] leading-snug text-white/55 sm:text-xs">
                Službeni portal za upis na visoka učilišta u RH
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
