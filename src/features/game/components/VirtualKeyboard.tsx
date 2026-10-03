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
                  "flex h-9 w-9 items-center justify-center rounded-md border font-mono text-sm",
                  active
                    ? "border-cyan-400 bg-cyan-400/20 text-cyan-200 glow-box-cyan"
                    : "border-white/10 bg-white/[0.03] text-zinc-400",
                  isErr && "border-[#ff2fb3] bg-[#ff2fb3]/20 text-[#ff7ac8]"
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
