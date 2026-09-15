import { describe, expect, it } from "vitest";
import { highSchoolPrograms } from "@/lib/juniorQuizEngine";
import {
  buildProgramGuide,
  findProgramBySlug,
  listProgramGuides,
  programSlug,
} from "@/lib/juniorProgramGuide";

describe("junior program guide", () => {
  it("svaki program ima jedinstven slug", () => {
    const slugs = highSchoolPrograms.map((p) => programSlug(p.name));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("nalazi opću gimnaziju i medicinsku po slugu", () => {
    const general = findProgramBySlug("opca-gimnazija");
    expect(general?.name).toBe("Opća gimnazija");
    const med = findProgramBySlug(programSlug("Medicinska sestra / medicinski tehničar"));
    expect(med?.name).toMatch(/Medicinska/i);
  });

  it("vodič ima što se uči, za koga nije i broj škola", () => {
    const guide = buildProgramGuide(findProgramBySlug("opca-gimnazija")!);
    expect(guide.learnWhat.length).toBeGreaterThanOrEqual(2);
    expect(guide.notFor.length).toBeGreaterThanOrEqual(1);
    expect(guide.program.duration).toBe(4);
    expect(guide.totalSchools).toBeGreaterThan(10);
  });

  it("umjetničke škole označava prijemni", () => {
    const art = listProgramGuides().find((g) => g.program.id === 26);
    expect(art?.extraExam).toBe(true);
    expect(art?.extraExamNote).toMatch(/prijemni|portfolio/i);
  });
});
