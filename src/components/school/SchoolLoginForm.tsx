import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Loader2, LogIn, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { schoolLogin, safeSchoolReturnPath } from "@/lib/schoolCmsApi";
import { warmupApiHealth } from "@/lib/api";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  quiet?: boolean;
  hideIntro?: boolean;
  resetOk?: boolean;
  className?: string;
  redirectTo?: string;
};

export default function SchoolLoginForm({
  compact = false,
  quiet = false,
  hideIntro = false,
  resetOk = false,
  className,
  redirectTo,
}: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    navigate(safeSchoolReturnPath(redirectTo || searchParams.get("next")));
  };

  return (
    <div
      className={cn(
        compact
          ? quiet
            ? "rounded-2xl border border-border/70 bg-card/80 p-4 shadow-[var(--shadow-soft)]"
            : "rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-card sm:p-5"
          : "rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-elevated)] md:p-8",
        className,
      )}
    >
      {hideIntro ? null : (
        <div className="mb-4 flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
              quiet ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
            )}
          >
            <School className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight">Prijava za škole</p>
            <p className="text-sm text-muted-foreground">Uredi profil i objave škole</p>
          </div>
        </div>
      )}
      {resetOk && (
        <p className="mb-3 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">
          Lozinka je postavljena. Prijavi se novom lozinkom.
        </p>
      )}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Korisničko ime / email
          <input
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base"
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
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pr-10 text-base"
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
        <Button type="submit" className="h-11 w-full text-base" disabled={loading}>
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
      {quiet ? null : (
        <p className="mt-4 text-xs text-muted-foreground">
          Učenici ovdje samo gledaju profile. Svoja prijava je na{" "}
          <Link to="/prijava" className="font-semibold text-primary hover:underline">
            /prijava
          </Link>
          .
        </p>
      )}
    </div>
  );
}
