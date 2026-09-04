import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  encodeParentBrief,
  parentBriefHref,
  parentBriefShareText,
  type ParentBrief,
} from "@/lib/juniorParentBrief";

export default function JuniorShareParents({
  brief,
  variant = "default",
}: {
  brief: ParentBrief;
  variant?: "default" | "outline";
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = parentBriefHref(brief);
    const text = parentBriefShareText(brief);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "MojPut — rezultat za roditelje",
          text: `${brief.pathwayTitle}\n\nOvo je orijentacija iz kviza, ne odluka.`,
          url,
        });
        return;
      }
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopied(true);
      toast.success("Tekst i poveznica su u međuspremniku.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Kopiranje nije uspjelo — otvori stranicu za roditelje.");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" variant={variant} className="rounded-xl" onClick={() => void share()}>
        {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
        Pošalji mami/tati
      </Button>
      <Button asChild size="sm" variant="outline" className="rounded-xl">
        <Link to={`/roditeljski-rezultat?d=${encodeParentBrief(brief)}`}>
          <Users className="mr-1.5 h-4 w-4" />
          Prikaži za roditelje
        </Link>
      </Button>
    </div>
  );
}
