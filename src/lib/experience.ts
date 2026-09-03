export type MojPutExperienceMode = "junior" | "senior";

const STORAGE_KEY = "mojput-experience";
const CHANGE_EVENT = "mojput-experience-changed";

export function getStoredExperience(): MojPutExperienceMode | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "junior" || v === "senior" ? v : null;
  } catch {
    return null;
  }
}

export function storeExperience(mode: MojPutExperienceMode | null): void {
  try {
    if (mode) {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage nedostupan (privatni način rada) — ignoriraj
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

const PREFERRED_KEY_PREFIX = "mojput-preferred-experience";

function preferredKeyFor(email?: string | null): string {
  const em = String(email || "").trim().toLowerCase();
  return em ? `${PREFERRED_KEY_PREFIX}:${em}` : PREFERRED_KEY_PREFIX;
}

/**
 * Preferirani MojPut (Junior/Senior) odabran pri registraciji ili zadnjim ulaskom.
 * Sprema se po emailu korisnika + globalni fallback (za tijek registracija → prijava).
 */
export function getPreferredExperience(email?: string | null): MojPutExperienceMode | null {
  try {
    const v =
      window.localStorage.getItem(preferredKeyFor(email)) ??
      window.localStorage.getItem(PREFERRED_KEY_PREFIX);
    return v === "junior" || v === "senior" ? v : null;
  } catch {
    return null;
  }
}

export function storePreferredExperience(
  mode: MojPutExperienceMode,
  email?: string | null,
): void {
  try {
    window.localStorage.setItem(PREFERRED_KEY_PREFIX, mode);
    const keyed = preferredKeyFor(email);
    if (keyed !== PREFERRED_KEY_PREFIX) {
      window.localStorage.setItem(keyed, mode);
    }
  } catch {
    // localStorage nedostupan — ignoriraj
  }
}

export function resolveExperienceMode(
  searchParams?: URLSearchParams | null,
): MojPutExperienceMode {
  const fromUrl = searchParams?.get("experience");
  if (fromUrl === "junior" || fromUrl === "senior") return fromUrl;
  return getStoredExperience() ?? "senior";
}

export function onExperienceChange(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
