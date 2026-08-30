import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { warmupApiHealth } from "@/lib/api";
import Index from "./pages/Index";
import KartaFakulteta from "./pages/KartaFakulteta";
import KartaSrednjihSkola from "./pages/KartaSrednjihSkola";
import Kviz from "./pages/Kviz";
import Samoprocjena from "./pages/Samoprocjena";
import Kalkulator from "./pages/Kalkulator";
import KalkulatorDoma from "./pages/KalkulatorDoma";
import VideoPage from "./pages/VideoPage";
import Forum from "./pages/Forum";
import Kalendar from "./pages/Kalendar";
import Mature from "./pages/Mature";
import Roditelji from "./pages/Roditelji";
import ParentGuide from "./pages/ParentGuide";
import ParentMentalHealth from "./pages/ParentMentalHealth";
import ParentForum from "./pages/ParentForum";
import ParentAssessment from "./pages/ParentAssessment";
import ParentArticleDetail from "./pages/ParentArticleDetail";
import Kontakt from "./pages/Kontakt";
import UvjetiKoristenja from "./pages/UvjetiKoristenja";
import Privatnost from "./pages/Privatnost";
import About from "./pages/About";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import Registracija from "./pages/Registracija";
import Prijava from "./pages/Prijava";
import ZaboravljenaLozinka from "./pages/ZaboravljenaLozinka";
import Verify from "./pages/Verify";
import FacultyProfiles from "./pages/FacultyProfiles";
import FacultyProfile from "./pages/FacultyProfile";
import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";
import TimDashboard from "./pages/TimDashboard";
import ProfilDashboard from "./pages/ProfilDashboard";
import ScrollToTop from "./components/ScrollToTop";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import { trackPageView } from "./lib/analytics";

const queryClient = new QueryClient();
const KalkulatorFakulteti = lazy(() => import("./pages/KalkulatorFakulteti"));

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

/** Probudi Render API pri učitavanju auth stranica. */
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PwaInstallPrompt />
      <BrowserRouter basename={routerBasename}>
        <ScrollToTop />
        <AnalyticsPageTracker />
        <ApiWarmup />
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
            <Route path="/kviz" element={<Kviz />} />
            <Route path="/samoprocjena" element={<Samoprocjena />} />
            <Route path="/kalkulator" element={<Kalkulator />} />
            <Route path="/kalkulator-fakulteti" element={<KalkulatorFakulteti />} />
            <Route path="/kalkulator-doma" element={<KalkulatorDoma />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/kalendar" element={<Kalendar />} />
            <Route path="/mature" element={<Mature />} />
            <Route path="/roditelji" element={<Roditelji />} />
            <Route path="/roditeljski-kutak" element={<Roditelji />} />
            <Route path="/roditeljski-kutak/vodic-za-roditelje" element={<ParentGuide />} />
            <Route path="/roditeljski-kutak/mentalno-zdravlje" element={<ParentMentalHealth />} />
            <Route path="/roditeljski-kutak/forum" element={<ParentForum />} />
            <Route path="/roditeljski-kutak/zajednicka-procjena" element={<ParentAssessment />} />
            <Route path="/roditeljski-kutak/preporuceni-clanak/:slug" element={<ParentArticleDetail />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/o-nama" element={<About />} />
            <Route path="/uvjeti" element={<UvjetiKoristenja />} />
            <Route path="/privatnost" element={<Privatnost />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/prijava" element={<Prijava />} />
            <Route path="/zaboravljena-lozinka" element={<ZaboravljenaLozinka />} />
            <Route path="/profil" element={<ProfilDashboard />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/registracija" element={<Registracija />} />
            <Route path="/fakulteti" element={<FacultyProfiles />} />
            <Route path="/fakulteti/:facultyId" element={<FacultyProfile />} />
            <Route path="/fakulteti/prijava" element={<FacultyLogin />} />
            <Route path="/fakulteti/dashboard" element={<FacultyDashboard />} />
            <Route path="/tim" element={<TimDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
