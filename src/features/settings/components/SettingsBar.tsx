"use client";

import { useState } from "react";
import { getAudioEngine } from "@/audio/AudioEngine";
import { loadSettings, saveSettings, type Settings } from "@/lib/storage";

// Task 23: volume, mute, reduce-motion. Persists to LocalStorage.
export function SettingsBar() {
  const [s, setS] = useState<Settings>(() => {
    const loaded = loadSettings();
    getAudioEngine().setVolume(loaded.volume);
    getAudioEngine().setMuted(loaded.muted);
    return loaded;
  });

  const update = (patch: Partial<Settings>) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      getAudioEngine().setVolume(next.volume);
      getAudioEngine().setMuted(next.muted);
      return next;
    });
  };

  return (
    <div className="flex items-center gap-3 text-xs text-zinc-400">
      <label className="flex items-center gap-2">
        Vol
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={s.volume}
          onChange={(e) => update({ volume: Number(e.target.value) })}
          aria-label="Volume"
        />
      </label>
      <button
        className="rounded-full border border-white/15 px-3 py-1"
        onClick={() => update({ muted: !s.muted })}
        aria-pressed={s.muted}
      >
        {s.muted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}
