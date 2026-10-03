"use client";

import { MODE_META, type GameMode } from "@/data/tracksMeta";
import { cn } from "@/lib/cn";

const ORDER: GameMode[] = ["free", "quote", "code"];

export function ModeSelect({
  value,
  onChange,
}: {
  value: GameMode;
  onChange: (m: GameMode) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Typing mode">
      {ORDER.map((m) => {
        const active = value === m;
        return (
          <button
            key={m}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all",
              active
                ? "border-[#ff2fb3] bg-[#ff2fb3]/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/25"
            )}
          >
            <div className="text-sm font-semibold text-zinc-100">{MODE_META[m].name}</div>
            <div className="mt-1 text-xs text-zinc-400">{MODE_META[m].hint}</div>
          </button>
        );
      })}
    </div>
  );
}
