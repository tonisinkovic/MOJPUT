import { formatEventLine } from "@/data/calendarEvents";
import { nextSeniorEvents } from "@/lib/seniorHomeData";
import {
  SENIOR_CALCULATOR_PROGRAM_COUNT,
  SENIOR_INSTITUTION_COUNT,
  SENIOR_VIDEO_COUNT,
} from "@/lib/seniorHonesty";

/** Traka koja se vrti ispod herojskog dijela: stvarne brojke i sljedeći rokovi iz kalendara. */
export default function SeniorTicker() {
  const items = [
    `${SENIOR_INSTITUTION_COUNT} učilišta na karti`,
    `${SENIOR_CALCULATOR_PROGRAM_COUNT} programa u kalkulatoru bodova`,
    ...nextSeniorEvents(3).map((e) => `Rok · ${formatEventLine(e)}`),
    `${SENIOR_VIDEO_COUNT} videa`,
    "Besplatno za sve",
  ];
  const loop = [...items, ...items];

  return (
    <div className="relative -mt-px overflow-hidden border-b border-border/60 bg-card/60 py-3.5 backdrop-blur" aria-label="Pregled platforme">
      <div className="sr-marquee flex w-max items-center gap-10 whitespace-nowrap pr-10 text-sm font-bold text-muted-foreground">
        {loop.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-10" aria-hidden={i >= items.length}>
            <span>{t}</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-[hsl(var(--sr-gold))]" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
