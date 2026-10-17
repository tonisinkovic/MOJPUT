import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { authGoogleClientId } from "@/lib/auth";

type GoogleCredentialResponse = { credential?: string };

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    ux_mode?: "popup" | "redirect";
    context?: "signin" | "signup" | "use";
    itp_support?: boolean;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
  prompt: (momentListener?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleAccountsId } };
  }
}

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>('script[data-mojput-gsi="1"]');
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("gsi")), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client?hl=hr";
    script.async = true;
    script.defer = true;
    script.dataset.mojputGsi = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("gsi"));
    document.head.appendChild(script);
  });
}

type Props = {
  disabled?: boolean;
  busy?: boolean;
  text?: "continue_with" | "signup_with" | "signin_with";
  /** Vrati prijavu bez novog klika ako je ovaj preglednik već potvrdio taj Google račun. */
  autoSelect?: boolean;
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
};

/** Službeni gumb „Nastavi s Googleom”. Sakriven dok API ne vrati GOOGLE_CLIENT_ID. */
export default function GoogleSignInButton({
  disabled,
  busy,
  text = "continue_with",
  autoSelect = false,
  onCredential,
  onError,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  onCredentialRef.current = onCredential;
  onErrorRef.current = onError;
  const [clientId, setClientId] = useState<string | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "off" | "error">("loading");

  useEffect(() => {
    let alive = true;
    authGoogleClientId()
      .then((id) => {
        if (!alive) return;
        if (!id) {
          setPhase("off");
          return;
        }
        setClientId(id);
        setPhase("ready");
      })
      .catch(() => {
        if (alive) setPhase("off");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (phase !== "ready" || !clientId) return;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        const host = hostRef.current;
        const gis = window.google?.accounts?.id;
        if (!host || !gis) {
          setPhase("error");
          onErrorRef.current("Google prijava se nije učitala. Osvježi stranicu.");
          return;
        }
        host.innerHTML = "";
        gis.initialize({
          client_id: clientId,
          auto_select: autoSelect,
          cancel_on_tap_outside: true,
          context: text === "signup_with" ? "signup" : "signin",
          itp_support: true,
          ux_mode: "popup",
          callback: (response) => {
            const credential = String(response?.credential || "").trim();
            if (!credential) {
              onErrorRef.current("Google nije vratio potvrdu. Pokušaj ponovno.");
              return;
            }
            onCredentialRef.current(credential);
          },
        });
        const width = Math.max(240, Math.min(host.clientWidth || 360, 400));
        gis.renderButton(host, {
          type: "standard",
          theme: "outline",
          size: "large",
          text,
          shape: "pill",
          logo_alignment: "left",
          width,
          locale: "hr",
        });
        if (autoSelect && typeof gis.prompt === "function") {
          try {
            gis.prompt();
          } catch {
            /* gumb i dalje radi ako One Tap nije dostupan */
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        setPhase("error");
        onErrorRef.current("Google prijava se nije učitala. Provjeri vezu i osvježi stranicu.");
      });
    return () => {
      cancelled = true;
    };
  }, [autoSelect, clientId, phase, text]);

  if (phase === "off") {
    if (import.meta.env.DEV) {
      return (
        <p className="mb-4 rounded-xl border border-border/70 bg-muted/40 px-3.5 py-2.5 text-[12.5px] leading-snug text-muted-foreground">
          Google prijava čeka <span className="font-semibold text-foreground">GOOGLE_CLIENT_ID</span> u .env.
          To je Web client iz Google Clouda, s originom http://localhost:8080 te https://mojput.com i
          https://www.mojput.com. Nakon toga restartaj API.
        </p>
      );
    }
    return null;
  }
  if (phase === "loading") {
    return <div className="mb-4 h-11 w-full animate-pulse rounded-full bg-muted/70" aria-hidden />;
  }
  if (phase === "error") return null;

  return (
    <div className="mb-4 space-y-4">
      <div className={disabled ? "pointer-events-none opacity-60" : undefined}>
        <div ref={hostRef} className="flex min-h-11 w-full justify-center [&>div]:w-full" />
        {busy ? (
          <p className="mt-2 flex items-center justify-center gap-2 text-[12.5px] font-medium text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Povezujem Google račun…
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">ili</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
