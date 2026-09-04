import { describe, expect, it } from "vitest";
import { answerJuniorFromBase } from "@/lib/juniorChat";

describe("junior chatbot baza", () => {
  it("ne izmišlja fakultete", () => {
    const t = answerJuniorFromBase("Usporedi FER i FOI");
    expect(t.toLowerCase()).toMatch(/nije u bazi|senior/);
    expect(t).not.toMatch(/preporučujem FER/i);
  });

  it("za grad vraća škole iz baze", () => {
    const t = answerJuniorFromBase("Srednje škole u Bjelovaru");
    expect(t).toMatch(/Bjelovar/i);
    expect(t).toMatch(/Gimnazija Bjelovar|škole/i);
  });

  it("za nepoznato kaže da ne zna", () => {
    const t = answerJuniorFromBase("Napiši mi pjesmu o zmajevima");
    expect(t).toMatch(/nemam u svojoj bazi/i);
  });

  it("za rokove koristi kalendar", () => {
    const t = answerJuniorFromBase("Kad su upisni rokovi?");
    expect(t).toMatch(/rok/i);
  });

  it("za program vodi na stranicu programa", () => {
    const t = answerJuniorFromBase("Što je opća gimnazija?");
    expect(t).toMatch(/gimnazija/i);
    expect(t).toMatch(/\/programi\/opca-gimnazija/);
  });
});
