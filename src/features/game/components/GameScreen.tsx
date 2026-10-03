"use client";

import { useEffect, useMemo, useRef } from "react";
import { getAudioEngine } from "@/audio/AudioEngine";
import { TRACKS, type TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import { useTypingEngine } from "@/features/game/hooks/useTypingEngine";
import { useRhythmTracker } from "@/features/game/hooks/useRhythmTracker";
import { buildStats, calcAccuracy, calcWPM, type GameStats } from "@/lib/metrics";
import { Button } from "@/components/ui/Button";
import { HUD } from "@/features/game/components/HUD";
import { TypeArea } from "@/features/game/components/TypeArea";

// Task 19: container owning the session. TypeArea/Keyboard/Canvas/Settings
// land in Tasks 20-23; placeholders keep the build green meanwhile.
export function GameScreen({
  track,
  mode,
  prompt,
  onExit,
  onFinish,
}: {
  track: TrackId;
  mode: GameMode;
  prompt: string;
  onExit: () => void;
  onFinish: (stats: GameStats, intervals: number[]) => void;
}) {
  const freeform = mode === "free";
  const rhythm = useRhythmTracker();
  const finishedRef = useRef(false);

  const engine = useTypingEngine({
    prompt,
    freeform,
    onCorrect: (k) => getAudioEngine().playNote(k),
    onError: (k) => getAudioEngine().playError(),
    onTap: () => rhythm.tap(),
  });

  useEffect(() => {
    getAudioEngine().resume();
    getAudioEngine().setPatch(TRACKS[track]);
  }, [track]);

  const wpm = useMemo(
    () => calcWPM(engine.correctChars, engine.elapsedMs),
    [engine.correctChars, engine.elapsedMs]
  );
  const accuracy = useMemo(
    () => calcAccuracy(engine.correctPresses, engine.totalKeys),
    [engine.correctPresses, engine.totalKeys]
  );

  useEffect(() => {
    if (engine.isComplete && !finishedRef.current) {
      finishedRef.current = true;
      onFinish(
        buildStats({
          correctChars: engine.correctChars,
          correctPresses: engine.correctPresses,
          totalKeys: engine.totalKeys,
          maxCombo: engine.maxCombo,
          elapsedMs: engine.elapsedMs,
        }),
        rhythm.intervals
      );
    }
  }, [engine.isComplete, engine.correctChars, engine.correctPresses, engine.totalKeys, engine.maxCombo, engine.elapsedMs, onFinish, rhythm.intervals]);

  const finishFreeform = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish(
      buildStats({
        correctChars: engine.correctChars,
        correctPresses: engine.correctPresses,
        totalKeys: engine.totalKeys,
        maxCombo: engine.maxCombo,
        elapsedMs: engine.elapsedMs,
      }),
      rhythm.intervals
    );
  };

  return (
    <div className="relative flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        <HUD wpm={wpm} accuracy={accuracy} combo={engine.combo} track={track} mode={mode} />
        <Button variant="ghost" onClick={onExit} className="ml-auto shrink-0">
          Exit
        </Button>
      </div>
      <TypeArea
        prompt={prompt}
        typed={engine.typed}
        freeform={freeform}
        onPressKey={(ch) => engine.pressKey(ch)}
        onBackspace={() => engine.handleBackspace()}
      />
      <div data-testid="keyboard-slot" className="text-xs text-zinc-500">
        VirtualKeyboard lands in Task 21 · last key: {engine.lastKey || "—"}
      </div>
      {freeform && (
        <Button onClick={finishFreeform} className="w-48">
          Finish jam
        </Button>
      )}
    </div>
  );
}
