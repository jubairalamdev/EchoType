"use client";

import { TRACKS } from "@/audio/tracks";
import type { TrackId } from "@/audio/tracks";
import { TRACK_META } from "@/data/tracksMeta";
import { cn } from "@/lib/cn";

export function TrackSelect({
  value,
  onChange,
}: {
  value: TrackId;
  onChange: (t: TrackId) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Backing track">
      {(Object.keys(TRACKS) as TrackId[]).map((id) => {
        const t = TRACKS[id];
        const meta = TRACK_META[id];
        const active = value === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all bg-gradient-to-br",
              meta.gradient,
              active
                ? "border-cyan-400 glow-box-cyan"
                : "border-white/10 hover:border-white/25"
            )}
          >
            <div className={cn("text-sm font-semibold", meta.accent)}>{t.name}</div>
            <div className="mt-1 text-xs text-zinc-400">{meta.tagline}</div>
            <div className="mt-2 text-[11px] text-zinc-500">{t.bpm} BPM · {t.wave}</div>
          </button>
        );
      })}
    </div>
  );
}
