/**
 * Adaptive question order for the junior orientation quiz (v2).
 * First ~16 questions are a wide core; the rest branch by emerging interests.
 */

import {
  calculateQuizProfile,
  juniorQuestions,
  type JuniorAnswers,
  type JuniorProgramMatch,
  type JuniorQuestion,
  type JuniorSignalKey,
  type JuniorStudentProfile,
} from "@/lib/juniorQuizEngine";

const byPool = (pool: JuniorQuestion["pool"]) =>
  juniorQuestions.filter((q) => q.pool === pool).sort((a, b) => a.id - b.id);

export const CORE_QUESTIONS = byPool("core");
export const CONTEXT_QUESTIONS = byPool("context");
export const FOLLOWUP_QUESTIONS = byPool("followup");

/** Likert 1–5 → 0–100. Nedostajući signal se ne ubraja (nije „tako-tako”). */
const answeredSignal = (profile: JuniorStudentProfile, key: JuniorSignalKey): number | null => {
  const value = profile.signals[key];
  if (typeof value !== "number") return null;
  return ((value - 1) / 4) * 100;
};

const meanKnown = (parts: Array<number | null>): number => {
  const known = parts.filter((part): part is number => part !== null);
  if (!known.length) return 0;
  return known.reduce((sum, part) => sum + part, 0) / known.length;
};

export const BRANCH_PACKS: { id: string; pool: JuniorQuestion["pool"]; score: (p: JuniorStudentProfile) => number }[] = [
  {
    id: "health",
    pool: "health",
    score: (p) =>
      meanKnown([
        p.interests.people,
        p.interests.science,
        p.environment.health,
        answeredSignal(p, "health_medicine"),
        answeredSignal(p, "helping_people"),
      ]),
  },
  {
    id: "tech",
    pool: "tech",
    score: (p) =>
      meanKnown([
        p.interests.technology,
        p.thinking.technical,
        p.environment.computer,
        answeredSignal(p, "tech_computers"),
      ]),
  },
  {
    id: "creative",
    pool: "creative",
    score: (p) =>
      meanKnown([
        p.interests.art_design,
        p.interests.media,
        p.thinking.creative,
        answeredSignal(p, "art_visual"),
        answeredSignal(p, "music_performance"),
      ]),
  },
  {
    id: "practical",
    pool: "practical",
    score: (p) =>
      meanKnown([
        p.interests.practical,
        p.thinking.practical,
        p.theoryPractice,
        answeredSignal(p, "hands_on_craft"),
        answeredSignal(p, "cooking_food"),
      ]),
  },
  {
    id: "academic",
    pool: "academic",
    score: (p) =>
      meanKnown([
        p.learning.theory,
        p.thinking.investigative,
        p.interests.languages,
        p.interests.society,
        p.postSchool.faculty,
      ]),
  },
  {
    id: "peoplebiz",
    pool: "peoplebiz",
    score: (p) =>
      meanKnown([
        p.interests.economy,
        p.interests.people,
        p.thinking.organizational,
        answeredSignal(p, "business_entrepreneur"),
        answeredSignal(p, "languages_travel"),
        answeredSignal(p, "sport_active"),
        answeredSignal(p, "cooking_food"),
        answeredSignal(p, "logistics_transport"),
      ]),
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
  const [first, second, third] = ranked;
  const s1 = first.score(profile);
  const s2 = second.score(profile);
  const s3 = third.score(profile);
  const gap = 6;
  const take = (pack: (typeof BRANCH_PACKS)[number], count: number) => byPool(pack.pool).slice(0, count).map((q) => q.id);
  const ids: number[] = [];
  if (s1 - s3 <= gap) {
    ids.push(...take(first, 3), ...take(second, 3), ...take(third, 2));
  } else if (s1 - s2 <= gap) {
    ids.push(...take(first, 4), ...take(second, 4));
  } else {
    ids.push(...take(first, 4), ...take(second, 3));
    const probe = byPool(third.pool)[0];
    if (probe) ids.push(probe.id);
  }
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
  const peopleFork =
    profile.interests.people >= 58 ||
    (profile.signals.helping_people ?? 0) >= 4 ||
    (profile.signals.health_medicine ?? 0) >= 4 ||
    (profile.signals.languages_travel ?? 0) >= 4
      ? [97]
      : [];
  return uniqueIds([...coreIds, ...branchIds, ...peopleFork, ...contextIds]);
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

  const creativeish = topNames.some((n) => /dizajn|medij|glazben|plesa/i.test(n));
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
