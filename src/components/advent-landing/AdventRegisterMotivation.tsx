import { Link } from "react-router-dom";
import { trackAdventCtaClick } from "@/lib/adventLeagueAnalytics";
import { GraduationCap, Map, MessageCircle, Sparkles } from "lucide-react";

const perks = [
  {
    icon: Map,
    title: "Otkrij put",
    text: "Svaki dan kratko pitanje vezano uz škole, fakultete i MojPut alate.",
  },
  {
    icon: GraduationCap,
    title: "Uči kroz igru",
    text: "Bodovi i ljestvica motiviraju — bez školske dosade.",
  },
  {
    icon: MessageCircle,
    title: "Zajednica",
    text: "Isti račun za forum, kvizove i advent ligu.",
  },
  {
    icon: Sparkles,
    title: "Brzo u igru",
    text: "Registracija + potvrda emaila i možeš sudjelovati.",
  },
] as const;

export function AdventRegisterMotivation() {
  return (
    <section
      className="advent-glass rounded-2xl p-5 sm:p-7"
      aria-labelledby="advent-motivation-heading"
    >
      <h2 id="advent-motivation-heading" className="advent-text-ivory text-xl font-extrabold tracking-tight sm:text-2xl">
        Zašto ući u ligu?
      </h2>
      <p className="advent-text-muted mt-2 text-sm font-medium">
        MojPut ti pomaže birati smjer — advent liga pretvara to u dnevni mini-izazov.
      </p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {perks.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--advent-gold)/0.1)] text-[hsl(var(--advent-gold))]">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[hsl(var(--advent-ivory))]">{title}</h3>
              <p className="mt-0.5 text-xs font-medium leading-relaxed text-[hsl(var(--advent-frost)/0.6)] sm:text-sm">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="advent-text-ivory mt-5 text-center text-sm font-extrabold sm:text-left">
        Nemaš račun?{" "}
        <Link
          to="/registracija?next=/adventska-liga"
          onClick={() => trackAdventCtaClick("register_motivation")}
          className="text-[hsl(var(--advent-gold))] underline-offset-4 hover:underline"
        >
          Registriraj se besplatno
        </Link>
      </p>
    </section>
  );
}
