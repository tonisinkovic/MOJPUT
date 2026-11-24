import { useEffect, useMemo, useState } from "react";
import { Link2, Check, Copy, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { AdventCompletePayload } from "@/lib/adventLeagueApi";
import {
  buildAdventShareLinkOnly,
  buildAdventShareText,
  canUseWebShare,
  copyTextToClipboard,
  shareAdventResult,
} from "@/lib/adventLeagueShare";
import { fetchAdventReferralMe } from "@/lib/adventLeagueReferral";
import { isApiError } from "@/lib/adventLeagueApi";
import { trackAdventShareClick } from "@/lib/adventLeagueAnalytics";
import { cn } from "@/lib/utils";

type AdventQuizShareCardProps = {
  results: AdventCompletePayload;
  className?: string;
};

export function AdventQuizShareCard({ results, className }: AdventQuizShareCardProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchAdventReferralMe().then((res) => {
      if (!alive || isApiError(res) || !res.data?.code) return;
      setReferralCode(res.data.code);
    });
    return () => {
      alive = false;
    };
  }, []);

  const shareText = useMemo(() => buildAdventShareText(results, referralCode), [results, referralCode]);
  const shareLink = useMemo(() => buildAdventShareLinkOnly(referralCode), [referralCode]);
  const webShare = canUseWebShare();

  const flashCopied = (which: "text" | "link") => {
    if (which === "text") {
      setCopiedText(true);
      window.setTimeout(() => setCopiedText(false), 2000);
    } else {
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    trackAdventShareClick("native");
    const outcome = await shareAdventResult(results, referralCode);
    if (outcome === "shared") toast.success("Podijeljeno!");
    else if (outcome === "copied") {
      flashCopied("text");
      toast.success("Tekst kopiran — dijeljenje nije dostupno na ovom uređaju.");
    } else if (outcome === "cancelled") return;
    else toast.error("Dijeljenje nije uspjelo — kopiraj tekst ručno.");
  };

  const handleCopyText = async () => {
    trackAdventShareClick("copy_text");
    try {
      await copyTextToClipboard(shareText);
      flashCopied("text");
      toast.success("Tekst za dijeljenje je kopiran.");
    } catch {
      toast.error("Kopiranje nije uspjelo.");
    }
  };

  const handleCopyLink = async () => {
    trackAdventShareClick("copy_link");
    try {
      await copyTextToClipboard(shareLink);
      flashCopied("link");
      toast.success("Poveznica na ligu je kopirana.");
    } catch {
      toast.error("Kopiranje poveznice nije uspjelo.");
    }
  };

  return (
    <section
      className={cn("advent-glass-gold rounded-2xl p-5 sm:p-6", className)}
      aria-labelledby="advent-share-heading"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-[hsl(var(--advent-gold))]" aria-hidden />
        <h2
          id="advent-share-heading"
          className="text-base font-extrabold text-[hsl(var(--advent-ivory))]"
        >
          Podijeli rezultat
        </h2>
      </div>

      {/* Vizualna kartica za screenshot / story */}
      <div
        className="relative mx-auto max-w-md rounded-xl bg-gradient-to-br from-[hsl(var(--advent-evergreen))] to-[hsl(var(--advent-midnight))] p-4 text-center text-white shadow-xl"
        role="img"
        aria-label={`Rezultat: ${results.questionsCorrect} točnih odgovora, ${results.totalScore} bodova`}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--advent-ivory)/0.7)]">
          MojPut · Adventska liga
        </p>
        <p className="mt-3 text-sm font-semibold text-[hsl(var(--advent-ivory)/0.8)]">
          {results.dayNumber != null ? `Dan ${results.dayNumber}` : "Današnji kviz"}
        </p>
        <p className="mt-4 text-3xl font-extrabold tabular-nums leading-none text-[hsl(var(--advent-gold))]">
          {results.totalScore}
        </p>
        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[hsl(var(--advent-ivory)/0.6)]">
          bodova
        </p>
        <p className="mt-4 text-lg font-extrabold text-[hsl(var(--advent-ivory))]">
          {results.questionsCorrect}/{results.questionsAnswered} točno
        </p>
        <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold leading-snug text-[hsl(var(--advent-ivory)/0.8)]">
          Izazovi prijatelje — možeš li nadmašiti moj rezultat danas?
        </p>
        <p className="mt-4 text-[11px] font-medium text-[hsl(var(--advent-ivory)/0.5)]">
          mojput.com/adventska-liga
        </p>
      </div>

      <pre
        className="advent-glass rounded-lg p-3 mt-4 max-h-32 overflow-y-auto whitespace-pre-wrap text-xs font-mono text-[hsl(var(--advent-frost)/0.6)]"
        aria-label="Tekst za kopiranje"
      >
        {shareText}
      </pre>

      <ShareActions
        webShare={webShare}
        copiedText={copiedText}
        copiedLink={copiedLink}
        onShare={handleNativeShare}
        onCopyText={handleCopyText}
        onCopyLink={handleCopyLink}
      />
    </section>
  );
}

function ShareActions({
  webShare,
  copiedText,
  copiedLink,
  onShare,
  onCopyText,
  onCopyLink,
}: {
  webShare: boolean;
  copiedText: boolean;
  copiedLink: boolean;
  onShare: () => void;
  onCopyText: () => void;
  onCopyLink: () => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        className="advent-btn-gold advent-shimmer rounded-xl min-h-12 px-6 font-extrabold text-sm w-full flex-1 inline-flex items-center justify-center gap-2 sm:w-auto"
        onClick={() => void onShare()}
      >
        <Share2 className="h-4 w-4" />
        {webShare ? "Podijeli" : "Kopiraj i podijeli"}
      </button>
      <button
        type="button"
        className="advent-btn-ghost rounded-xl min-h-12 px-4 font-extrabold text-sm inline-flex items-center justify-center gap-2"
        onClick={() => void onCopyText()}
      >
        {copiedText ? (
          <Check className="h-4 w-4 text-[hsl(var(--advent-gold))]" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {copiedText ? (
          <span className="text-[hsl(var(--advent-gold))]">Kopirano!</span>
        ) : (
          "Kopiraj tekst"
        )}
      </button>
      <button
        type="button"
        className="advent-btn-ghost rounded-xl min-h-12 px-4 font-extrabold text-sm inline-flex items-center justify-center gap-2"
        onClick={() => void onCopyLink()}
      >
        {copiedLink ? (
          <Check className="h-4 w-4 text-[hsl(var(--advent-gold))]" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
        {copiedLink ? (
          <span className="text-[hsl(var(--advent-gold))]">Kopirano!</span>
        ) : (
          "Kopiraj poveznicu"
        )}
      </button>
    </div>
  );
}
