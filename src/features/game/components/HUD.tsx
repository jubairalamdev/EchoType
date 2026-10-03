"use client";

import { Flame, Gauge, Target } from "lucide-react";
import { TRACKS, type TrackId } from "@/audio/tracks";
import { MODE_META, type GameMode } from "@/data/tracksMeta";

// Project-progress style stat card: big numeral, glowing gradient bar.
export function HUD({
  wpm,
  accuracy,
  combo,
  progress,
  track,
  mode,
}: {
  wpm: number;
  accuracy: number;
  combo: number;
  progress: number;
  track: TrackId;
  mode: GameMode;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div
      className="flex flex-1 items-center gap-4 rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-5 py-4"
      aria-live="polite"
    >
      <div className="flex items-baseline gap-1">
        <Gauge className="h-4 w-4 translate-y-0.5 text-violet-300" aria-hidden="true" />
        <span className="text-4xl font-bold tracking-tight text-white">{wpm}</span>
        <span className="text-sm text-zinc-400">WPM</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div
          className="h-3 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Typing progress"
        >
          <div
            className="glow-bar h-full rounded-full bg-gradient-to-r from-[#8b7cf6] to-[#5b8cff] transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
            {accuracy}%
          </span>
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
            x{combo}
          </span>
          <span className="ml-auto hidden truncate sm:inline">
            {TRACKS[track].name} · {MODE_META[mode].name}
          </span>
        </div>
      </div>
    </div>
  );
}
