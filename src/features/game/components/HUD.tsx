"use client";

import { TRACKS, type TrackId } from "@/audio/tracks";
import { MODE_META, type GameMode } from "@/data/tracksMeta";

export function HUD({
  wpm,
  accuracy,
  combo,
  track,
  mode,
}: {
  wpm: number;
  accuracy: number;
  combo: number;
  track: TrackId;
  mode: GameMode;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
      aria-live="polite"
    >
      <span className="font-semibold text-cyan-300">{wpm} WPM</span>
      <span className="text-zinc-300">{accuracy}% acc</span>
      <span className={combo >= 10 ? "text-[#ff7ac8] glow-magenta" : "text-zinc-300"}>
        {combo}x combo
      </span>
      <span className="ml-auto hidden text-xs text-zinc-500 sm:inline">
        {TRACKS[track].name} · {MODE_META[mode].name}
      </span>
    </div>
  );
}
