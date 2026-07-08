import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-leaflet's MapContainer doesn't survive Strict Mode's double-invoked
  // mount/cleanup effects (it removes the Leaflet map on the phantom unmount
  // but never recreates it), crashing the /map page in dev.
  reactStrictMode: false,
};

export default nextConfig;
