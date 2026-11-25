import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { AdventPageSeo } from "@/components/advent/AdventPageSeo";
import { AdventThemeWrapper } from "@/components/advent/AdventThemeWrapper";
import { AdventSplashOverlay } from "@/components/advent/AdventSplashOverlay";
import { AdventSnowfall } from "@/components/advent/AdventSnowfall";
import { AdventTwinklingStars } from "@/components/advent/AdventTwinklingStars";
import { AdventFloatingOrnaments } from "@/components/advent/AdventFloatingOrnaments";
import { AdventChristmasLights } from "@/components/advent/AdventChristmasLights";
import { AdventChristmasTree } from "@/components/advent/AdventChristmasTree";
import { AdventPwaInstallHint } from "@/components/advent/AdventPwaInstallHint";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import {
  AdventDayGrid,
  AdventHowItWorks,
  AdventLandingFooter,
  AdventLandingHero,
  AdventLeaderboard,
  AdventPlayCta,
  AdventPrizesSection,
  AdventRegisterMotivation,
  AdventRulesSection,
  AdventPrizeDrawSection,
  AdventReferralCatchUpCta,
} from "@/components/advent-landing";
import { adventFetchMe, isApiError } from "@/lib/adventLeagueApi";
import { buildAdventCalendarDays, getSeasonPhase, getZagrebDayKey, type AdventCalendarDay } from "@/lib/adventLeagueLanding";
import { trackAdventCtaClick, trackAdventLandingView } from "@/lib/adventLeagueAnalytics";
import { runAdventReferralCapture } from "@/lib/adventLeagueReferral";

