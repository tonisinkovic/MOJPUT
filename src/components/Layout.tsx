import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SiteFeedback from "./SiteFeedback";
import MojPutPremiumTeaser from "./MojPutPremiumTeaser";
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
      <div
        className="fixed z-50 right-4 sm:right-6"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <Link
          to="/chatbot"
          aria-label="Otvori AI ChatBot"
          title="AI ChatBot"
          className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-14 sm:w-14"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-transparent to-transparent"
          />
          <Bot className="relative h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />
          <span
            aria-hidden
            className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-lg bg-foreground/90 px-2.5 py-1 text-xs font-medium text-background shadow-sm sm:group-hover:inline-block sm:group-focus-visible:inline-block"
          >
            AI ChatBot
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
