import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { warmupApiHealth } from "@/lib/api";
import { startJuniorCloudSync } from "@/lib/juniorCloud";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ErrorBoundary from "./components/ErrorBoundary";
import { trackPageView } from "./lib/analytics";

const queryClient = new QueryClient();
const KartaFakulteta = lazy(() => import("./pages/KartaFakulteta"));
const KartaSrednjihSkola = lazy(() => import("./pages/KartaSrednjihSkola"));
const Kviz = lazy(() => import("./pages/Kviz"));
const Samoprocjena = lazy(() => import("./pages/Samoprocjena"));
const Kalkulator = lazy(() => import("./pages/Kalkulator"));
const KalkulatorDoma = lazy(() => import("./pages/KalkulatorDoma"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const VideoSrednje = lazy(() => import("./pages/VideoSrednje"));
const Forum = lazy(() => import("./pages/Forum"));
const Kalendar = lazy(() => import("./pages/Kalendar"));
const Mature = lazy(() => import("./pages/Mature"));
const Roditelji = lazy(() => import("./pages/Roditelji"));
const ParentGuide = lazy(() => import("./pages/ParentGuide"));
const ParentMentalHealth = lazy(() => import("./pages/ParentMentalHealth"));
const ParentForum = lazy(() => import("./pages/ParentForum"));
const ParentAssessment = lazy(() => import("./pages/ParentAssessment"));
const ParentArticleDetail = lazy(() => import("./pages/ParentArticleDetail"));
const Kontakt = lazy(() => import("./pages/Kontakt"));
const UvjetiKoristenja = lazy(() => import("./pages/UvjetiKoristenja"));
const Privatnost = lazy(() => import("./pages/Privatnost"));
const About = lazy(() => import("./pages/About"));
const Partneri = lazy(() => import("./pages/Partneri"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Registracija = lazy(() => import("./pages/Registracija"));
const Prijava = lazy(() => import("./pages/Prijava"));
const ZaboravljenaLozinka = lazy(() => import("./pages/ZaboravljenaLozinka"));
const Verify = lazy(() => import("./pages/Verify"));
const FacultyProfiles = lazy(() => import("./pages/FacultyProfiles"));
const FacultyProfile = lazy(() => import("./pages/FacultyProfile"));
const FacultyLogin = lazy(() => import("./pages/FacultyLogin"));
const FacultyDashboard = lazy(() => import("./pages/FacultyDashboard"));
const TimDashboard = lazy(() => import("./pages/TimDashboard"));
const ProfilDashboard = lazy(() => import("./pages/ProfilDashboard"));
const KalkulatorFakulteti = lazy(() => import("./pages/KalkulatorFakulteti"));
const KvizSrednja = lazy(() => import("./pages/KvizSrednja"));
const UsporediSkole = lazy(() => import("./pages/UsporediSkole"));
const UsporediStudije = lazy(() => import("./pages/UsporediStudije"));
const RoditeljskiRezultat = lazy(() => import("./pages/RoditeljskiRezultat"));
const JuniorProgrami = lazy(() => import("./pages/JuniorProgrami"));
const JuniorProgramDetail = lazy(() => import("./pages/JuniorProgramDetail"));
const Razred = lazy(() => import("./pages/Razred"));
const HighSchoolProfile = lazy(() => import("./pages/HighSchoolProfile"));
const HighSchoolProfiles = lazy(() => import("./pages/HighSchoolProfiles"));
const JuniorSchoolFeed = lazy(() => import("./pages/JuniorSchoolFeed"));
const SchoolLogin = lazy(() => import("./pages/SchoolLogin"));
const SchoolDashboard = lazy(() => import("./pages/SchoolDashboard"));

/** Usklađeno s `base` u vite.config (`import.meta.env.BASE_URL`). */
const routerBasename =
  import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

const AnalyticsPageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(fullPath);
  }, [location.pathname, location.search, location.hash]);

  return null;
};

const ApiWarmup = () => {
  const location = useLocation();

  useEffect(() => {
    warmupApiHealth();
  }, []);

  useEffect(() => {
    if (/^\/(prijava|registracija|zaboravljena-lozinka|verify)(\/|$)/.test(location.pathname)) {
      warmupApiHealth(true);
    }
  }, [location.pathname]);

  return null;
};

const JuniorCloudSync = () => {
  useEffect(() => {
    startJuniorCloudSync();
  }, []);
  return null;
};

const RouteErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return <ErrorBoundary key={pathname}>{children}</ErrorBoundary>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PwaInstallPrompt />
      <BrowserRouter basename={routerBasename}>
        <ScrollToTop />
        <CookieConsentBanner />
        <AnalyticsPageTracker />
        <ApiWarmup />
        <JuniorCloudSync />
        <RouteErrorBoundary>
          <Suspense
            fallback={
              <main className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="rounded-2xl border border-border/70 bg-card/90 px-5 py-4 text-sm font-medium text-muted-foreground shadow-soft">
                  Učitavam alat...
                </div>
              </main>
            }
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/karta" element={<KartaFakulteta />} />
              <Route path="/srednje-skole" element={<KartaSrednjihSkola />} />
              <Route path="/srednje-skole/prijava" element={<SchoolLogin />} />
              <Route path="/srednje-skole/objave" element={<JuniorSchoolFeed />} />
              <Route path="/srednje-skole/profili" element={<HighSchoolProfiles />} />
              <Route path="/srednje-skole/:slug" element={<HighSchoolProfile />} />
              <Route path="/skola" element={<SchoolDashboard />} />
              <Route path="/skola/dashboard" element={<SchoolDashboard />} />
              <Route path="/kviz" element={<Kviz />} />
              <Route path="/kviz-srednja" element={<KvizSrednja />} />
              <Route path="/usporedi-skole" element={<UsporediSkole />} />
              <Route path="/usporedi-studije" element={<UsporediStudije />} />
              <Route path="/programi" element={<JuniorProgrami />} />
              <Route path="/programi/:slug" element={<JuniorProgramDetail />} />
              <Route path="/razred" element={<Razred />} />
              <Route path="/samoprocjena" element={<Samoprocjena />} />
              <Route path="/kalkulator" element={<Kalkulator />} />
              <Route path="/kalkulator-fakulteti" element={<KalkulatorFakulteti />} />
              <Route path="/kalkulator-doma" element={<KalkulatorDoma />} />
              <Route path="/video" element={<VideoPage />} />
              <Route path="/video-srednje" element={<VideoSrednje />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/kalendar" element={<Kalendar />} />
              <Route path="/mature" element={<Mature />} />
              <Route path="/roditeljski-rezultat" element={<RoditeljskiRezultat />} />
              <Route path="/roditelji" element={<Roditelji />} />
              <Route path="/roditeljski-kutak" element={<Roditelji />} />
              <Route path="/roditeljski-kutak/vodic-za-roditelje" element={<ParentGuide />} />
              <Route path="/roditeljski-kutak/mentalno-zdravlje" element={<ParentMentalHealth />} />
              <Route path="/roditeljski-kutak/forum" element={<ParentForum />} />
              <Route path="/roditeljski-kutak/zajednicka-procjena" element={<ParentAssessment />} />
              <Route path="/roditeljski-kutak/preporuceni-clanak/:slug" element={<ParentArticleDetail />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/o-nama" element={<About />} />
              <Route path="/partneri" element={<Partneri />} />
              <Route path="/uvjeti" element={<UvjetiKoristenja />} />
              <Route path="/privatnost" element={<Privatnost />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/prijava" element={<Prijava />} />
              <Route path="/zaboravljena-lozinka" element={<ZaboravljenaLozinka />} />
              <Route path="/profil" element={<ProfilDashboard />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/registracija" element={<Registracija />} />
              <Route path="/fakulteti" element={<FacultyProfiles />} />
              <Route path="/fakulteti/prijava" element={<FacultyLogin />} />
              <Route path="/fakulteti/dashboard" element={<FacultyDashboard />} />
              <Route path="/fakulteti/:facultyId" element={<FacultyProfile />} />
              <Route path="/tim" element={<TimDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
