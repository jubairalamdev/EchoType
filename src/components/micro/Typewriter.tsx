"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

// Cycling type-and-erase headline. All state updates happen inside timeout
// callbacks (never synchronously in the effect body). Static first phrase
// when the user prefers reduced motion.
export function Typewriter({
  phrases = ["EchoType", "Type your tone", "Beat your speed"],
  className,
  typeMs = 90,
  eraseMs = 45,
  holdMs = 1600,
}: {
  phrases?: string[];
  className?: string;
  typeMs?: number;
  eraseMs?: number;
  holdMs?: number;
}) {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let cancelled = false;
    let timer = 0;
    let phrase = 0;
    let chars = phrases[0]?.length ?? 0;
    let deleting = true;

    const tick = () => {
      if (cancelled) return;
      const full = phrases[phrase] ?? "";
      if (!deleting) {
        chars += 1;
        setText(full.slice(0, chars));
        if (chars >= full.length) {
          deleting = true;
          timer = window.setTimeout(tick, holdMs);
        } else {
          timer = window.setTimeout(tick, typeMs);
        }
      } else {
        chars -= 1;
        setText(full.slice(0, Math.max(0, chars)));
        if (chars <= 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = window.setTimeout(tick, 400);
        } else {
          timer = window.setTimeout(tick, eraseMs);
        }
      }
    };

    timer = window.setTimeout(tick, holdMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className={cn("inline-flex items-baseline justify-center", className)}>
      <span>{text}</span>
      <span className="animate-pulse text-violet-300" aria-hidden="true">
        |
      </span>
    </span>
  );
}
