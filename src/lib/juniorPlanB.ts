/**
 * Plan B uz top izbor: bliža ili lakša škola istog tipa.
 * Ne mijenja kviz — samo kaže što učenik može stvarno upisati.
 */

import { nearbySchoolsForProgram, type NearbySchool } from "@/lib/juniorGeo";
import {
  chanceFor,
  enrichNearbySchool,
  type EnrichedNearbySchool,
} from "@/lib/juniorPath";
import {
  highSchoolPrograms,
  type HighSchoolProgram,
  type JuniorProgramMatch,
} from "@/lib/juniorQuizEngine";

export const PLAN_B_FAR_KM = 18;
export const PLAN_B_SEARCH_KM = 55;

const ENTRY_RANK: Record<HighSchoolProgram["entryBar"], number> = {
  nizi: 0,
  srednji: 1,
  visok: 2,
};

export type PlanBReason = "no_school" | "far" | "cutoff" | "high_bar";

export type PlanBSuggestion = {
  reasons: PlanBReason[];
  why: string;
  fitLine: string;
  realLine: string;
  school: EnrichedNearbySchool | null;
  program: HighSchoolProgram;
  matchPercentage: number | null;
};

export function planBReasons(input: {
  nearby: EnrichedNearbySchool[];
  points: number | null;
  entryBar: HighSchoolProgram["entryBar"];
}): PlanBReason[] {
  const first = input.nearby[0];
  const reasons: PlanBReason[] = [];
  if (!first) {
    reasons.push("no_school");
    return reasons;
  }
  if (first.distanceKm >= PLAN_B_FAR_KM) reasons.push("far");
  if (input.points != null && first.cutoff?.min != null) {
    const tone = chanceFor(input.points, first.cutoff.min).tone;
    if (tone === "amber" || tone === "rose") reasons.push("cutoff");
  } else if (input.entryBar === "visok" && (first.cutoff?.min ?? 0) >= 65) {
    reasons.push("high_bar");
  }
  return reasons;
}

function whyText(reasons: PlanBReason[]): string {
  if (reasons.includes("no_school")) {
    return "U krugu od 30 km nema škole s ovim programom.";
  }
  if (reasons.includes("cutoff") && reasons.includes("far")) {
    return "Prva škola je daleko, a lanjski prag je visok za tvoje bodove.";
  }
  if (reasons.includes("cutoff")) {
    return "Lanjski prag prve škole je visok za tvoje bodove.";
  }
  if (reasons.includes("far")) {
    return "Najbliža škola s ovim programom nije baš blizu.";
  }
  return "Upis na prvi izbor nije siguran — imaj rezervu istog tipa.";
}

function pickEasierSchool(
  nearby: EnrichedNearbySchool[],
  points: number | null,
): EnrichedNearbySchool | null {
  const first = nearby[0];
  if (!first) return null;
  const rest = nearby.slice(1);
  const lowerCutoff = rest.find((s) => {
    if (first.cutoff?.min == null || s.cutoff?.min == null) return false;
    return s.cutoff.min <= first.cutoff.min - 2;
  });
  if (lowerCutoff) return lowerCutoff;
  if (points != null) {
    const safer = rest.find((s) => {
      if (s.cutoff?.min == null) return false;
      const tone = chanceFor(points, s.cutoff.min).tone;
      return tone === "emerald" || tone === "lime";
    });
    if (safer) return safer;
  }
  return null;
}

function pickSister(
  current: HighSchoolProgram,
  recommendations: JuniorProgramMatch[],
  city: string | null,
  usedProgramId: number,
): { match: { program: HighSchoolProgram; matchPercentage: number | null }; school: EnrichedNearbySchool | null } | null {
  const ranked = recommendations
    .filter((rec) => rec.program.id !== current.id && rec.program.id !== usedProgramId)
    .filter((rec) => rec.program.type === current.type)
    .sort(
      (a, b) =>
        ENTRY_RANK[a.program.entryBar] - ENTRY_RANK[b.program.entryBar] ||
        b.matchPercentage - a.matchPercentage,
    );

  const fallback =
    ranked.length > 0
      ? ranked.map((rec) => ({ program: rec.program, matchPercentage: rec.matchPercentage }))
      : highSchoolPrograms
          .filter((p) => p.id !== current.id && p.type === current.type)
          .sort((a, b) => ENTRY_RANK[a.entryBar] - ENTRY_RANK[b.entryBar])
          .slice(0, 6)
          .map((program) => ({ program, matchPercentage: null as number | null }));

  for (const rec of fallback) {
    if (ENTRY_RANK[rec.program.entryBar] > ENTRY_RANK[current.entryBar]) continue;
    const schools = city
      ? nearbySchoolsForProgram(rec.program, city, PLAN_B_SEARCH_KM, 4).map((s) =>
          enrichNearbySchool(s, rec.program),
        )
      : [];
    if (schools.length > 0 || !city) {
      return { match: rec, school: schools[0] ?? null };
    }
  }
  return null;
}

export function findPlanB(input: {
  program: HighSchoolProgram;
  matchPercentage: number;
  nearby: NearbySchool[];
  recommendations: JuniorProgramMatch[];
  city: string | null;
  points: number | null;
}): PlanBSuggestion | null {
  const nearby = input.nearby.map((s) => enrichNearbySchool(s, input.program));
  const reasons = planBReasons({
    nearby,
    points: input.points,
    entryBar: input.program.entryBar,
  });
  if (reasons.length === 0) return null;

  const easier = pickEasierSchool(nearby, input.points);
  if (easier) {
    return {
      reasons,
      why: whyText(reasons),
      fitLine: "Ovo ti leži.",
      realLine: "Ovo možeš stvarno upisati — isti program, niži lanjski prag.",
      school: easier,
      program: input.program,
      matchPercentage: input.matchPercentage,
    };
  }

  if (reasons.includes("no_school") && input.city) {
    const farther = nearbySchoolsForProgram(input.program, input.city, PLAN_B_SEARCH_KM, 4)
      .filter((s) => s.distanceKm > 30)
      .map((s) => enrichNearbySchool(s, input.program));
    if (farther[0]) {
      return {
        reasons,
        why: whyText(reasons),
        fitLine: "Ovo ti leži.",
        realLine: "Najbliža škola s ovim programom je malo dalje — provjeri prijevoz ili dom.",
        school: farther[0],
        program: input.program,
        matchPercentage: input.matchPercentage,
      };
    }
  }

  const sister = pickSister(input.program, input.recommendations, input.city, input.program.id);
  if (sister) {
    return {
      reasons,
      why: whyText(reasons),
      fitLine: "Ovo ti leži.",
      realLine:
        sister.match.program.id === input.program.id
          ? "Ovo možeš stvarno upisati."
          : `Ovo možeš stvarno upisati — ${sister.match.program.name}, isti tip puta.`,
      school: sister.school,
      program: sister.match.program,
      matchPercentage: sister.match.matchPercentage || null,
    };
  }

  return null;
}
