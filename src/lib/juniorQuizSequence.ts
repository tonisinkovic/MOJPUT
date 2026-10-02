/**
 * Adaptive question order for the junior orientation quiz (v2).
 * First ~16 questions are a wide core; the rest branch by emerging interests.
 */

import {
  analyzeJuniorQuiz,
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

/** Najviše četiri bliska dana, plus izlaz. Ne baca svih osam odjednom. */
export const peopleDayOptionIds = (profile: JuniorStudentProfile): string[] => {
  const ids: string[] = [];
  const push = (id: string) => {
    if (!ids.includes(id)) ids.push(id);
  };
  const health = (profile.signals.health_medicine ?? 0) >= 4;
  const animals = (profile.signals.animals_nature ?? 0) >= 4;
  const lab = (profile.signals.science_experiments ?? 0) >= 4 && (profile.peopleFocus === "lab" || health);
  const guests = (profile.signals.languages_travel ?? 0) >= 4;
  const dance = (profile.signals.music_performance ?? 0) >= 4;
  const sport = (profile.signals.sport_active ?? 0) >= 4 && !dance;
  if (health) {
    push("care");
    push("doctor");
  }
  if (lab) push("lab");
  if (animals) push("animals");
  if (guests) push("guests");
  if (dance) push("dance");
  if (sport) push("sport");
  if (profile.interests.people >= 58 && ids.length < 3) push("class");
  return [...ids.slice(0, 4), "none"];
};

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
  const mathAnswer = answers[6];
  const handsScale = answers[11];
  const learnStyle = answers[16];
  const mathClear = mathAnswer === "interest_math" || mathAnswer === "avoid_math";
  const handsClear =
    typeof handsScale === "number" &&
    ((handsScale >= 5 && learnStyle === "make") || (handsScale <= 2 && learnStyle !== "make" && learnStyle !== undefined));
  const contextIds = CONTEXT_QUESTIONS.map((q) => q.id).filter((id) => !(id === 71 && handsClear));
  if (existing && existing.length > coreIds.length) {
    const preserved = existing.filter((id) => !coreIds.includes(id) && !contextIds.includes(id));
    return uniqueIds([...coreIds, ...preserved, ...contextIds]);
  }
  const profile = calculateQuizProfile(answers);
  const branchIds = pickBranchQuestionIds(profile).filter((id) => !(id === 32 && mathClear));
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

/** Posao u ovom bloku je plan ili gosti. Sport i kuhinja imaju svoja pitanja. */
export const jobOptionIds = (_answers: JuniorAnswers): string[] => ["plan", "serve"];

const CHECK_IDS = [98, 99] as const;

const shortProgramName = (name: string): string => name.split("/")[0].replace(/\s*\(.*\)\s*/, "").trim();

const sameFamily = (left: string, right: string): boolean => {
  const families = [
    /bravar|limar|strojar|električar|stolar|automehatron|građevinsk/i,
    /sestra|fizioter/i,
    /farmac|kemijski/i,
    /kuhar|pekar|krojač|prehramben/i,
    /hotel|konobar|turisti/i,
    /šumar|poljopriv|cvjeć|veterin/i,
    /dizajn|likov|medij|glazben|plesa/i,
    /računar|elektroteh/i,
  ];
  return families.some((pattern) => pattern.test(left) && pattern.test(right));
};

const explicitFork = (left: string, right: string): boolean => {
  const forks: Array<[RegExp, RegExp]> = [
    [/sestra|fizioter/i, /farmac|kemijski/i],
    [/kuhar|pekar/i, /krojač/i],
    [/bravar|limar|stolar|automehatron/i, /strojar|električar|građevinsk/i],
    [/hotel|turisti/i, /konobar/i],
  ];
  return forks.some(
    ([one, other]) => (one.test(left) && other.test(right)) || (other.test(left) && one.test(right)),
  );
};

const answeredChecks = (answers: JuniorAnswers): Array<{ keep: number; drop: number }> => {
  const found: Array<{ keep: number; drop: number }> = [];
  for (const id of CHECK_IDS) {
    const raw = answers[id];
    if (typeof raw !== "string") continue;
    const kept = /^keep-(\d+)-drop-(\d+)$/.exec(raw);
    if (kept) {
      found.push({ keep: Number(kept[1]), drop: Number(kept[2]) });
      continue;
    }
    const skipped = /^skip-(\d+)-(\d+)$/.exec(raw);
    if (skipped) found.push({ keep: Number(skipped[1]), drop: Number(skipped[2]) });
  }
  return found;
};

const pairAlreadyAsked = (answers: JuniorAnswers, leftId: number, rightId: number): boolean =>
  answeredChecks(answers).some(
    (check) =>
      (check.keep === leftId && check.drop === rightId) || (check.keep === rightId && check.drop === leftId),
  );

const strongestSignalMet = (match: JuniorProgramMatch, profile: JuniorStudentProfile): boolean => {
  const boosts = Object.entries(match.program.boostSignals).filter(([, weight]) => (weight ?? 0) > 0);
  if (!boosts.length) return match.program.type === "gimnazija";
  const [key] = boosts.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0];
  return (profile.signals[key as JuniorSignalKey] ?? 0) >= 4;
};

