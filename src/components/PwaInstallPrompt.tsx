import { useEffect, useMemo, useState } from "react";
import { Download, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "mojput:pwa-install-dismissed";

function isStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function readDismissed(): boolean {
  return window.localStorage.getItem(DISMISS_KEY) === "1";
}

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(true);
  const [installed, setInstalled] = useState<boolean>(false);

  const isIos = useMemo(() => /iphone|ipad|ipod/i.test(navigator.userAgent), []);
  const isSafari = useMemo(
    () =>
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      !/crios|fxios|edgios/i.test(navigator.userAgent),
    [],
  );
  const isMobile = useMemo(
    () =>
      window.matchMedia("(max-width: 1023px)").matches ||
      /android|iphone|ipad|ipod/i.test(navigator.userAgent),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(readDismissed());
    setInstalled(isStandaloneMode());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const showIosInstructions = isMobile && isIos && !installed;
  const showInstallButton = isMobile && !isIos && !installed && Boolean(deferredPrompt);
  const shouldRender = !dismissed && (showIosInstructions || showInstallButton);

  const hidePrompt = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-xl border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Instaliraj MojPut na mobitel</p>
          {showInstallButton ? (
            <p className="text-xs text-muted-foreground">
              Instalacijom dobivas brzi pristup aplikaciji direktno s pocetnog zaslona.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {isSafari
                ? "Na iPhoneu tapni Share pa Add to Home Screen."
                : "Za iPhone instalaciju otvori stranicu u Safariju pa tapni Share -> Add to Home Screen."}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Zatvori instalacijski banner"
          onClick={hidePrompt}
          className="h-8 w-8 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {showInstallButton ? (
          <Button type="button" onClick={triggerInstall} className="h-9 flex-1">
            <Download className="h-4 w-4" />
            Instaliraj aplikaciju
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            <Share2 className="h-4 w-4 shrink-0" />
            <span>Share -&gt; Add to Home Screen</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
