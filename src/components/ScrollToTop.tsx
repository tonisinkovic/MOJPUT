import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Usklađeno s `Layout` main `pt-16` (4rem) + mali razmak ispod nav trake. */
const HEADER_OFFSET_PX = 80;

/**
 * Preglednik + `scroll-behavior: smooth` na `html` mogu programatski skrolati "mekano"
 * ili kasnije vratiti poziciju; privremeno ga isključujemo za trenutačni skrol na vrh.
 */
export function scrollDocumentToTopInstant() {
  const html = document.documentElement;
  const body = document.body;
  const prevHtml = html.style.scrollBehavior;
  const prevBody = body.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";

  const root = document.scrollingElement ?? html;
  root.scrollTop = 0;
  html.scrollTop = 0;
  body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  requestAnimationFrame(() => {
    html.style.scrollBehavior = prevHtml;
    body.style.scrollBehavior = prevBody;
  });
}

/**
 * `scrollIntoView({ block: "start" })` na kraju duge stranice često ne može poravnati vrh
 * s viewportom — preglednik skrola na maksimum i korisnik vidi *dno* sekcije.
 * Ručno računamo Y i oduzimamo visinu fiksne navigacije.
 */
function scrollToHashTarget(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const doc = document.scrollingElement ?? document.documentElement;
  const rawTop = rect.top + window.scrollY - HEADER_OFFSET_PX;
  const maxTop = Math.max(0, doc.scrollHeight - window.innerHeight);
  const top = Math.min(Math.max(0, rawTop), maxTop);

  window.scrollTo({ top, left: 0, behavior: "smooth" });
  return true;
}

/**
 * Pri svakoj navigaciji pomakne prozor na vrh, da se stranica ne otvara „negdje po sredini”.
 * Ručno scroll restoration — inače preglednik ponekad zadrži staru poziciju na SPA rutama.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    const hasFragment = Boolean(hash && hash.length > 1);
    if (!hasFragment) {
      scrollDocumentToTopInstant();
      return;
    }

    const id = hash.slice(1);
    if (scrollToHashTarget(id)) return;

    // Element još nije u DOM-u (sporiji render) — barem makni staru poziciju skrola.
    scrollDocumentToTopInstant();
  }, [pathname, search, hash]);

  useEffect(() => {
    if (!hash || hash.length <= 1) return;
    const id = hash.slice(1);

    let cancelled = false;
    const timers: number[] = [];
    const schedule = (ms: number) => {
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          scrollToHashTarget(id);
        }, ms),
      );
    };

    schedule(0);
    schedule(50);
    schedule(150);
    schedule(400);

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pathname, search, hash]);

  // Nakon layouta (fontovi, slike) još jednom bez hasha — da se ne „zašteka” dno stranice.
  useEffect(() => {
    if (hash && hash.length > 1) return;
    const t = window.setTimeout(() => {
      scrollDocumentToTopInstant();
    }, 0);
    const t2 = window.setTimeout(() => {
      scrollDocumentToTopInstant();
    }, 120);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [pathname, search, hash]);

  return null;
}
