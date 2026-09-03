import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import { Icon, DivIcon, LatLngBounds } from "leaflet";
import type { FacultyInstitutionType } from "@/data/faculties";
import type { FacultyWithGeo } from "@/data/facultyLocations";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink, GraduationCap, MapPin } from "lucide-react";
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

const TYPE_COLORS: Record<FacultyInstitutionType, string> = {
  Sveučilište: "#14b8a6",
  Veleučilište: "#0ea5e9",
  Ostalo: "#8b5cf6",
};

const TYPE_STYLE: Record<FacultyInstitutionType, string> = {
  Sveučilište: "bg-primary/10 text-primary border-primary/25",
  Veleučilište: "bg-sky-500/10 text-sky-700 border-sky-500/25 dark:text-sky-400",
  Ostalo: "bg-violet-500/10 text-violet-700 border-violet-500/25 dark:text-violet-400",
};

function createClusterIcon(count: number, type?: FacultyInstitutionType) {
  const color = type ? TYPE_COLORS[type] : "#14b8a6";
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

function createFacultyIcon(type: FacultyInstitutionType) {
  const color = TYPE_COLORS[type];
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
    className: "custom-faculty-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

type ClusterData = {
  lat: number;
  lng: number;
  faculties: FacultyWithGeo[];
  type?: FacultyInstitutionType;
};

function clusterFaculties(faculties: FacultyWithGeo[], zoomLevel: number): ClusterData[] {
  // At high zoom, show individual markers
  if (zoomLevel >= 13) {
    return faculties.map((f) => ({
      lat: f.lat,
      lng: f.lng,
      faculties: [f],
      type: f.institutionType,
    }));
  }

  // Cluster by proximity
  const gridSize = zoomLevel <= 7 ? 0.8 : zoomLevel <= 9 ? 0.3 : zoomLevel <= 11 ? 0.1 : 0.05;
  const clusters: Map<string, ClusterData> = new Map();

  for (const faculty of faculties) {
    const gridLat = Math.floor(faculty.lat / gridSize) * gridSize;
    const gridLng = Math.floor(faculty.lng / gridSize) * gridSize;
    const key = `${gridLat},${gridLng}`;

    if (clusters.has(key)) {
      clusters.get(key)!.faculties.push(faculty);
    } else {
      clusters.set(key, {
        lat: faculty.lat,
        lng: faculty.lng,
        faculties: [faculty],
        type: faculty.institutionType,
      });
    }
  }

  // Calculate cluster centers
  for (const cluster of clusters.values()) {
    if (cluster.faculties.length > 1) {
      cluster.lat = cluster.faculties.reduce((sum, f) => sum + f.lat, 0) / cluster.faculties.length;
      cluster.lng = cluster.faculties.reduce((sum, f) => sum + f.lng, 0) / cluster.faculties.length;
      const types = new Set(cluster.faculties.map((f) => f.institutionType));
      cluster.type = types.size === 1 ? cluster.faculties[0].institutionType : undefined;
    }
  }

  return Array.from(clusters.values());
}

function MapController({
  faculties,
  focusedFacultyId,
}: {
  faculties: FacultyWithGeo[];
  focusedFacultyId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (focusedFacultyId) {
      const faculty = faculties.find((f) => f.id === focusedFacultyId);
      if (faculty) {
        map.flyTo([faculty.lat, faculty.lng], 15, { duration: 0.8 });
      }
    }
  }, [focusedFacultyId, faculties, map]);

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

function mapsUrl(f: FacultyWithGeo): string {
  const q = encodeURIComponent(`${f.name}, ${f.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

type FacultyMapProps = {
  faculties: FacultyWithGeo[];
  focusedFacultyId: string | null;
  onOpenDetail: (id: string) => void;
  className?: string;
};

export default function FacultyMap({
  faculties,
  focusedFacultyId,
  onOpenDetail,
  className,
}: FacultyMapProps) {
  const [zoom, setZoom] = useState(7);
  const mapRef = useRef<L.Map | null>(null);

  // Croatia bounds
  const bounds = useMemo(
    () =>
      new LatLngBounds(
        [42.35, 13.4], // SW
        [46.6, 19.5], // NE
      ),
    [],
  );

  const clusters = useMemo(() => clusterFaculties(faculties, zoom), [faculties, zoom]);

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
        <MapController faculties={faculties} focusedFacultyId={focusedFacultyId} />

        {clusters.map((cluster, idx) => {
          const isCluster = cluster.faculties.length > 1;
          const faculty = cluster.faculties[0];

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${idx}`}
                position={[cluster.lat, cluster.lng]}
                icon={createClusterIcon(cluster.faculties.length, cluster.type)}
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
                        style={{ background: cluster.type ? TYPE_COLORS[cluster.type] : "#14b8a6" }}
                      >
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {cluster.faculties.length} ustanova
                        </p>
                        <p className="text-xs text-muted-foreground">Približi za detalje</p>
                      </div>
                    </div>
                    <ul className="max-h-40 space-y-1 overflow-y-auto text-xs">
                      {cluster.faculties.slice(0, 8).map((f) => (
                        <li
                          key={f.id}
                          className="cursor-pointer truncate rounded px-1.5 py-1 hover:bg-muted"
                          onClick={() => onOpenDetail(f.id)}
                        >
                          {f.name}
                        </li>
                      ))}
                      {cluster.faculties.length > 8 && (
                        <li className="px-1.5 py-1 text-muted-foreground">
                          + još {cluster.faculties.length - 8}...
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
              key={faculty.id}
              position={[faculty.lat, faculty.lng]}
              icon={createFacultyIcon(faculty.institutionType)}
            >
              <Popup className="school-popup" maxWidth={320}>
                <div className="p-1">
                  <div className="mb-2 flex items-start gap-2.5">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ background: TYPE_COLORS[faculty.institutionType] }}
                    >
                      {faculty.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold leading-snug text-foreground">{faculty.name}</h3>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {faculty.city}
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "mb-2 rounded-md border text-[10px] font-semibold",
                      TYPE_STYLE[faculty.institutionType],
                    )}
                  >
                    {faculty.institutionType}
                  </Badge>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {faculty.provider && faculty.provider !== faculty.name && (
                      <p className="flex items-start gap-1.5">
                        <GraduationCap className="mt-0.5 h-3 w-3 shrink-0 text-primary/70" />
                        <span>{faculty.provider}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3 shrink-0 text-primary/70" />
                      {faculty.programs.length}{" "}
                      {faculty.programs.length === 1 ? "studijski program" : "studijskih programa"}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(faculty.id)}
                      className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Detalji
                    </button>
                    <a
                      href={mapsUrl(faculty)}
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
          Vrsta ustanove
        </p>
        <div className="grid gap-1">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 text-xs">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: color, boxShadow: `0 1px 3px ${color}55` }}
              />
              <span className="text-foreground">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
