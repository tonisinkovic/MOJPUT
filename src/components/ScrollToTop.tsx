import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollDocumentToTop() {
  const root = document.scrollingElement ?? document.documentElement;
  root.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
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

  useEffect(() => {
    if (hash && hash.length > 1) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
    }

    scrollDocumentToTop();
    // Nakon layouta nove rute (slike, fontovi) još jednom — da se ne „vrati” dno.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(scrollDocumentToTop);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, search, hash]);

  return null;
}
