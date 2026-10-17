import raw from "./calendarEvents.json";

export type CalendarEventSource = { label: string; url: string };

export type CalendarEvent = {
  year: number;
  /** 0–11, kao u `Date`. */
  month: number;
  day: number;
  title: string;
  type: string;
  urgent: boolean;
  /** Okvirni datum prema prošloj godini dok službeni nije objavljen. */
  estimated?: boolean;
  source?: CalendarEventSource;
};

type RawEvent = {
  date: string;
  title: string;
  type: string;
  urgent: boolean;
  estimated?: boolean;
  source?: string;
};

const sources = raw.sources as Record<string, CalendarEventSource>;

function fromRaw(e: RawEvent): CalendarEvent {
  const [year, month, day] = e.date.split("-").map(Number);
  return {
    year,
    month: month - 1,
    day,
    title: e.title,
    type: e.type,
    urgent: e.urgent,
    ...(e.estimated ? { estimated: true } : {}),
    ...(e.source && sources[e.source] ? { source: sources[e.source] } : {}),
  };
}

export const seniorEvents: CalendarEvent[] = (raw.senior as RawEvent[]).map(fromRaw);

const juniorEventsThisYear: CalendarEvent[] = (raw.junior as RawEvent[]).map(fromRaw);

/** Upisi u srednje: objavljena godina + iduća (okvirno, isti raspored). */
export const juniorEvents: CalendarEvent[] = [
  ...juniorEventsThisYear,
  ...juniorEventsThisYear.map((event) => ({ ...event, year: event.year + 1, estimated: true })),
];

export const schoolCalendarEvents: CalendarEvent[] = (raw.school as RawEvent[]).map(fromRaw);

export function eventDate(event: CalendarEvent): Date {
  return new Date(event.year, event.month, event.day, 23, 59, 59);
}

/** 1. rujna tekuće školske/akademske godine — sve prije toga ide u arhivu. */
export function academicYearStart(from: Date = new Date()): Date {
  const year = from.getMonth() >= 8 ? from.getFullYear() : from.getFullYear() - 1;
  return new Date(year, 8, 1);
}

export function isArchivedEvent(event: CalendarEvent, from: Date = new Date()): boolean {
  return eventDate(event).getTime() < academicYearStart(from).getTime();
}

export function nextUpcomingEvent(
  events: CalendarEvent[],
  from: Date = new Date(),
): CalendarEvent | null {
  return upcomingEvents(events, from, 1)[0] ?? null;
}

export function upcomingEvents(events: CalendarEvent[], from: Date = new Date(), limit = 5): CalendarEvent[] {
  return events
    .filter((e) => eventDate(e).getTime() >= from.getTime())
    .sort((a, b) => eventDate(a).getTime() - eventDate(b).getTime())
    .slice(0, limit);
}

export function formatEventDate(event: CalendarEvent): string {
  return eventDate(event).toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Jedan redak za chatbot / popise: „1. veljače 2027. — Početak prijava… (okvirno)”. */
export function formatEventLine(event: CalendarEvent): string {
  return `${formatEventDate(event)} — ${event.title}${event.estimated ? " (okvirno)" : ""}`;
}
