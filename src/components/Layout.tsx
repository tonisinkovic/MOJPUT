import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SiteFeedback from "./SiteFeedback";
import MojPutPremiumTeaser from "./MojPutPremiumTeaser";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout = ({ children, hideFooter }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      {!hideFooter && (
        <>
          <SiteFeedback />
          <Footer />
        </>
      )}

      <MojPutPremiumTeaser />

      {/* Floating Chatbot shortcut (available on all pages, incl. /kalendar) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          asChild
          className="gradient-hero border-0 text-primary-foreground rounded-full w-14 h-14 p-0 shadow-lg glow-primary hover:scale-110 transition-transform"
        >
          <Link to="/chatbot" aria-label="Otvori AI chatbot">
            <Bot className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Layout;
