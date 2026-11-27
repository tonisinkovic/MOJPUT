import type { ReflectionQuiz } from "./types";
import { partEmocije } from "./partEmocije";
import { partKarijera } from "./partKarijera";
import { partKomunikacija } from "./partKomunikacija";
import { partNavike } from "./partNavike";
import { partOsobnost } from "./partOsobnost";
import { partRaspolozenje } from "./partRaspolozenje";
import { partSposobnosti } from "./partSposobnosti";
import { partTim } from "./partTim";
import { partUcenje } from "./partUcenje";
import { partVrijednosti } from "./partVrijednosti";
export { REFLECTION_BAND_LABEL, REFLECTION_SCALE, reflectionScore } from "./types";
export type { ReflectionQuiz } from "./types";

export const REFLECTION_QUIZZES: ReflectionQuiz[] = [
  ...partKomunikacija,
  ...partOsobnost,
  ...partEmocije,
  ...partRaspolozenje,
  ...partUcenje,
  ...partKarijera,
  ...partNavike,
  ...partTim,
  ...partVrijednosti,
  ...partSposobnosti,
];

const byId = new Map(REFLECTION_QUIZZES.map((quiz) => [quiz.id, quiz]));

export function getReflectionQuiz(id: string): ReflectionQuiz | undefined {
  return byId.get(id as ReflectionQuiz["id"]);
}
