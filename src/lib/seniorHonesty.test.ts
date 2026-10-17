import { describe, expect, it } from "vitest";
import { scoringFormulas } from "@/data/scoringFormulas";
import { VIDEOS } from "@/data/videos";
import studyProgramsJson from "@/data/career-quiz/study-programs.json";
import { facultyCatalog } from "./facultyCatalog";
import {
  SENIOR_CALCULATOR_PROGRAM_COUNT,
  SENIOR_INSTITUTION_COUNT,
  SENIOR_QUIZ_STUDY_AREA_COUNT,
  SENIOR_VIDEO_COUNT,
} from "./seniorHonesty";

describe("brojke na početnoj odgovaraju podacima", () => {
  it("učilišta", () => expect(SENIOR_INSTITUTION_COUNT).toBe(facultyCatalog.length));
  it("programi u kalkulatoru", () => expect(SENIOR_CALCULATOR_PROGRAM_COUNT).toBe(scoringFormulas.length));
  it("videi", () => expect(SENIOR_VIDEO_COUNT).toBe(VIDEOS.length));
  it("područja u kvizu", () =>
    expect(SENIOR_QUIZ_STUDY_AREA_COUNT).toBe((studyProgramsJson as { programs: unknown[] }).programs.length));
});
