"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface Ripple {
  id: number;
  char: string;
}

// Task 20: character diff render + floating key ripples.
// Task 24 (part): hidden input drives pressKey on mobile keyboards.
export function TypeArea({
  prompt,
  typed,
  freeform = false,
  onPressKey,
  onBackspace,
}: {
  prompt: string;
  typed: string;
  freeform?: boolean;
  onPressKey: (ch: string) => void;
  onBackspace: () => void;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLenRef = useRef(0);

  useEffect(() => {
    if (typed.length > prevLenRef.current) {
      const char = typed.slice(-1);
      const id = ++idRef.current;
      setRipples((r) => [...r.slice(-11), { id, char }]);
      const t = window.setTimeout(
        () => setRipples((r) => r.filter((x) => x.id !== id)),
        650
      );
      prevLenRef.current = typed.length;
      return () => window.clearTimeout(t);
    }
    prevLenRef.current = typed.length;
  }, [typed]);

  const text = freeform ? typed || " " : prompt;

  return (
    <div className="relative rounded-xl border border-white/10 bg-black/40 p-5">
      <div className="pointer-events-none absolute -top-3 right-4 flex gap-1" aria-hidden="true">
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="key-ripple text-lg font-bold text-cyan-300"
            initial={{ y: 6, opacity: 0.9, scale: 0.7 }}
            animate={{ y: -26, opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {r.char === " " ? "·" : r.char}
          </motion.span>
        ))}
      </div>
      <p className="font-mono text-lg leading-8" aria-label="Typing prompt">
        {text.split("").map((ch, i) => {
          const done = i < typed.length;
          const current = i === typed.length;
          return (
            <span
              key={i}
              className={cn(
                done && "text-cyan-300",
                !done && !current && "text-zinc-500",
                current && "typing-cursor bg-cyan-400/20 text-white"
              )}
            >
              {ch === " " ? " " : ch}
            </span>
          );
        })}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-zinc-300 sm:hidden"
          onClick={() => inputRef.current?.focus()}
        >
          Tap to open keyboard
        </button>
        <input
          ref={inputRef}
          className="h-0 w-0 opacity-0"
          aria-label="Mobile typing input"
          autoCapitalize="off"
          autoCorrect="off"
          value=""
          onChange={(e) => {
            const v = e.target.value;
            if (v.length === 0) {
              onBackspace();
            } else {
              onPressKey(v.slice(-1));
            }
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
