import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { authResendVerification, authVerifyCode } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phase, setPhase] = useState<"form" | "loading" | "success">("form");
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendInfo, setResendInfo] = useState("");

  useEffect(() => {
    const q = searchParams.get("email")?.trim();
    if (q) setEmail(q);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const clean = email.trim().toLowerCase();
    const code = otp.replace(/\D/g, "");
    if (!clean) {
      setMessage("Unesi email.");
      return;
    }
    if (code.length !== 6) {
      setMessage("Upiši svih 6 znamenki koda iz pisma.");
      return;
    }
    setPhase("loading");
    const res = await authVerifyCode({ email: clean, code });
    if (res.success) {
      setPhase("success");
      return;
    }
    setPhase("form");
    setMessage(res.message || "Potvrda nije uspjela.");
  };

  const handleResend = async () => {
    const clean = email.trim().toLowerCase();
    if (!clean) {
      setResendInfo("Prvo unesi email s kojim si se registrirao/la.");
      return;
    }
    setResendLoading(true);
    setResendInfo("");
    const r = await authResendVerification(clean);
    setResendLoading(false);
    if (r.success) {
      setResendInfo("Ako postoji nepotvrđena registracija, poslan je novi kod na email.");
    } else {
      setResendInfo(r.message);
    }
  };

  return (
    <Layout>
      <section className="container py-16 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 space-y-6">
          {phase === "form" || phase === "loading" ? (
            <>
              <div className="text-center space-y-2">
                <h1 className="text-xl font-bold text-slate-900">Potvrda računa</h1>
                <p className="text-sm text-slate-600">
                  Upiši email s kojim si se registrirao/la i <strong>6-znamenkasti kod</strong> iz pisma.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="verify-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden />
                    Email
                  </Label>
                  <Input
                    id="verify-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tvoj@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kod iz pisma (6 znamenki)</Label>
                  <div className="flex justify-center py-1">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                {message && (
                  <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
                    <span>{message}</span>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={phase === "loading"}>
                  {phase === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      Provjera…
                    </>
                  ) : (
                    "Potvrdi račun"
                  )}
                </Button>
              </form>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={resendLoading}
                  onClick={handleResend}
                >
                  {resendLoading ? "Šaljem…" : "Pošalji novi kod"}
                </Button>
                {resendInfo && <p className="text-center text-xs text-slate-600">{resendInfo}</p>}
              </div>
              <p className="text-center text-sm">
                <Link to="/prijava" className="font-semibold text-primary hover:underline">
                  Natrag na prijavu
                </Link>
              </p>
            </>
          ) : null}
          {phase === "success" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden />
              </div>
              <h1 className="text-center text-xl font-bold text-slate-900">Račun je potvrđen</h1>
              <p className="text-center text-sm text-slate-700">
                Možeš se prijaviti s emailom i lozinkom.
              </p>
              <Button type="button" className="w-full" onClick={() => navigate("/prijava?verified=1")}>
                Na prijavu
              </Button>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Verify;
