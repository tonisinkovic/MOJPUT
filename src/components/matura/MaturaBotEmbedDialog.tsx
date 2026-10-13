/**
 * MaturaBOT ugradnja u MojPut (sekcija Matura).
 * Klik na karticu otvara ovaj dijalog; sadržaj s https://www.maturabot.hr
 * je u iframeu kako CSS MaturaBOT-a ne bi dirao MojPut layout.
 */
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

export const MATURABOT_URL = "https://www.maturabot.hr";
export const MATURABOT_LOGO_URL = "https://www.maturabot.hr/images/logo/logo_mark.png";

type MaturaBotBrandProps = {
  className?: string;
};

export function MaturaBotBrand({ className }: MaturaBotBrandProps) {
  return (
    <a
      href={MATURABOT_URL}
      target="_blank"
      rel="noreferrer noopener"
      className={cn("inline-flex min-w-0 items-center gap-2 no-underline", className)}
    >
      <img
        src={MATURABOT_LOGO_URL}
        alt=""
        width={36}
        height={36}
        className="h-8 w-8 shrink-0 rounded-lg object-cover sm:h-9 sm:w-9"
      />
      <span className="truncate text-[17px] font-extrabold tracking-[-0.02em] text-slate-950 sm:text-xl">
        Matura<span className="text-[#2563EB]">BOT</span>
      </span>
    </a>
  );
}

type MaturaBotFrameProps = {
  className?: string;
  title?: string;
};

export function MaturaBotFrame({ className, title = "MaturaBOT" }: MaturaBotFrameProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn("flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 bg-muted/30 px-6 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          Ugrađeni sadržaj trenutno nije dostupan. Otvori MaturaBOT u novom prozoru.
        </p>
        <a
          href={MATURABOT_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Otvori maturabot.hr
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={MATURABOT_URL}
      title={title}
      className={cn("h-full w-full border-0 bg-white", className)}
      referrerPolicy="no-referrer-when-downgrade"
      allow="clipboard-write; fullscreen"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

type MaturaBotEmbedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MaturaBotEmbedDialog({ open, onOpenChange }: MaturaBotEmbedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex h-[100dvh] max-h-[100dvh] w-full max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 bg-background p-0 shadow-2xl",
          "sm:h-[min(92dvh,52rem)] sm:max-h-[92dvh] sm:w-[min(96vw,72rem)] sm:max-w-[72rem] sm:rounded-2xl sm:border",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-card px-4 py-3 pr-12 sm:px-5">
          <div className="min-w-0">
            <DialogTitle className="sr-only">Matura — MaturaBOT</DialogTitle>
            <DialogDescription className="sr-only">
              Priprema za državnu maturu. Sadržaj pokreće MaturaBOT.
            </DialogDescription>
            <MaturaBotBrand />
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">
              Ovaj dio pokreće MaturaBOT · maturabot.hr
            </p>
          </div>
          <a
            href={MATURABOT_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border/80 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:inline-flex"
          >
            Otvori na maturabot.hr
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
          {open ? <MaturaBotFrame /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
