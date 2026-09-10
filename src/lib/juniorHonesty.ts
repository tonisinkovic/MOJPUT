/** Sitna, jasna napomena uz prag i kilometre — da prvi ljutiti roditelj ne sruši povjerenje. */

import { highSchools } from "@/data/highSchools";
import { kalkulatorSchools } from "@/data/srednjaKalkulator";
import { JUNIOR_PROGRAM_FAMILY_COUNT, juniorQuestions } from "@/lib/juniorQuizEngine";

export const JUNIOR_MAP_SCHOOL_COUNT = highSchools.length;
export const JUNIOR_CALCULATOR_SCHOOL_COUNT = kalkulatorSchools.length;
export const JUNIOR_QUIZ_QUESTION_COUNT = juniorQuestions.length;

export const JUNIOR_SCHOOL_COUNT_NOTE =
  `Karta = adrese (${JUNIOR_MAP_SCHOOL_COUNT} škola). Kalkulator = lanjski prag (${JUNIOR_CALCULATOR_SCHOOL_COUNT} škola). Nisu isti popisi.`;

export const JUNIOR_SCHOOL_COUNT_NOTE_SHORT =
  `Karta ${JUNIOR_MAP_SCHOOL_COUNT} · kalkulator ${JUNIOR_CALCULATOR_SCHOOL_COUNT} škola.`;

export const JUNIOR_NUMBERS_NOTE =
  "Udaljenost je zračna linija, ne put autobusom. Ovo je prag od prošle godine — iduće može biti drugačije. Pitaj školu.";

export const JUNIOR_NUMBERS_NOTE_SHORT =
  "Zračna linija. Lanjski prag. Pitaj školu.";

export const JUNIOR_CATALOG_NOTE =
  `Kviz i vodič pokrivaju ${JUNIOR_PROGRAM_FAMILY_COUNT} vrsta smjerova (gimnazija, tehnička, umjetnička, obrt). To nije cijeli službeni popis — škole imaju i uske smjerove. Ako točnog nema, gledaj najbliži.`;

export const JUNIOR_CATALOG_NOTE_SHORT =
  `${JUNIOR_PROGRAM_FAMILY_COUNT} vrsta smjerova, ne cijeli službeni popis.`;

export const JUNIOR_MISSING_SCHOOL_NOTE =
  "Ove škole nema u našoj bazi kalkulatora — prag ne izmišljamo. Potvrdi na stranici škole ili potraži sličan program.";

export const JUNIOR_MISSING_CUTOFF_NOTE =
  "Prag za ovaj smjer nije u bazi. Ne pogodujemo broj — pitaj školu.";

export const JUNIOR_MISSING_NEARBY_NOTE =
  "U ovom krugu nema škole s tim programom u našoj bazi. To ne znači da škole nema — možda je pod drugim nazivom, u susjednom gradu ili je nemamo na popisu.";
