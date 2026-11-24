import { describe, expect, it } from "vitest";
import {
  ADVENT_QUESTIONS_PER_DAY,
  type AdventAnsweredQuestion,
} from "@/lib/adventLeagueApi";
import {
  allQuestionsAnswered,
  firstUnansweredIndex,
  mergeAnsweredFromServer,
  questionByIndex,
} from "@/lib/adventQuizEngine";

describe("adventQuizEngine", () => {
  it("firstUnansweredIndex skips answered", () => {
    const map = mergeAnsweredFromServer([
      { questionIndex: 0, selectedAnswer: "a", correct: true, score: 100, durationMs: 1000 },
      { questionIndex: 1, selectedAnswer: "b", correct: false, score: 0, durationMs: 1000 },
    ] satisfies AdventAnsweredQuestion[]);
    expect(firstUnansweredIndex(map)).toBe(2);
    expect(allQuestionsAnswered(map)).toBe(false);
  });

  it("allQuestionsAnswered when 10 answered", () => {
    const rows: AdventAnsweredQuestion[] = Array.from({ length: ADVENT_QUESTIONS_PER_DAY }, (_, i) => ({
      questionIndex: i,
      selectedAnswer: "a",
      correct: true,
      score: 100,
      durationMs: 1000,
    }));
    const map = mergeAnsweredFromServer(rows);
    expect(allQuestionsAnswered(map)).toBe(true);
    expect(firstUnansweredIndex(map)).toBe(ADVENT_QUESTIONS_PER_DAY);
  });

  it("questionByIndex finds by index field", () => {
    const q = questionByIndex(
      [
        { index: 0, questionText: "A", options: [] },
        { index: 2, questionText: "C", options: [] },
      ],
      2,
    );
    expect(q?.questionText).toBe("C");
  });
});