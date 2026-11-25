import { useCallback, useEffect, useState } from "react";
import { Gift, Loader2, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  adminFetchDrawStats,
  adminPickDrawWinner,
  isAdminApiError,
  type AdventAdminDrawStats,
} from "@/lib/adventLeagueAdminApi";

export function AdventPrizeDrawAdmin() {
  const [stats, setStats] = useState<AdventAdminDrawStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetchDrawStats();
    setLoading(false);
    if (isAdminApiError(res) || !res.data) {
      toast.error(res.message || "Ne mogu učitati nagradnu igru.");
      return;
    }
    setStats(res.data);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onPick = async () => {
    if (!confirm("Nasumično izvući jednog dobitnika među svima prijavljenim u nagradnoj igri?")) return;
    setPicking(true);
    const res = await adminPickDrawWinner();
    setPicking(false);
    if (isAdminApiError(res) || !res.data?.winner) {
      toast.error(res.message || "Izvlačenje nije uspjelo.");
      return;
    }
    toast.success(`Dobitnik: @${res.data.winner.username} (iz ${res.data.winner.poolSize} prijava)`);
    await load();
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Nagradna igra (izvlačenje)
        </CardTitle>
        <CardDescription>
          Korisnici se prijavljuju na landing stranici. Bodovi ljestvice nisu povezani — samo lista sudionika.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : stats ? (
          <>
            <p className="text-sm">
              Prijavljeno: <span className="text-lg font-extrabold">{stats.entrantCount}</span>
            </p>
            <Button type="button" className="rounded-xl" disabled={picking || stats.entrantCount < 1} onClick={() => void onPick()}>
              {picking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shuffle className="mr-2 h-4 w-4" />}
              Izvuci nasumičnog dobitnika
            </Button>
            {stats.recentWinners.length > 0 ? (
              <ul className="space-y-2 text-sm">
                <p className="font-semibold text-muted-foreground">Zadnja izvlačenja</p>
                {stats.recentWinners.map((w) => (
                  <li key={w.id} className="flex justify-between rounded-lg border px-3 py-2">
                    <span className="font-medium">@{w.username}</span>
                    <span className="text-muted-foreground">{w.pickedAt?.slice(0, 10)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}