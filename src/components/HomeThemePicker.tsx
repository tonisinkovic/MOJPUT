import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Check, Moon, Palette, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Kompaktan odabir teme na početnoj — uklopljen u hero, prilagođen mobilnim zaslonima.
 */
export function HomeThemePicker() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLight = mounted && resolvedTheme === "light";
  const activeDark = mounted && resolvedTheme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-lg md:max-w-xl"
    >
      <div
        className={cn(
          "rounded-2xl border border-border/50 bg-background/45 px-3 py-3 shadow-sm backdrop-blur-sm",
          "sm:px-4 sm:py-4 md:border-border/40 md:bg-background/55",
        )}
      >
        <div className="mb-2.5 text-center md:mb-3">
          <div className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">
            <Palette className="h-3 w-3 shrink-0 text-primary/80" aria-hidden />
            Izgled stranice
          </div>
          <h2 className="text-sm font-semibold leading-snug text-foreground sm:text-base md:font-bold">
            <span className="md:hidden">Svijetli ili tamni način</span>
            <span className="hidden md:inline">Kako želiš koristiti MojPut?</span>
          </h2>
          <p className="mx-auto mt-1 hidden max-w-md text-pretty text-xs text-muted-foreground sm:block md:text-sm">
            Odaberi način prikaza — oba su prilagođena čitljivosti. Kasnije u{" "}
            <span className="font-medium text-foreground/85">profilu → postavke</span>.
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:hidden">
            Promjenu kasnije pronađeš u profilu.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={cn(
              "group relative flex flex-col rounded-xl border p-2.5 text-left outline-none transition-all duration-200 sm:rounded-2xl sm:p-3.5 md:p-4",
              "bg-card/60 backdrop-blur-sm sm:bg-card/80",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              activeLight
                ? "border-primary/80 shadow-sm ring-1 ring-primary/25 sm:ring-2 sm:ring-primary/20"
                : "border-border/60 hover:border-primary/30 hover:bg-card/90",
            )}
            aria-pressed={activeLight}
          >
            {activeLight && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm sm:right-2.5 sm:top-2.5 sm:h-6 sm:w-6">
                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
              </span>
            )}
            <div className="mb-0 flex items-center gap-2 sm:mb-2 md:mb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 ring-1 ring-amber-200/80 dark:bg-amber-500/12 dark:text-amber-300 dark:ring-amber-500/25 sm:h-9 sm:w-9 md:h-10 md:w-10 md:rounded-xl">
                <Sun className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem] md:h-5 md:w-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0 flex-1 pr-4 sm:pr-5">
                <span className="block text-xs font-semibold leading-tight text-foreground sm:text-sm">
                  <span className="sm:hidden">Svijetli</span>
                  <span className="hidden sm:inline">Svijetli način</span>
                </span>
                <p className="mt-0.5 hidden text-[11px] text-muted-foreground sm:line-clamp-2 sm:block md:text-xs">
                  Čist prikaz, dobar za dan
                </p>
              </div>
            </div>
            <div
              className="hidden h-[3.25rem] overflow-hidden rounded-lg border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/95 to-slate-100/90 p-2 shadow-inner sm:block md:h-[4.5rem] md:rounded-xl md:p-2.5"
              aria-hidden
            >
              <div className="mb-1.5 flex gap-1 md:mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300/90 md:h-2 md:w-2" />
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300/70 md:h-2 md:w-2" />
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300/50 md:h-2 md:w-2" />
              </div>
              <div className="space-y-1 md:space-y-1.5">
                <div className="h-1.5 w-full rounded bg-slate-200/90 md:h-2 md:rounded-md" />
                <div className="h-1.5 w-[88%] rounded bg-slate-200/70 md:h-2 md:rounded-md" />
                <div className="h-1.5 w-[72%] rounded bg-primary/25 md:h-2 md:rounded-md" />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={cn(
              "group relative flex flex-col rounded-xl border p-2.5 text-left outline-none transition-all duration-200 sm:rounded-2xl sm:p-3.5 md:p-4",
              "bg-card/60 backdrop-blur-sm sm:bg-card/80",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              activeDark
                ? "border-primary/80 shadow-sm ring-1 ring-primary/25 sm:ring-2 sm:ring-primary/20"
                : "border-border/60 hover:border-primary/30 hover:bg-card/90",
            )}
            aria-pressed={activeDark}
          >
            {activeDark && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm sm:right-2.5 sm:top-2.5 sm:h-6 sm:w-6">
                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
              </span>
            )}
            <div className="mb-0 flex items-center gap-2 sm:mb-2 md:mb-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-indigo-200 dark:bg-slate-800/90 dark:text-indigo-200 sm:h-9 sm:w-9 md:h-10 md:w-10 md:rounded-xl">
                <Moon className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem] md:h-5 md:w-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0 flex-1 pr-4 sm:pr-5">
                <span className="block text-xs font-semibold leading-tight text-foreground sm:text-sm">
                  <span className="sm:hidden">Tamni</span>
                  <span className="hidden sm:inline">Tamni način</span>
                </span>
                <p className="mt-0.5 hidden text-[11px] text-muted-foreground sm:line-clamp-2 sm:block md:text-xs">
                  Odmara oči, za večer
                </p>
              </div>
            </div>
            <div
              className="hidden h-[3.25rem] overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 p-2 shadow-inner sm:block md:h-[4.5rem] md:rounded-xl md:p-2.5"
              aria-hidden
            >
              <div className="mb-1.5 flex gap-1 md:mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-600 md:h-2 md:w-2" />
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-600/80 md:h-2 md:w-2" />
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-600/60 md:h-2 md:w-2" />
              </div>
              <div className="space-y-1 md:space-y-1.5">
                <div className="h-1.5 w-full rounded bg-zinc-700/90 md:h-2 md:rounded-md" />
                <div className="h-1.5 w-[88%] rounded bg-zinc-700/70 md:h-2 md:rounded-md" />
                <div className="h-1.5 w-[72%] rounded bg-primary/40 md:h-2 md:rounded-md" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
