import { useEffect, useState } from "react";

const STORAGE_KEY = "mojput_samoprocjena_save_consent";
const CHANGE_EVENT = "mojput:samoprocjena-save-consent";

export function getSamoprocjenaSaveConsent(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSamoprocjenaSaveConsent(granted: boolean): void {
  try {
    if (granted) localStorage.setItem(STORAGE_KEY, "1");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* privatni način rada */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: granted }));
}

/** Rezultati samoprocjene spremaju se na profil samo kad je ovo `true`; zadano je isključeno. */
export function useSamoprocjenaSaveConsent(): boolean {
  const [granted, setGranted] = useState(getSamoprocjenaSaveConsent);
  useEffect(() => {
    const onChange = () => setGranted(getSamoprocjenaSaveConsent());
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);
  return granted;
}
