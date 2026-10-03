"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getAudioEngine } from "@/audio/AudioEngine";
import { loadSettings, saveSettings, type Settings } from "@/lib/storage";
import { IconButton } from "@/components/ui/IconButton";

// Volume + mute. Persists to LocalStorage.
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
      <Volume2 className="h-4 w-4 text-violet-300" aria-hidden="true" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={s.volume}
        onChange={(e) => update({ volume: Number(e.target.value) })}
        aria-label="Volume"
        className="accent-violet-400"
      />
      <IconButton
        label={s.muted ? "Unmute" : "Mute"}
        onClick={() => update({ muted: !s.muted })}
        className="h-9 w-9"
      >
        {s.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </IconButton>
    </div>
  );
}
