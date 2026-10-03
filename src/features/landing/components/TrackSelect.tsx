"use client";

import { motion } from "framer-motion";
import { Check, MoonStar, Waves, Zap } from "lucide-react";
import { TRACKS } from "@/audio/tracks";
import type { TrackId } from "@/audio/tracks";
import { BorderBeam } from "@/components/magic/BorderBeam";
import { cn } from "@/lib/cn";

// Each track carries its own mood — cozy dusk, neon drive, deep drift.
const MOOD: Record<
  TrackId,
  { Icon: typeof Waves; blob: string; icon: string; border: string; from: string; to: string }
> = {
  lofi: {
    Icon: MoonStar,
    blob: "from-amber-400/50 via-orange-400/25 to-transparent",
    icon: "text-amber-200",
    border: "border-amber-300/40",
    from: "#fbbf24",
    to: "#fb9235",
  },
  synthwave: {
    Icon: Zap,
    blob: "from-fuchsia-500/50 via-cyan-400/30 to-transparent",
    icon: "text-pink-200",
    border: "border-pink-400/40",
    from: "#ff2fb3",
    to: "#22d3ee",
  },
  ambient: {
    Icon: Waves,
    blob: "from-sky-400/50 via-teal-300/25 to-transparent",
    icon: "text-sky-200",
    border: "border-sky-300/40",
    from: "#5b8cff",
    to: "#2dd4bf",
  },
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
        const mood = MOOD[id];
        const Icon = mood.Icon;
        const active = value === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              "relative overflow-hidden rounded-[28px] border text-left transition-colors",
              active ? mood.border : "border-white/10 hover:border-white/25"
            )}
          >
            {active && (
              <BorderBeam
                duration={6}
                size={240}
                colorFrom={mood.from}
                colorTo={mood.to}
              />
            )}
            {active && (
              <motion.span
                layoutId="track-selected-arrow"
                className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8b7cf6] to-[#5b8cff] text-white shadow-[0_0_16px_rgb(139_124_246/0.6)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Check className="h-4 w-4" aria-hidden="true" />
              </motion.span>
            )}
            <div className={cn("flex h-20 items-center bg-gradient-to-br p-4", mood.blob)}>
              <Icon
                className={cn("h-7 w-7 drop-shadow-[0_0_12px_rgb(0_0_0/0.6)]", mood.icon)}
                aria-hidden="true"
              />
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
