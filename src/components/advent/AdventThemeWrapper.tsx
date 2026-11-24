import { useEffect, createContext, useContext, useMemo, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Motion context — reduced-motion preference                        */
/* ------------------------------------------------------------------ */

interface AdventMotionContextValue {
  /** True when the user prefers reduced motion. */
  reducedMotion: boolean;
}

const AdventMotionContext = createContext<AdventMotionContextValue>({
  reducedMotion: false,
});

export function useAdventMotion() {
  return useContext(AdventMotionContext);
}

/* ------------------------------------------------------------------ */
/*  Theme wrapper — applies .advent-page to <body>                    */
/* ------------------------------------------------------------------ */

interface Props {
  children: ReactNode;
}

/**
 * Wraps Advent pages in the `.advent-page` scope (like `.jh-page` / `.sr-page`).
 * Also provides `AdventMotionContext` for reduced-motion awareness.
 */
export function AdventThemeWrapper({ children }: Props) {
  useEffect(() => {
    document.body.classList.add("advent-page");
    return () => {
      document.body.classList.remove("advent-page");
    };
  }, []);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const ctx = useMemo<AdventMotionContextValue>(
    () => ({ reducedMotion }),
    [reducedMotion],
  );

  return (
    <AdventMotionContext.Provider value={ctx}>
      {children}
    </AdventMotionContext.Provider>
  );
}
