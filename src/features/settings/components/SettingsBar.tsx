"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getAudioEngine } from "@/audio/AudioEngine";
import { loadSettings, saveSettings, type Settings } from "@/lib/storage";
import { IconButton } from "@/components/ui/IconButton";
import { WakeSlider } from "@/components/magic/WakeSlider";

// Volume as a wake bar + mute. Persists to LocalStorage.
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
      <Volume2 className="h-4 w-4 shrink-0 text-violet-300" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <WakeSlider
          value={Math.round(s.volume * 100)}
          onChange={(v) => update({ volume: v / 100 })}
          bars={24}
          height={40}
          restHeight={10}
          fillColor="#8b7cf6"
          trackColor="#23232f"
          crestColor="#5b8cff"
          ariaLabel="Volume"
          showValue
          formatValue={(v) => `${v}%`}
        />
      </div>
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
