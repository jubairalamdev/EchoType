"use client";

import { useCallback, useRef, useState } from "react";

// Task 17: inter-keystroke intervals for the rhythm graph.
export function useRhythmTracker() {
  const lastRef = useRef<number | null>(null);
  const [intervals, setIntervals] = useState<number[]>([]);

  const tap = useCallback(() => {
    const now = performance.now();
    if (lastRef.current !== null) {
      const dt = now - lastRef.current;
      setIntervals((prev) => [...prev.slice(-119), Math.min(dt, 3000)]);
    }
    lastRef.current = now;
  }, []);

  const reset = useCallback(() => {
    lastRef.current = null;
    setIntervals([]);
  }, []);

  return { intervals, tap, reset };
}
