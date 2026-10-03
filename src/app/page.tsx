"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TrackSelect } from "@/features/landing/components/TrackSelect";
import { ModeSelect } from "@/features/landing/components/ModeSelect";
import { GameScreen } from "@/features/game/components/GameScreen";
import type { TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import { randomQuote } from "@/data/quotes";
import { randomSnippet } from "@/data/codeSnippets";
import type { GameStats } from "@/lib/metrics";

export default function Home() {
  const [track, setTrack] = useState<TrackId>("lofi");
  const [mode, setMode] = useState<GameMode>("quote");
  const [started, setStarted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [lastStats, setLastStats] = useState<GameStats | null>(null);

  const start = () => {
    const text =
      mode === "quote"
        ? randomQuote().text
        : mode === "code"
          ? randomSnippet().text
          : "";
    setPrompt(text);
    setLastStats(null);
    setStarted(true);
  };

  if (!started) {
    return (
      <motion.main
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
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
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <GameScreen
        track={track}
        mode={mode}
        prompt={prompt}
        onExit={() => setStarted(false)}
        onFinish={(stats) => setLastStats(stats)}
      />
      {lastStats && (
        <p className="text-sm text-zinc-400" aria-live="polite">
          Done: {lastStats.wpm} WPM · {lastStats.accuracy}% · x{lastStats.maxCombo} (ResultModal lands in Task 26)
        </p>
      )}
    </main>
  );
}
