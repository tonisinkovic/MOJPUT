import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Loader2, LogIn, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { schoolLogin } from "@/lib/schoolCmsApi";
import { warmupApiHealth } from "@/lib/api";

type Props = {
  compact?: boolean;
  resetOk?: boolean;
};

export default function SchoolLoginForm({ compact = false, resetOk = false }: Props) {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    warmupApiHealth(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await schoolLogin({ login: login.trim(), password });
    setLoading(false);
    if (!res.success) {
      setError(res.message || "Prijava nije uspjela.");
      return;
    }
    navigate("/skola/dashboard");
  };

  return (
    <div
      className={
        compact
          ? "rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-card sm:p-5"
          : "rounded-3xl border-2 border-primary/20 bg-card p-6 shadow-card md:p-8"
      }
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <School className="h-5 w-5" />
        </span>
        <div>
          <p className="text-lg font-bold leading-tight">Prijava za škole</p>
          <p className="text-xs text-muted-foreground">Uredi profil i objave škole</p>
        </div>
      </div>
      {resetOk && (
        <p className="mb-3 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">
          Lozinka je postavljena. Prijavi se novom lozinkom.
        </p>
      )}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Korisničko ime / email
          <input
            className="mt-1.5 w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Lozinka
          <div className="relative mt-1.5">
            <input
              type={showPw ? "text" : "password"}
              className="w-full rounded-xl border-2 border-border bg-background px-3 py-2 pr-10 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Sakrij lozinku" : "Prikaži lozinku"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          <span className="ml-2">Prijava</span>
        </Button>
      </form>
      <p className="mt-3 text-sm">
        <Link
          to="/zaboravljena-lozinka?from=skola"
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
        >
          <KeyRound className="h-4 w-4" />
          Zaboravljena lozinka?
        </Link>
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        Učenici ovdje samo gledaju profile. Svoja prijava je na{" "}
        <Link to="/prijava" className="font-semibold text-primary hover:underline">
          /prijava
        </Link>
        .
      </p>
    </div>
  );
}
