import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  BarChart3,
  User,
  UserPlus,
  Map,
  HelpCircle,
  Target,
  Calculator,
  Home,
  Video,
  MessageSquare,
  Calendar,
  Users,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderThemeToggle } from "@/components/HeaderThemeToggle";
import { authLogout, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavEntry = { label: string; path: string; icon: LucideIcon };

// Primarne - najčešće korištene stavke.
const primaryNav: NavEntry[] = [
  { label: "Karta fakulteta", path: "/karta", icon: Map },
  { label: "Kviz", path: "/kviz", icon: HelpCircle },
  { label: "Kalkulator", path: "/kalkulator", icon: Calculator },
  { label: "Forum", path: "/forum", icon: MessageSquare },
];

// Sekundarne - u "Više" padajućem na desktopu, lista na mobitelu.
const secondaryNav: NavEntry[] = [
  { label: "Samoprocjena", path: "/samoprocjena", icon: Target },
  { label: "Domovi", path: "/kalkulator-doma", icon: Home },
  { label: "Video", path: "/video", icon: Video },
  { label: "Kalendar", path: "/kalendar", icon: Calendar },
  { label: "Roditelji", path: "/roditelji", icon: Users },
];

// Cijela lista za mobitel (redoslijed važnosti).
const navItems: NavEntry[] = [...primaryNav, ...secondaryNav];

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
    await authLogout(user?.email);
    setUser(null);
    setOpen(false);
  };

  const profileInitial = user?.username?.trim()?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 dark:border-border/40 dark:bg-background/85 dark:shadow-[0_1px_0_0_hsl(var(--border)/0.35)]">
      <div className="container flex h-16 items-center justify-between gap-2 md:gap-4">
        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2 rounded-xl py-1 pr-1 outline-none transition-transform hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-2.5 sm:pr-2"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background shadow-md shadow-primary/20 ring-2 ring-primary/20 transition duration-300 group-hover:scale-[1.04] group-hover:shadow-lg group-hover:shadow-primary/25 md:h-10 md:w-10">
              <img
                src={`${import.meta.env.BASE_URL}mojput-logo.png`}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-contain p-0.5"
                decoding="async"
              />
            </div>
            <span className="truncate text-lg font-extrabold tracking-tight text-gradient md:text-xl">MojPut</span>
          </Link>
          <HeaderThemeToggle className="max-[380px]:scale-90" />
        </div>

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
            {primaryNav.map((item) => {
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-tight transition-all duration-200 xl:px-3 xl:text-[13px]",
                    secondaryNav.some((i) => i.path === location.pathname)
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 dark:shadow-primary/20"
                      : "text-muted-foreground hover:bg-background/90 hover:text-foreground hover:shadow-sm dark:hover:bg-background/60",
                  )}
                  aria-label="Više opcija"
                >
                  <MoreHorizontal className="h-3.5 w-3.5 opacity-85 xl:h-4 xl:w-4" aria-hidden />
                  <span className="whitespace-nowrap">Više</span>
                  <ChevronDown className="h-3 w-3 opacity-70 xl:h-3.5 xl:w-3.5" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                {secondaryNav.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium",
                          active && "bg-primary/10 text-primary",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-md",
                            active ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <nav
              className={cn(
                "container flex max-h-[calc(100vh-4rem)] flex-col gap-2 overflow-y-auto overscroll-contain py-4",
                !user && "pb-28",
              )}
              aria-label="Mobilna navigacija"
            >
              {!user && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm touch-manipulation"
                    asChild
                  >
                    <Link to="/prijava" onClick={() => setOpen(false)}>
                      <LogIn className="h-4 w-4" />
                      Prijava
                    </Link>
                  </Button>
                  <Button
                    className="h-12 w-full justify-center gap-2 rounded-xl border-0 bg-gradient-to-r from-primary to-primary/90 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 touch-manipulation"
                    asChild
                  >
                    <Link to="/registracija" onClick={() => setOpen(false)}>
                      <UserPlus className="h-4 w-4" />
                      Registracija
                    </Link>
                  </Button>
                </div>
              )}

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

              <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">
                <span className="text-xs font-medium text-muted-foreground">Izgled stranice</span>
                <HeaderThemeToggle />
              </div>

              {user && (
                <div className="mt-2 border-t border-border/60 pt-4">
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
                </div>
              )}
            </nav>

            {!user && (
              <div className="lg:hidden border-t border-border/70 bg-card/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur supports-[backdrop-filter]:bg-card/80">
                <div className="container flex gap-2">
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
