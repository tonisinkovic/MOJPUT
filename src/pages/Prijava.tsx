import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Mail, Lock, LogIn } from "lucide-react";
import { authLogin, authLogout, authMe, authVerifyEmail, type AuthUser } from "@/lib/auth";

const Prijava = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loggedUser, setLoggedUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");

  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams(window.location.search);
    const verify = params.get("verify");
    if (verify) {
      setInfo("Potvrđujem email...");
      authVerifyEmail(verify)
        .then((res) => {
          if (!alive) return;
          if (res.success) {
            setInfo("Email je potvrđen. Sada se možeš prijaviti.");
          } else {
            setInfo(res.message);
          }
          params.delete("verify");
          const next = params.toString();
          window.history.replaceState({}, "", `${window.location.pathname}${next ? `?${next}` : ""}`);
        })
        .catch(() => {
          if (!alive) return;
          setInfo("Greška kod potvrde emaila.");
        });
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
  }, []);

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

    if (!loginData.email || !loginData.password) {
      setLoginError("Molimo ispuni sva polja.");
      return;
    }

    const res = await authLogin({
      email: loginData.email,
      password: loginData.password,
    });
    if (!res.success) {
      setLoginError(res.message);
      return;
    }
    setLoggedUser((res as any).user ?? (res as any).data?.user ?? null);
    setLoginData({ email: "", password: "" });
  };

  const handleLogout = async () => {
    await authLogout();
    setLoggedUser(null);
    setLoginData({ email: "", password: "" });
    setLoginError("");
  };

  const displayName = loggedUser?.username || "";

  return (
    <Layout>
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

