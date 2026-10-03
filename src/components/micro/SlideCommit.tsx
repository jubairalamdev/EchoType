"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

// Slide-to-commit pill in the spirit of ReactBits Slide Commit:
// drag the knob to the end to confirm. Springs back if released early.
export function SlideCommit({
  label = "Slide to start",
  onCommit,
  disabled = false,
}: {
  label?: string;
  onCommit: () => void;
  disabled?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);
  const x = useMotionValue(0);
  const dragState = useRef({ startX: 0, baseX: 0 });

  const fillWidth = useTransform(x, (v) => v + 28);
  const labelOpacity = useTransform(x, [0, Math.max(1, max * 0.6)], [1, 0]);

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      setMax(Math.max(0, el.clientWidth - 64));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const commitRef = useRef(onCommit);
  useEffect(() => {
    commitRef.current = onCommit;
  }, [onCommit]);

  const endDrag = useCallback(() => {
    setDragging(false);
    if (done) return;
    if (x.get() >= max * 0.9 && max > 0) {
      setDone(true);
      animate(x, max, { type: "spring", stiffness: 400, damping: 30 }).then(() => {
        commitRef.current();
        window.setTimeout(() => {
          setDone(false);
          animate(x, 0, { type: "spring", stiffness: 300, damping: 28 });
        }, 450);
      });
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 26 });
    }
  }, [done, max, x]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      const dx = e.clientX - dragState.current.startX;
      x.set(Math.min(max, Math.max(0, dragState.current.baseX + dx)));
    };
    const up = () => endDrag();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, endDrag, max, x]);

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-16 w-full max-w-sm touch-none overflow-hidden rounded-full border border-white/15 bg-white/[0.04] select-none",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8b7cf6]/40 to-[#5b8cff]/25"
        style={{ width: fillWidth }}
      />
      <motion.span
        className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium text-zinc-300"
        style={{ opacity: labelOpacity }}
      >
        {label}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <ChevronRight className="h-4 w-4 -ml-3 opacity-50" aria-hidden="true" />
      </motion.span>
      <motion.span
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={max > 0 ? Math.round((x.get() / max) * 100) : 0}
        className="glow-box-violet absolute top-1 left-1 flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-gradient-to-br from-[#8b7cf6] to-[#5b8cff] text-white active:cursor-grabbing"
        style={{ x }}
        onPointerDown={(e) => {
          if (disabled || done) return;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          dragState.current = { startX: e.clientX, baseX: x.get() };
          setDragging(true);
        }}
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </motion.span>
    </div>
  );
}
