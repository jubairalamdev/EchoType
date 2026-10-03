"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TrackSelect } from "@/features/landing/components/TrackSelect";
import { ModeSelect } from "@/features/landing/components/ModeSelect";
import type { TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import { randomQuote } from "@/data/quotes";
import { randomSnippet } from "@/data/codeSnippets";

export default function Home() {
  const [track, setTrack] = useState<TrackId>("lofi");
  const [mode, setMode] = useState<GameMode>("quote");
  const [started, setStarted] = useState(false);
  const [prompt, setPrompt] = useState("");

  const start = () => {
    const text =
      mode === "quote"
        ? randomQuote().text
        : mode === "code"
          ? randomSnippet().text
          : "";
    setPrompt(text);
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
      <p className="text-sm text-zinc-400">
        Track: {track} · Mode: {mode}
      </p>
      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 font-mono text-sm">
        {prompt || "Freeform jam — GameScreen lands in Task 19."}
      </p>
      <Button variant="ghost" onClick={() => setStarted(false)} className="w-40">
        Back
      </Button>
    </main>
  );
}
