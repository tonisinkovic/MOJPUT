import { Link } from "react-router-dom";
import { Gamepad2, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackAdventCtaClick } from "@/lib/adventLeagueAnalytics";
import { getSeasonPhase } from "@/lib/adventLeagueLanding";

const LOGIN_NEXT = "/prijava?next=/adventska-liga";
const REGISTER_NEXT = "/registracija?next=/adventska-liga";

type AdventPlayCtaProps = {
  loggedIn: boolean;
  onPlayToday?: () => void;
};

export function AdventPlayCta({ loggedIn, onPlayToday }: AdventPlayCtaProps) {
  const phase = getSeasonPhase();

  return (
    <section
      id="advent-cta"
      className="scroll-mt-24 advent-glass-gold rounded-2xl p-5 sm:p-7"
      aria-labelledby="advent-cta-heading"
    >
      <h2 id="advent-cta-heading" className="advent-heading advent-text-gold text-2xl sm:text-3xl">
        🎮 Spreman/na za današnji kviz? 🌟
      </h2>
      <p className="mt-2 text-sm font-medium leading-relaxed advent-text-muted">
        {phase === "before"
          ? "Liga još nije počela — registriraj se sad da ne propustiš prvi dan."
          : phase === "after"
            ? "Ova sezona je završila. Pregledaj ljestvicu i pripremi se za sljedeću rundu."
            : "10 pitanja dnevno — bodovi i bonus za brzinu čekaju na tebe."}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {loggedIn ? (
          <Button
            type="button"
            size="lg"
            className="advent-btn-gold advent-shimmer rounded-xl min-h-12 w-full sm:w-auto px-6 text-sm font-extrabold inline-flex items-center gap-2 justify-center"
            disabled={phase !== "active"}
            onClick={() => onPlayToday?.()}
          >
            <Sparkles className="h-4 w-4 animate-advent-sparkle" />
            <Gamepad2 className="h-4 w-4" />
            {phase === "active" ? "Idi na današnji dan" : phase === "before" ? "Uskoro start" : "Sezona završena"}
          </Button>
        ) : (
          <>
            <Button
              asChild
              size="lg"
              className="advent-btn-gold advent-shimmer rounded-xl min-h-12 w-full sm:w-auto px-6 text-sm font-extrabold inline-flex items-center gap-2"
            >
              <Link to={LOGIN_NEXT} onClick={() => trackAdventCtaClick("login")}>
                Prijavi se i igraj
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="advent-btn-ghost rounded-xl min-h-12 w-full sm:w-auto px-6 text-sm font-extrabold inline-flex items-center gap-2"
            >
              <Link to={REGISTER_NEXT} onClick={() => trackAdventCtaClick("register")}>
                <UserPlus className="h-4 w-4" />
                Novi MojPut račun
              </Link>
            </Button>
          </>
        )}
      </div>

      {!loggedIn ? (
        <p className="mt-3 text-xs font-semibold advent-text-muted">
          Besplatna registracija · potvrda emaila · isti račun za forum, kvizove i ligu
        </p>
      ) : null}
    </section>
  );
}
