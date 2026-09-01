import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Video, Bot, FileDown, Bell, LayoutGrid, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const perks = [
  {
    icon: Video,
    title: "Pro video sadržaj i materijali",
    text: "Detaljni vodiči za maturu i upise, iskustva studenata te dodatni materijali na jednom mjestu.",
  },
  {
    icon: Bot,
    title: "Veći limit za AI asistenta",
    text: "Više dnevnih razgovora, detaljnije preporuke i duži kontekst za tvoje odluke o studiju.",
  },
  {
    icon: LayoutGrid,
    title: "Neograničeni scenariji upisa",
    text: "Spremi više kombinacija mature i fakulteta te usporedi rezultate bez ponovnog unosa.",
  },
  {
    icon: FileDown,
    title: "PDF izvještaji",
    text: "Preuzmi pregled bodova, pragova, preporuka i plana upisa za sebe, roditelja ili mentora.",
  },
  {
    icon: Bell,
    title: "Pametni podsjetnici",
    text: "Pravovremene obavijesti za rokove mature, prijave, domove i promjene natječaja.",
  },
  {
    icon: ShieldCheck,
    title: "Rani pristup novim alatima",
    text: "Isprobaj nove MojPut alate prije javnog lansiranja i koristi prioritetnu podršku.",
  },
];

/** Pro ponuda je najava; naplata i aktivacija još nisu uključene. */
const SHOW_PREMIUM_TEASER = true;

type ProSound = "open" | "close";

/** Kratak, tih UI zvuk bez dodatnih audio datoteka. Pokreće se samo nakon korisnikova klika. */
function playProSound(kind: ProSound) {
  if (typeof window === "undefined") return;
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;

  try {
    const context = new AudioContextCtor();
    const notes =
      kind === "open"
        ? [
            { frequency: 659.25, delay: 0, duration: 0.22, volume: 0.032 },
            { frequency: 987.77, delay: 0.075, duration: 0.3, volume: 0.026 },
          ]
        : [
            { frequency: 783.99, delay: 0, duration: 0.16, volume: 0.022 },
            { frequency: 523.25, delay: 0.065, duration: 0.22, volume: 0.018 },
          ];

    notes.forEach(({ frequency, delay, duration, volume }) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + delay;

      oscillator.type = kind === "open" ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    });

    window.setTimeout(() => void context.close(), 650);
  } catch {
    // Preglednik ili korisničke postavke mogu blokirati Web Audio; teaser svejedno normalno radi.
  }
}