const pairNeedsCheck = (
  left: JuniorProgramMatch,
  right: JuniorProgramMatch,
  answers: JuniorAnswers,
  profile: JuniorStudentProfile,
): boolean => {
  if (pairAlreadyAsked(answers, left.program.id, right.program.id)) return false;
  const gap = Math.abs((left.rankScore ?? 0) - (right.rankScore ?? 0));
  const close = Number.isFinite(left.rankScore) && Number.isFinite(right.rankScore) && gap <= 6;
  const lookalike =
    (left.program.type === "gimnazija" && right.program.type === "gimnazija") ||
    sameFamily(left.program.name, right.program.name) ||
    explicitFork(left.program.name, right.program.name);
  const leader = (left.rankScore ?? 0) >= (right.rankScore ?? 0) ? left : right;
  const trailer = leader === left ? right : left;
  return close || lookalike || !strongestSignalMet(trailer, profile);
};

const cardCheckQuestion = (id: number, left: JuniorProgramMatch, right: JuniorProgramMatch): JuniorQuestion => ({
  id,
  format: "choice",
  pool: "followup",
  section: "context",
  skippable: true,
  prompt: `Što ti je bliže: ${shortProgramName(left.program.name)} ili ${shortProgramName(right.program.name)}?`,
  hint: `${left.program.goodFor[0] ?? ""}. ${right.program.goodFor[0] ?? ""}`.trim(),
  options: [
    { id: `keep-${left.program.id}-drop-${right.program.id}`, label: left.program.name },
    { id: `keep-${right.program.id}-drop-${left.program.id}`, label: right.program.name },
  ],
});

const ideaConfirmQuestion = (answers: JuniorAnswers): JuniorQuestion | null => {
  if (answers[89] !== undefined) return null;
  const written = answers[76];
  if (typeof written !== "string" || written.trim().length < 4 || written === "skip") return null;
  const preview = analyzeJuniorQuiz(answers);
  const note = preview.consideringNote ?? "";
  const named = /Zato je (.+) prvi prijedlog/.exec(note)?.[1];
  if (!named || !preview.profile.considering) return null;
  return {
    id: 89,
    format: "choice",
    pool: "followup",
    section: "context",
    prompt: `Napisao/la si „${preview.profile.considering}”. Je li ti blizu: ${named}?`,
    options: [
      { id: "yes", label: "Da, to mi je blizu" },
      { id: "no", label: "Ne, bila je samo ideja" },
    ],
  };
};

const clarifyingQuestions = (profile: JuniorStudentProfile, answers: JuniorAnswers): JuniorQuestion[] => {
  const out: JuniorQuestion[] = [];
  const add = (id: number) => {
    if (answers[id] !== undefined) return;
    const question = juniorQuestions.find((item) => item.id === id);
    if (question) out.push(question);
  };
  const tech = profile.signals.tech_computers ?? 0;
  const health = profile.signals.health_medicine ?? 0;
  const art = profile.signals.art_visual ?? 0;
  const music = profile.signals.music_performance ?? 0;
  const plants = profile.signals.plants_outdoor ?? 0;
  const animals = profile.signals.animals_nature ?? 0;
  if (tech >= 4 && !profile.techChoice) add(91);
  if (health >= 4 && !profile.peopleFocus) add(92);
  if (art >= 4 && music >= 4) add(93);
  if (plants >= 4 && animals >= 4) add(95);
  if (profile.postSchool.faculty >= 55 && profile.postSchool.work >= 55 && answers[70] === undefined) add(94);
  if ((health >= 4 || tech >= 4) && answers[96] === undefined) add(96);
  return out.slice(0, 2);
};

/** Najviše dva pitanja. Bliski par s kartice, provjera iz kataloga, ili potvrda napisane ideje. */
export const selectFollowupQuestions = (
  answers: JuniorAnswers,
  matches: JuniorProgramMatch[],
): JuniorQuestion[] => {
  const cards = matches.slice(0, 3).filter((card) => card?.program);
  const profile = calculateQuizProfile(answers);
  const pairs: Array<[JuniorProgramMatch, JuniorProgramMatch]> = [];
  const consider = (left?: JuniorProgramMatch, right?: JuniorProgramMatch) => {
    if (!left || !right || pairs.length >= 2) return;
    if (pairs.some(([a, b]) => a.program.id === left.program.id && b.program.id === right.program.id)) return;
    if (!pairNeedsCheck(left, right, answers, profile)) return;
    pairs.push([left, right]);
  };
  if (cards.length >= 2) {
    consider(cards[0], cards[1]);
    consider(cards[1], cards[2]);
    consider(cards[0], cards[2]);
  }
  const freeIds = CHECK_IDS.filter((id) => answers[id] === undefined);
  const cardQuestions = pairs.slice(0, freeIds.length).map((pair, index) => cardCheckQuestion(freeIds[index], pair[0], pair[1]));
  const idea = ideaConfirmQuestion(answers);
  const familyPair = pairs.some(
    ([left, right]) => sameFamily(left.program.name, right.program.name) || explicitFork(left.program.name, right.program.name),
  );
  const clarify = familyPair ? [] : clarifyingQuestions(profile, answers);
  return [...(idea ? [idea] : []), ...clarify, ...cardQuestions].slice(0, 2);
};
