export type CalendarEvent = {
  year: number;
  month: number;
  day: number;
  title: string;
  type: string;
  urgent: boolean;
};

export const seniorEvents: CalendarEvent[] = [
  { year: 2025, month: 11, day: 1, title: "Početak prijava ispita mature", type: "Rok", urgent: true },
  { year: 2026, month: 1, day: 1, title: "Početak prijava studija", type: "Upisi", urgent: true },
  { year: 2026, month: 1, day: 15, title: "Kraj prijava ispita mature", type: "Rok", urgent: true },
  { year: 2026, month: 3, day: 27, title: "Orijentacijske rang-liste upisa na studije", type: "Upisi", urgent: false },
  { year: 2026, month: 4, day: 22, title: "Kraj nastave za maturante i norijada", type: "Rok", urgent: false },
  { year: 2026, month: 5, day: 3, title: "Biologija (9h) • Geografija (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 9, title: "Njemački jezik (9h) • Filozofija (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 10, title: "Talijanski jezik (9h) • Likovna umjetnost (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 15, title: "Hrvatski jezik – test + sažetak (9h)", type: "Ispit", urgent: true },
  { year: 2026, month: 5, day: 16, title: "Hrvatski jezik – esej (9h)", type: "Ispit", urgent: true },
  { year: 2026, month: 5, day: 17, title: "Politika i gospodarstvo (9h) • Povijest (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 18, title: "Fizika (9h) • Logika (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 19, title: "Engleski jezik – viša razina (9h)", type: "Ispit", urgent: true },
  { year: 2026, month: 5, day: 23, title: "Psihologija (9h) • Informatika (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 24, title: "Kemija (9h) • Sociologija (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 25, title: "Matematika – viša i osnovna (9h)", type: "Ispit", urgent: true },
  { year: 2026, month: 5, day: 26, title: "Glazbena umjetnost (9h) • Etika (14h) • Vjeronauk (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 6, day: 1, title: "Kraj registracija u sustavu Postani student (stariji kandidati)", type: "Upisi", urgent: false },
  { year: 2026, month: 6, day: 8, title: "Privremeni rezultati mature • privremene rang-liste upisa na studije", type: "Rezultati", urgent: false },
  { year: 2026, month: 6, day: 10, title: "Rok za prigovore na rezultate mature", type: "Rok", urgent: true },
  {
    year: 2026,
    month: 6,
    day: 15,
    title:
      "Konačni rezultati mature • rok za prijavu i odjavu studija (do 13:59) • konačne liste upisa na studije (iza 15h)",
    type: "Rezultati",
    urgent: true,
  },
];

export const juniorEvents: CalendarEvent[] = [
  { year: 2026, month: 5, day: 6, title: "Počinju prijave u sustav", type: "Upisi", urgent: true },
  { year: 2026, month: 5, day: 24, title: "Prijava obrazovnih programa (24. 6. – 3. 7.)", type: "Upisi", urgent: true },
  { year: 2026, month: 5, day: 24, title: "Programi koji imaju dodatne provjere (24. 6. – 26. 6.)", type: "Upisi", urgent: false },
  { year: 2026, month: 5, day: 24, title: "Dostava dokumentacije za dodatna prava / HZZ (24. 6. – 1. 7.)", type: "Rok", urgent: false },
  { year: 2026, month: 5, day: 29, title: "Dodatni ispiti i provjere (29. 6. – 2. 7.)", type: "Ispit", urgent: false },
  { year: 2026, month: 6, day: 2, title: "Brisanje kandidata koji nisu zadovoljili preduvjete", type: "Rok", urgent: true },
  { year: 2026, month: 6, day: 3, title: "Rok za prigovore", type: "Rok", urgent: true },
  { year: 2026, month: 6, day: 7, title: "Objava konačnih ljestvica", type: "Rezultati", urgent: true },
  { year: 2026, month: 6, day: 7, title: "Dostava upisnice i potrebnih liječničkih dokumenata (7. – 9. 7.)", type: "Upisi", urgent: true },
  { year: 2026, month: 7, day: 10, title: "Objava slobodnih mjesta za jesenski rok", type: "Rezultati", urgent: false },
  { year: 2026, month: 7, day: 24, title: "Prijava obrazovnih programa (24. – 28. 8.)", type: "Upisi", urgent: true },
  { year: 2026, month: 7, day: 24, title: "Programi s dodatnim provjerama (24. – 26. 8.)", type: "Upisi", urgent: false },
  { year: 2026, month: 7, day: 24, title: "Dostava dokumentacije (24. – 27. 8.)", type: "Rok", urgent: false },
  { year: 2026, month: 7, day: 27, title: "Dodatne provjere", type: "Ispit", urgent: false },
  { year: 2026, month: 7, day: 28, title: "Brisanje kandidata koji ne zadovoljavaju preduvjete", type: "Rok", urgent: true },
  { year: 2026, month: 7, day: 28, title: "Prigovori", type: "Rok", urgent: true },
  { year: 2026, month: 7, day: 31, title: "Objava konačnih ljestvica", type: "Rezultati", urgent: true },
  { year: 2026, month: 7, day: 31, title: "Dostava upisnica i potrebne dokumentacije (31. 8. – 2. 9.)", type: "Upisi", urgent: true },
  { year: 2026, month: 8, day: 3, title: "Objava slobodnih mjesta nakon jesenskog roka", type: "Rezultati", urgent: false },
  { year: 2026, month: 8, day: 3, title: "Naknadni upisni rok (3. – 30. 9., samo gdje ostane slobodnih mjesta)", type: "Upisi", urgent: true },
  { year: 2026, month: 8, day: 30, title: "Naknadni upisni rok – završetak", type: "Upisi", urgent: true },
];

export function eventDate(event: CalendarEvent): Date {
  return new Date(event.year, event.month, event.day, 23, 59, 59);
}

export function nextUpcomingEvent(
  events: CalendarEvent[],
  from: Date = new Date(),
): CalendarEvent | null {
  const upcoming = events
    .filter((e) => eventDate(e).getTime() >= from.getTime())
    .sort((a, b) => eventDate(a).getTime() - eventDate(b).getTime());
  return upcoming[0] ?? null;
}

export function formatEventDate(event: CalendarEvent): string {
  return eventDate(event).toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
