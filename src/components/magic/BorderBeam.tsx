"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

// Traveling border beam in the spirit of Magic UI Border Beam:
// a soft gradient dot orbits the card's border via CSS offset-path.
// Pure CSS animation (no JS loop), masked so only the border ring shows.
export function BorderBeam({
  className,
  size = 120,
  duration = 6,
  delay = 0,
  borderWidth = 1.5,
  colorFrom = "#8b7cf6",
  colorTo = "#5b8cff",
  reverse = false,
}: {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  reverse?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
      style={{ border: `${borderWidth}px solid transparent` }}
    >
      <div
        className={cn("border-beam-dot absolute aspect-square", className)}
        style={
          {
            width: size,
            background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            animationDirection: reverse ? "reverse" : "normal",
            "--beam-duration": `${duration}s`,
            "--beam-delay": `${delay}s`,
          } as CSSProperties
        }
      />
    </div>
  );
}
