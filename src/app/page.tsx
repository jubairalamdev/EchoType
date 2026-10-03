"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Aurora } from "@/components/fx/Aurora";
import { SlideCommit } from "@/components/micro/SlideCommit";
import { LatticeLoader } from "@/components/micro/LatticeLoader";
import { pushToast } from "@/components/micro/SwipeToast";
import { TrackSelect } from "@/features/landing/components/TrackSelect";
import { ModeSelect } from "@/features/landing/components/ModeSelect";
import { GameScreen } from "@/features/game/components/GameScreen";
import { ResultModal } from "@/features/results/components/ResultModal";
import { getAudioEngine } from "@/audio/AudioEngine";
import type { TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import { randomPrompt } from "@/data/passages";
import type { GameStats } from "@/lib/metrics";
import { appendHistory, loadBest, maybeSaveBest } from "@/lib/storage";
import { cn } from "@/lib/cn";

type Step = 0 | 1 | 2;

const STEP_LABELS = ["Welcome", "Track", "Mode"];

function StepDots({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "h-2 rounded-full transition-all",
            i === step ? "w-8 bg-gradient-to-r from-[#8b7cf6] to-[#5b8cff]" : "w-2 bg-white/15"
          )}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>(0);
  const [track, setTrack] = useState<TrackId>("lofi");
  const [mode, setMode] = useState<GameMode>("quote");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [runId, setRunId] = useState(0);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [intervals, setIntervals] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isBest, setIsBest] = useState(false);

  const begin = () => {
    setLoading(true);
    // Prep while the loader plays: warm the audio engine, then deal a prompt.
    getAudioEngine().resume();
    const text = randomPrompt(mode);
    window.setTimeout(() => {
      setPrompt(text);
      setStats(null);
      setIntervals([]);
      setModalOpen(false);
      setLoading(false);
      setStarted(true);
    }, 650);
  };

  // Finish -> stats -> persist best + history -> modal.
  const handleFinish = useCallback(
    (s: GameStats, iv: number[]) => {
      setStats(s);
      setIntervals(iv);
      const best = maybeSaveBest({ ...s, mode, track, date: new Date().toISOString() });
      appendHistory({ ...s, mode, track, date: new Date().toISOString() });
      setIsBest(best);
      if (best) pushToast("New personal best");
      setModalOpen(true);
    },
    [mode, track]
  );

  const replay = () => {
    setModalOpen(false);
    setStats(null);
    setRunId((n) => n + 1);
    window.scrollTo({ top: 0 });
  };
  const newPrompt = () => {
    setPrompt(randomPrompt(mode));
    setModalOpen(false);
    setStats(null);
    setRunId((n) => n + 1);
    window.scrollTo({ top: 0 });
  };
  const exit = () => {
    setModalOpen(false);
    setStarted(false);
    setStep(0);
  };

  if (!started) {
    const best = loadBest();
    return (
      <motion.main
        id="main"
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <StepDots step={step} />
        <p className="text-center text-xs uppercase tracking-widest text-zinc-500" aria-live="polite">
          Step {step + 1} of 3 · {STEP_LABELS[step]}
        </p>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section
              key="step-welcome"
              className="flex flex-col items-center gap-6 text-center"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <Badge>
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                cyberpunk lo-fi typing synth
              </Badge>
              <h1 className="text-6xl font-bold tracking-tight glow-violet">EchoType</h1>
              <p className="max-w-md text-zinc-400">
                Type to make music. Every key is a note — pick a track, pick a
                mode, and play the song with your fingers.
              </p>
              {best && (
                <p className="text-sm text-violet-300">
                  Personal best: {best.wpm} WPM · {best.accuracy}%
                </p>
              )}
              <Button onClick={() => setStep(1)} className="w-48 py-3 text-base">
                Next
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </motion.section>
          )}
          {step === 1 && (
            <motion.section
              key="step-track"
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-center text-2xl font-bold">Pick your frequency</h2>
              <TrackSelect value={track} onChange={setTrack} />
              <div className="flex items-center justify-between">
                <IconButton label="Back" onClick={() => setStep(0)}>
                  <ArrowLeft className="h-5 w-5" />
                </IconButton>
                <Button onClick={() => setStep(2)} className="w-48">
                  Next
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </motion.section>
          )}
          {step === 2 && (
            <motion.section
              key="step-mode"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-center text-2xl font-bold">Choose your mode</h2>
              <div className="w-full">
                <ModeSelect value={mode} onChange={setMode} />
              </div>
              <SlideCommit label="Slide to start" onCommit={begin} />
              <div className="flex w-full items-center">
                <IconButton label="Back" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-5 w-5" />
                </IconButton>
                <span className="mx-auto hidden items-center gap-2 text-xs text-zinc-500 sm:inline-flex">
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  {track} · {mode}
                </span>
                <span className="w-11" aria-hidden="true" />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {loading && <LatticeLoader text="Tuning the synth…" />}
      </motion.main>
    );
  }

  return (
    <>
      <Aurora colorStops={["#8b7cf6", "#5b8cff", "#3b2d8f"]} amplitude={1} blend={0.55} speed={0.6} />
      <motion.main
        id="main"
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
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
    </>
  );
}
