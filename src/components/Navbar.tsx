import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Menu,
  X,
  Compass,
  LogOut,
  BarChart3,
  User,
  Map,
  HelpCircle,
  Target,
  Calculator,
  Home,
  Video,
  MessageSquare,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authLogout, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems: { label: string; path: string; icon: LucideIcon }[] = [
  { label: "Karta fakulteta", path: "/karta", icon: Map },
  { label: "Kviz", path: "/kviz", icon: HelpCircle },
  { label: "Samoprocjena", path: "/samoprocjena", icon: Target },
  { label: "Kalkulator", path: "/kalkulator", icon: Calculator },
  { label: "Domovi", path: "/kalkulator-doma", icon: Home },
  { label: "Video", path: "/video", icon: Video },
  { label: "Forum", path: "/forum", icon: MessageSquare },
  { label: "Kalendar", path: "/kalendar", icon: Calendar },
  { label: "Roditelji", path: "/roditelji", icon: Users },
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

  const profileInitial = user?.username?.trim()?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 dark:border-border/40 dark:bg-background/85 dark:shadow-[0_1px_0_0_hsl(var(--border)/0.35)]">
      <div className="container flex h-16 items-center justify-between gap-3 md:gap-4">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl py-1 pr-2 outline-none transition-transform hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/85 shadow-md shadow-primary/25 ring-2 ring-primary/20 transition duration-300 group-hover:scale-[1.04] group-hover:shadow-lg group-hover:shadow-primary/30 md:h-10 md:w-10">
            <Compass className="h-[1.15rem] w-[1.15rem] text-primary-foreground md:h-5 md:w-5" strokeWidth={2.25} />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gradient md:text-xl">MojPut</span>
        </Link>

        {/* Desktop nav — pill traka, centrirano */}
        <nav
          className="mx-auto hidden min-w-0 max-w-3xl flex-1 justify-center lg:flex xl:max-w-4xl"
          aria-label="Glavna navigacija"
        >
          <div
            className={cn(
              "inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border/60 bg-muted/40 px-1 py-1 shadow-inner",
              "scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              "dark:border-border/50 dark:bg-muted/25",
            )}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-tight transition-all duration-200 xl:px-3 xl:text-[13px]",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 dark:shadow-primary/20"
                      : "text-muted-foreground hover:bg-background/90 hover:text-foreground hover:shadow-sm dark:hover:bg-background/60",
                  )}
                >
                  <Icon
                    className={cn("h-3.5 w-3.5 shrink-0 opacity-85 xl:h-4 xl:w-4", active && "opacity-100")}
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                {user.is_admin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1.5 rounded-full px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
                    asChild
                  >
                    <Link to="/tim" title="Statistika za tim">
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden xl:inline">Tim</span>
                    </Link>
                  </Button>
                )}
                <Link
                  to="/profil"
                  className={cn(
                    "flex max-w-[160px] items-center gap-2 rounded-full border border-border/70 bg-card/60 py-1 pl-1 pr-3 shadow-sm",
                    "transition-all hover:border-primary/35 hover:bg-card hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "dark:bg-card/40 dark:hover:bg-card/70",
                  )}
                  title={`Otvori profil (${user.username})`}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/20 dark:bg-primary/20"
                    aria-hidden
                  >
                    {profileInitial}
                  </span>
                  <span className="truncate text-sm font-semibold text-foreground">{user.username}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 rounded-full border-border/80 px-3 shadow-sm transition hover:border-primary/30 hover:bg-muted/50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">Odjava</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-9 rounded-full px-4 font-semibold" asChild>
                  <Link to="/prijava">Prijava</Link>
                </Button>
                <Button
                  size="sm"
                  className="h-9 rounded-full border-0 bg-gradient-to-r from-primary to-primary/90 px-4 font-semibold text-primary-foreground shadow-md shadow-primary/25 transition hover:opacity-[0.97] hover:shadow-lg hover:shadow-primary/30"
                  asChild
                >
                  <Link to="/registracija">Registracija</Link>
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-foreground shadow-sm transition lg:hidden",
              "hover:bg-muted hover:shadow-md active:scale-[0.98]",
              "dark:bg-muted/30 dark:hover:bg-muted/50",
            )}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-border/50 bg-card/95 shadow-[inset_0_1px_0_0_hsl(var(--border)/0.3)] backdrop-blur-lg dark:bg-card/90"
          >
            <nav className="container flex max-h-[calc(100vh-4rem)] flex-col gap-2 overflow-y-auto overscroll-contain py-4" aria-label="Mobilna navigacija">
              <div className="grid gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                        active
                          ? "border-primary/40 bg-primary/12 text-primary shadow-sm dark:bg-primary/15"
                          : "border-transparent bg-muted/30 text-muted-foreground hover:border-border/80 hover:bg-muted/50 hover:text-foreground dark:bg-muted/20",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          active ? "bg-primary/15 text-primary" : "bg-background/80 text-muted-foreground dark:bg-background/50",
                        )}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-2 border-t border-border/60 pt-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/profil"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 p-3 shadow-sm",
                        "transition hover:border-primary/35 hover:shadow-md",
                      )}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-primary ring-1 ring-primary/20">
                        {profileInitial}
                      </span>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-xs font-medium text-muted-foreground">Prijavljen/a</p>
                        <p className="truncate font-semibold text-foreground">{user.username}</p>
                      </div>
                    </Link>
                    <Button variant="outline" className="h-11 w-full gap-2 rounded-xl font-semibold shadow-sm" asChild>
                      <Link to="/profil" onClick={() => setOpen(false)}>
                        <User className="h-4 w-4" />
                        Moj profil
                      </Link>
                    </Button>
                    {user.is_admin && (
                      <Button variant="outline" className="h-11 w-full gap-2 rounded-xl font-semibold shadow-sm" asChild>
                        <Link to="/tim" onClick={() => setOpen(false)}>
                          <BarChart3 className="h-4 w-4" />
                          Tim — statistika
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="h-11 w-full gap-2 rounded-xl font-semibold shadow-sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Odjava
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="outline" className="h-11 flex-1 rounded-xl font-semibold shadow-sm" asChild>
                      <Link to="/prijava" onClick={() => setOpen(false)}>
                        Prijava
                      </Link>
                    </Button>
                    <Button
                      className="h-11 flex-1 rounded-xl border-0 bg-gradient-to-r from-primary to-primary/90 font-semibold text-primary-foreground shadow-md shadow-primary/25"
                      asChild
                    >
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
