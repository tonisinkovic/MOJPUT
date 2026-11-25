import type { ReactNode } from "react";
import Layout from "@/components/Layout";
import { AdventPageSeo } from "@/components/advent/AdventPageSeo";
import { AdventThemeWrapper } from "@/components/advent/AdventThemeWrapper";
import { AdventLandingFooter } from "@/components/advent-landing";
import { ADVENT_RULES_SHORT, adventSeasonMeta } from "@/lib/adventLeagueLanding";
import { Link } from "react-router-dom";

const RULE_EMOJIS = ["👤", "⚡", "🏆", "🔐", "📆"] as const;

export default function AdventPravila() {
  return (
    <AdventThemeWrapper>
      <Layout>
        <AdventPageSeo page="pravila" />
        <div className="advent-surface-primary min-h-[calc(100dvh-4rem)] px-4 py-10 sm:px-6">
          <Shell>
            <h1 className="advent-heading advent-text-gold text-2xl sm:text-3xl">📜 Pravila Adventske lige</h1>
            <p className="advent-text-muted mt-2 text-sm font-medium">
              Sezona {adventSeasonMeta.year}: {adventSeasonMeta.startDate} – {adventSeasonMeta.endDate} (Europe/Zagreb)
            </p>

            <ul className="mt-6 space-y-3">
              {ADVENT_RULES_SHORT.map((rule, i) => (
                <li key={i} className="advent-glass-gold rounded-2xl p-4">
                  <span className="mr-2 text-lg" aria-hidden>
                    {RULE_EMOJIS[i] ?? "✨"}
                  </span>
                  <span className="advent-text-ivory text-sm font-semibold leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>

            <div className="advent-glass-frost mt-6 rounded-xl border border-dashed border-[hsl(var(--advent-gold)/0.25)] p-4 text-sm advent-text-muted">
              <p className="font-bold text-[hsl(var(--advent-gold))]">Poštena igra</p>
              <p className="mt-1 font-medium">
                Jedan račun, jedan pokušaj dnevno. Bodove i ljestvicu računa server. Referral link otvara najviše jednu
                nadoknadu najranijeg propuštenog dana nakon prijave. Ostali propušteni dani ostaju zatvoreni.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/adventska-liga" className="advent-btn-gold rounded-xl px-5 py-2.5 text-sm font-bold">
                Natrag na ligu
              </Link>
              <Link
                to="/adventska-liga/kviz"
                className="advent-btn-ghost rounded-xl px-5 py-2.5 text-sm font-bold"
              >
                Današnji kviz
              </Link>
            </div>

            <div className="mt-10 border-t border-[hsl(var(--advent-frost)/0.1)] pt-6">
              <AdventLandingFooter />
            </div>
          </Shell>
        </div>
      </Layout>
    </AdventThemeWrapper>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <article className="mx-auto max-w-2xl">{children}</article>;
}