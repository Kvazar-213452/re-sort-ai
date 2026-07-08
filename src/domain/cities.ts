import type { WasteBin } from "./bins";
import { BIN_META } from "./bins";

export type RecyclingBin = WasteBin | "glass";

export interface RecyclingPoint {
  id: string;
  name: string;
  address: string;
  hours: string;
  bins: RecyclingBin[];
  lat: number;
  lng: number;
}

export interface City {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  /** [south, west, north, east] — used to query real containers around the city. */
  bbox: [number, number, number, number];
}

export const GERMANY_VIEW = { lat: 51.1657, lng: 10.4515, zoom: 6 };

export const CITIES: City[] = [
  { slug: "berlin", name: "Berlin", lat: 52.52, lng: 13.405, zoom: 12, bbox: [52.42, 13.15, 52.62, 13.65] },
  { slug: "munich", name: "Munich", lat: 48.1351, lng: 11.582, zoom: 12, bbox: [48.02, 11.35, 48.25, 11.75] },
  { slug: "hamburg", name: "Hamburg", lat: 53.5511, lng: 9.9937, zoom: 12, bbox: [53.4, 9.75, 53.7, 10.25] },
  { slug: "cologne", name: "Cologne", lat: 50.9375, lng: 6.9603, zoom: 12, bbox: [50.83, 6.75, 51.05, 7.15] },
  { slug: "frankfurt", name: "Frankfurt", lat: 50.1109, lng: 8.6821, zoom: 12, bbox: [50.02, 8.5, 50.2, 8.85] },
  { slug: "leipzig", name: "Leipzig", lat: 51.3397, lng: 12.3731, zoom: 12, bbox: [51.25, 12.2, 51.45, 12.55] },
];

export const MAP_BIN_META: Record<
  RecyclingBin,
  { label: string; dot: string; text: string; bg: string; ring: string }
> = {
  ...BIN_META,
  glass: {
    label: "Glass",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    ring: "ring-cyan-500/40",
  },
};
