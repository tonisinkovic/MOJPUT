import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import KartaFakulteta from "./pages/KartaFakulteta";
import Kviz from "./pages/Kviz";
import Samoprocjena from "./pages/Samoprocjena";
import Kalkulator from "./pages/Kalkulator";
import VideoPage from "./pages/VideoPage";
import Forum from "./pages/Forum";
import Kalendar from "./pages/Kalendar";
import Roditelji from "./pages/Roditelji";
import ParentGuide from "./pages/ParentGuide";
import ParentMentalHealth from "./pages/ParentMentalHealth";
import ParentForum from "./pages/ParentForum";
import ParentAssessment from "./pages/ParentAssessment";
import ParentArticleDetail from "./pages/ParentArticleDetail";
import Kontakt from "./pages/Kontakt";
import UvjetiKoristenja from "./pages/UvjetiKoristenja";
import About from "./pages/About";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import Registracija from "./pages/Registracija";
import Prijava from "./pages/Prijava";
import FacultyProfiles from "./pages/FacultyProfiles";
import FacultyProfile from "./pages/FacultyProfile";
import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/karta" element={<KartaFakulteta />} />
          <Route path="/kviz" element={<Kviz />} />
          <Route path="/samoprocjena" element={<Samoprocjena />} />
          <Route path="/kalkulator" element={<Kalkulator />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/kalendar" element={<Kalendar />} />
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
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/prijava" element={<Prijava />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="/fakulteti" element={<FacultyProfiles />} />
          <Route path="/fakulteti/:facultyId" element={<FacultyProfile />} />
          <Route path="/fakulteti/prijava" element={<FacultyLogin />} />
          <Route path="/fakulteti/dashboard" element={<FacultyDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
