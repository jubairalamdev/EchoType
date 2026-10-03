// Task 15: LocalStorage persistence — settings, best, history. SSR-safe.

import type { TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import type { GameStats } from "@/lib/metrics";

export interface Settings {
  volume: number;
  muted: boolean;
  track: TrackId;
  reduceMotion: boolean;
}

export interface BestScore extends GameStats {
  mode: GameMode;
  track: TrackId;
  date: string;
}

const KEYS = {
  settings: "echotype:settings",
  best: "echotype:best",
  history: "echotype:history",
} as const;

const DEFAULT_SETTINGS: Settings = {
  volume: 0.8,
  muted: false,
  track: "lofi",
  reduceMotion: false,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota / private mode — non-fatal
  }
}

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(KEYS.settings, {}) };
}

export function saveSettings(s: Settings) {
  write(KEYS.settings, s);
}

export function loadBest(): BestScore | null {
  return read<BestScore | null>(KEYS.best, null);
}

export function maybeSaveBest(entry: BestScore): boolean {
  const prev = loadBest();
  if (!prev || entry.wpm > prev.wpm) {
    write(KEYS.best, entry);
    return true;
  }
  return false;
}

export function loadHistory(): BestScore[] {
  return read<BestScore[]>(KEYS.history, []);
}

export function appendHistory(entry: BestScore) {
  const h = loadHistory();
  h.unshift(entry);
  write(KEYS.history, h.slice(0, 20));
}
