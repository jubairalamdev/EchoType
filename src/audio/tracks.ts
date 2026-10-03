import type { TrackPatch } from "@/audio/AudioEngine";

// Task 10: Per-track instrument patch + vibe metadata.
// Backing-beat sequencer deferred (Task 11 stub); bpm kept for future use.

export type TrackId = "lofi" | "synthwave" | "ambient";

export interface TrackDef extends TrackPatch {
  id: TrackId;
  name: string;
  bpm: number;
  description: string;
}

export const TRACKS: Record<TrackId, TrackDef> = {
  lofi: {
    id: "lofi",
    name: "Lo-Fi Chill",
    bpm: 76,
    wave: "triangle",
    filterFreq: 1800,
    description: "Soft triangle pluck, mellow lowpass.",
  },
  synthwave: {
    id: "synthwave",
    name: "Synthwave Groove",
    bpm: 102,
    wave: "sawtooth",
    filterFreq: 2600,
    description: "Bright saw edge for neon drive.",
  },
  ambient: {
    id: "ambient",
    name: "Ambient Drone",
    bpm: 60,
    wave: "sine",
    filterFreq: 1200,
    description: "Pure sine wash, slow and airy.",
  },
};

export const TRACK_LIST: TrackDef[] = [TRACKS.lofi, TRACKS.synthwave, TRACKS.ambient];
