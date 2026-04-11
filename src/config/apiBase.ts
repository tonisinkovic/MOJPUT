/**
 * Javni Node API (Render). U dev: "" → Vite proxy na 127.0.0.1:3000.
 * Zadana vrijednost kad build nema VITE_API_URL (npr. stari CI) — mora odgovarati deployanom Render servisu.
 */
export const DEFAULT_PRODUCTION_API = "https://mojput.onrender.com";

export const API_BASE_URL =
  import.meta.env.DEV
    ? ""
    : String(import.meta.env.VITE_API_URL || DEFAULT_PRODUCTION_API).replace(/\/$/, "");
