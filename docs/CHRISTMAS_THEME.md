# MojPut.com — Christmas Theme Documentation

## Overview

A fully reversible, premium Christmas visual layer across the MojPut.com platform.
Controlled by a single config flag. All existing design remains untouched.

---

## How to Toggle the Christmas Theme

### Enable (default during season)

```ts
// src/config/christmas.ts
export const CHRISTMAS_THEME_ENABLED = true;
```

### Disable (restore original MojPut)

```ts
// src/config/christmas.ts
export const CHRISTMAS_THEME_ENABLED = false;
```

Then rebuild or restart the dev server. **That's it.**

When disabled:
- `.christmas-active` class is never added to `<html>`
- All Christmas CSS selectors are inert (no matching element)
- All Christmas React components are not rendered (`{flag && <Component />}`)
- Zero visual artifacts remain — original MojPut is 100% restored

---

## Existing Design Baseline

### Color Palette (Original)

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--primary` | `174 62% 42%` (~#1f9b8e) | Brand teal, CTA, rings |
| `--primary` (dark) | `174 62% 48%` | Brighter teal for dark mode |
| `--accent` | `14 90% 62%` | Coral accent |
| `--background` | `210 30% 99%` | Light background |
| `--background` (dark) | `220 25% 8%` | Dark background |
| `--foreground` | `215 30% 12%` | Text |
| `--foreground` (dark) | `210 20% 95%` | Dark mode text |
| `--card` | `0 0% 100%` | Card surface |
| `--muted` | `220 15% 95%` | Muted surfaces |
| `--border` | `220 15% 91%` | Border |
| `--surface-warm` | `30 40% 98%` | Warm surface |
| `--surface-cool` | `210 40% 97%` | Cool surface |

### Scoped Theme Palettes

- **Junior (`.jh-page`):** Teal/violet/coral hex palette (`--mp-primary: #0C8075`, `--mp-accent: #6D4AE0`)
- **Senior (`.sr-page`):** Night/cyan/gold palette (`--mp-primary: #0E7490`, `--mp-accent: #F5B021`)
- **Advent (`.advent-page`):** Midnight/evergreen/gold (`--advent-midnight`, `--advent-gold`)

### Typography

- **Font:** Plus Jakarta Sans (Google Fonts), weights 400–800
- **Features:** `font-feature-settings: "ss01", "cv11"`
- **Headings:** letter-spacing `-0.02em`, font-weight 700–800
- **Scale:** Responsive clamp values via `--text-hero`, `--text-h1`, etc.

### Design Structure

- **CSS Framework:** Tailwind CSS 3.4 with `darkMode: ["class"]`
- **UI Kit:** shadcn/ui (Radix) with HSL CSS variable tokens
- **Variable Convention:** HSL components without `hsl()` wrapper (e.g. `--primary: 174 62% 42%`)
- **Class Merging:** `cn()` utility via `clsx` + `tailwind-merge`
- **Animations:** `tailwindcss-animate` plugin + framer-motion + CSS `@keyframes`
- **Dark Mode:** `next-themes` ThemeProvider with `attribute="class"`

### Key Files

| File | Role |
|------|------|
| `src/index.css` | Global stylesheet (~2,800 lines), all design tokens |
| `tailwind.config.ts` | Tailwind configuration, color mapping, keyframes |
| `src/main.tsx` | App bootstrap, ThemeProvider |
| `src/App.tsx` | Router, providers, all 52 routes |
| `src/components/Layout.tsx` | Page chrome (Navbar + Footer) |
| `src/components/Navbar.tsx` | Main navigation |
| `src/components/Footer.tsx` | Site footer |

### Routes Reviewed

