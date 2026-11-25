import { useCallback, useEffect, useState } from "react";
import { Gift, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { adventEnterPrizeDraw, adventFetchPrizeDrawMe, isApiError } from "@/lib/adventLeagueApi";
import { trackAdventCtaClick } from "@/lib/adventLeagueAnalytics";

type Props = {
  loggedIn: boolean;
  /** Ako već znamo iz /api/advent/me */
  initialEntered?: boolean;
};

export function AdventPrizeDrawSection({ loggedIn, initialEntered }: Props) {
  const [entered, setEntered] = useState(Boolean(initialEntered));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialEntered != null) {
      setEntered(initialEntered);
      return;
    }
    if (!loggedIn) return;
    let alive = true;
    adventFetchPrizeDrawMe().then((res) => {
      if (!alive || isApiError(res) || !res.data) return;
      setEntered(res.data.entered);
    });
    return () => {
      alive = false;
    };
  }, [initialEntered, loggedIn]);

  const onEnter = useCallback(async () => {
    setPending(true);
    setMessage(null);
    trackAdventCtaClick("prize_draw_enter");
    const res = await adventEnterPrizeDraw();
    setPending(false);
    if (isApiError(res)) {
      setMessage(res.message || "Prijava nije uspjela.");
      return;
    }
    setEntered(true);
    setMessage(res.data?.already ? "Već si u nagradnoj igri — sretno pri izvlačenju!" : "Uspješno si prijavljen u nagradnu igru!");
  }, []);

  return (
    <section
      className="advent-glass-gold rounded-2xl border border-[hsl(var(--advent-gold)/0.25)] p-5 sm:p-7"
      aria-labelledby="advent-prize-draw-heading"
    >
      <motionHead>
        <Gift className="h-6 w-6 text-[hsl(var(--advent-gold))]" aria-hidden />
        <div>
          <h2 id="advent-prize-draw-heading" className="advent-text-ivory text-lg font-extrabold sm:text-xl">
            Nagradna igra
          </h2>
          <p className="advent-text-muted mt-1 text-sm font-medium">
            Jednim klikom ulaziš u izvlačenje među sudionicima lige.{" "}
            <strong className="font-bold text-[hsl(var(--advent-ivory))]">Ne donosi bodove</strong> na ljestvici — bodove
            dobivaš samo kroz kviz.
          </p>
        </div>
      </motionHead>

      {!loggedIn ? (
        <p className="mt-4 text-sm font-semibold text-[hsl(var(--advent-frost)/0.85)]">
          <Link to="/prijava?next=/adventska-liga" className="text-[hsl(var(--advent-gold))] underline-offset-4 hover:underline">
            Prijavi se
          </Link>{" "}
          pa klikni sudjelovanje u nagradnoj igri.
        </p>
      ) : entered ? (
        <p className="mt-4 rounded-xl bg-[hsl(var(--advent-evergreen)/0.35)] px-4 py-3 text-sm font-semibold text-[hsl(var(--advent-ivory))]">
          ✅ Prijavljen si u nagradnu igru. MojPut će nasumično odabrati dobitnika među svima koji su kliknuli
          sudjelovanje.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={pending}
            onClick={() => void onEnter()}
            className="advent-cta-gold inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Sudjeluj u nagradnoj igri
          </button>
          <p className="text-xs font-medium text-[hsl(var(--advent-frost)/0.55)]">Pohranjujemo tvoj MojPut račun u listu sudionika.</p>
        </div>
      )}

      {message ? <p className="mt-3 text-sm font-semibold text-[hsl(var(--advent-gold))]">{message}</p> : null}
    </section>
  );
}

function motionHead({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3">{children}</div>;
}