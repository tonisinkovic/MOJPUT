import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginFaculty } from "@/lib/facultyStore";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
};

export default function FacultyLoginForm({ compact = false }: Props) {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!login.trim() || !password) {
      setError("Unesi korisničko ime ili email i lozinku.");
      return;
    }

    const session = loginFaculty(login.trim(), password);
    if (!session) {
      setError("Neispravni podaci za prijavu fakulteta.");
      return;
    }
    navigate("/fakulteti/dashboard");
  };

  return (
    <div
      className={cn(
        compact
          ? "rounded-2xl border-2 border-primary/20 bg-card p-4 shadow-card sm:p-5"
          : "rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-elevated)] md:p-8",
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </span>
        <div>
          <p className="text-lg font-bold leading-tight">Prijava za fakultete</p>
          <p className="text-xs text-muted-foreground">Uredi profil i objave fakulteta</p>
        </div>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium" htmlFor={compact ? "faculty-login-compact" : "faculty-login"}>
          Email ili korisničko ime
          <input
            id={compact ? "faculty-login-compact" : "faculty-login"}
            type="text"
            className="mt-1.5 w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="npr. fer-zg ili fer-zg@fakultet.mojput.hr"
            autoComplete="username"
            required
          />
        </label>
        <label className="block text-sm font-medium" htmlFor={compact ? "faculty-password-compact" : "faculty-password"}>
          Lozinka
          <div className="relative mt-1.5">
            <input
              id={compact ? "faculty-password-compact" : "faculty-password"}
              type={showPw ? "text" : "password"}
              className="w-full rounded-xl border-2 border-border bg-background px-3 py-2 pr-10 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Unesi lozinku"
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
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full">
          <LogIn className="h-4 w-4" />
          <span className="ml-2">Prijava</span>
        </Button>
      </form>
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