All 52 routes defined in `src/App.tsx`, including:
- `/` (Home — JuniorHome / SeniorHome)
- `/kalkulator`, `/kalkulator-fakulteti`, `/kalkulator-doma`
- `/srednje-skole`, `/srednje-skole/profili`, `/srednje-skole/:slug`
- `/fakulteti`, `/fakulteti/:facultyId`
- `/kviz`, `/kviz-srednja`, `/samoprocjena`
- `/forum`, `/kalendar`, `/video`, `/chatbot`
- `/profil`, `/prijava`, `/registracija`
- `/adventska-liga`, `/adventska-liga/kviz`, `/adventska-liga/ljestvica`
- `/roditelji`, `/roditeljski-kutak/*`
- `/o-nama`, `/kontakt`, `/partneri`, `/privatnost`, `/uvjeti`

---

## Christmas Theme Architecture

### Files Created

| File | Purpose |
|------|---------|
| `src/config/christmas.ts` | Single toggle: `CHRISTMAS_THEME_ENABLED` |
| `src/styles/christmas.css` | All Christmas CSS, scoped to `.christmas-active` |
| `src/components/christmas/ChristmasThemeProvider.tsx` | Context + `<html>` class toggle |
| `src/components/christmas/ChristmasSnowfall.tsx` | CSS-only snowfall particles |
| `src/components/christmas/ChristmasGarland.tsx` | Top-of-page garland decoration |
| `src/components/christmas/ChristmasFooterDecoration.tsx` | Footer seasonal decoration |
| `src/components/christmas/ChristmasHeroOverlay.tsx` | Home page hero warm overlay |
| `src/components/christmas/index.ts` | Barrel exports |

### Files Modified (Minimal)

| File | Change |
|------|--------|
| `src/main.tsx` | Import `christmas.css`, wrap with `ChristmasThemeProvider` |
| `src/components/Layout.tsx` | Conditional `ChristmasSnowfall` + `ChristmasGarland` |
| `src/components/Footer.tsx` | Conditional `ChristmasFooterDecoration` |
| `src/components/MojPutEntryIntro.tsx` | Christmas background, snowfall, garland, pine/star decorations, warm logo glow |
| `src/components/junior-home/JuniorHero.tsx` | Conditional `ChristmasHeroOverlay` |
| `src/components/senior-home/SeniorHero.tsx` | Conditional `ChristmasHeroOverlay` |

### How It Works

1. `CHRISTMAS_THEME_ENABLED` flag in `src/config/christmas.ts`
2. `ChristmasThemeProvider` reads the flag
3. If `true`: adds `.christmas-active` class to `<html>`, provides context
4. `christmas.css` selectors under `.christmas-active` activate overrides
5. Christmas React components render decorative elements
6. If `false`: no class, no components, no visual change

### Christmas Color Palette

| Name | HSL | Hex Approx | Usage |
|------|-----|------------|-------|
| Warm Evergreen | `152 35% 28%` | #2E5E4A | Borders, dividers |
| Deep Forest Green | `152 40% 15%` | #173D27 | Dark backgrounds |
| Soft Cranberry | `350 55% 52%` | #C44B5C | Warm accent |
| Champagne Gold | `43 70% 62%` | #D4A843 | CTA glow, shimmer |
| Warm Ivory | `40 33% 96%` | #F7F3ED | Light surface warmth |
| Snow White | `210 20% 98%` | #F9FAFB | Background tint |
| Soft Winter Blue | `210 40% 80%` | #B8CCE0 | Frost accents |

**MojPut primary teal is NOT changed.** Christmas colors are additive accents only.

---

## Reverting to Original Design

1. Set `CHRISTMAS_THEME_ENABLED = false` in `src/config/christmas.ts`
2. Rebuild (`npm run build`) or restart dev server (`npm run dev`)
3. Done — all Christmas visuals disappear completely

### Optional Full Cleanup (after season)

1. Delete `src/config/christmas.ts`
2. Delete `src/styles/christmas.css`
3. Delete `src/components/christmas/` directory
4. Remove ~20 conditional lines from Layout.tsx, Footer.tsx, main.tsx, MojPutEntryIntro.tsx, JuniorHero.tsx, SeniorHero.tsx
5. Remove `christmas.css` import from main.tsx
