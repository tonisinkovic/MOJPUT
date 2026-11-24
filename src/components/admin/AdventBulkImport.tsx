import { useCallback, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileUp, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  adminConfirmImport,
  adminFetchImportTemplate,
  adminPreviewImport,
  isAdminApiError,
  type AdventImportPreviewPayload,
} from "@/lib/adventLeagueAdminApi";

const STATUS_LABEL: Record<string, string> = {
  ready: "Spremno",
  duplicate: "Duplikat",
  error: "Greška",
};

function statusClass(status: string) {
  if (status === "ready") return "border-emerald-200 bg-emerald-50/50";
  if (status === "duplicate") return "border-amber-200 bg-amber-50/50";
  return "border-destructive/40 bg-destructive/5";
}

export function AdventBulkImport({ onImported }: { onImported?: () => void }) {
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<AdventImportPreviewPayload | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [overwriteDuplicates, setOverwriteDuplicates] = useState(false);
  const [createMissingDays, setCreateMissingDays] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const readyLineNumbers = useMemo(
    () =>
      (preview?.rows || [])
        .filter((r) => r.status === "ready" || (r.status === "duplicate" && overwriteDuplicates))
        .map((r) => r.lineNumber),
    [preview, overwriteDuplicates],
  );

  const handleFile = useCallback(async (file: File | null) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv") && file.type && !file.type.includes("csv")) {
      toast.error("Odaberi .csv datoteku.");
      return;
    }
  const text = await file.text();
    setCsvText(text);
    setFileName(file.name);
    setPreview(null);
    setPreviewError(null);
  }, []);

  const runPreview = useCallback(async () => {
    if (!csvText.trim()) {
      toast.error("Prvo učitaj CSV.");
      return;
    }
    setLoadingPreview(true);
    setPreviewError(null);
    const res = await adminPreviewImport(csvText);
    setLoadingPreview(false);
    if (isAdminApiError(res)) {
      setPreview(null);
      setPreviewError(res.message);
      toast.error(res.message);
      return;
    }
    if (res.data) {
      setPreview(res.data);
      toast.success("Pregled generiran.");
    }
  }, [csvText]);

  const downloadTemplate = useCallback(async () => {
    const res = await adminFetchImportTemplate();
    if (!res.ok) {
      toast.error("Predložak nije dostupan.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "advent-pitanja-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const runConfirm = useCallback(async () => {
    if (!csvText.trim() || !preview) return;
    if (readyLineNumbers.length === 0) {
      toast.error("Nema valjanih redaka za uvoz.");
      return;
    }
    if (!confirm(`Uvezi ${readyLineNumbers.length} pitanja? Nevaljani redovi bit će preskočeni.`)) return;

    setConfirming(true);
    const res = await adminConfirmImport({
      csv: csvText,
      overwriteDuplicates,
      createMissingDays,
      lineNumbers: readyLineNumbers,
    });
    setConfirming(false);

    if (isAdminApiError(res)) {
      toast.error(res.message);
      return;
    }
    toast.success(res.data?.message || "Uvoz završen.");
    setPreview(null);
    setCsvText("");
    setFileName(null);
    onImported?.();
  }, [csvText, preview, readyLineNumbers, overwriteDuplicates, createMissingDays, onImported]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Bulk uvoz pitanja (CSV)
        </CardTitle>
        <CardDescription>
          Stupci: day_key ili day_number, question_index (opcionalno), question_text, category, option_a–d, correct,
          explanation, difficulty (1–5). Pregledaj prije potvrde.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="rounded-xl" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Predložak CSV
          </Button>
          <label
            htmlFor="advent-csv-upload"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/50"
          >
            <FileUp className="h-4 w-4" />
            Odaberi datoteku
            <input
              id="advent-csv-upload"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {fileName && (
          <p className="text-xs text-muted-foreground">
            Datoteka: <span className="font-medium text-foreground">{fileName}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="overwrite-dup"
              checked={overwriteDuplicates}
              onCheckedChange={(v) => setOverwriteDuplicates(Boolean(v))}
            />
            <Label htmlFor="overwrite-dup" className="text-sm font-normal">
              Zamijeni postojeća pitanja (isti dan + index)
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="create-days"
              checked={createMissingDays}
              onCheckedChange={(v) => setCreateMissingDays(Boolean(v))}
            />
            <Label htmlFor="create-days" className="text-sm font-normal">
              Kreiraj nedostajuće dane kao neaktivne
            </Label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={runPreview} disabled={loadingPreview || !csvText.trim()} className="rounded-xl">
            {loadingPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Pregled uvoza
          </Button>
          <Button
            type="button"
            onClick={runConfirm}
            disabled={confirming || !preview || readyLineNumbers.length === 0}
            className="rounded-xl"
          >
            {confirming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Potvrdi uvoz ({readyLineNumbers.length})
          </Button>
        </div>

        {previewError && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{previewError}</span>
          </div>
        )}

        {preview && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 text-sm">
              <span>
                Ukupno: <strong>{preview.summary.total}</strong>
              </span>
              <span className="text-emerald-700">
                Spremno: <strong>{preview.summary.ready}</strong>
              </span>
              <span className="text-amber-700">
                Duplikati: <strong>{preview.summary.duplicate}</strong>
              </span>
              <span className="text-destructive">
                Greške: <strong>{preview.summary.error}</strong>
              </span>
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border p-2">
              {preview.rows.map((row) => (
                <div
                  key={row.lineNumber}
                  className={cn("rounded-lg border p-3 text-sm", statusClass(row.status))}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold">
                      Red {row.lineNumber} · {STATUS_LABEL[row.status] || row.status}
                    </span>
                    {row.dayKey && (
                      <span className="text-xs text-muted-foreground">
                        {row.dayKey}
                        {row.questionIndex != null ? ` · #${row.questionIndex}` : ""}
                      </span>
                    )}
                  </div>
                  {row.questionPreview && (
                    <p className="mt-1 line-clamp-2 text-muted-foreground">{row.questionPreview.text}</p>
                  )}
                  {row.errors.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-destructive">
                      {row.errors.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  )}
                  {row.warnings.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-amber-800">
                      {row.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {preview.summary.error > 0 && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Samo valjani redovi uvezeni nakon potvrde; greške se ne objavljuju.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}