const MojPutPremiumTeaser = () => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen === open) return;
    playProSound(nextOpen ? "open" : "close");
    setOpen(nextOpen);
  };

  if (!SHOW_PREMIUM_TEASER) {
    return null;
  }

  return (
    <>
      {/* Desktop / tablet: animirani premium marker na desnom rubu */}
      <motion.button
        type="button"
        onClick={() => handleOpenChange(true)}
        initial={{ x: 56, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          boxShadow: [
            "0 10px 35px -12px rgba(245, 158, 11, 0.38)",
            "0 14px 42px -10px rgba(245, 158, 11, 0.68)",
            "0 10px 35px -12px rgba(245, 158, 11, 0.38)",
          ],
        }}
        transition={{
          x: { type: "spring", stiffness: 170, damping: 18, delay: 0.55 },
          opacity: { duration: 0.35, delay: 0.4 },
          boxShadow: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ x: -7, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "group fixed z-[45] hidden overflow-hidden md:flex",
          "right-0 top-[clamp(7rem,30vh,38%)] -translate-y-1/2",
          "w-[3.65rem] flex-col items-center gap-1.5 rounded-l-[1.35rem] border border-r-0 border-amber-300/50",
          "bg-[linear-gradient(155deg,#17120b_0%,#090b14_56%,#111827_100%)] py-4 text-amber-100",
        )}
        aria-label="MojPut Pro — pregled ponude"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 -left-full w-8 rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 group-hover:left-[140%]"
        />
        <span className="relative flex size-8 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 shadow-[0_0_22px_rgba(251,191,36,0.35)]">
          <Crown className="size-4 text-amber-300" strokeWidth={2.2} />
        </span>
        <span className="relative max-w-[2.8rem] text-center text-[10px] font-black uppercase leading-tight tracking-[0.16em] text-amber-200">
          Pro
        </span>
        <span className="relative size-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]" />
      </motion.button>

      {/* Mobitel: ikona iznad chatbota */}
      <motion.button
        type="button"
        onClick={() => handleOpenChange(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          boxShadow: [
            "0 8px 25px -8px rgba(245,158,11,.45)",
            "0 10px 34px -6px rgba(245,158,11,.75)",
            "0 8px 25px -8px rgba(245,158,11,.45)",
          ],
        }}
        transition={{
          scale: { type: "spring", stiffness: 220, damping: 16, delay: 0.45 },
          opacity: { duration: 0.3, delay: 0.35 },
          boxShadow: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
        }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "fixed z-[45] flex overflow-hidden md:hidden",
          "bottom-[calc(6.25rem+env(safe-area-inset-bottom,0px))] right-6",
          "size-12 items-center justify-center rounded-full border border-amber-300/45",
          "bg-[linear-gradient(145deg,#211607,#090b14_65%)] text-amber-200",
        )}
        aria-label="MojPut Pro"
      >
        <motion.span
          aria-hidden
          className="absolute inset-1 rounded-full border border-amber-300/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <Crown className="relative size-5 drop-shadow-[0_0_8px_rgba(252,211,77,.65)]" strokeWidth={2.2} />
      </motion.button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[min(92dvh,760px)] max-w-md overflow-hidden rounded-[1.75rem] border border-amber-300/25 bg-[#080b14] p-0 text-white shadow-[0_32px_90px_-20px_rgba(0,0,0,.9),0_0_70px_-24px_rgba(245,158,11,.5)] sm:max-w-xl [&>button]:right-4 [&>button]:top-4 [&>button]:z-20 [&>button]:rounded-full [&>button]:border [&>button]:border-white/10 [&>button]:bg-black/30 [&>button]:p-2 [&>button]:text-white [&>button]:opacity-80 [&>button]:backdrop-blur-md hover:[&>button]:opacity-100">
          <div className="relative max-h-[min(92dvh,760px)] overflow-y-auto">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -left-24 -top-28 size-72 rounded-full bg-amber-400/15 blur-3xl"
                animate={{ x: [0, 26, 0], y: [0, 18, 0], opacity: [0.55, 0.9, 0.55] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -right-28 top-16 size-72 rounded-full bg-cyan-400/10 blur-3xl"
                animate={{ x: [0, -24, 0], y: [0, 24, 0], opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,.32)_100%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/90 to-transparent" />
            </div>

            <div className="relative px-5 pb-5 pt-7 sm:px-7 sm:pb-6 sm:pt-8">
              <DialogHeader className="gap-4 text-left">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-300/20 to-amber-500/5 shadow-[0_0_35px_rgba(245,158,11,.22)]"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Crown className="size-6 text-amber-300 drop-shadow-[0_0_9px_rgba(252,211,77,.55)]" />
                  </motion.span>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
                        Premium članstvo
                      </span>
                      <span className="size-1 rounded-full bg-amber-300" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                        Uskoro
                      </span>
                    </div>
                    <DialogTitle className="bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-2xl font-black tracking-[-0.04em] text-transparent sm:text-3xl">
                      MojPut Pro
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="max-w-lg text-left text-sm leading-6 text-white/65 sm:text-[15px]">
                  Tvoj osobni centar za pametniji odabir studija — više AI pomoći, bolji plan i svi važni koraci
                  pod kontrolom.
                </DialogDescription>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.45 }}
                className="relative mt-5 overflow-hidden rounded-2xl border border-amber-200/25 bg-gradient-to-r from-amber-300/[0.12] via-white/[0.06] to-cyan-300/[0.08] p-4 backdrop-blur-xl sm:p-5"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 -left-24 w-20 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  animate={{ left: ["-8rem", "130%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.8, ease: "easeInOut" }}
                />
                <div className="relative flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                      Sve Pro pogodnosti
                    </p>
                    <p className="mt-1 flex items-end gap-2">
                      <span className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">5,99 €</span>
                      <span className="pb-1 text-sm font-medium text-white/50">mjesečno</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1.5 text-xs font-bold text-amber-200">
                    <Sparkles className="size-3.5" />
                    Bez skrivenih troškova
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="relative border-y border-white/[0.07] bg-white/[0.025] px-5 py-5 sm:px-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-white">Što otključavaš</p>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  6 Pro pogodnosti
                </span>
              </div>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {perks.map(({ icon: Icon, title, text }, index) => (
                  <motion.li
                    key={title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + index * 0.055, duration: 0.35 }}
                    whileHover={{ y: -3, scale: 1.012 }}
                    className={cn(
                      "group relative flex min-h-[8.4rem] overflow-hidden rounded-2xl border p-4",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_16px_30px_-24px_rgba(0,0,0,.9)]",
                      "transition-colors duration-300 hover:border-amber-200/30",
                      index % 2 === 0
                        ? "border-amber-200/15 bg-[linear-gradient(145deg,rgba(251,191,36,.105),rgba(255,255,255,.035)_48%,rgba(8,11,20,.5))]"
                        : "border-cyan-100/10 bg-[linear-gradient(145deg,rgba(103,232,249,.075),rgba(255,255,255,.035)_48%,rgba(8,11,20,.5))]",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -right-8 -top-10 size-24 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                        index % 2 === 0 ? "bg-amber-300/15 opacity-60" : "bg-cyan-300/10 opacity-50",
                      )}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/45 to-transparent"
                    />
                    <div className="relative flex w-full gap-3.5">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-200/20 bg-gradient-to-br from-amber-200/20 to-amber-500/[0.06] text-amber-200 shadow-[0_8px_22px_-10px_rgba(245,158,11,.8)]">
                        <Icon className="size-[1.15rem]" strokeWidth={2.15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-extrabold leading-snug tracking-[-0.01em] text-white">
                            {title}
                          </p>
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-amber-200/20 bg-amber-200/10 text-amber-200">
                            <Check className="size-3" strokeWidth={2.8} />
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] font-medium leading-[1.65] text-white/50">{text}</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <DialogFooter className="relative flex-col gap-3 px-5 py-5 sm:px-7">
              <Button
                className="group h-12 w-full overflow-hidden rounded-xl border border-amber-200/35 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 font-black text-[#171007] shadow-[0_14px_35px_-12px_rgba(245,158,11,.65)] transition hover:brightness-105"
                disabled
              >
                <Crown data-icon="inline-start" />
                Aktivacija uskoro
                <ArrowRight data-icon="inline-end" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-center text-[11px] text-white/40">
                <Check className="size-3.5 text-amber-300/80" />
                <span>Ništa se ne naplaćuje prije službenog pokretanja</span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="mx-auto text-xs font-semibold text-white/45 transition hover:text-white/80"
              >
                Možda kasnije
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MojPutPremiumTeaser;
