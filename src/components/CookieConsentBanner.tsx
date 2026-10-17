import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAnalyticsConsent, setAnalyticsConsent, type AnalyticsConsent } from "@/lib/analytics";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getAnalyticsConsent() === null);
  }, []);

  if (!visible) return null;

  const choose = (consent: AnalyticsConsent) => {
    setAnalyticsConsent(consent);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Postavke kolačića"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-xl rounded-xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div className="space-y-1">
          <p className="text-sm font-semibold">Kolačići za analitiku</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Nužni kolačići omogućuju prijavu i rad stranice. Uz tvoje dopuštenje koristimo i Google Analytics da
            vidimo koje se stranice koriste — bez oglasa i bez prodaje podataka. Odluku možeš promijeniti na stranici{" "}
            <Link to="/privatnost" className="font-medium text-primary underline-offset-2 hover:underline">
              Privatnost
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="h-9" onClick={() => choose("denied")}>
          Odbijam
        </Button>
        <Button type="button" className="h-9" onClick={() => choose("granted")}>
          Prihvaćam
        </Button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
