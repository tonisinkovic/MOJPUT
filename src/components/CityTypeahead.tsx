import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function foldHr(s: string): string {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");
}

export function matchesCity(place: string, cityInput: string): boolean {
  const q = foldHr(cityInput.trim());
  if (q.length < 2) return true;
  return foldHr(place).includes(q);
}

export function CityTypeahead({
  cities,
  value,
  onChange,
}: {
  cities: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);

  const suggestions = useMemo(() => {
    const q = foldHr(value.trim());
    if (!q) return [];
    return cities
      .map((city) => {
        const f = foldHr(city);
        const rank = f === q ? 0 : f.startsWith(q) ? 1 : f.includes(q) ? 2 : 9;
        return { city, rank };
      })
      .filter((row) => row.rank < 9)
      .sort((a, b) => a.rank - b.rank || a.city.localeCompare(b.city, "hr"))
      .slice(0, 8)
      .map((row) => row.city);
  }, [cities, value]);

  useEffect(() => {
    setHi(0);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative min-w-0">
      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open || suggestions.length === 0) {
            if (e.key === "Escape") setOpen(false);
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHi((n) => (n + 1) % suggestions.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHi((n) => (n - 1 + suggestions.length) % suggestions.length);
          } else if (e.key === "Enter") {
            e.preventDefault();
            pick(suggestions[hi] || suggestions[0]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Upiši grad…"
        aria-label="Upiši grad"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-autocomplete="list"
        aria-expanded={open && suggestions.length > 0}
        className="h-11 rounded-xl border-border/80 bg-background pl-10 pr-10 text-base"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Očisti grad"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      {open && value.trim() ? (
        <ul
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-xl border border-border/80 bg-card py-1 shadow-[var(--shadow-elevated)]"
        >
          {suggestions.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-muted-foreground">Nema grada za to što pišeš.</li>
          ) : (
            suggestions.map((city, i) => (
              <li key={city}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === hi}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm",
                    i === hi ? "bg-muted text-foreground" : "hover:bg-muted/70",
                  )}
                  onMouseEnter={() => setHi(i)}
                  onClick={() => pick(city)}
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {city}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
