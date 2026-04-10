/**
 * Dokumenti u sekciji Matura.
 * Za novu datoteku: stavi PDF u `public/mature/` (npr. `moj-dokument.pdf`) i dodaj stavku u `MATURE_DOCUMENTS`.
 */
export type MatureDocument = {
  id: string;
  title: string;
  description: string;
  /** Ime datoteke u mapi `public/mature/` */
  fileName: string;
  /** Grupa za filtriranje (npr. Matematika, Hrvatski jezik) */
  category: string;
  /** Kratka oznaka sesije / oznake ispita (opcionalno) */
  sessionLabel?: string;
};

export const MATURE_DOCUMENTS: MatureDocument[] = [
  {
    id: "mat-a-d-s072",
    title: "Matematika — razina A",
    description: "Dokument D-S072 — materijal za pripremu / ispit iz matematike na višoj razini.",
    fileName: "mat-a-d-s072.pdf",
    category: "Matematika",
    sessionLabel: "D-S072",
  },
  {
    id: "mat-b-d-s072",
    title: "Matematika — razina B",
    description: "Dokument D-S072 — materijal za pripremu / ispit iz matematike na osnovnoj razini.",
    fileName: "mat-b-d-s072.pdf",
    category: "Matematika",
    sessionLabel: "D-S072",
  },
];
