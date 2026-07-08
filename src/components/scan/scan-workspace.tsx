"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, Check, Droplet, Leaf, Recycle, Sparkles, Trophy, Upload, Video, X, Zap } from "lucide-react";
import { BinLegend } from "@/components/ui/bin-legend";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useAuth } from "@/components/providers/auth-provider";
import { ScanChat } from "./scan-chat";
import { fileToDataUrl, resizeDataUrl } from "@/utils/image";
import { BIN_META } from "@/domain/bins";
import type { ScanApiResponse, ScanResult, XpInfo } from "@/types/scan";

const primaryBtn =
  "inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]";
const secondaryBtn =
  "inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-muted hover:-translate-y-0.5";

export function ScanWorkspace() {
  const { user, refresh } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [fastMode, setFastMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [xpInfo, setXpInfo] = useState<XpInfo | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    try {
      const raw = await fileToDataUrl(file);
      const resized = await resizeDataUrl(raw);
      setImage(resized);
    } catch {
      setError("Could not read that image. Try a different file.");
    }
  }

  async function startCamera() {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setCameraActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setError("Camera access was denied or is unavailable on this device.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const maxDim = 1024;
    const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
  }

  async function analyze() {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mode: fastMode ? "fast" : "full" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      const payload = data as ScanApiResponse;
      setResult(payload.result);
      setXpInfo(payload.xp);
      setHistoryId(payload.historyId);
      setResultKey((k) => k + 1);
      if (payload.xp && !payload.xp.duplicate) {
        await refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImage(null);
    setResult(null);
    setXpInfo(null);
    setHistoryId(null);
    setError(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="rounded-2xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">1. Capture or upload</h2>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Zap className={`size-3.5 transition-colors ${fastMode ? "text-accent" : ""}`} />
            Fast scan
            <button
              type="button"
              role="switch"
              aria-checked={fastMode}
              aria-label="Toggle fast scan mode"
              onClick={() => setFastMode((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
                fastMode ? "bg-accent" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  fastMode ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-muted">
          {cameraActive ? (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          ) : image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Captured item" className="h-full w-full animate-fade-up object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera className="size-8 animate-float" />
              <span className="text-sm">No image yet</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {cameraActive ? (
            <>
              <button type="button" onClick={capturePhoto} className={primaryBtn}>
                <Camera className="size-4" />
                Capture
              </button>
              <button type="button" onClick={stopCamera} className={secondaryBtn}>
                <X className="size-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={startCamera} className={secondaryBtn}>
                <Video className="size-4" />
                Use camera
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()} className={secondaryBtn}>
                <Upload className="size-4" />
                Upload photo
              </button>
              {image && (
                <button type="button" onClick={reset} className={secondaryBtn}>
                  <X className="size-4" />
                  Clear
                </button>
              )}
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
            event.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={analyze}
          disabled={!image || loading}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-foreground transition-all duration-300 enabled:hover:scale-[1.02] disabled:opacity-40"
        >
          {loading ? "Analyzing..." : "Analyze item"}
          <Recycle className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </button>

        {error && (
          <p className="mt-3 animate-fade-up rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5">
        <h2 className="font-semibold">2. Result</h2>
        {!result ? (
          <div className="mt-4 flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center text-muted-foreground">
            <Recycle className={`size-8 ${loading ? "animate-spin text-accent" : ""}`} />
            <p className="max-w-xs text-sm">
              {loading ? "Analyzing your item..." : "Your scan result will appear here once you analyze an item."}
            </p>
          </div>
        ) : (
          <>
            <XpBanner xp={xpInfo} signedIn={Boolean(user)} />
            <ResultCard key={resultKey} result={result} />
            {historyId && (
              <div className="mt-4">
                <ScanChat key={historyId} historyId={historyId} objectName={result.object} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function XpBanner({ xp, signedIn }: { xp: XpInfo | null; signedIn: boolean }) {
  if (!signedIn) {
    return (
      <Link
        href="/login"
        className="mt-4 flex animate-fade-up items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
      >
        <Trophy className="size-3.5 shrink-0 text-accent" />
        Sign in to earn XP and chat about this scan
      </Link>
    );
  }

  if (!xp) return null;

  if (xp.duplicate) {
    return (
      <div className="mt-4 flex animate-fade-up items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
        <Trophy className="size-3.5 shrink-0" />
        Already scanned this exact photo before — no XP this time.
      </div>
    );
  }

  return (
    <div className="mt-4 flex animate-fade-up items-center gap-2 rounded-xl bg-accent-soft px-3 py-2.5 text-xs font-medium text-accent">
      <Trophy className="size-3.5 shrink-0 animate-pop" />+{xp.awarded} XP earned — {xp.total} XP total
    </div>
  );
}

function ResultCard({ result }: { result: ScanResult }) {
  const meta = BIN_META[result.bin];

  return (
    <div className="mt-4 animate-fade-up space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{result.object}</h3>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}
        >
          <span className={`size-1.5 rounded-full ${meta.dot} animate-blink`} />
          {meta.label}
        </span>
      </div>

      <div>
        <div className="mb-1.5 text-xs text-muted-foreground">Which bin?</div>
        <BinLegend active={result.bin} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>AI confidence</span>
          <span>{result.confidence}%</span>
        </div>
        <ProgressBar value={result.confidence} />
      </div>

      {result.mode === "full" && (
        <>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-muted px-3 py-2.5 transition-transform duration-300 hover:-translate-y-0.5">
              <div className="text-xs text-muted-foreground">Material</div>
              <div className="mt-0.5 font-medium capitalize">{result.material}</div>
            </div>
            <div className="rounded-xl bg-muted px-3 py-2.5 transition-transform duration-300 hover:-translate-y-0.5">
              <div className="text-xs text-muted-foreground">Recyclable</div>
              <div className="mt-0.5 flex items-center gap-1 font-medium">
                {result.recyclable ? (
                  <Check className="size-3.5 text-accent" />
                ) : (
                  <X className="size-3.5 text-red-500" />
                )}
                {result.recyclable ? "Yes" : "No"}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Droplet className="size-4 shrink-0 text-accent" />
              {result.needsCleaning ? "Rinse before disposing" : "No cleaning needed"}
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="size-4 shrink-0 text-accent" />
              Decomposes in {result.decompositionTime}
            </div>
          </div>

          {result.environmentalImpact && <p className="text-sm text-muted-foreground">{result.environmentalImpact}</p>}

          {result.reuseIdea && (
            <div className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                <span className="font-medium text-foreground">Reuse idea:</span>{" "}
                <span className="text-muted-foreground">{result.reuseIdea}</span>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}