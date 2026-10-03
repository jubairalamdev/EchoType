"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowUp, Keyboard } from "lucide-react";
import { cn } from "@/lib/cn";

interface Ripple {
  id: number;
  char: string;
}

// Ticker prompt: the next letter stays centered, upcoming letters slide in
// from the right, typed letters fade out to the left. Newlines show as ⏎.
export function TypeArea({
  prompt,
  typed,
  freeform = false,
  errorNonce = 0,
  onPressKey,
  onBackspace,
}: {
  prompt: string;
  typed: string;
  freeform?: boolean;
  errorNonce?: number;
  onPressKey: (ch: string) => void;
  onBackspace: () => void;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLenRef = useRef(0);
  const shake = useAnimation();

  // Wrong-key shake via animation controls (effect -> external sync, lint-clean).
  useEffect(() => {
    if (errorNonce === 0) return;
    shake.start({ x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.3 } });
  }, [errorNonce, shake]);

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

  const raw = freeform ? typed : prompt;
  const index = Math.min(typed.length, raw.length);
  const display = (ch: string) => {
    if (ch === "\n") return "⏎";
    if (ch === " ") return " ";
    return ch;
  };

  return (
    <div
      className="relative min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-black/40"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="pointer-events-none absolute -top-1 right-6 flex gap-1" aria-hidden="true">
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="key-ripple text-lg font-bold text-violet-300"
            initial={{ y: 6, opacity: 0.9, scale: 0.7 }}
            animate={{ y: -26, opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {r.char === " " ? "·" : r.char}
          </motion.span>
        ))}
      </div>

      <div className="relative overflow-hidden py-6" aria-label="Typing prompt">
        {/* edge fades: typed letters dissolve left, upcoming emerge right */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black/90 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black/90 to-transparent"
          aria-hidden="true"
        />
        {/* center caret glow (kept) + up arrow marking the letter */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-9 w-px -translate-x-1/2 -translate-y-1/2 bg-violet-300/70"
          aria-hidden="true"
        />
        <motion.span
          className="pointer-events-none absolute bottom-1 left-1/2 z-10 -translate-x-1/2 text-violet-300 drop-shadow-[0_0_8px_rgb(139_124_246/0.8)]"
          aria-hidden="true"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowUp className="h-4 w-4" />
        </motion.span>
        {raw.length === 0 ? (
          <p className="px-6 text-center font-mono text-lg text-zinc-500">
            Start typing — every key sings.
          </p>
        ) : (
          <div
            className="flex w-max font-mono text-2xl leading-10 transition-transform duration-150 ease-out"
            style={{ paddingLeft: "50%", transform: `translateX(calc(-${index}ch - 0.5ch))` }}
          >
            {raw.split("").map((ch, i) => {
              const done = i < typed.length;
              const current = i === typed.length;
              if (current) {
                return (
                  <motion.span
                    key={i}
                    animate={shake}
                    className="whitespace-pre text-white"
                  >
                    {display(ch)}
                  </motion.span>
                );
              }
              return (
                <span
                  key={i}
                  className={cn("whitespace-pre", done ? "text-violet-200/70" : "text-zinc-500")}
                >
                  {display(ch)}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 px-5 pb-4">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-zinc-300 sm:hidden"
          onClick={() => inputRef.current?.focus()}
        >
          <Keyboard className="h-4 w-4" aria-hidden="true" />
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
