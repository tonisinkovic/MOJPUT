/**
 * Shared motion constants and framer-motion variants for the Advent premium UI.
 * Keeps durations, easings, and reusable variants in one place.
 */

/* ------------------------------------------------------------------ */
/*  Durations (seconds)                                               */
/* ------------------------------------------------------------------ */
export const ADVENT_DURATION = {
  micro: 0.2,
  standard: 0.4,
  cinematic: 0.8,
  celebration: 1.5,
} as const;

/* ------------------------------------------------------------------ */
/*  Easings                                                           */
/* ------------------------------------------------------------------ */
export const ADVENT_EASE = {
  out: [0.22, 1, 0.36, 1] as readonly number[],
  inOut: [0.65, 0, 0.35, 1] as readonly number[],
  spring: { type: "spring" as const, stiffness: 300, damping: 24 },
} as const;

/* ------------------------------------------------------------------ */
/*  Reusable framer-motion variants                                   */
/* ------------------------------------------------------------------ */

export const adventFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ADVENT_DURATION.standard, ease: ADVENT_EASE.out },
  },
  exit: { opacity: 0, y: -8, transition: { duration: ADVENT_DURATION.micro } },
};

export const adventFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: ADVENT_DURATION.standard, ease: ADVENT_EASE.out },
  },
  exit: { opacity: 0, transition: { duration: ADVENT_DURATION.micro } },
};

export const adventScaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: ADVENT_DURATION.standard, ease: ADVENT_EASE.out },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: ADVENT_DURATION.micro },
  },
};

export const adventSlideLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: ADVENT_DURATION.standard, ease: ADVENT_EASE.out },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: ADVENT_DURATION.micro },
  },
};

export const adventStaggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const adventStaggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ADVENT_DURATION.standard, ease: ADVENT_EASE.out },
  },
};
