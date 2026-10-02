import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NotebookPen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchParentDnevnik } from "@/lib/parentDnevnikApi";
import type { DnevnikEntry } from "@/lib/parentDnevnikStore";

export default function ParentDnevnikProfile() {
  const [entries, setEntries] = useState<DnevnikEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchParentDnevnik().then((res) => {
      if (cancelled) return;
      if (res.success && Array.isArray(res.data)) setEntries(res.data);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <NotebookPen className="h-4 w-4 text-primary" />
          Dnevnik razgovora
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!ready ? (
          <p className="text-sm text-muted-foreground">Učitavanje zapisa…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Još nema zapisa na ovom računu.</p>
        ) : (
          <ul className="space-y-2">
            {entries.slice(0, 5).map((entry) => {
              const d = new Date(`${entry.dateIso}T00:00:00`);
              const dateStr = Number.isNaN(d.getTime())
                ? entry.dateIso
                : d.toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
              return (
                <li key={entry.id} className="rounded-xl border border-border/70 px-3 py-2 text-sm">
                  <p className="font-semibold">{dateStr}</p>
                  {entry.teme ? <p className="mt-0.5 text-muted-foreground line-clamp-2">{entry.teme}</p> : null}
                  {entry.sljedeciKorak ? (
                    <p className="mt-0.5 text-xs text-foreground/80">Sljedeći korak: {entry.sljedeciKorak}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
        <Link
          to="/roditeljski-kutak/vodic-za-roditelje?experience=junior#dnevnik"
          className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Otvori dnevnik
        </Link>
      </CardContent>
    </Card>
  );
}
