"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

// Task 21: visual keyboard — lights up active key, shakes on error.
const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

export function VirtualKeyboard({
  activeKey,
  errorKey,
  errorNonce,
}: {
  activeKey: string;
  errorKey: string;
  errorNonce: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5" aria-hidden="true">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1.5">
          {row.map((k) => {
            const active = activeKey.toLowerCase() === k;
            const isErr = errorKey.toLowerCase() === k && errorNonce > 0;
            return (
              <motion.span
                key={k}
                animate={
                  isErr
                    ? { x: [0, -4, 4, -3, 3, 0] }
                    : active
                      ? { scale: [1, 1.25, 1] }
                      : { scale: 1, x: 0 }
                }
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border font-mono text-sm",
                  active
                    ? "border-violet-400 bg-violet-400/20 text-violet-100 glow-box-violet"
                    : "border-white/10 bg-white/[0.03] text-zinc-400",
                  isErr && "border-rose-400 bg-rose-400/20 text-rose-200"
                )}
              >
                {k}
              </motion.span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
