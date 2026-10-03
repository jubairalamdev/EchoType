"use client";

import { MoonStar, Waves, Zap } from "lucide-react";
import { TRACKS } from "@/audio/tracks";
import type { TrackId } from "@/audio/tracks";
import { cn } from "@/lib/cn";

const ICONS: Record<TrackId, typeof Waves> = {
  lofi: MoonStar,
  synthwave: Zap,
  ambient: Waves,
};

const BLOB: Record<TrackId, string> = {
  lofi: "from-[#8b7cf6]/70 via-[#5b8cff]/40 to-transparent",
  synthwave: "from-[#5b8cff]/70 via-[#8b7cf6]/40 to-transparent",
  ambient: "from-[#b7a8ff]/60 via-[#5b8cff]/30 to-transparent",
};

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
        const Icon = ICONS[id];
        const active = value === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              "overflow-hidden rounded-[28px] border text-left transition-all",
              active
                ? "border-violet-400/70 glow-box-violet"
                : "border-white/10 hover:border-white/25"
            )}
          >
            <div className={cn("flex h-20 items-center bg-gradient-to-br p-4", BLOB[id])}>
              <Icon className="h-7 w-7 text-white drop-shadow-[0_0_12px_rgb(0_0_0/0.6)]" aria-hidden="true" />
            </div>
            <div className="bg-[#101018] p-4">
              <div className="text-sm font-semibold text-zinc-100">{t.name}</div>
              <div className="mt-0.5 text-xs text-zinc-500">
                {t.bpm} BPM · {t.wave}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
