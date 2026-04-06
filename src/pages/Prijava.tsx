import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Mail, Lock, LogIn, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { authLogin, authLogout, authMe, authResendVerification, type AuthUser } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Skočni prozor nakon redirecta s API-ja (npr. verified=1). */
type EmailVerifyUi =
  | { kind: "closed" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const Prijava = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loggedUser, setLoggedUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");
  const [emailVerifyUi, setEmailVerifyUi] = useState<EmailVerifyUi>({ kind: "closed" });
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    const verifiedFlag = searchParams.get("verified");
    const verifyErr = searchParams.get("verify_error");

    if (verifiedFlag === "1") {
      setEmailVerifyUi({
        kind: "success",
        message: "Račun je potvrđen. Možeš se prijaviti s emailom i lozinkom.",
      });
      setSearchParams({}, { replace: true });
    } else if (verifyErr === "expired") {
      setEmailVerifyUi({
        kind: "error",
        message: "Kod za potvrdu je istekao. Registriraj se ponovno ili zatraži novi kod na stranici za potvrdu.",
      });
      setSearchParams({}, { replace: true });
    } else if (verifyErr === "invalid" || verifyErr === "missing") {
      setEmailVerifyUi({
        kind: "error",
        message: "Potvrda više nije linkom. Otvori stranicu za potvrdu i upiši email te kod iz pisma.",
      });
      setSearchParams({}, { replace: true });
    }

    authMe()
      .then((res) => {
        if (!alive) return;
        if (res.success) setLoggedUser(res.user ?? (res as any).user ?? (res as any).data?.user ?? null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [searchParams, setSearchParams]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    setInfo("");
    setNeedsVerification(false);

    if (!loginData.email || !loginData.password) {
      setLoginError("Molimo ispuni sva polja.");
      return;
    }

    const res = await authLogin({
      email: loginData.email,
      password: loginData.password,
    });
    if (!res.success) {
      setLoginError(res.message || "Prijava nije uspjela.");
      if (
        (res as any).code === "EMAIL_NOT_VERIFIED" ||
        (res as any).code === "PENDING_VERIFICATION" ||
        /potvrdi email|nije aktiviran/i.test(res.message)
      ) {
        setNeedsVerification(true);
      }
      return;
    }
    const user = (res as any).user ?? (res as any).data?.user ?? null;
    if (!user) {
      setLoginError(
        "Server je odgovorio bez podataka o korisniku. Osvježi stranicu i pokušaj ponovno; ako se ponavlja, provjeri deploy API-ja.",
      );
      return;
    }
    setLoggedUser(user);
    setLoginData({ email: "", password: "" });
  };

  const handleResend = async () => {
    const email = loginData.email.trim();
    if (!email) {
      setLoginError("Unesi email da mogu poslati potvrdu.");
      return;
    }
    setResendLoading(true);
    setLoginError("");
    const res = await authResendVerification(email);
    setResendLoading(false);
    if (!res.success) {
      setLoginError(res.message);
      return;
    }
    setInfo("Ako email postoji i nije potvrđen, poslan je novi 6-znamenkasti kod.");
  };

  const handleLogout = async () => {
    await authLogout();
    setLoggedUser(null);
    setLoginData({ email: "", password: "" });
    setLoginError("");
  };

  const displayName = loggedUser?.username || "";

  const verifyOpen = emailVerifyUi.kind !== "closed";

  return (
    <Layout>
      {verifyOpen ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setEmailVerifyUi({ kind: "closed" });
          }}
        >
        <DialogContent
          className={
            emailVerifyUi.kind === "loading"
              ? "sm:max-w-md [&>button:last-child]:hidden"
              : "sm:max-w-md"
          }
          onPointerDownOutside={(e) => {
            if (emailVerifyUi.kind === "loading") e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (emailVerifyUi.kind === "loading") e.preventDefault();
          }}
        >
          {emailVerifyUi.kind === "loading" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
                  Potvrda računa
                </DialogTitle>
                <DialogDescription>
                  Potvrđujemo tvoj email. Pričekaj trenutak…
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center py-6">
                <Loader2 className="h-12 w-12 animate-spin text-primary/80" aria-hidden />
              </div>
            </>
          )}
          {emailVerifyUi.kind === "success" && (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" aria-hidden />
                </div>
                <DialogTitle className="text-center">Račun je potvrđen</DialogTitle>
                <DialogDescription className="text-center text-base text-slate-700">
                  {emailVerifyUi.message}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => setEmailVerifyUi({ kind: "closed" })}
                >
                  U redu
                </Button>
              </DialogFooter>
            </>
          )}
          {emailVerifyUi.kind === "error" && (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-7 w-7 text-red-600" aria-hidden />
                </div>
                <DialogTitle className="text-center">Potvrda nije uspjela</DialogTitle>
                <DialogDescription className="text-center text-base text-slate-700">
                  {emailVerifyUi.message}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => setEmailVerifyUi({ kind: "closed" })}
                >
                  Zatvori
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      ) : null}

      <section className="container py-16 max-w-md mx-auto">
        {!loggedUser ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Prijava
                </h1>
                <p className="text-xs md:text-sm text-slate-500">
                  Unesi svoje podatke za prijavu na MojPut.
                </p>
              </div>
            </div>

            {loading && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium mb-4">
                Provjeravam prijavu...
              </div>
            )}

            {info && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 font-medium mb-4">
                {info}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  placeholder="tvoj@email.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Lock size={16} />
                  Lozinka
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  placeholder="Unesi lozinku"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                  {loginError}
                </div>
              )}

              {needsVerification && (
                <div className="space-y-2">
                  <Link
                    to={
                      loginData.email.trim()
                        ? `/verify?email=${encodeURIComponent(loginData.email.trim().toLowerCase())}`
                        : "/verify"
                    }
                    className="block w-full py-2.5 text-center rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                  >
                    Upiši kod za potvrdu
                  </Link>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="w-full py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm font-semibold text-slate-900"
                  >
                    {resendLoading ? "Šaljem…" : "Pošalji novi kod na email"}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2 text-sm"
              >
                Prijavi se
              </button>

              <p className="text-center text-xs text-slate-600 mt-2">
                Nemaš račun? Posjeti stranicu{" "}
                <span className="font-semibold">Registracija</span> u glavnom
                izborniku.
              </p>
              <p className="text-center text-[11px] text-slate-500 mt-3 leading-snug">
                Račun s weba i račun s lokalnog testa nisu isti (različita baza). Email mora biti
                potvrđen 6-znamenkastim kodom iz pisma. Ako te stranica ne drži prijavljenim nakon osvježenja,
                osvježi deploy API-ja (session cookie za GitHub Pages).
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">
              Dobrodošao, {displayName || "korisniče"}!
            </h1>
            <p className="text-slate-600 text-sm">
              Trenutačno si prijavljen s adresom{" "}
              <span className="font-medium">{loggedUser.email}</span>.
            </p>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all"
            >
              Odjava
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Prijava;

