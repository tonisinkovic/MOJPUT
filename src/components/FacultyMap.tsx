import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cityCoordinates, croatiaCenter, defaultZoom } from "@/data/cityCoordinates";

// Popravljanje default ikona Leafleta u Vite/React
const fixLeafletIcon = () => {
  const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  (L.Marker.prototype as L.Marker & { options: L.MarkerOptions }).options.icon = icon;
};

type FacultyMapProps = {
  cities: string[];
  onCityClick?: (city: string) => void;
};

export default function FacultyMap({ cities, onCityClick }: FacultyMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) fixLeafletIcon();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="h-full w-full min-h-[280px] rounded-lg bg-muted animate-pulse flex items-center justify-center text-muted-foreground text-sm">
        Učitavanje karte…
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden bg-muted">
      <MapContainer
        center={croatiaCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        scrollWheelZoom
        style={{ minHeight: 280 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          const coords = cityCoordinates[city];
          if (!coords) return null;
          return (
            <CircleMarker
              key={city}
              center={coords}
              radius={10}
              pathOptions={{
                fillColor: "#22c55e",
                color: "#16a34a",
                weight: 2,
                fillOpacity: 0.8,
              }}
              eventHandlers={{
                click: () => onCityClick?.(city),
              }}
            >
              <Popup>{city}</Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
