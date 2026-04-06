import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Video, Bot, FileDown, Bell, LayoutGrid, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const perks = [
  {
    icon: Video,
    title: "Ekskluzivni sadržaj",
    text: "Dublji video vodiči, snimke s fakulteta i materijali koji neće biti u besplatnoj verziji.",
  },
  {
    icon: Bot,
    title: "AI asistent Pro",
    text: "Prošireni kontekst, prioritet u odgovorima i naprednije preporuke za smjer i karijeru.",
  },
  {
    icon: LayoutGrid,
    title: "Plan i scenariji",
    text: "Personalizirani plan mature/upisa, spremanje više scenarija u kalkulatoru i usporedbe „što ako”.",
  },
  {
    icon: FileDown,
    title: "Izvještaji",
    text: "PDF sažetak bodova, praga i raspodjele — spremno za obitelj ili mentoricu.",
  },
  {
    icon: Bell,
    title: "Rane obavijesti",
    text: "Push/e-mail za važne rokove, promjene natječaja i nove programe na platformi.",
  },
  {
    icon: ShieldCheck,
    title: "Iskustvo bez ometanja",
    text: "Čistiji prikaz stranica i rani pristup novim modulima prije javnog lansiranja.",
  },
];

const MojPutPremiumTeaser = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop / tablet: uska kartica na desnom rubu */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-[45] hidden md:flex",
          "right-0 top-[clamp(7rem,30vh,38%)] -translate-y-1/2",
          "w-12 flex-col items-center gap-1.5 rounded-l-2xl border border-r-0 border-amber-400/35 bg-gradient-to-b from-amber-50/95 via-card to-card py-4 shadow-lg",
          "text-amber-900 transition-all hover:w-[3.25rem] hover:shadow-xl hover:border-amber-500/50",
          "dark:from-amber-950/40 dark:via-card dark:to-card dark:text-amber-100 dark:border-amber-600/30",
        )}
        aria-label="MojPut Premium — pregled ponude"
      >
        <Crown className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} />
        <span className="max-w-[2.5rem] text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-amber-800 dark:text-amber-200">
          Premium
        </span>
      </button>

      {/* Mobitel: ikona iznad chatbota */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-[45] flex md:hidden",
          "bottom-[calc(6.25rem+env(safe-area-inset-bottom,0px))] right-6",
          "h-12 w-12 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-50 to-card shadow-lg",
          "text-amber-700 transition-transform active:scale-95 dark:from-amber-950/60 dark:to-card dark:text-amber-300",
        )}
        aria-label="MojPut Premium"
      >
        <Crown className="h-5 w-5" strokeWidth={2} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(90dvh,640px)] max-w-md overflow-y-auto rounded-2xl border-2 p-0 sm:max-w-lg">
          <div className="border-b border-border/60 bg-gradient-to-br from-amber-50/90 via-primary/5 to-transparent px-6 pb-4 pt-6 dark:from-amber-950/25 dark:via-primary/10">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  <Crown className="h-5 w-5" />
                </span>
                <DialogTitle className="text-xl font-bold tracking-tight">MojPut Premium</DialogTitle>
              </div>
              <DialogDescription className="text-left text-base text-muted-foreground">
                Koncept pretplate — sadržaj i točan popis pogodnosti još se dogovaraju. Ovo je smjer u kojem
                platforma može ponuditi više vrijednosti maturantima i roditeljima.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-4 px-6 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mjesečna pretplata (koncept)</p>
                <p className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight">4,99 €</span>
                  <span className="text-sm text-muted-foreground">/ mjesec</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                U pripremi
              </span>
            </div>

            <p className="text-sm font-semibold text-foreground">Što bi moglo uključivati</p>
            <ul className="space-y-3">
              {perks.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold leading-snug">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter className="flex-col gap-2 border-t border-border/60 bg-muted/20 px-6 py-4">
            <p className="text-center text-xs text-muted-foreground">
              Plaćanje i aktivacija još nisu uključeni — ovo je samo vizualni i sadržajni koncept.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button className="gradient-hero border-0 font-semibold text-primary-foreground" disabled>
                Nastavi na plaćanje (uskoro)
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Zatvori
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MojPutPremiumTeaser;
