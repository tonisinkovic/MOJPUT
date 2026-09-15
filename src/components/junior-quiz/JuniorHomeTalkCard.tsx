import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildHomeTalk } from "@/lib/juniorHomeTalk";
import type { JuniorQuizAnalysis } from "@/lib/juniorQuizEngine";

export default function JuniorHomeTalkCard({ analysis }: { analysis: JuniorQuizAnalysis }) {
  const talk = buildHomeTalk(analysis);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(talk.text);
      setCopied(true);
      toast.success("Tekst je u međuspremniku — zalijepi ga u poruku.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopiranje nije uspjelo. Označi tekst i kopiraj ručno.");
    }
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg sm:p-6">
      <h3 className="text-base font-bold">Što možeš reći kod kuće</h3>
      <p className="mt-1 text-sm text-muted-foreground">Pet redaka. Nije ocjena i nije odluka.</p>
      <ul className="mt-3 space-y-2 text-sm">
        <li>
          <span className="font-semibold">Vuče te: </span>
          {talk.pulls}
        </li>
        {talk.programs.length > 0 ? (
          <li>
            <span className="font-semibold">Vrijedi pogledati: </span>
            {talk.programs.join(" i ")}
          </li>
        ) : null}
        <li>
          <span className="font-semibold">Na što obratiti pažnju: </span>
          {talk.watch}
        </li>
        <li>
          <span className="font-semibold">Pitaj roditelja: </span>
          {talk.parentQuestion}
        </li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={() => void copy()}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          Kopiraj
        </Button>
        <Button asChild size="sm" className="rounded-xl">
          <a href={`https://wa.me/?text=${encodeURIComponent(talk.text)}`} target="_blank" rel="noreferrer">
            <MessageCircle className="mr-1.5 h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
