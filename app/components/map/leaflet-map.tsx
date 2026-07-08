"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, MapPin } from "lucide-react";
import { CITIES, GERMANY_VIEW, MAP_BIN_META, type City, type RecyclingPoint } from "../../lib/containers";

const CITY_ICON = L.divIcon({
  className: "",
  html: `<span class="block size-3.5 rounded-full bg-accent ring-[3px] ring-accent/30 shadow-md"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function pointIcon(colorClass: string, isActive: boolean) {
  return L.divIcon({
    className: "",
    html: `<span class="flex size-7 items-center justify-center rounded-full ${colorClass} shadow-md transition-transform ${
      isActive ? "scale-125 ring-[3px] ring-white" : "ring-2 ring-white"
    }"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FlyTo({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.1 });
  }, [lat, lng, zoom, map]);
  return null;
}

export function LeafletMap({
  city,
  points,
  activeId,
  onSelectCity,
  onSelectPoint,
}: {
  city: City | null;
  points: RecyclingPoint[];
  activeId: string | null;
  onSelectCity: (slug: string) => void;
  onSelectPoint: (id: string) => void;
}) {
  const activePoint = points.find((p) => p.id === activeId) ?? null;
  const view = activePoint
    ? { lat: activePoint.lat, lng: activePoint.lng, zoom: 15 }
    : city
      ? { lat: city.lat, lng: city.lng, zoom: city.zoom }
      : GERMANY_VIEW;

  return (
    <MapContainer
      center={[GERMANY_VIEW.lat, GERMANY_VIEW.lng]}
      zoom={GERMANY_VIEW.zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
      />
      <FlyTo lat={view.lat} lng={view.lng} zoom={view.zoom} />

      {!city &&
        CITIES.map((c) => (
          <Marker
            key={c.slug}
            position={[c.lat, c.lng]}
            icon={CITY_ICON}
            eventHandlers={{ click: () => onSelectCity(c.slug) }}
          >
            <Tooltip permanent direction="top" offset={[0, -8]} className="city-label-tooltip">
              {c.name}
            </Tooltip>
          </Marker>
        ))}

      {city &&
        points.map((point) => {
          const meta = MAP_BIN_META[point.bins[0]];
          return (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={pointIcon(meta.dot, point.id === activeId)}
              eventHandlers={{ click: () => onSelectPoint(point.id) }}
            >
              <Popup>
                <div className="min-w-44">
                  <p className="font-semibold text-foreground">{point.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    {point.address}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" />
                    {point.hours}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {point.bins.map((bin) => {
                      const binMeta = MAP_BIN_META[bin];
                      return (
                        <span
                          key={bin}
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${binMeta.bg} ${binMeta.text}`}
                        >
                          <span className={`size-1.5 rounded-full ${binMeta.dot}`} />
                          {binMeta.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
