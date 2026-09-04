import { Link } from "react-router-dom";
import { getStoredExperience } from "@/lib/experience";

/** Junior nema Senior alate u izborniku — ako netko ipak otvori URL, objasni zašto. */
export default function JuniorLaterNotice({ tool }: { tool: string }) {
  if (typeof window === "undefined" || getStoredExperience() !== "junior") return null;
  return (
    <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-sm leading-relaxed">
      <p className="font-semibold">{tool} je alat za Senior (matura / fakultet).</p>
      <p className="mt-1 text-muted-foreground">
        U Junioru ostaje sakriven da ne zbuni osmaše. Ako trebaš srednju školu, vrati se na{" "}
        <Link to="/kviz-srednja" className="font-semibold text-primary underline-offset-2 hover:underline">
          kviz
        </Link>
        ,{" "}
        <Link to="/srednje-skole" className="font-semibold text-primary underline-offset-2 hover:underline">
          kartu
        </Link>{" "}
        ili{" "}
        <Link to="/kalkulator" className="font-semibold text-primary underline-offset-2 hover:underline">
          kalkulator bodova
        </Link>
        .
      </p>
    </div>
  );
}
