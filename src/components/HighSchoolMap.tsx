import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import { Icon, DivIcon, LatLngBounds } from "leaflet";
import type { HighSchool, HighSchoolCategory } from "@/data/highSchools";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink, Globe, Mail, MapPin, Phone, School } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error - Leaflet internals
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CATEGORY_COLORS: Record<HighSchoolCategory, string> = {
  Gimnazija: "#14b8a6",
  "Strukovna škola": "#0ea5e9",
  "Umjetnička škola": "#8b5cf6",
  "Srednja škola": "#10b981",
  "Posebni programi": "#f59e0b",
};

const CATEGORY_STYLE: Record<HighSchoolCategory, string> = {
  Gimnazija: "bg-primary/10 text-primary border-primary/25",
  "Strukovna škola": "bg-sky-500/10 text-sky-700 border-sky-500/25 dark:text-sky-400",
  "Umjetnička škola": "bg-violet-500/10 text-violet-700 border-violet-500/25 dark:text-violet-400",
  "Srednja škola": "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
  "Posebni programi": "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-400",
};

function createClusterIcon(count: number, category?: HighSchoolCategory) {
  const color = category ? CATEGORY_COLORS[category] : "#14b8a6";
  const size = count > 50 ? 48 : count > 20 ? 42 : count > 10 ? 36 : 30;
  
  return new DivIcon({
    html: `<div style="
      background: ${color};
      color: white;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: ${size > 40 ? 14 : 12}px;
      box-shadow: 0 4px 12px ${color}55, 0 2px 4px rgba(0,0,0,0.15);
      border: 3px solid white;
      transition: transform 0.15s ease;
    ">${count}</div>`,
    className: "custom-cluster-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createSchoolIcon(category: HighSchoolCategory) {
  const color = CATEGORY_COLORS[category];
  return new DivIcon({
    html: `<div style="
      background: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px ${color}55, 0 2px 4px rgba(0,0,0,0.15);
      border: 2.5px solid white;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    </div>`,
    className: "custom-school-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

type ClusterData = {
  lat: number;
  lng: number;
  schools: HighSchool[];
  category?: HighSchoolCategory;
};

function clusterSchools(schools: HighSchool[], zoomLevel: number): ClusterData[] {
  // At high zoom, show individual markers
  if (zoomLevel >= 13) {
    return schools.map((s) => ({
      lat: s.lat,
      lng: s.lng,
      schools: [s],
      category: s.category,
    }));
  }

  // Cluster by proximity
  const gridSize = zoomLevel <= 7 ? 0.8 : zoomLevel <= 9 ? 0.3 : zoomLevel <= 11 ? 0.1 : 0.05;
  const clusters: Map<string, ClusterData> = new Map();

  for (const school of schools) {
    const gridLat = Math.floor(school.lat / gridSize) * gridSize;
    const gridLng = Math.floor(school.lng / gridSize) * gridSize;
    const key = `${gridLat},${gridLng}`;

    if (clusters.has(key)) {
      clusters.get(key)!.schools.push(school);
    } else {
      clusters.set(key, {
        lat: school.lat,
        lng: school.lng,
        schools: [school],
        category: school.category,
      });
    }
  }

  // Calculate cluster centers
  for (const cluster of clusters.values()) {
    if (cluster.schools.length > 1) {
      cluster.lat = cluster.schools.reduce((sum, s) => sum + s.lat, 0) / cluster.schools.length;
      cluster.lng = cluster.schools.reduce((sum, s) => sum + s.lng, 0) / cluster.schools.length;
      // If all same category, keep it; otherwise undefined
      const categories = new Set(cluster.schools.map((s) => s.category));
      cluster.category = categories.size === 1 ? cluster.schools[0].category : undefined;
    }
  }

  return Array.from(clusters.values());
}

function MapController({
  schools,
  focusedSchoolId,
}: {
  schools: HighSchool[];
  focusedSchoolId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (focusedSchoolId) {
      const school = schools.find((s) => s.id === focusedSchoolId);
      if (school) {
        map.flyTo([school.lat, school.lng], 15, { duration: 0.8 });
      }
    }
  }, [focusedSchoolId, schools, map]);

  return null;
}

function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();
  
  useEffect(() => {
    const handleZoom = () => onZoomChange(map.getZoom());
    map.on("zoomend", handleZoom);
    onZoomChange(map.getZoom());
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, onZoomChange]);

  return null;
}

function mapsUrl(s: HighSchool): string {
  const q = encodeURIComponent(`${s.name}, ${s.address}, ${s.postalCode} ${s.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

type HighSchoolMapProps = {
  schools: HighSchool[];
  focusedSchoolId: string | null;
  onOpenDetail: (id: string) => void;
  className?: string;
};

export default function HighSchoolMap({
  schools,
  focusedSchoolId,
  onOpenDetail,
  className,
}: HighSchoolMapProps) {
  const [zoom, setZoom] = useState(7);
  const mapRef = useRef<L.Map | null>(null);

  // Croatia bounds
  const bounds = useMemo(
    () =>
      new LatLngBounds(
        [42.35, 13.4], // SW
        [46.6, 19.5]   // NE
      ),
    []
  );

  const clusters = useMemo(() => clusterSchools(schools, zoom), [schools, zoom]);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <MapContainer
        center={[44.8, 16.0]}
        zoom={7}
        minZoom={6}
        maxZoom={18}
        maxBounds={bounds}
        maxBoundsViscosity={0.8}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <ZoomTracker onZoomChange={setZoom} />
        <MapController schools={schools} focusedSchoolId={focusedSchoolId} />

        {clusters.map((cluster, idx) => {
          const isCluster = cluster.schools.length > 1;
          const school = cluster.schools[0];

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${idx}`}
                position={[cluster.lat, cluster.lng]}
                icon={createClusterIcon(cluster.schools.length, cluster.category)}
                eventHandlers={{
                  click: () => {
                    if (mapRef.current) {
                      mapRef.current.flyTo([cluster.lat, cluster.lng], Math.min(zoom + 2, 15), {
                        duration: 0.5,
                      });
                    }
                  },
                }}
              >
                <Popup className="school-popup" maxWidth={320}>
                  <div className="p-1">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                        style={{ background: cluster.category ? CATEGORY_COLORS[cluster.category] : "#14b8a6" }}
                      >
                        <School className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{cluster.schools.length} škola</p>
                        <p className="text-xs text-muted-foreground">Približi za detalje</p>
                      </div>
                    </div>
                    <ul className="max-h-40 space-y-1 overflow-y-auto text-xs">
                      {cluster.schools.slice(0, 8).map((s) => (
                        <li
                          key={s.id}
                          className="cursor-pointer truncate rounded px-1.5 py-1 hover:bg-muted"
                          onClick={() => onOpenDetail(s.id)}
                        >
                          {s.name}
                        </li>
                      ))}
                      {cluster.schools.length > 8 && (
                        <li className="px-1.5 py-1 text-muted-foreground">
                          + još {cluster.schools.length - 8}...
                        </li>
                      )}
                    </ul>
                  </div>
                </Popup>
              </Marker>
            );
          }

          return (
            <Marker
              key={school.id}
              position={[school.lat, school.lng]}
              icon={createSchoolIcon(school.category)}
            >
              <Popup className="school-popup" maxWidth={320}>
                <div className="p-1">
                  <div className="mb-2 flex items-start gap-2.5">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ background: CATEGORY_COLORS[school.category] }}
                    >
                      {school.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold leading-snug text-foreground">{school.name}</h3>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {school.city}
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn("mb-2 rounded-md border text-[10px] font-semibold", CATEGORY_STYLE[school.category])}
                  >
                    {school.category}
                  </Badge>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-primary/70" />
                      <span>
                        {school.address}, {school.postalCode} {school.city}
                      </span>
                    </p>
                    {school.phones.length > 0 && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 shrink-0 text-primary/70" />
                        {school.phones[0]}
                      </p>
                    )}
                    {school.emails.length > 0 && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3 w-3 shrink-0 text-primary/70" />
                        <a href={`mailto:${school.emails[0]}`} className="text-primary hover:underline">
                          {school.emails[0]}
                        </a>
                      </p>
                    )}
                    {school.website && (
                      <p className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 shrink-0 text-primary/70" />
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-primary hover:underline"
                        >
                          {school.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(school.id)}
                      className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Detalji
                    </button>
                    <a
                      href={mapsUrl(school)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Karta
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-14 left-3 z-[1000] rounded-xl border border-border/80 bg-card/95 p-2.5 shadow-lg backdrop-blur-sm sm:bottom-4 sm:left-4 sm:p-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Vrsta škole
        </p>
        <div className="grid gap-1">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2 text-xs">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: color, boxShadow: `0 1px 3px ${color}55` }}
              />
              <span className="text-foreground">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
