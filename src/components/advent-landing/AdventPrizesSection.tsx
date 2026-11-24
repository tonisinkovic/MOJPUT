import { useEffect, useState } from "react";
import { ExternalLink, Gift, Loader2 } from "lucide-react";
import { adventFetchPrizes, isPrizesApiError, type AdventPrizePublic } from "@/lib/adventLeaguePrizesApi";
import { cn } from "@/lib/utils";

function DemoBadge({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span className="rounded-md bg-[hsl(var(--advent-gold)/0.15)] text-[hsl(var(--advent-gold))] text-[10px] font-bold uppercase px-2 py-0.5">
      Demo
    </span>
  );
}

function PrizeImage({ prize }: { prize: AdventPrizePublic }) {
  if (prize.imageUrl) {
    return (
      <img
        src={prize.imageUrl}
        alt=""
        className="mb-3 h-28 w-full rounded-xl object-cover"
        loading="lazy"
      />
    );
  }
  return (
    <div
      className="advent-glass-frost mb-3 flex h-28 w-full items-center justify-center rounded-xl text-4xl"
      aria-hidden
    >
      🎁
    </div>
  );
}

function PartnerLogo({ name, logoUrl, websiteUrl, isDemo }: { name: string; logoUrl?: string | null; websiteUrl?: string | null; isDemo?: boolean }) {
  const inner = logoUrl ? (
    <img src={logoUrl} alt={name} className="h-8 max-w-[120px] object-contain" loading="lazy" />
  ) : (
    <span className="text-xs font-bold text-[hsl(var(--advent-frost)/0.5)]">{name}</span>
  );

  if (websiteUrl && !isDemo) {
    return (
      <a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="advent-glass-frost inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:brightness-125"
      >
        {inner}
        <ExternalLink className="h-3 w-3 text-[hsl(var(--advent-frost)/0.4)]" aria-hidden />
      </a>
    );
  }
  return <div className="advent-glass-frost inline-flex rounded-lg px-2 py-1">{inner}</div>;
}

function PrizeCard({ prize }: { prize: AdventPrizePublic }) {
  return (
    <li>
      <div className="advent-glass h-full rounded-2xl overflow-hidden">
        <div className="space-y-2 p-4 pb-2">
          <PrizeImage prize={prize} />
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="advent-text-ivory text-base font-extrabold">{prize.name}</h4>
            <DemoBadge show={prize.isDemo} />
          </div>
          <span className="advent-glass-frost inline-flex rounded-md text-[10px] font-semibold uppercase text-[hsl(var(--advent-frost)/0.6)] px-2 py-0.5">
            {prize.category}
          </span>
        </div>
        <div className="space-y-3 px-4 pb-4 text-sm font-medium leading-relaxed advent-text-muted">
          <p>{prize.description}</p>
          {prize.partner ? (
            <div className="flex flex-col gap-1 border-t border-[hsl(var(--advent-frost)/0.1)] pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--advent-frost)/0.5)]">Partner</span>
              <PartnerLogo
                name={prize.partner.name}
                logoUrl={prize.partner.logoUrl}
                websiteUrl={prize.partner.websiteUrl}
                isDemo={prize.partner.isDemo}
              />
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function AdventPrizesSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainPrizes, setMainPrizes] = useState<AdventPrizePublic[]>([]);
  const [dailyPrizes, setDailyPrizes] = useState<AdventPrizePublic[]>([]);
  const [hasDemo, setHasDemo] = useState(false);

  useEffect(() => {
    let alive = true;
    adventFetchPrizes().then((res) => {
      if (!alive) return;
      setLoading(false);
      if (isPrizesApiError(res) || !res.data) {
        setError(res.success ? "Nagrade nisu dostupne." : res.message);
        return;
      }
      setMainPrizes(res.data.mainPrizes);
      setDailyPrizes(res.data.dailyPrizes);
      setHasDemo(res.data.hasDemoContent);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section aria-labelledby="advent-prizes-heading">
      <h2 id="advent-prizes-heading" className="advent-text-ivory mb-3 text-xl font-extrabold tracking-tight sm:text-2xl">
        Nagrade i partneri
      </h2>
      <p className="advent-text-muted mb-4 text-sm font-medium">
        Pregled nagrada i partnera Adventske lige.{" "}
        {hasDemo ? (
          <span className="font-semibold text-[hsl(var(--advent-gold))]">Označeno „Demo" je placeholder do službene objave.</span>
        ) : null}
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--advent-frost)/0.5)]">
          <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--advent-gold))]" />
          Učitavam nagrade…
        </div>
      ) : null}

      {error ? (
        <p className="advent-glass-frost rounded-xl px-4 py-3 text-sm text-[hsl(var(--advent-cranberry))]">{error}</p>
      ) : null}

      {!loading && !error ? (
        <div className={cn("space-y-8")}>
          <div>
            <h3 className="advent-text-ivory mb-3 text-sm font-extrabold uppercase tracking-wider">Glavne nagrade</h3>
            {mainPrizes.length === 0 ? (
              <p className="text-sm text-[hsl(var(--advent-frost)/0.5)]">Glavne nagrade još nisu objavljene.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mainPrizes.map((p) => (
                  <PrizeCard key={p.id} prize={p} />
                ))}
              </ul>
            )}
          </div>

          {dailyPrizes.length > 0 ? (
            <div>
              <h3 className="advent-text-ivory mb-3 text-sm font-extrabold uppercase tracking-wider">Dnevne nagrade</h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dailyPrizes.map((p) => (
                  <PrizeCard key={p.id} prize={p} />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[hsl(var(--advent-frost)/0.4)]">
        <Gift className="h-3.5 w-3.5" aria-hidden />
        Detalji u pravilima sudjelovanja na dnu stranice.
      </p>
    </section>
  );
}
