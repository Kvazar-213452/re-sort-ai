"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, Clock, Globe2, MapPin, MapPinned } from "lucide-react";
import { CITIES, MAP_BIN_META, type RecyclingPoint } from "@/domain/cities";
import { Reveal } from "@/components/ui/reveal";

const LeafletMap = dynamic(() => import("./leaflet-map").then((mod) => mod.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export function RecyclingMap() {
  const [citySlug, setCitySlug] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [resolved, setResolved] = useState<{ slug: string; points: RecyclingPoint[] } | null>(null);
  const [fetchError, setFetchError] = useState<{ slug: string; message: string } | null>(null);

  const city = useMemo(() => CITIES.find((c) => c.slug === citySlug) ?? null, [citySlug]);
  const points = resolved?.slug === citySlug ? resolved.points : [];
  const error = fetchError?.slug === citySlug ? fetchError.message : null;
  const loading = citySlug !== null && resolved?.slug !== citySlug && !error;

  useEffect(() => {
    if (!citySlug) return;
    let cancelled = false;
    fetch(`/api/containers?city=${citySlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setResolved({ slug: citySlug, points: data.points });
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError({
            slug: citySlug,
            message: err instanceof Error ? err.message : "Could not load recycling points.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [citySlug]);

  function selectCity(slug: string) {
    setCitySlug(slug);
    setActiveId(null);
  }

  function resetToOverview() {
    setCitySlug(null);
    setActiveId(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/70">
          <MapPinned className="size-3.5 text-accent" />
          Recycling Map
          <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wide text-accent-foreground">
            BETA
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Find a container near you</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Pick a city in Germany and browse nearby recycling containers on the map — no location access needed,
          you&apos;re always in control. Data comes live from OpenStreetMap.
        </p>
      </div>

      <Reveal className="mt-8">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetToOverview}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ${
              !city
                ? "border-transparent bg-accent-soft text-accent ring-2 ring-accent/40"
                : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
            }`}
          >
            <Globe2 className="size-3.5" />
            All Germany
          </button>
          {CITIES.map((c) => {
            const isActive = c.slug === citySlug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => selectCity(c.slug)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "border-transparent bg-accent-soft text-accent ring-2 ring-accent/40"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                }`}
              >
                <MapPin className="size-3.5" />
                {c.name}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={80} className="mt-6">
        <div className="relative h-80 overflow-hidden rounded-2xl border border-border bg-card sm:h-[26rem]">
          <LeafletMap
            city={city}
            points={points}
            activeId={activeId}
            onSelectCity={selectCity}
            onSelectPoint={setActiveId}
          />
          {city && loading && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] flex justify-center p-3">
              <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-md">
                Loading containers in {city.name}…
              </span>
            </div>
          )}
        </div>
      </Reveal>

      {city && error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <AlertTriangle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {city && !loading && !error && points.length === 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
          No mapped recycling containers found in {city.name} yet.
        </div>
      )}

      {city && points.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {points.map((point, index) => (
            <Reveal key={point.id} delay={Math.min(index, 8) * 60}>
              <button
                type="button"
                onClick={() => setActiveId(point.id)}
                className={`w-full rounded-xl border bg-card p-4 text-left transition-all duration-300 hover:border-accent/40 ${
                  activeId === point.id ? "border-accent/50 ring-2 ring-accent/30" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{point.name}</h3>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {point.hours}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  {point.address}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {point.bins.map((bin) => {
                    const meta = MAP_BIN_META[bin];
                    return (
                      <span
                        key={bin}
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}
                      >
                        <span className={`size-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    );
                  })}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
