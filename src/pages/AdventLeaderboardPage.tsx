import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { AdventPageSeo } from "@/components/advent/AdventPageSeo";
import { AdventThemeWrapper } from "@/components/advent/AdventThemeWrapper";
import { AdventSnowfall } from "@/components/advent/AdventSnowfall";
import { AdventLeaderboard } from "@/components/advent-landing/AdventLeaderboard";
import { getSeasonPhase, getZagrebDayKey } from "@/lib/adventLeagueLanding";
import { isLocalhostBrowser } from "@/lib/adventLocalTest";
import season from "@/data/advent-league/season.json";

const AdventLeaderboardPage = () => {
  const location = useLocation();
  const todayKey = useMemo(() => getZagrebDayKey(), []);
  const phase = useMemo(() => getSeasonPhase(todayKey), [todayKey]);
  const localTest = isLocalhostBrowser();
  const dayKeyForDaily = localTest ? season.startDate : phase === "active" ? todayKey : undefined;
  const celebrate = new URLSearchParams(location.search).get("slavlje") === "1";

  return (
    <Layout>
      <AdventPageSeo page="leaderboard" />
      <AdventThemeWrapper>
        <div className="relative min-h-screen advent-surface-primary">
          <AdventSnowfall light />
          <div className="relative z-10 mx-auto w-full max-w-lg px-4 pb-16 pt-8 sm:max-w-xl sm:px-5 sm:pt-10">
            <Link
              to="/adventska-liga"
              className="mb-4 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-bold advent-text-muted hover:text-[hsl(var(--advent-ivory))] transition-colors"
            >
              ← Adventska liga
            </Link>
            <AdventLeaderboard
              variant="full"
              todayKey={dayKeyForDaily}
              defaultScope="season"
              celebrate={celebrate}
            />
          </div>
        </div>
      </AdventThemeWrapper>
    </Layout>
  );
};

export default AdventLeaderboardPage;
