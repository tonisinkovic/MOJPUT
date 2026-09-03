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
