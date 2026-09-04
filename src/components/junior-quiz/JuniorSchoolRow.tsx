import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, Calculator, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HighSchoolProgram } from "@/lib/juniorQuizEngine";
import {
  CHANCE_TONE,
  addToShortlist,
  calculatorHref,
  chanceFor,
  effectiveJuniorPoints,
  isOnShortlist,
  mapSchoolHref,
  onJuniorPointsChange,
  onShortlistChange,
  removeFromShortlist,
  shortlistFromNearby,
  type EnrichedNearbySchool,
} from "@/lib/juniorPath";

export default function JuniorSchoolRow({
  school,
  program,
  matchPercentage,
}: {
  school: EnrichedNearbySchool;
  program: HighSchoolProgram;
  matchPercentage: number | null;
}) {
  const [saved, setSaved] = useState(() =>
    isOnShortlist(shortlistFromNearby(school, program, matchPercentage).key),
  );
  const [points, setPoints] = useState<number | null>(() => effectiveJuniorPoints());

  useEffect(() => {
    const syncList = () =>
      setSaved(isOnShortlist(shortlistFromNearby(school, program, matchPercentage).key));
    const syncPts = () => setPoints(effectiveJuniorPoints());
    const offList = onShortlistChange(syncList);
    const offPts = onJuniorPointsChange(syncPts);
    return () => {
      offList();
      offPts();
    };
  }, [school, program, matchPercentage]);

  const item = shortlistFromNearby(school, program, matchPercentage);
  const chance =
    points != null && school.cutoff?.min != null ? chanceFor(points, school.cutoff.min) : null;

  const toggleSave = () => {
    if (saved) {
      removeFromShortlist(item.key);
      toast.message("Maknuto s liste.");
      return;
    }
    const res = addToShortlist(item);
    if (res.ok) {
      toast.success("Spremljeno u moje škole.");
      return;
    }
    if (res.reason === "exists") toast.message("Već je na listi.");
    if (res.reason === "schools") toast.error("Lista prima 5 škola — makni jednu da dodaš ovu.");
    if (res.reason === "programs") {
      toast.error("Možeš pratiti najviše 3 programa — makni jedan da dodaš ovaj.");
    }
  };

  return (
    <li className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug">
            {school.name}{" "}
            <span className="font-normal text-muted-foreground">({school.city})</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            ~{school.distanceKm} km
            {school.cutoff?.min != null ? (
              <>
                {" "}
                · prag {school.cutoff.min.toLocaleString("hr-HR")}
                {school.cutoff.year ? ` (${school.cutoff.year})` : ""}
              </>
            ) : (
              " · prag nije u bazi"
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleSave}
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition",
            saved
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary",
          )}
          aria-label={saved ? "Ukloni sa liste" : "Spremi školu"}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>

      {chance ? (
        <p
          className={cn(
            "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold",
            CHANCE_TONE[chance.tone].badge,
          )}
        >
          {chance.label}
        </p>
      ) : school.cutoff?.min != null ? (
        <p className="mt-1.5 text-[11px] text-muted-foreground">Unesi bodove iznad da vidiš šansu.</p>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-1.5">
        <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-2.5 text-xs">
          <Link to={mapSchoolHref(school.mapSchoolId, school.name, school.city)}>
            <MapPin className="mr-1 h-3 w-3" />
            Na karti
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-2.5 text-xs">
          <Link to={calculatorHref(school.cutoff?.schoolId, school.cutoff?.programId)}>
            <Calculator className="mr-1 h-3 w-3" />
            Izračunaj šansu
          </Link>
        </Button>
      </div>
    </li>
  );
}
