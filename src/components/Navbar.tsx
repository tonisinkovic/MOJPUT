import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Compass, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authLogout, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      setUser(userFromAuthMe(res));
    });
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== "visible") return;
      authMe().then((res) => setUser(userFromAuthMe(res)));
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const sync = () => {
      authMe().then((res) => setUser(userFromAuthMe(res)));
    };
    window.addEventListener("mojput-auth-changed", sync);
    return () => window.removeEventListener("mojput-auth-changed", sync);
  }, []);

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    setOpen(false);
  };

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

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground max-w-[140px] truncate" title={user.username}>
                {user.username}
              </span>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" />
                Odjava
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/prijava">Prijava</Link>
              </Button>
              <Button size="sm" className="gradient-hero border-0 text-primary-foreground" asChild>
                <Link to="/registracija">Registracija</Link>
              </Button>
            </>
          )}
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
              <div className="mt-4 pt-4 border-t">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground px-1 truncate" title={user.username}>
                      Prijavljen/a: <span className="font-medium text-foreground">{user.username}</span>
                    </p>
                    <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Odjava
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to="/prijava" onClick={() => setOpen(false)}>
                        Prijava
                      </Link>
                    </Button>
                    <Button className="flex-1 gradient-hero border-0 text-primary-foreground" asChild>
                      <Link to="/registracija" onClick={() => setOpen(false)}>
                        Registracija
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
