"use client";

import { useEffect, useMemo, useRef } from "react";
import { getAudioEngine } from "@/audio/AudioEngine";
import { TRACKS, type TrackId } from "@/audio/tracks";
import type { GameMode } from "@/data/tracksMeta";
import { useTypingEngine } from "@/features/game/hooks/useTypingEngine";
import { useRhythmTracker } from "@/features/game/hooks/useRhythmTracker";
import { buildStats, calcAccuracy, calcWPM, type GameStats } from "@/lib/metrics";
import { Check, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { HUD } from "@/features/game/components/HUD";
import { TypeArea } from "@/features/game/components/TypeArea";
import { VirtualKeyboard } from "@/features/game/components/VirtualKeyboard";
import { SettingsBar } from "@/features/settings/components/SettingsBar";

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
    onError: () => getAudioEngine().playError(),
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

  const progress = freeform ? 0 : prompt.length > 0 ? engine.index / prompt.length : 0;

  return (
    <div className="relative flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        <HUD
          wpm={wpm}
          accuracy={accuracy}
          combo={engine.combo}
          progress={progress}
          track={track}
          mode={mode}
        />
        <IconButton label="Home" onClick={onExit}>
          <Home className="h-5 w-5" />
        </IconButton>
      </div>
      <SettingsBar />
      <TypeArea
        prompt={prompt}
        typed={engine.typed}
        freeform={freeform}
        errorNonce={engine.errorNonce}
        onPressKey={(ch) => engine.pressKey(ch)}
        onBackspace={() => engine.handleBackspace()}
      />
      <VirtualKeyboard
        activeKey={engine.lastKey}
        errorKey={engine.lastError}
        errorNonce={engine.errorNonce}
      />
      {freeform && (
        <Button onClick={finishFreeform} className="w-48">
          <Check className="h-4 w-4" aria-hidden="true" />
          Finish jam
        </Button>
      )}
    </div>
  );
}
