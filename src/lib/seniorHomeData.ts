import { seniorEvents, upcomingEvents, type CalendarEvent } from "@/data/calendarEvents";
import { getFacultyCityCenter, listFacultyCities } from "@/data/facultyLocations";
import type { Faculty } from "@/types/faculty";

/** Okvir Hrvatske (lng/lat) za jednostavnu projekciju točaka na kartu. */
export const HR_BOUNDS = { minLng: 13.2, maxLng: 19.6, minLat: 42.2, maxLat: 46.7 };

/** Pretvara koordinate u postotke (0-100) unutar okvira; y raste prema dolje. */
export function projectGeo(lat: number, lng: number): { x: number; y: number } {
  const { minLng, maxLng, minLat, maxLat } = HR_BOUNDS;
  return {
    x: ((lng - minLng) / (maxLng - minLng)) * 100,
    y: (1 - (lat - minLat) / (maxLat - minLat)) * 100,
  };
}

export type CityDot = { city: string; x: number; y: number };

/** Gradovi s visokoškolskim ustanovama i njihov položaj (iz `facultyLocations`). */
export function cityDots(): CityDot[] {
  const out: CityDot[] = [];
  for (const city of listFacultyCities()) {
    const geo = getFacultyCityCenter(city);
    if (!geo) continue;
    out.push({ city, ...projectGeo(geo.lat, geo.lng) });
  }
  return out;
}

export type CityGroup = {
  city: string;
  x: number;
  y: number;
  count: number;
  /** Broj ustanova po području (`Faculty.area`). */
  byArea: Record<string, number>;
  names: string[];
};

/** Grupira ustanove po gradu (samo gradovi s poznatim koordinatama), najviše ustanova prvo. */
export function groupByCity(list: Faculty[]): CityGroup[] {
  const map = new Map<string, CityGroup>();
  for (const f of list) {
    const key = f.city.trim().toLowerCase();
    const geo = getFacultyCityCenter(f.city);
    if (!geo) continue;
    let g = map.get(key);
    if (!g) {
      g = { city: f.city.trim(), ...projectGeo(geo.lat, geo.lng), count: 0, byArea: {}, names: [] };
      map.set(key, g);
    }
    g.count += 1;
    g.byArea[f.area] = (g.byArea[f.area] ?? 0) + 1;
    g.names.push(f.name);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

/** Područja poredana po broju ustanova. */
export function areaCounts(list: Faculty[]): { area: string; count: number }[] {
  const m: Record<string, number> = {};
  for (const f of list) m[f.area] = (m[f.area] ?? 0) + 1;
  return Object.entries(m)
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count);
}

/** Sljedeći rokovi za Senior iz kalendara (isti izvor kao /kalendar). */
export function nextSeniorEvents(limit = 6, from: Date = new Date()): CalendarEvent[] {
  return upcomingEvents(seniorEvents, from, limit);
}

/** Datum za prikaz na vremenskoj crti: { day, mon }. */
export function eventDayParts(e: CalendarEvent): { day: string; mon: string; year: number } {
  const d = new Date(e.year, e.month, e.day);
  return {
    day: String(e.day),
    mon: d.toLocaleDateString("hr-HR", { month: "short" }).replace(".", ""),
    year: e.year,
  };
}
