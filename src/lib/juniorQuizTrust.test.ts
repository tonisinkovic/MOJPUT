import { describe, expect, it } from "vitest";
import { analyzeJuniorQuiz } from "./juniorQuizEngine";

const top = (answers: Record<number, string | number | string[]>) =>
  analyzeJuniorQuiz(answers).recommendations.slice(0, 3).map((r) => r.program.name).join(" | ");

describe("vjerodostojni susjedi", () => {
  it("knjige ne otvaraju hotel, pravo ide na opću", () => {
    const names = top({ 3: 5, 7: ["books"], 12: "text", 60: "society", 61: 5, 70: "faculty", 76: "pravo" });
    expect(names).not.toMatch(/hotel/i);
    expect(names).toMatch(/opća|jezičn|klasičn/i);
  });

  it("psihologija ostaje na gimnaziji", () => {
    const names = top({ 2: ["help"], 8: 4, 10: "explain", 60: "society", 70: "faculty", 76: "psihologija" });
    expect(names).toMatch(/opća/i);
    expect(names).not.toMatch(/sestra|hotel|prodavač/i);
  });

  it("računala uz mržnju matematike ne daju matematičku gimnaziju", () => {
    const names = top({ 2: ["app"], 6: "avoid_math", 30: "code", 32: "prefer_less", 70: "both", 75: ["matematika"] });
    expect(names).toMatch(/računar/i);
    expect(names).not.toMatch(/prirodoslovno-matematička/i);
  });

  it("ured ne otvara matematičku gimnaziju", () => {
    const names = top({ 5: "plan", 15: "security", 34: "office", 35: "office", 70: "work", 76: "ured" });
    expect(names).toMatch(/upravni/i);
    expect(names).not.toMatch(/prirodoslovno-matematička/i);
  });

  it("pekar ne vuče kuhara, more ne vuče jezičnu, ples ne vuče medije", () => {
    expect(top({ 11: 5, 16: "make", 50: "bake", 70: "work" })).not.toMatch(/kuhar/i);
    expect(top({ 14: 5, 34: "sea", 50: "sea", 70: "both", 76: "pomorstvo" })).not.toMatch(/jezičn/i);
    expect(top({ 2: ["music", "sport"], 40: "dance", 70: "both", 97: "dance" })).not.toMatch(/medijski/i);
  });
});
