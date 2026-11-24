import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { adventAudio } from "@/lib/adventAudio";

interface Props {
  className?: string;
}

/**
 * Floating toggle button for Advent sound effects.
 * Shows speaker icon on/off with brief tooltip feedback.
 */
export function AdventAudioToggle({ className = "" }: Props) {
  const [enabled, setEnabled] = useState(adventAudio.enabled);
  const [showTooltip, setShowTooltip] = useState(false);

  const toggle = useCallback(() => {
    const next = !enabled;
    adventAudio.setEnabled(next);
    setEnabled(next);
    setShowTooltip(true);
    if (next) {
      adventAudio.play("selectOption");
    }
  }, [enabled]);

  useEffect(() => {
    if (!showTooltip) return;
    const t = setTimeout(() => setShowTooltip(false), 1500);
    return () => clearTimeout(t);
  }, [showTooltip]);

  const Icon = enabled ? Volume2 : VolumeX;
  const label = enabled ? "Zvuk uključen" : "Zvuk isključen";

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggle}
        className="advent-glass flex h-9 w-9 items-center justify-center rounded-full text-[hsl(var(--advent-frost)/0.5)] transition hover:text-[hsl(var(--advent-gold))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--advent-gold)/0.5)]"
        aria-label={label}
        title={label}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </button>
      {showTooltip && (
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[hsl(var(--advent-midnight))] px-2 py-1 text-[10px] font-bold text-[hsl(var(--advent-gold))] shadow-lg">
          {label}
        </span>
      )}
    </div>
  );
}
