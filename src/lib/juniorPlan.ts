/**
 * Osobni plan do upisa: 3–5 koraka iz kviza + kalendara.
 * Razlog da se učenik vrati u svibnju, ne samo u ožujku.
 */

import { juniorEvents, nextUpcomingEvent, type CalendarEvent } from "@/data/calendarEvents";
import type { JuniorQuizSnapshot } from "@/lib/juniorPath";
import { hasExtraExam } from "@/lib/juniorProgramGuide";
import { highSchoolPrograms } from "@/lib/juniorQuizEngine";

export type JuniorPlanStep = {
  id: string;
  title: string;
  detail: string;
  href: string;
  when: string;
};

const MONTHS_HR = [
  "siječanj",
  "veljača",
  "ožujak",
  "travanj",
  "svibanj",
  "lipanj",
  "srpanj",
  "kolovoz",
  "rujan",
  "listopad",
  "studeni",
  "prosinac",
];

export type JuniorPlanInput = {
  snapshot: JuniorQuizSnapshot | null;
  shortlistCount: number;
  hasGrades: boolean;
  from?: Date;
};

function monthLabel(from: Date): string {
  return MONTHS_HR[from.getMonth()] ?? "ovaj mjesec";
}

function extraExamOnSnapshot(snapshot: JuniorQuizSnapshot): boolean {
  return snapshot.recommendations.slice(0, 3).some((rec) => {
    const program = highSchoolPrograms.find((p) => p.id === rec.id);
    return program ? hasExtraExam(program) : rec.type === "umjetnicka";
  });
}

function nextMaySignup(from: Date): CalendarEvent | null {
  const prijave = juniorEvents
    .filter((e) => /počinju prijave/i.test(e.title))
    .sort((a, b) => a.year - b.year || a.month - b.month || a.day - b.day);
  return prijave.find((e) => new Date(e.year, e.month, e.day, 23, 59, 59).getTime() >= from.getTime()) ?? null;
}

export function buildJuniorPlan(input: JuniorPlanInput): JuniorPlanStep[] {
  const from = input.from ?? new Date();
  const month = monthLabel(from);
  const steps: JuniorPlanStep[] = [];
  const snap = input.snapshot;

  if (!snap) {
    steps.push({
      id: "quiz",
      title: "Riješi kviz za srednju",
      detail: "Bez kviza nema osobnog plana. Traje oko 10 minuta i predlaže programe, ne fakultet.",
      href: "/kviz-srednja",
      when: "danas",
    });
  } else {
    const subjects = snap.topSubjects
      .slice(0, 3)
      .map((s) => s.label)
      .filter(Boolean);
    if (subjects.length > 0) {
      steps.push({
        id: "subjects",
        title: `Ovaj mjesec: ${subjects.slice(0, 2).join(" i ")}`,
        detail: `Za tvoje smjerove s kviza sada najviše pomaže podići ${subjects.join(", ")} — ne sve predmete jednako.`,
        href: "/kalkulator",
        when: month,
      });
    }
  }

  if (snap && extraExamOnSnapshot(snap)) {
    steps.push({
      id: "exam",
      title: "Pripremi dodatnu provjeru",
      detail: "Na vrhu liste imaš program s prijemnim, portfoliom ili audicijom. To se ne rješava tjedan prije roka.",
      href: "/programi",
      when: month,
    });
  }

  if (input.shortlistCount === 0) {
    steps.push({
      id: "shortlist",
      title: "Spremi 2–3 škole s kviza",
      detail: "Lista ostaje na računu. Bez nje pedagog i roditelj gledaju prazan ekran.",
      href: snap ? "/kviz-srednja" : "/srednje-skole",
      when: month,
    });
  } else {
    steps.push({
      id: "visit",
      title: "Dan otvorenih vrata ili posjet",
      detail: "Jedna škola s liste, ovaj ili idući mjesec. Pitanje trećem razredu na forumu vrijedi više od brošure.",
      href: "/usporedi-skole",
      when: month,
    });
  }

  if (!input.hasGrades) {
    steps.push({
      id: "grades",
      title: "Unesi ocjene u kalkulator",
      detail: "Bez bodova prag je samo broj. Unesi 7. i 8. da vidiš jesi li iznad lanjskog minimuma.",
      href: "/kalkulator",
      when: month,
    });
  }

  const deadline = nextUpcomingEvent(juniorEvents, from);
  if (deadline) {
    steps.push({
      id: "deadline",
      title: deadline.title,
      detail: "Stavi u kalendar. Ako kasniš, ostaje jesenski ili naknadni rok — ali prvi krug je lakši.",
      href: "/kalendar",
      when: `${deadline.day}. ${MONTHS_HR[deadline.month] ?? ""} ${deadline.year}.`,
    });
  }

  const may = nextMaySignup(from);
  const alreadyHasMay = steps.some((s) => /prijav/i.test(s.title));
  if (may && !alreadyHasMay && from.getMonth() <= 4) {
    steps.push({
      id: "may",
      title: "U svibnju: prijave u sustav",
      detail: "Vrati se tad, ne samo sad. Kviz i lista su spremljeni — u svibnju treba prijava, ne novi kviz.",
      href: "/kalendar",
      when: `svibanj ${may.year}.`,
    });
  }

  const unique: JuniorPlanStep[] = [];
  const seen = new Set<string>();
  for (const step of steps) {
    if (seen.has(step.id)) continue;
    seen.add(step.id);
    unique.push(step);
    if (unique.length >= 5) break;
  }
  return unique.slice(0, 5);
}
