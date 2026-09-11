import { hasExtraExam } from "@/lib/juniorProgramGuide";
import type { HighSchoolProgram } from "@/lib/juniorQuizEngine";

export const hasProgramMatura = (program: HighSchoolProgram): boolean => program.duration === 4;

export const entryBarLabel = (program: HighSchoolProgram): string => {
  if (program.entryBar === "visok") return "Upis često traži više bodova";
  if (program.entryBar === "nizi") return "Upisni prag često nije visok";
  return "Upisni prag je srednji";
};

export type ProgramFactChip = { id: string; label: string };

export const programFactChips = (program: HighSchoolProgram): ProgramFactChip[] => {
  const chips: ProgramFactChip[] = [{ id: "years", label: `${program.duration} godine` }];
  if (hasProgramMatura(program)) chips.push({ id: "matura", label: "Ima maturu" });
  else chips.push({ id: "no-matura", label: "Nema mature" });
  if (hasExtraExam(program)) chips.push({ id: "exam", label: "Treba prijemni ili mapa" });
  chips.push({ id: "bar", label: entryBarLabel(program) });
  return chips;
};
