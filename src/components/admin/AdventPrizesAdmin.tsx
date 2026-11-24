import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Gift, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  adminFetchPrizesPartners,
  adminSavePrizesPartners,
  isPrizesApiError,
  type AdventPrizesAdminPayload,
} from "@/lib/adventLeaguePrizesApi";

const SCHEMA_HINT = `{
  "partners": [{ "id": "slug", "name": "...", "description": "...", "logoUrl": null, "websiteUrl": null, "isDemo": true }],
  "prizes": [{ "id": "slug", "name": "...", "description": "...", "imageUrl": null, "category": "sezona", "tier": "main|daily", "partnerId": "slug", "isDemo": true, "sortOrder": 1 }]
}`;

export function AdventPrizesAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await adminFetchPrizesPartners();
    setLoading(false);
    if (isPrizesApiError(res) || !res.data) {
      setError(res.success ? "Podaci nisu dostupni." : res.message);
      return;
    }
    const payload: AdventPrizesAdminPayload = {
      partners: res.data.partners,
      prizes: res.data.prizes,
    };
    setJsonText(JSON.stringify(payload, null, 2));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async () => {
    setParseError(null);
    let parsed: AdventPrizesAdminPayload;
    try {
      parsed = JSON.parse(jsonText) as AdventPrizesAdminPayload;
    } catch {
      setParseError("JSON nije valjan — provjeri sintaksu.");
      return;
    }
    setSaving(true);
    const res = await adminSavePrizesPartners(parsed);
    setSaving(false);
    if (isPrizesApiError(res)) {
      const extra = (res as { data?: { errors?: string[] } }).data?.errors;
      toast.error(extra?.length ? extra.join(" ") : res.message);
      return;
    }
    toast.success("Nagrade i partneri spremljeni.");
    void load();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Učitavam…
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="flex items-center gap-2 py-6 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Nagrade i partneri
        </CardTitle>
        <CardDescription>
          Uređivanje JSON datoteke na serveru — bez deploya koda. Postavi <code className="text-xs">isDemo: true</code>{" "}
          za placeholder sadržaj.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground">{SCHEMA_HINT}</pre>
        <Textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={18}
          className="font-mono text-xs rounded-xl"
          spellCheck={false}
        />
        {parseError ? <p className="text-sm text-destructive">{parseError}</p> : null}
        <Button type="button" className="rounded-xl" disabled={saving} onClick={() => void handleSave()}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Spremi
        </Button>
      </CardContent>
    </Card>
  );
}