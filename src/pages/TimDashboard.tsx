import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { fetchAdminStats, type AdminStats } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  Clock,
  MessageSquareText,
  MessagesSquare,
  Mail,
  Heart,
  TrendingUp,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const statCards: {
  key: keyof AdminStats;
  label: string;
  hint: string;
  icon: ReactNode;
}[] = [
  {
    key: "users_total",
    label: "Registrirani korisnici",
    hint: "Ukupno redova u tablici korisnika",
    icon: <Users className="h-5 w-5" />,
  },
  {
    key: "users_verified",
    label: "Potvrđeni email",
    hint: "Korisnici koji su dovršili potvrdu računa",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    key: "pending_registrations",
    label: "Čeka potvrdu",
    hint: "Registracije još bez unosa koda",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    key: "registrations_last_7_days",
    label: "Novi (7 dana)",
    hint: "Registracije u zadnjih tjedan dana",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    key: "site_feedback",
    label: "Povratne informacije",
    hint: "Broj poslanih povratnih poruka (u bazi)",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    key: "forum_conversations",
    label: "Forum — teme",
    hint: "Aktivni razgovori",
    icon: <MessagesSquare className="h-5 w-5" />,
  },
  {
    key: "forum_messages",
    label: "Forum — poruke",
    hint: "Ukupno poruka",
    icon: <MessageSquareText className="h-5 w-5" />,
  },
  {
    key: "forum_likes",
    label: "Forum — lajkovi",
    hint: "Ukupno lajkova na porukama",
    icon: <Heart className="h-5 w-5" />,
  },
];

const TimDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetchAdminStats().then((res) => {
      if (!alive) return;
      if (!res.success) {
        setError(res.message || "Nema pristupa ili greška servera.");
        setLoading(false);
        return;
      }
      const body = res as { success: true; data: AdminStats };
      setStats(body.data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Layout>
      <section className="container py-10 md:py-14 max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Button variant="ghost" size="sm" className="mb-2 -ml-2 gap-1 text-muted-foreground" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Natrag
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tim — statistika</h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl">
              Sažetak iz baze (samo za račune navedene u{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">ADMIN_EMAILS</code> na serveru). Podaci se ne dijele
              s ostalim korisnicima.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground py-12">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Učitavam…
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="font-medium text-destructive">{error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Ako si član tima, provjeri je li tvoj email u <code className="text-xs bg-muted px-1 rounded">ADMIN_EMAILS</code>{" "}
                na API-ju i jesi li prijavljen tim računom.
              </p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link to="/prijava">Prijava</Link>
              </Button>
            </div>
          </div>
        )}

        {stats && !loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border bg-card p-5 shadow-sm hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="text-2xl font-bold tabular-nums">{stats[item.key]}</span>
                </div>
                <p className="font-semibold text-sm leading-snug">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.hint}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default TimDashboard;
