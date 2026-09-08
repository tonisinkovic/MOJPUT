/** Sitna, jasna napomena uz prag i kilometre — da prvi ljutiti roditelj ne sruši povjerenje. */

import { highSchools } from "@/data/highSchools";
import { kalkulatorSchools } from "@/data/srednjaKalkulator";
import { JUNIOR_PROGRAM_FAMILY_COUNT, juniorQuestions } from "@/lib/juniorQuizEngine";

export const JUNIOR_MAP_SCHOOL_COUNT = highSchools.length;
export const JUNIOR_CALCULATOR_SCHOOL_COUNT = kalkulatorSchools.length;
export const JUNIOR_QUIZ_QUESTION_COUNT = juniorQuestions.length;

export const JUNIOR_SCHOOL_COUNT_NOTE =
  `Na karti je ${JUNIOR_MAP_SCHOOL_COUNT} škola (adrese). U kalkulatoru ${JUNIOR_CALCULATOR_SCHOOL_COUNT} škola s lanjskim pragom gdje ga imamo. Nisu isti popisi — ne izjednačujemo ih.`;

export const JUNIOR_SCHOOL_COUNT_NOTE_SHORT =
  `Karta ${JUNIOR_MAP_SCHOOL_COUNT} · kalkulator ${JUNIOR_CALCULATOR_SCHOOL_COUNT} škola.`;

export const JUNIOR_NUMBERS_NOTE =
  "Udaljenost je zračna linija, ne put autobusom. Prag je lanjski minimum — sljedeće godine može biti drugačiji. Prije odluke potvrdi na školi.";

export const JUNIOR_NUMBERS_NOTE_SHORT =
  "Zračna linija i lanjski min. Potvrdi na školi.";

export const JUNIOR_CATALOG_NOTE =
  `Kviz i vodič pokrivaju ${JUNIOR_PROGRAM_FAMILY_COUNT} obitelji programa (gimnazija, tehnička, umjetnička, obrt). To nije cijeli službeni katalog — škole imaju i uske smjerove. Ako točnog programa nema, gledaj najbližu obitelj.`;

export const JUNIOR_CATALOG_NOTE_SHORT =
  `${JUNIOR_PROGRAM_FAMILY_COUNT} obitelji programa, ne cijeli katalog smjerova.`;

export const JUNIOR_MISSING_SCHOOL_NOTE =
  "Ove škole nema u našoj bazi kalkulatora — prag ne izmišljamo. Potvrdi na stranici škole ili potraži sličan program.";

export const JUNIOR_MISSING_CUTOFF_NOTE =
  "Prag za ovaj smjer nije u bazi. Ne pogodujemo broj — pitaj školu.";

export const JUNIOR_MISSING_NEARBY_NOTE =
  "U ovom krugu nema škole s tim programom u našoj bazi. To ne znači da škole nema — možda je pod drugim nazivom, u susjednom gradu ili je nemamo na popisu.";
