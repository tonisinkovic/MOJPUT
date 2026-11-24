import { Calendar, Trophy, Target, Gift, Users, Shield } from "lucide-react";
import { ADVENT_RULES_SHORT, adventSeasonMeta } from "@/lib/adventLeagueLanding";

const ruleIcons = [Calendar, Target, Trophy, Users, Gift, Shield];

export function AdventRulesSection() {
  return (
    <section id="advent-rules" className="scroll-mt-24" aria-labelledby="advent-rules-heading">
      <h2 id="advent-rules-heading" className="advent-heading advent-text-gold mb-4 text-2xl sm:text-3xl">
        🎄 Kako ligu igraš 🎁
      </h2>
      <p className="mb-5 text-sm font-semibold advent-text-muted">
        Sezona {adventSeasonMeta.year}: {adventSeasonMeta.startDate} – {adventSeasonMeta.endDate}
      </p>

      {/* Visual rule cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADVENT_RULES_SHORT.map((rule, i) => {
          const Icon = ruleIcons[i] || Target;
          return (
            <div
              key={i}
              className="advent-glass-gold group rounded-2xl p-4 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(var(--advent-gold)/0.3)] cursor-default"
              style={{
                animation: `advent-fade-up 0.4s ease-out forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--advent-gold)/0.15)] text-[hsl(var(--advent-gold))] ring-2 ring-[hsl(var(--advent-gold)/0.3)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-1.5">
                    <span className="text-lg font-extrabold text-[hsl(var(--advent-gold))]">
                      {i + 1}.
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold leading-relaxed advent-text-ivory">
                {rule}
              </p>
            </div>
          );
        })}
      </div>

      {/* Fair play notice */}
      <div className="mt-6 advent-glass-frost rounded-xl border-2 border-dashed border-[hsl(var(--advent-gold)/0.3)] p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 shrink-0 text-[hsl(var(--advent-gold))]" aria-hidden />
          <div>
            <p className="mb-1 text-sm font-extrabold text-[hsl(var(--advent-gold))]">
              ⚖️ Poštena igra
            </p>
            <p className="text-sm font-medium leading-relaxed advent-text-muted">
              Jedan račun, jedan pokušaj dnevno. Bodovi se računaju na serveru kad backend bude aktivan — ne diraj
              odgovore u alatima za developere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
