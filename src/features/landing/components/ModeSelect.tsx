"use client";

import { motion } from "framer-motion";
import { Check, Code, Music, Quote } from "lucide-react";
import { MODE_META, type GameMode } from "@/data/tracksMeta";
import { BorderBeam } from "@/components/magic/BorderBeam";
import { cn } from "@/lib/cn";

const ORDER: { id: GameMode; Icon: typeof Music }[] = [
  { id: "free", Icon: Music },
  { id: "quote", Icon: Quote },
  { id: "code", Icon: Code },
];

export function ModeSelect({
  value,
  onChange,
}: {
  value: GameMode;
  onChange: (m: GameMode) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Typing mode">
      {ORDER.map(({ id, Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={cn(
              "relative flex items-center gap-3 rounded-[28px] border p-4 text-left transition-colors",
              active
                ? "border-violet-300/40 bg-violet-400/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/25"
            )}
          >
            {active && (
              <BorderBeam duration={6} size={120} colorFrom="#8b7cf6" colorTo="#5b8cff" />
            )}
            {active && (
              <motion.span
                layoutId="mode-selected-arrow"
                className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#8b7cf6] to-[#5b8cff] text-white shadow-[0_0_16px_rgb(139_124_246/0.6)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.span>
            )}
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                active ? "bg-gradient-to-br from-[#8b7cf6] to-[#5b8cff] text-white" : "bg-white/5 text-violet-200"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-zinc-100">{MODE_META[id].name}</span>
              <span className="block text-xs text-zinc-500">{MODE_META[id].hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
