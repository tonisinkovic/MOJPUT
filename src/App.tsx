import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import KartaFakulteta from "./pages/KartaFakulteta";
import Kviz from "./pages/Kviz";
import Samoprocjena from "./pages/Samoprocjena";
import Kalkulator from "./pages/Kalkulator";
import VideoPage from "./pages/VideoPage";
import Forum from "./pages/Forum";
import Kalendar from "./pages/Kalendar";
import Roditelji from "./pages/Roditelji";
import Kontakt from "./pages/Kontakt";
import UvjetiKoristenja from "./pages/UvjetiKoristenja";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import Registracija from "./pages/Registracija";
import Prijava from "./pages/Prijava";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/uvjeti" element={<UvjetiKoristenja />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/prijava" element={<Prijava />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
