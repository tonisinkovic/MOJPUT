import { describe, expect, it } from "vitest";
import {
  citiesFromFacultyLabel,
  locateStudyPrograms,
  locationSummary,
} from "./seniorQuizGeo";
import type { StudyProgramMatch } from "./studyProgramEngine";

const fakeMatch = (name: string, faculties: string[]): StudyProgramMatch => ({
  program: {
    id: 1,
    name,
    area: "stem",
    faculties,
    description: "",
    interestWeights: { investigative: 2 },
    competencyWeights: { technical: 2 },
  },
  matchPercentage: 80,
  strength: "jaka",
  interestFit: 80,
  readinessFit: 70,
  signalBoost: 0,
  reasons: ["test"],
  warnings: [],
});

describe("seniorQuizGeo", () => {
  it("izvlači grad iz oznake fakulteta", () => {
    expect(citiesFromFacultyLabel("FER (Zagreb)")).toEqual(["Zagreb"]);
    expect(citiesFromFacultyLabel("Veleučilišta (Dubrovnik, Šibenik)")).toEqual([
      "Dubrovnik",
      "Šibenik",
    ]);
  });

  it("ostanak u Zagrebu stavlja FER ispred FESB-a", () => {
    const located = locateStudyPrograms(
      [
        fakeMatch("Računarstvo Split", ["FESB (Split)"]),
        fakeMatch("Računarstvo Zagreb", ["FER (Zagreb)"]),
      ],
      { homeCity: "Zagreb", plan: "stay", targetCity: null },
    );
    expect(located[0].program.name).toBe("Računarstvo Zagreb");
    expect(located[0].availableLocally).toBe(true);
    expect(located[1].availableLocally).toBe(false);
  });

  it("odlazak u Split ostavlja samo split fakultete kao lokalne", () => {
    const located = locateStudyPrograms([fakeMatch("IT", ["FER (Zagreb)", "FESB (Split)"])], {
      homeCity: "Bjelovar",
      plan: "move",
      targetCity: "Split",
    });
    expect(located[0].localFaculties.some((f) => f.city === "Split")).toBe(true);
    expect(located[0].localFaculties.some((f) => f.city === "Zagreb")).toBe(false);
  });

  it("sažetak za svejedno spominje rodni grad", () => {
    expect(
      locationSummary({ homeCity: "Osijek", plan: "anywhere", targetCity: null }),
    ).toContain("Osijek");
  });
});
