import { describe, expect, it } from "vitest";
import { highSchoolPrograms } from "@/lib/juniorQuizEngine";
import {
  chanceFor,
  computeSrednjaPoints,
  emptyGradeDraft,
  findCutoff,
  findKalkulatorSchool,
  findMapSchoolId,
  gradeDraftIsUsable,
  nextJuniorDeadline,
  shortlistItemKey,
} from "@/lib/juniorPath";

describe("juniorPath matching", () => {
  it("nalazi Gimnaziju Bjelovar i prag za opću gimnaziju", () => {
    const school = findKalkulatorSchool("Gimnazija Bjelovar", "Bjelovar");
    expect(school?.name).toMatch(/Gimnazija Bjelovar/i);

    const program = highSchoolPrograms.find((p) => p.name === "Opća gimnazija");
    expect(program).toBeTruthy();
    const cutoff = findCutoff("Gimnazija Bjelovar", "Bjelovar", program!);
    expect(cutoff?.min).toEqual(expect.any(Number));
    expect(cutoff?.programName.toLowerCase()).toContain("opća");
  });

  it("povezuje školu s kartom po imenu i gradu", () => {
    const id = findMapSchoolId("Gimnazija Bjelovar", "Bjelovar");
    expect(id).toMatch(/^ss-/);
  });

  it("shortlist ključ je stabilan bez obzira na veličina slova", () => {
    expect(shortlistItemKey("Gimnazija Bjelovar", "Bjelovar", 1)).toBe(
      shortlistItemKey("gimnazija bjelovar", "bjelovar", 1),
    );
  });
});

describe("juniorPath bodovi i šansa", () => {
  it("računa bodove kao kalkulator (4×prosjek + ključni + posebni)", () => {
    const draft = emptyGradeDraft();
    draft.program = "gimnazija4";
    draft.prosjek5 = "5";
    draft.prosjek6 = "5";
    draft.razred7 = { ...draft.razred7, prosjek: "5", matematika: "5", hrvatski: "5", strani: "5", predmet1: "5", predmet2: "5", predmet3: "5" };
    draft.razred8 = { ...draft.razred8, prosjek: "5", matematika: "5", hrvatski: "5", strani: "5", predmet1: "5", predmet2: "5", predmet3: "5" };
    const r = computeSrednjaPoints(draft);
    expect(r.ukupno).toBe(80);
    expect(r.max).toBe(80);
  });

  it("draft je upotrebljiv tek s dva prosjeka", () => {
    const empty = emptyGradeDraft();
    expect(gradeDraftIsUsable(empty)).toBe(false);
    empty.prosjek5 = "4.2";
    empty.prosjek6 = "4.5";
    expect(gradeDraftIsUsable(empty)).toBe(true);
  });

  it("šansa prati razmak od praga", () => {
    expect(chanceFor(70, 60).tone).toBe("emerald");
    expect(chanceFor(61, 60).tone).toBe("lime");
    expect(chanceFor(58, 60).tone).toBe("amber");
    expect(chanceFor(50, 60).tone).toBe("rose");
  });
});

describe("juniorPath kalendar", () => {
  it("sljedeći rok nakon 4. 9. 2026. je završetak naknadnog roka", () => {
    const next = nextJuniorDeadline(new Date(2026, 8, 4, 8, 0, 0));
    expect(next?.title).toMatch(/završetak/i);
    expect(next?.day).toBe(30);
  });
});
