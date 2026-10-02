/**
 * Kalendar kritičnih datuma za upis u srednju školu (Junior roditeljski kutak).
 *
 * Izvor: https://www.upisi.hr i godišnji dokument "Odluka o upisu učenika u I. razred srednje škole"
 * koji ministarstvo objavljuje na travanj–svibanj za sljedeću upisnu generaciju.
 *
 * NAPOMENA: datumi se mijenjaju svake godine. Dok Ministarstvo ne objavi aktualnu Odluku,
 * koristimo opisne okvire (`dateLabel`). Čim bude objavljen točan datum, dopuniti `dateIso`
 * (ISO 8601 u lokalnoj zoni, npr. "2026-06-24") kako bi "sljedeći datum" marker radio.
 *
 * Održavanje: provjeri jednom godišnje u travnju i ažuriraj.
 */

export type JuniorUpisKalendarItem = {
  id: string;
  title: string;
  /** Čovjeku čitljiv datum/okvir, npr. "24.-27. lipnja (okvirno)". Uvijek postoji. */
  dateLabel: string;
  /** Opcionalni točan datum. Ako postoji, koristi se za računanje "sljedećeg". */
  dateIso?: string;
  href?: string;
  note?: string;
};

export const juniorUpisKalendar: JuniorUpisKalendarItem[] = [
  {
    id: "u1",
    title: "Dani otvorenih vrata srednjih škola",
    dateLabel: "ožujak – svibanj (po školi)",
    note: "Svaka škola objavljuje vlastiti termin — pratite stranice škole i profil na MojPutu.",
  },
  {
    id: "u2",
    title: "Objava Odluke o upisu u srednju",
    dateLabel: "travanj – svibanj",
    href: "https://mzo.gov.hr",
    note: "Ministarstvo znanosti i obrazovanja objavljuje točne datume i uvjete.",
  },
  {
    id: "u3",
    title: "Otvaranje NISpuSŠ sustava i prva prijava (ljetni rok)",
    dateLabel: "svibanj – lipanj (okvirno)",
    href: "https://www.upisi.hr",
    note: "Prijava do 10 smjerova po prioritetu.",
  },
  {
    id: "u4",
    title: "Objava rezultata prve prijave",
    dateLabel: "kraj lipnja (okvirno)",
    href: "https://www.upisi.hr",
  },
  {
    id: "u5",
    title: "Druga prijava u ljetnom roku",
    dateLabel: "početak srpnja (okvirno)",
    href: "https://www.upisi.hr",
    note: "Automatska ako prva nije ostvarena; moguće izmjene liste.",
  },
  {
    id: "u6",
    title: "Dopunska (treća) prijava i upisi u školu",
    dateLabel: "sredina srpnja (okvirno)",
    note: "Dopunska lista za slobodna mjesta + fizički upis u školu.",
  },
  {
    id: "u7",
    title: "Jesenski rok",
    dateLabel: "kraj kolovoza (okvirno)",
    href: "https://www.upisi.hr",
    note: "Za učenike koji nisu upisali u ljetnom roku — uža ponuda, ali postoji.",
  },
];

/**
 * Vrati sljedeći nadolazeći datum (po `dateIso`), ili `null` ako nijedan nema ISO datum
 * ili su svi u prošlosti. Koristi se za badge "sljedeće" u hub kartici.
 */
export function nextUpcomingUpisDate(now: Date = new Date()): JuniorUpisKalendarItem | null {
  const future = juniorUpisKalendar
    .filter((item): item is JuniorUpisKalendarItem & { dateIso: string } => !!item.dateIso)
    .map((item) => ({ item, time: new Date(item.dateIso).getTime() }))
    .filter(({ time }) => Number.isFinite(time) && time >= now.getTime())
    .sort((a, b) => a.time - b.time);
  return future[0]?.item ?? null;
}
