/**
 * Most od djetetovog kviza do kuće: isti podatci, jezik za roditelja.
 * Nije novi kviz — roditelj ne odgovara umjesto djeteta.
 */

import type { NearbyAnalysis } from "@/lib/juniorGeo";
import { enrichNearbySchool } from "@/lib/juniorPath";
import {
  juniorProgramTypeLabels,
  type JuniorQuizAnalysis,
} from "@/lib/juniorQuizEngine";

export type ParentBriefSchool = {
  name: string;
  city: string;
  km: number | null;
  prag: number | null;
};

export type ParentBriefProgram = {
  name: string;
  typeLabel: string;
  duration: number;
  why: string[];
  after: string;
  schools: ParentBriefSchool[];
};

export type ParentBrief = {
  v: 1;
  city: string | null;
  savedAt: string;
  pathwayTitle: string;
  pathwayWhy: string;
  confidence: string;
  programs: ParentBriefProgram[];
  questions: string[];
};

const BRIEF_KEY = "junior-parent-brief-v1";

function toParentReason(reason: string): string {
  return reason
    .replace(/^Rekao\/la si da/i, "Dijete je reklo da")
    .replace(/^Jak ti je interes:\s*/i, "Istaknut interes: ")
    .replace(/^U školi ti dobro ide:\s*/i, "U školi dobro ide: ")
    .replace(/^Ukupni profil interesa i predmeta dobro se poklapa s ovim programom\./i, "Profil interesa i predmeta dobro se poklapa s ovim programom.");
}

function parentPathwayWhy(analysis: JuniorQuizAnalysis): string {
  const raw = analysis.pathway.explanation
    .replace(/\bti\b/gi, "dijete")
    .replace(/\bTvoj\b/g, "Njegov/njezin")
    .replace(/\btvoj\b/g, "njihov");
  return `${raw} Ovo je orijentacija iz kviza, ne preporuka upisa i ne zamjena za razgovor kod kuće.`;
}

function buildQuestions(analysis: JuniorQuizAnalysis, city: string | null): string[] {
  const top = analysis.recommendations[0]?.program.name ?? "predloženi program";
  const direction =
    analysis.pathway.direction === "gimnazija"
      ? "gimnazijski, više teorije"
      : analysis.pathway.direction === "strukovna"
        ? "strukovni, više prakse"
        : "mješoviti — i teorija i praksa";
  return [
    `Što u programu „${top}” zvuči kao vaše dijete, a što kao očekivanje okoline?`,
    city
      ? `Jesu li škole do 30 km od mjesta ${city} prihvatljive, ili razmatrate selidbu ili učenički dom?`
      : "Gdje bi dijete stvarno htjelo ići u školu — i zašto baš tamo?",
    `Kviz naginje prema ${direction} putu. Kako to vidite vi, a kako dijete?`,
    "Koji je prvi zajednički korak ovaj tjedan: miran razgovor, dan otvorenih vrata ili posjet jednoj školi?",
  ];
}

export function buildParentBrief(
  analysis: JuniorQuizAnalysis,
  city: string | null,
  nearby: NearbyAnalysis | null,
): ParentBrief {
  const programs = analysis.recommendations.slice(0, 3).map((rec) => {
    const rawSchools = nearby?.byProgram.get(rec.program.id) ?? [];
    const schools = rawSchools.slice(0, 3).map((s) => {
      const enriched = enrichNearbySchool(s, rec.program);
      return {
        name: s.name,
        city: s.city,
        km: s.distanceKm,
        prag: enriched.cutoff?.min ?? null,
      };
    });
    return {
      name: rec.program.name,
      typeLabel: juniorProgramTypeLabels[rec.program.type],
      duration: rec.program.duration,
      why: rec.reasons.slice(0, 2).map(toParentReason),
      after: rec.program.afterSchool,
      schools,
    };
  });

  return {
    v: 1,
    city,
    savedAt: new Date().toISOString(),
    pathwayTitle: analysis.pathway.title,
    pathwayWhy: parentPathwayWhy(analysis),
    confidence:
      analysis.confidence.level === "high"
        ? "Kviz je prilično jasan — ipak ga tretirajte kao početak razgovora."
        : analysis.confidence.level === "medium"
          ? "Rezultat je koristan, ali nije čvrsta dijagnoza interesa."
          : "Rezultat je okviran. Važnije je što dijete kaže uživo nego postotak na ekranu.",
    programs,
    questions: buildQuestions(analysis, city),
  };
}

export function encodeParentBrief(brief: ParentBrief): string {
  const json = JSON.stringify(brief);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeParentBrief(raw: string): ParentBrief | null {
  try {
    const padded = raw.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const json = decodeURIComponent(escape(atob(padded + pad)));
    const parsed = JSON.parse(json) as ParentBrief;
    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.programs)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveParentBrief(brief: ParentBrief): void {
  try {
    window.localStorage.setItem(BRIEF_KEY, JSON.stringify(brief));
  } catch {
    /* ignore */
  }
}

export function loadParentBrief(): ParentBrief | null {
  try {
    const raw = window.localStorage.getItem(BRIEF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ParentBrief;
    return parsed?.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function parentBriefShareText(brief: ParentBrief): string {
  const lines = [
    "MojPut — rezultat kviza za srednju (orijentacija, nije odluka)",
    "",
    brief.pathwayTitle,
    brief.pathwayWhy,
    "",
    brief.confidence,
    "",
  ];
  brief.programs.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.name} (${p.typeLabel}, ${p.duration} god.)`);
    p.why.forEach((w) => lines.push(`   · ${w}`));
    if (p.schools.length) {
      lines.push(
        `   Škole u blizini: ${p.schools
          .map((s) => {
            const km = s.km != null ? ` ~${s.km} km` : "";
            const prag = s.prag != null ? `, prag ${s.prag}` : "";
            return `${s.name} (${s.city}${km}${prag})`;
          })
          .join("; ")}`,
      );
    }
    lines.push(`   Nakon škole: ${p.after}`);
    lines.push("");
  });
  lines.push("Pitanja za razgovor:");
  brief.questions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  return lines.join("\n");
}

export function parentBriefHref(brief: ParentBrief): string {
  const encoded = encodeParentBrief(brief);
  const base = `${window.location.origin}${import.meta.env.BASE_URL || "/"}`.replace(/\/+$/, "/");
  return `${base}roditeljski-rezultat?d=${encoded}`;
}
