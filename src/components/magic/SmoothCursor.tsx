"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Spring-trailing cursor in the spirit of Magic UI Smooth Cursor.
// White dot + lagging ring, native cursor hidden on fine pointers only.
export function SmoothCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    document.documentElement.classList.add("smooth-cursor");
    const move = (e: MouseEvent) => {
      // Event-driven: same-value sets bail out, no render loop.
      setEnabled(true);
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHot(!!t?.closest("a,button,input,[role='slider'],[role='radio']"));
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("smooth-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[200] h-2.5 w-2.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, marginLeft: -5, marginTop: -5 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[200] h-8 w-8 rounded-full border border-white/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, marginLeft: -16, marginTop: -16 }}
        animate={{ scale: hot ? 1.7 : 1, opacity: hot ? 0.9 : 0.6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </>
  );
}