const AdventskaLiga = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [scoresByDay, setScoresByDay] = useState<Record<string, number>>({});
  const [catchUpDayKey, setCatchUpDayKey] = useState<string | null>(null);
  const [joinDayKey, setJoinDayKey] = useState<string | null>(null);
  const [prizeDrawEntered, setPrizeDrawEntered] = useState(false);

  const todayKey = useMemo(() => getZagrebDayKey(), []);
  const phase = useMemo(() => getSeasonPhase(todayKey), [todayKey]);
  const leaderboardDayKey = phase === "active" ? todayKey : undefined;
  const calendarDays = useMemo(
    () => buildAdventCalendarDays(scoresByDay, todayKey, { joinDayKey, catchUpDayKey }),
    [scoresByDay, todayKey, joinDayKey, catchUpDayKey],
  );
  const catchUpDayNumber = useMemo(() => {
    if (!catchUpDayKey) return null;
    const d = calendarDays.find((c) => c.dayKey === catchUpDayKey);
    return d?.dayNumber ?? null;
  }, [calendarDays, catchUpDayKey]);

  useEffect(() => {
    void runAdventReferralCapture(location.search, location.pathname);
  }, [location.pathname, location.search]);

  useEffect(() => {
    trackAdventLandingView({ logged_in: Boolean(user), season_phase: phase });
  }, [phase, user]);

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      setUser(userFromAuthMe(res));
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    adventFetchMe().then((res) => {
      if (!alive || isApiError(res) || !res.data) return;
      setScoresByDay(res.data.scoresByDay);
      setCatchUpDayKey(res.data.catchUpDayKey ?? null);
      setJoinDayKey(res.data.joinDayKey ?? null);
      setPrizeDrawEntered(Boolean(res.data.prizeDraw?.entered));
    });
    return () => {
      alive = false;
    };
  }, [user]);

  const scrollToCalendar = useCallback(() => {
    document.getElementById("advent-calendar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToTodayQuiz = useCallback(() => {
    trackAdventCtaClick("play_today");
    navigate("/adventska-liga/kviz");
  }, [navigate]);

  const onDaySelect = useCallback(
    (day: AdventCalendarDay) => {
      if (day.status === "catch_up") {
        trackAdventCtaClick("calendar_catchup");
        navigate(`/adventska-liga/kviz/${day.dayKey}`);
        return;
      }
      if (day.status !== "available") {
        scrollToCalendar();
        return;
      }
      trackAdventCtaClick("calendar_day");
      goToTodayQuiz();
    },
    [goToTodayQuiz, navigate, scrollToCalendar],
  );

  const onParticipate = useCallback(() => {
    trackAdventCtaClick("participate_hero");
    if (phase === "active" && user) {
      goToTodayQuiz();
      return;
    }
    if (phase === "active") {
      scrollToCalendar();
      return;
    }
    if (!user) return;
    scrollToCalendar();
  }, [goToTodayQuiz, phase, scrollToCalendar, user]);

  return (
    <AdventThemeWrapper>
      <Layout>
        <AdventPageSeo page="landing" />
        <AdventSplashOverlay />
        <AdventSnowfall />
        <AdventTwinklingStars />
        <AdventFloatingOrnaments />

        {/* Page shell: warm burgundy-to-evergreen gradient */}
        <div id="top" className="relative min-h-screen advent-surface-primary">
          {/* Christmas lights across the top */}
          <AdventChristmasLights className="top-0" />
          
          {/* Christmas tree decoration (desktop only) */}
          <div className="advent-orb-gold hidden lg:block" style={{ width: 420, height: 420, top: "3%", right: "-6%", opacity: 0.2 }} aria-hidden />
          <div className="hidden lg:flex fixed bottom-8 right-8 z-20">
            <AdventChristmasTree />
          </div>
          
          {/* Ambient warm glow decorations */}
          <div className="hidden lg:block absolute rounded-full blur-3xl" style={{ width: 320, height: 320, top: "25%", left: "-4%", opacity: 0.15, background: "radial-gradient(circle, hsl(25 75% 55%), transparent 70%)", animation: "advent-glow-pulse 6s ease-in-out infinite" }} aria-hidden />
          <div className="advent-orb-frost hidden lg:block" style={{ width: 280, height: 280, bottom: "12%", right: "8%", opacity: 0.08 }} aria-hidden />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-20 sm:px-5 sm:pb-16 sm:pt-24">
            <AdventPwaInstallHint />
            <div className="flex flex-col gap-8 lg:gap-10">
              <AdventLandingHero loggedIn={Boolean(user)} username={user?.username} />

              <AdventHowItWorks />

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:gap-10">
                <div className="space-y-8">
                  <AdventPlayCta loggedIn={Boolean(user)} onPlayToday={onParticipate} />
                  {catchUpDayKey && catchUpDayNumber ? (
                    <AdventReferralCatchUpCta catchUpDayKey={catchUpDayKey} dayNumber={catchUpDayNumber} />
                  ) : null}
                  <AdventDayGrid days={calendarDays} todayKey={todayKey} onDaySelect={onDaySelect} />
                  {user ? (
                    <AdventPrizeDrawSection loggedIn initialEntered={prizeDrawEntered} />
                  ) : null}
                  {phase === "before" ? (
                    <p className="advent-glass-gold rounded-xl px-4 py-3 text-sm font-semibold" style={{ color: "hsl(var(--advent-gold))" }}>
                      Kalendar je otvoren cijeli prosinac. Kviz pitanja kreću 5. prosinca.
                    </p>
                  ) : null}
                  {phase === "active" ? (
                    <p className="advent-glass-frost rounded-xl px-4 py-3 text-sm font-medium advent-text-muted">
                      Aktivan dan u kalendaru označen je zlatnim okvirom. Klikni ga ili na gumb iznad za današnjih 10 pitanja.
                    </p>
                  ) : null}
                  <AdventPrizesSection />
                  <AdventRulesSection />
                  <AdventLandingFooter />
                </div>

                <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                  <AdventLeaderboard variant="compact" todayKey={leaderboardDayKey} />
                  <AdventRegisterMotivation />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AdventThemeWrapper>
  );
};

export default AdventskaLiga;