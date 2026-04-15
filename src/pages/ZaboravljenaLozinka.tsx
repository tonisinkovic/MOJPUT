import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { KeyRound, Loader2, Mail, Lock } from "lucide-react";
import { authForgotPassword, authResetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function ZaboravljenaLozinka() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token")?.trim() ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    setError("");
    setInfo("");
  }, [tokenFromUrl]);

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const clean = email.trim().toLowerCase();
    if (!clean) {
      setError("Upiši email adresu.");
      return;
    }
    setLoading(true);
    const res = await authForgotPassword(clean);
    setLoading(false);
    if (!res.success) {
      setError(res.message || "Zahtjev nije uspio.");
      return;
    }
    const msg =
      (res as { message?: string }).message ||
      "Ako račun postoji, poslana su uputstva na email.";
    const preview = (res as { email_preview_url?: string }).email_preview_url;
    setInfo(preview ? `${msg}\n\n(Dev: pregled testnog maila: ${preview})` : msg);
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 6) {
      setError("Lozinka mora imati barem 6 znakova.");
      return;
    }
    if (password !== password2) {
      setError("Lozinke se ne podudaraju.");
      return;
    }
    setLoading(true);
    const res = await authResetPassword({ token: tokenFromUrl, password });
    setLoading(false);
    if (!res.success) {
      setError(res.message || "Promjena lozinke nije uspjela.");
      return;
    }
    setPassword("");
    setPassword2("");
    navigate("/prijava?reset=ok");
  };

  const resetMode = Boolean(tokenFromUrl);

  return (
    <Layout>
      <section className="container mx-auto max-w-md py-16">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                {resetMode ? "Nova lozinka" : "Zaboravljena lozinka"}
              </h1>
              <p className="text-xs text-slate-500 md:text-sm">
                {resetMode
                  ? "Upiši novu lozinku za svoj račun."
                  : "Upiši email — poslat \u0107emo poveznicu za novu lozinku (vrijedi 1 sat)."}
              </p>
            </div>
          </div>

          {info && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-medium text-blue-800 whitespace-pre-wrap">
              {info}
            </div>
          )}

          {resetMode ? (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock size={16} aria-hidden />
                  Nova lozinka
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Najmanje 6 znakova"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock size={16} aria-hidden />
                  Ponovi lozinku
                </label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Spremam…
                  </>
                ) : (
                  "Spremi novu lozinku"
                )}
              </Button>
              <Link
                to="/prijava"
                className="block text-center text-sm font-semibold text-primary hover:underline"
              >
                Natrag na prijavu
              </Link>
            </form>
          ) : (
            <form onSubmit={handleRequestLink} className="space-y-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail size={16} aria-hidden />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="tvoj@email.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Šaljem…
                  </>
                ) : (
                  "Pošalji poveznicu"
                )}
              </Button>
              <Link
                to="/prijava"
                className="block text-center text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline"
              >
                Natrag na prijavu
              </Link>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
