import type { TrackId } from "@/audio/tracks";

// UI-side metadata for track select cards (audio patch lives in audio/tracks.ts).
export interface TrackMeta {
  id: TrackId;
  tagline: string;
  gradient: string;
  accent: string;
}

export const TRACK_META: Record<TrackId, TrackMeta> = {
  lofi: {
    id: "lofi",
    tagline: "Dusty chords, slow pulse",
    gradient: "from-cyan-400/20 to-amber-200/10",
    accent: "text-cyan-300",
  },
  synthwave: {
    id: "synthwave",
    tagline: "Neon drive, bright edge",
    gradient: "from-[#ff2fb3]/25 to-cyan-400/10",
    accent: "text-[#ff7ac8]",
  },
  ambient: {
    id: "ambient",
    tagline: "Weightless wash",
    gradient: "from-amber-200/15 to-cyan-400/10",
    accent: "text-amber-200",
  },
};

export type GameMode = "free" | "quote" | "code";

export const MODE_META: Record<GameMode, { name: string; hint: string }> = {
  free: { name: "Freeform Jam", hint: "No mistakes — every key sings" },
  quote: { name: "Quote Challenge", hint: "Type the passage exactly" },
  code: { name: "Code Snippet", hint: "Symbols included, stay sharp" },
};
