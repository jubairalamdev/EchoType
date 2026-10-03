"use client";

import { useState } from "react";
import { Check, Copy, Home, RotateCcw, Shuffle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { IconButton } from "@/components/ui/IconButton";
import { RhythmGraph } from "@/features/results/components/RhythmGraph";
import type { GameStats } from "@/lib/metrics";
import type { TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import { TRACKS } from "@/audio/tracks";
import { MODE_META } from "@/data/tracksMeta";

// Encore card: big accuracy numeral, glowing bar, icon actions.
export function ResultModal({
  open,
  stats,
  intervals,
  track,
  mode,
  isBest,
  onReplay,
  onNew,
  onExit,
}: {
  open: boolean;
  stats: GameStats | null;
  intervals: number[];
  track: TrackId;
  mode: GameMode;
  isBest: boolean;
  onReplay: () => void;
  onNew: () => void;
  onExit: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!stats) return null;

  const share = async () => {
    const text = `EchoType encore: ${stats.wpm} WPM, ${stats.accuracy}% acc, x${stats.maxCombo} combo (${TRACKS[track].name} / ${MODE_META[mode].name})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal open={open} onClose={onExit}>
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">encore</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-white">{stats.accuracy}</span>
              <span className="text-2xl text-zinc-500">%</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {stats.wpm} WPM · x{stats.maxCombo} combo
              {isBest && <span className="text-violet-300"> · new best</span>}
            </p>
          </div>
          <IconButton label="Home" onClick={onExit}>
            <Home className="h-5 w-5" />
          </IconButton>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={stats.accuracy}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Accuracy"
        >
          <div
            className="glow-bar h-full rounded-full bg-gradient-to-r from-[#8b7cf6] to-[#5b8cff]"
            style={{ width: `${stats.accuracy}%` }}
          />
        </div>
        <RhythmGraph intervals={intervals} />
        <div className="flex items-center justify-center gap-3">
          <IconButton label="Replay" onClick={onReplay}>
            <RotateCcw className="h-5 w-5" />
          </IconButton>
          <IconButton label="New prompt" onClick={onNew}>
            <Shuffle className="h-5 w-5" />
          </IconButton>
          <IconButton label={copied ? "Copied" : "Copy result"} onClick={share}>
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </IconButton>
        </div>
      </div>
    </Modal>
  );
}
