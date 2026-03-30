import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Karta fakulteta", path: "/karta" },
  { label: "Kviz", path: "/kviz" },
  { label: "Samoprocjena", path: "/samoprocjena" },
  { label: "Kalkulator", path: "/kalkulator" },
  { label: "Domovi", path: "/kalkulator-doma" },
  { label: "Video", path: "/video" },
  { label: "Forum", path: "/forum" },
  { label: "Kalendar", path: "/kalendar" },
  { label: "Roditelji", path: "/roditelji" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-gradient">MojPut</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/prijava">Prijava</Link>
          </Button>
          <Button size="sm" className="gradient-hero border-0 text-primary-foreground" asChild>
            <Link to="/registracija">Registracija</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-card overflow-hidden"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 mt-4 pt-4 border-t">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/prijava" onClick={() => setOpen(false)}>Prijava</Link>
                </Button>
                <Button className="flex-1 gradient-hero border-0 text-primary-foreground" asChild>
                  <Link to="/registracija" onClick={() => setOpen(false)}>Registracija</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
