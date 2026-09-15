/**
 * Adaptive question order for the junior orientation quiz (v2).
 * First ~16 questions are a wide core; the rest branch by emerging interests.
 */

import {
  calculateQuizProfile,
  juniorQuestions,
  type JuniorAnswers,
  type JuniorQuestion,
  type JuniorStudentProfile,
  type JuniorProgramMatch,
} from "@/lib/juniorQuizEngine";

const byPool = (pool: JuniorQuestion["pool"]) =>
  juniorQuestions.filter((q) => q.pool === pool).sort((a, b) => a.id - b.id);

export const CORE_QUESTIONS = byPool("core");
export const CONTEXT_QUESTIONS = byPool("context");
export const FOLLOWUP_QUESTIONS = byPool("followup");

export const BRANCH_PACKS: { id: string; pool: JuniorQuestion["pool"]; score: (p: JuniorStudentProfile) => number }[] = [
  {
    id: "health",
    pool: "health",
    score: (p) =>
      p.interests.people +
      p.interests.science +
      p.environment.health +
      (p.signals.health_medicine ?? 3) * 8 +
      (p.signals.helping_people ?? 3) * 6,
  },
  {
    id: "tech",
    pool: "tech",
    score: (p) =>
      p.interests.technology +
      p.thinking.technical +
      p.environment.computer +
      (p.signals.tech_computers ?? 3) * 8,
  },
  {
    id: "creative",
    pool: "creative",
    score: (p) =>
      p.interests.art_design +
      p.interests.media +
      p.thinking.creative +
      (p.signals.art_visual ?? 3) * 7 +
      (p.signals.music_performance ?? 3) * 6,
  },
  {
    id: "practical",
    pool: "practical",
    score: (p) =>
      p.interests.practical +
      p.thinking.practical +
      p.theoryPractice +
      (p.signals.hands_on_craft ?? 3) * 6 +
      (p.signals.cooking_food ?? 3) * 4,
  },
  {
    id: "academic",
    pool: "academic",
    score: (p) =>
      p.learning.theory +
      p.thinking.investigative +
      p.interests.languages +
      p.interests.society +
      p.postSchool.faculty,
  },
  {
    id: "peoplebiz",
    pool: "peoplebiz",
    score: (p) =>
      p.interests.economy +
      p.interests.people +
      p.thinking.organizational +
      (p.signals.business_entrepreneur ?? 3) * 7 +
      (p.signals.languages_travel ?? 3) * 6 +
      (p.signals.sport_active ?? 3) * 5 +
      (p.signals.cooking_food ?? 3) * 4 +
      (p.signals.logistics_transport ?? 3) * 6,
  },
];

export const typicalJuniorQuizLength = (): number =>
  CORE_QUESTIONS.length + 8 + CONTEXT_QUESTIONS.length;

const uniqueIds = (ids: number[]): number[] => {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
};

export const pickBranchQuestionIds = (profile: JuniorStudentProfile): number[] => {
  const ranked = [...BRANCH_PACKS].sort((a, b) => b.score(profile) - a.score(profile));
  const ids: number[] = [];
  ids.push(...byPool(ranked[0].pool).map((q) => q.id));
  ids.push(...byPool(ranked[1].pool).map((q) => q.id));
  const third = byPool(ranked[2].pool).slice(0, 2).map((q) => q.id);
  ids.push(...third);
  return uniqueIds(ids).slice(0, 8);
};

export const buildMainSequence = (answers: JuniorAnswers, existing?: number[]): number[] => {
  const coreIds = CORE_QUESTIONS.map((q) => q.id);
  const contextIds = CONTEXT_QUESTIONS.map((q) => q.id);
  if (existing && existing.length > coreIds.length) {
    const preserved = existing.filter((id) => !coreIds.includes(id) && !contextIds.includes(id));
    return uniqueIds([...coreIds, ...preserved, ...contextIds]);
  }
  const profile = calculateQuizProfile(answers);
  const branchIds = pickBranchQuestionIds(profile);
  return uniqueIds([...coreIds, ...branchIds, ...contextIds]);
};

export const expandSequenceIfNeeded = (
  sequence: number[],
  answers: JuniorAnswers,
  index: number,
): number[] => {
  const coreIds = CORE_QUESTIONS.map((q) => q.id);
  if (index < coreIds.length) return sequence.length ? sequence : coreIds;
  if (sequence.length > coreIds.length) return sequence;
  return buildMainSequence(answers);
};

export const selectFollowupQuestions = (
  answers: JuniorAnswers,
  matches: JuniorProgramMatch[],
): JuniorQuestion[] => {
  const unused = (q: JuniorQuestion) => answers[q.id] === undefined;
  const topTypes = new Set(matches.slice(0, 3).map((m) => m.program.type));
  const topNames = matches.slice(0, 3).map((m) => m.program.name);
  const ranked: JuniorQuestion[] = [];

  const gymVsTech = topTypes.has("gimnazija") && topTypes.has("tehnicka");
  const q90 = FOLLOWUP_QUESTIONS.find((q) => q.id === 90);
  if (gymVsTech && q90 && unused(q90)) ranked.push(q90);

  const techish = topNames.some((n) => /računar|elektro|strojar/i.test(n));
  const q91 = FOLLOWUP_QUESTIONS.find((q) => q.id === 91);
  if (techish && q91 && unused(q91)) ranked.push(q91);

  const healthish = topNames.some((n) => /medicin|farmac|fizioter/i.test(n));
  const q92 = FOLLOWUP_QUESTIONS.find((q) => q.id === 92);
  if (healthish && q92 && unused(q92)) ranked.push(q92);

  const creativeish = topNames.some((n) => /dizajn|medij|glazben/i.test(n));
  const q93 = FOLLOWUP_QUESTIONS.find((q) => q.id === 93);
  if (creativeish && q93 && unused(q93)) ranked.push(q93);

  const q94 = FOLLOWUP_QUESTIONS.find((q) => q.id === 94);
  if (q94 && unused(q94)) ranked.push(q94);

  const natureish = topNames.some((n) => /veterin|šumar|poljopriv/i.test(n));
  const q95 = FOLLOWUP_QUESTIONS.find((q) => q.id === 95);
  if (natureish && q95 && unused(q95)) ranked.push(q95);

  const q96 = FOLLOWUP_QUESTIONS.find((q) => q.id === 96);
  if (q96 && unused(q96)) ranked.push(q96);

  for (const q of FOLLOWUP_QUESTIONS) {
    if (unused(q) && !ranked.includes(q)) ranked.push(q);
  }

  const fromUnusedBranch = juniorQuestions.filter(
    (q) =>
      (q.pool === "health" ||
        q.pool === "tech" ||
        q.pool === "creative" ||
        q.pool === "practical" ||
        q.pool === "academic" ||
        q.pool === "peoplebiz") &&
      unused(q),
  );
  return uniqueIds([...ranked, ...fromUnusedBranch].map((q) => q.id))
    .slice(0, 5)
    .map((id) => juniorQuestions.find((q) => q.id === id)!)
    .filter(Boolean);
};
