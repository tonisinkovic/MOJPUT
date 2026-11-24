import { Link } from "react-router-dom";
import { adventSeasonMeta } from "@/lib/adventLeagueLanding";

export function AdventLandingFooter() {
  return (
    <footer
      className="advent-glass mt-4 rounded-2xl px-4 py-6 text-center sm:px-6"
      aria-label="Podnožje stranice lige"
    >
      <div className="advent-gold-line mb-6" />
      <p className="advent-text-ivory text-sm font-extrabold">
        Adventska kviz liga {adventSeasonMeta.year} · {adventSeasonMeta.startDate} – {adventSeasonMeta.endDate}
      </p>
      <p className="advent-text-muted mt-2 text-xs font-medium">
        Organizator: MojPut — alat za srednjoškolce, studente i roditelje.
      </p>
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-extrabold">
        <Link to="/adventska-liga/pravila" className="text-[hsl(var(--advent-gold))] hover:underline">
          Pravila
        </Link>
        <a href="#advent-rules" className="text-[hsl(var(--advent-frost)/0.5)] hover:text-[hsl(var(--advent-gold))] hover:underline">
          Kratki pregled
        </a>
        <Link to="/uvjeti" className="text-[hsl(var(--advent-gold))] hover:underline">
          Uvjeti korištenja
        </Link>
        <Link to="/privatnost" className="text-[hsl(var(--advent-gold))] hover:underline">
          Privatnost
        </Link>
        <Link to="/kontakt" className="text-[hsl(var(--advent-gold))] hover:underline">
          Kontakt
        </Link>
        <a href="#top" className="text-[hsl(var(--advent-frost)/0.4)] hover:text-[hsl(var(--advent-ivory))]">
          Na vrh
        </a>
      </nav>
      <p className="mt-3 text-[11px] font-medium text-[hsl(var(--advent-frost)/0.3)]">
        Globalno podnožje stranice nalazi se ispod (Platforma, Zajednica, Informacije).
      </p>
    </footer>
  );
}
