import { Shield } from "lucide-react";
import { ADVENT_RULES_SHORT, adventSeasonMeta } from "@/lib/adventLeagueLanding";

const ruleEmojis = ["👤", "⚡", "🏆", "🔐", "📆"] as const;

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
          const emoji = ruleEmojis[i] ?? "✨";
          return (
            <div
              key={i}
              className="advent-glass-gold group cursor-default rounded-2xl p-4 opacity-0 transition-all animate-advent-fade-up hover:scale-105 hover:shadow-2xl hover:shadow-[hsl(var(--advent-gold)/0.3)]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--advent-gold)/0.15)] text-xl ring-2 ring-[hsl(var(--advent-gold)/0.3)]"
                  aria-hidden
                >
                  {emoji}
                </div>
                <span className="text-lg font-extrabold text-[hsl(var(--advent-gold))]">{i + 1}.</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed advent-text-ivory">{rule}</p>
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
