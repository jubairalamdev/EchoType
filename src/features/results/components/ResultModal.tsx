"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { RhythmGraph } from "@/features/results/components/RhythmGraph";
import type { GameStats } from "@/lib/metrics";
import type { TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import { TRACKS } from "@/audio/tracks";
import { MODE_META } from "@/data/tracksMeta";

// Task 26: vinyl/soundwave summary card with copy-text share (no PNG V1).
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
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">encore</p>
          <h2 className="text-2xl font-bold glow-cyan">Performance complete</h2>
          {isBest && <p className="mt-1 text-sm text-amber-200">New personal best!</p>}
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-black/40 p-3">
            <div className="text-2xl font-bold text-cyan-300">{stats.wpm}</div>
            <div className="text-xs text-zinc-500">WPM</div>
          </div>
          <div className="rounded-xl bg-black/40 p-3">
            <div className="text-2xl font-bold text-zinc-100">{stats.accuracy}%</div>
            <div className="text-xs text-zinc-500">accuracy</div>
          </div>
          <div className="rounded-xl bg-black/40 p-3">
            <div className="text-2xl font-bold text-[#ff7ac8]">x{stats.maxCombo}</div>
            <div className="text-xs text-zinc-500">combo</div>
          </div>
        </div>
        <RhythmGraph intervals={intervals} />
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={onReplay}>Replay</Button>
          <Button variant="ghost" onClick={onNew}>New prompt</Button>
          <Button variant="ghost" onClick={share}>{copied ? "Copied!" : "Copy result"}</Button>
          <Button variant="ghost" onClick={onExit}>Exit</Button>
        </div>
      </div>
    </Modal>
  );
}
