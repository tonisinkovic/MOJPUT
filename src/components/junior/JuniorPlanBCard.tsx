import { Link } from "react-router-dom";
import { LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanBSuggestion } from "@/lib/juniorPlanB";
import { calculatorHref, mapSchoolHref } from "@/lib/juniorPath";
import { programHref } from "@/lib/juniorProgramGuide";

export default function JuniorPlanBCard({ plan }: { plan: PlanBSuggestion }) {
  return (
    <div className="mt-3 rounded-2xl border border-sky-500/25 bg-sky-500/[0.06] px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-sky-800 dark:text-sky-200">
        <LifeBuoy className="h-3.5 w-3.5" />
        Plan B
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{plan.why}</p>
      <p className="mt-2 text-sm font-semibold">{plan.fitLine}</p>
      <p className="text-sm text-muted-foreground">{plan.realLine}</p>
      {plan.school ? (
        <p className="mt-2 text-sm font-semibold">
          {plan.school.name}{" "}
          <span className="font-normal text-muted-foreground">
            ({plan.school.city}
            {plan.school.distanceKm != null ? ` · ~${plan.school.distanceKm} km` : ""}
            {plan.school.cutoff?.min != null ? ` · prag ${plan.school.cutoff.min}` : ""})
          </span>
        </p>
      ) : (
        <p className="mt-2 text-sm font-semibold">{plan.program.name}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-2.5 text-xs">
          <Link to={programHref(plan.program)}>O programu</Link>
        </Button>
        {plan.school ? (
          <>
            <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-2.5 text-xs">
              <Link to={mapSchoolHref(plan.school.mapSchoolId, plan.school.name, plan.school.city)}>
                Na karti
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-2.5 text-xs">
              <Link to={calculatorHref(plan.school.cutoff?.schoolId, plan.school.cutoff?.programId)}>
                Šansa
              </Link>
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
