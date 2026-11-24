import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "mojput_advent_pwa_hint_dismissed";

/**
 * Jednokratni savjet „dodaj na početni ekran“ na advent landing stranici.
 */
export function AdventPwaInstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (!mobile) return;
    setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* noop */
    }
    setShow(false);
  };

  return (
    <motionAside>
      <p className="text-sm font-semibold text-[hsl(var(--advent-ivory))]">
        💡 Prije 1. prosinca: dodaj MojPut na početni zaslon — lakše se vratiš na dnevni kviz.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-lg p-1.5 text-[hsl(var(--advent-frost)/0.6)] hover:bg-white/10"
        aria-label="Zatvori"
      >
        <X className="h-4 w-4" />
      </button>
    </motionAside>
  );
}

function motionAside({ children }: { children: ReactNode }) {
  return (
    <aside
      className="advent-glass-gold mx-4 mb-4 flex items-start justify-between gap-3 rounded-2xl border border-[hsl(var(--advent-gold)/0.2)] px-4 py-3 sm:mx-0"
      role="note"
    >
      {children}
    </aside>
  );
}