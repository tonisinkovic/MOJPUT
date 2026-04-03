import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { authVerifyEmail } from "@/lib/auth";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Link iz maila: ${APP_ORIGIN}/MOJPUT/verify?token=...
 */
const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token")?.trim();
    if (!token) {
      setPhase("error");
      setMessage("Nedostaje token za potvrdu.");
      return;
    }
    authVerifyEmail(token)
      .then((res) => {
        if (res.success) {
          setPhase("success");
          setMessage("Račun je potvrđen. Možeš se prijaviti s emailom i lozinkom.");
        } else {
          setPhase("error");
          setMessage(res.message || "Potvrda nije uspjela.");
        }
      })
      .catch(() => {
        setPhase("error");
        setMessage("Nije moguće potvrditi račun. Provjeri vezu i pokušaj ponovno.");
      });
  }, [searchParams]);

  return (
    <Layout>
      <section className="container py-16 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center space-y-6">
          {phase === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" aria-hidden />
              <h1 className="text-xl font-bold text-slate-900">Potvrda računa</h1>
              <p className="text-sm text-slate-600">Potvrđujemo tvoj email…</p>
            </>
          )}
          {phase === "success" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Račun je potvrđen</h1>
              <p className="text-sm text-slate-700">{message}</p>
              <Button type="button" className="w-full" onClick={() => navigate("/prijava")}>
                Na prijavu
              </Button>
            </>
          )}
          {phase === "error" && (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" aria-hidden />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Potvrda nije uspjela</h1>
              <p className="text-sm text-slate-700">{message}</p>
              <Button type="button" variant="secondary" className="w-full" onClick={() => navigate("/prijava")}>
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
