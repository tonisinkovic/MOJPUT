import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(getAnalyticsConsent() == null);
  }, []);

  if (!open) return null;

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 p-4 shadow-[0_-8px_30px_-12px_hsl(215_30%_12%/0.35)] backdrop-blur-md [padding-bottom:max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
        <div className="min-w-0 flex-1">
          <p id="cookie-consent-title" className="text-sm font-semibold text-foreground">
            Kolačići i analitika
          </p>
          <p id="cookie-consent-desc" className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Nužni kolačići drže prijavu i postavke. Analitiku (Google Analytics) palimo samo ako pristaneš — da
            vidimo koje stranice pomažu. Ne koristimo oglase.{" "}
            <Link to="/privatnost" className="font-semibold text-primary underline-offset-2 hover:underline">
              Privatnost
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row">
          <Button type="button" variant="outline" className="min-h-11 rounded-xl" onClick={() => choose(false)}>
            Samo nužno
          </Button>
          <Button type="button" className="min-h-11 rounded-xl" onClick={() => choose(true)}>
            Prihvati analitiku
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
