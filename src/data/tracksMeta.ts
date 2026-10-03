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
    gradient: "from-[#8b7cf6]/20 to-[#5b8cff]/10",
    accent: "text-violet-300",
  },
  synthwave: {
    id: "synthwave",
    tagline: "Neon drive, bright edge",
    gradient: "from-[#5b8cff]/25 to-[#8b7cf6]/10",
    accent: "text-[#b7a8ff]",
  },
  ambient: {
    id: "ambient",
    tagline: "Weightless wash",
    gradient: "from-[#b7a8ff]/15 to-[#5b8cff]/10",
    accent: "text-violet-200",
  },
};

export type GameMode = "free" | "quote" | "code";

export const MODE_META: Record<GameMode, { name: string; hint: string }> = {
  free: { name: "Freeform Jam", hint: "No mistakes — every key sings" },
  quote: { name: "Quote Challenge", hint: "Type the passage exactly" },
  code: { name: "Code Snippet", hint: "Symbols included, stay sharp" },
};
