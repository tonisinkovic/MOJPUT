import { useCallback, useEffect, useState } from "react";
import { Flag, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost } from "@/lib/api";

type ForumReport = {
  message_id: number;
  text: string;
  created_at: string;
  hidden_at: string | null;
  deleted_by_user_at: string | null;
  conversation_id: number;
  conversation_title: string;
  audience: string;
  author: string;
  report_count: number;
  last_report_at: string;
  reasons: string[];
};

const REASON_LABEL: Record<string, string> = {
  uvreda: "uvreda",
  spam: "spam",
  neprimjereno: "neprimjereno",
  osobni_podaci: "osobni podaci",
  ostalo: "ostalo",
};

function reasonSummary(reasons: string[]): string {
  const counts = new Map<string, number>();
  for (const r of reasons) counts.set(r, (counts.get(r) ?? 0) + 1);
  return [...counts.entries()].map(([r, n]) => `${REASON_LABEL[r] ?? r} ×${n}`).join(", ");
}

export default function ForumReportsPanel() {
  const [reports, setReports] = useState<ForumReport[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await apiGet<ForumReport[]>("/api/admin/forum/reports");
    if (!res.success) {
      setError(res.message);
      setReports([]);
      return;
    }
    setError("");
    setReports(res.data ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (id: number, action: "restore" | "remove") => {
    setBusyId(id);
    const url =
      action === "restore" ? `/api/admin/forum/messages/${id}/restore` : `/api/forum/messages/${id}/soft-delete`;
    const res = await apiPost(url, {});
    setBusyId(null);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(action === "restore" ? "Poruka vraćena, prijave obrisane." : "Poruka uklonjena.");
    await load();
  };

  return (
    <section className="mt-10 rounded-2xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Flag className="h-5 w-5 text-destructive" aria-hidden />
        <h2 className="text-lg font-bold">Forum — prijavljene poruke</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Poruka s 3 ili više prijava automatski je skrivena. Vrati je ako su prijave neosnovane ili je trajno ukloni.
      </p>

      {reports === null ? (
        <div className="flex items-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Učitavam prijave…
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nema prijavljenih poruka.</p>
      ) : (
        <ul className="divide-y rounded-xl border">
          {reports.map((r) => (
            <li key={r.message_id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {r.audience === "junior" ? "Junior" : "Senior"} · {r.conversation_title} · {r.author}
                </p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm">
                  {r.deleted_by_user_at ? <span className="italic text-muted-foreground">(uklonjena)</span> : r.text}
                </p>
                <p className="mt-1 text-xs">
                  <span className="font-semibold text-destructive">{r.report_count} prijava</span>
                  {r.reasons.length > 0 && <span className="text-muted-foreground"> · {reasonSummary(r.reasons)}</span>}
                  {r.hidden_at && <span className="ml-1 font-semibold text-amber-700">· skrivena</span>}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === r.message_id}
                  onClick={() => void act(r.message_id, "restore")}
                >
                  <RotateCcw className="mr-1 h-3.5 w-3.5" />
                  Vrati
                </Button>
                {!r.deleted_by_user_at && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busyId === r.message_id}
                    onClick={() => void act(r.message_id, "remove")}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Ukloni
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
