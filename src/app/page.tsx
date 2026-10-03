"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TrackSelect } from "@/features/landing/components/TrackSelect";
import { ModeSelect } from "@/features/landing/components/ModeSelect";
import { GameScreen } from "@/features/game/components/GameScreen";
import { ResultModal } from "@/features/results/components/ResultModal";
import type { TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import { randomQuote } from "@/data/quotes";
import { randomSnippet } from "@/data/codeSnippets";
import type { GameStats } from "@/lib/metrics";
import { appendHistory, maybeSaveBest } from "@/lib/storage";

function promptFor(mode: GameMode): string {
  if (mode === "quote") return randomQuote().text;
  if (mode === "code") return randomSnippet().text;
  return "";
}

export default function Home() {
  const [track, setTrack] = useState<TrackId>("lofi");
  const [mode, setMode] = useState<GameMode>("quote");
  const [started, setStarted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [runId, setRunId] = useState(0);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [intervals, setIntervals] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isBest, setIsBest] = useState(false);

  const start = () => {
    setPrompt(promptFor(mode));
    setStats(null);
    setIntervals([]);
    setModalOpen(false);
    setStarted(true);
  };

  // Task 27: finish -> stats -> persist best + history -> modal.
  const handleFinish = useCallback(
    (s: GameStats, iv: number[]) => {
      setStats(s);
      setIntervals(iv);
      const best = maybeSaveBest({ ...s, mode, track, date: new Date().toISOString() });
      appendHistory({ ...s, mode, track, date: new Date().toISOString() });
      setIsBest(best);
      setModalOpen(true);
    },
    [mode, track]
  );

  // Task 28: replay / new prompt / exit.
  const replay = () => {
    setModalOpen(false);
    setStats(null);
    setRunId((n) => n + 1);
    window.scrollTo({ top: 0 });
  };
  const newPrompt = () => {
    setPrompt(promptFor(mode));
    setModalOpen(false);
    setStats(null);
    setRunId((n) => n + 1);
    window.scrollTo({ top: 0 });
  };
  const exit = () => {
    setModalOpen(false);
    setStarted(false);
  };

  if (!started) {
    return (
      <AnimatePresence mode="wait">
      <motion.main
        key="landing"
        id="main"
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
      >
        <header className="text-center">
          <Badge>cyberpunk lo-fi typing synth</Badge>
          <h1 className="mt-4 text-5xl font-bold tracking-tight glow-cyan">EchoType</h1>
          <p className="mt-2 text-zinc-400">Type to make music. Every key is a note.</p>
        </header>
        <section className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500">1 · Pick a track</h2>
          <TrackSelect value={track} onChange={setTrack} />
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500">2 · Pick a mode</h2>
          <ModeSelect value={mode} onChange={setMode} />
        </section>
        <Button onClick={start} className="mx-auto w-48 py-3 text-base">
          Start performance
        </Button>
      </motion.main>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
    <motion.main
      key={`playing-${runId}`}
      id="main"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <GameScreen
        key={`${runId}-${prompt}`}
        track={track}
        mode={mode}
        prompt={prompt}
        onExit={exit}
        onFinish={handleFinish}
      />
      <ResultModal
        open={modalOpen}
        stats={stats}
        intervals={intervals}
        track={track}
        mode={mode}
        isBest={isBest}
        onReplay={replay}
        onNew={newPrompt}
        onExit={exit}
      />
    </motion.main>
    </AnimatePresence>
  );
}
