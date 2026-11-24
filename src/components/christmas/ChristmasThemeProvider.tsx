import {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { CHRISTMAS_THEME_ENABLED } from "@/config/christmas";

interface ChristmasContextValue {
  enabled: boolean;
  reducedMotion: boolean;
}

const ChristmasContext = createContext<ChristmasContextValue>({
  enabled: false,
  reducedMotion: false,
});

export function useChristmas() {
  return useContext(ChristmasContext);
}

interface Props {
  children: ReactNode;
}

/**
 * Wraps the entire app. When CHRISTMAS_THEME_ENABLED is true:
 *  - Adds `.christmas-active` to <html> (same level as next-themes `.dark`)
 *  - Provides Christmas context (enabled + reduced-motion flag)
 *  - Cleans up on unmount
 *
 * When false: renders children only, zero side effects.
 */
export function ChristmasThemeProvider({ children }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!CHRISTMAS_THEME_ENABLED) return;

    const root = document.documentElement;
    root.classList.add("christmas-active");

    return () => {
      root.classList.remove("christmas-active");
    };
  }, []);

  useEffect(() => {
    if (!CHRISTMAS_THEME_ENABLED) return;
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const ctx = useMemo<ChristmasContextValue>(
    () => ({
      enabled: CHRISTMAS_THEME_ENABLED,
      reducedMotion,
    }),
    [reducedMotion],
  );

  return (
    <ChristmasContext.Provider value={ctx}>
      {children}
    </ChristmasContext.Provider>
  );
}
