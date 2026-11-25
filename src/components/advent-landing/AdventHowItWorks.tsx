import { Clock, LogIn, Puzzle, Trophy } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "1. Prijava u MojPut",
    text: "Registriraj se i potvrdi email — isti račun za forum, kvizove i ligu.",
  },
  {
    icon: Puzzle,
    title: "2. Deset pitanja dnevno",
    text: "Svaki kviz dan (5.–24. 12.) donosi 10 pitanja: izbor, upis ili procjena udaljenosti.",
  },
  {
    icon: Clock,
    title: "3. Bodovi i brzina",
    text: "Točan odgovor donosi bodove prema brzini — brži točan odgovor vrijedi više, do 100 bodova po pitanju.",
  },
  {
    icon: Trophy,
    title: "4. Ljestvica i nagrade",
    text: "Skupljaj bodove kroz prosinac i prati poredak — detalji nagrada u pravilima kampanje.",
  },
] as const;

export function AdventHowItWorks() {
  return (
    <section id="advent-how" className="scroll-mt-24" aria-labelledby="advent-how-heading">
      <h2 id="advent-how-heading" className="advent-heading advent-text-gold text-2xl sm:text-3xl">
        ❄️ Kako kviz funkcionira ✨
      </h2>
      <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed advent-text-muted">
        Svaki dan jedan kratki kviz od 10 pitanja. Jedan pokušaj, bodove računa server, rezultat ide na ljestvicu.
      </p>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <div className="flex h-full gap-3 advent-glass rounded-2xl p-4 sm:p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--advent-gold)/0.1)] text-[hsl(var(--advent-gold))]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-[hsl(var(--advent-ivory))]">{title}</h3>
                <p className="mt-1 text-xs font-medium leading-relaxed text-[hsl(var(--advent-frost)/0.6)] sm:text-sm">{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
