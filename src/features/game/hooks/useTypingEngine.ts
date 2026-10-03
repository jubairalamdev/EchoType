"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isBackspace, normalizeGameKey } from "@/lib/keyboard";

// Task 16: core typing state machine.
// Backspace = neutral (pop, no penalty). Timer pauses on blur/hidden tab.
// Freeform: every key is correct, never auto-completes.

interface EngineOptions {
  prompt: string;
  freeform?: boolean;
  onCorrect?: (key: string) => void;
  onError?: (key: string) => void;
  onTap?: () => void;
}

export function useTypingEngine({ prompt, freeform = false, onCorrect, onError, onTap }: EngineOptions) {
  const [typed, setTyped] = useState("");
  const [totalKeys, setTotalKeys] = useState(0);
  const [correctPresses, setCorrectPresses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [lastKey, setLastKey] = useState("");
  const [lastError, setLastError] = useState("");
  const [errorNonce, setErrorNonce] = useState(0);

  const startRef = useRef<number | null>(null);
  const pausedMsRef = useRef(0);
  const pauseStartRef = useRef<number | null>(null);
  const typedRef = useRef("");
  typedRef.current = typed;

  const onCorrectRef = useRef(onCorrect);
  onCorrectRef.current = onCorrect;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onTapRef = useRef(onTap);
  onTapRef.current = onTap;
  const promptRef = useRef(prompt);
  promptRef.current = prompt;
  const freeformRef = useRef(freeform);
  freeformRef.current = freeform;

  const nowElapsed = useCallback(() => {
    if (startRef.current === null) return 0;
    const paused = pausedMsRef.current + (pauseStartRef.current !== null ? performance.now() - pauseStartRef.current : 0);
    return Math.max(0, performance.now() - startRef.current - paused);
  }, []);

  const ensureStarted = useCallback(() => {
    if (startRef.current === null) {
      startRef.current = performance.now();
      setElapsedMs(0);
    }
  }, []);

  const pressKey = useCallback(
    (char: string) => {
      if (char.length === 0) return;
      ensureStarted();
      onTapRef.current?.();
      setLastKey(char);
      const cur = typedRef.current;
      const p = promptRef.current;
      const free = freeformRef.current;

      if (free) {
        const next = cur + char;
        typedRef.current = next;
        setTyped(next);
        setTotalKeys((t) => t + 1);
        setCorrectPresses((c) => c + 1);
        setCombo((c) => {
          const n = c + 1;
          setMaxCombo((m) => Math.max(m, n));
          return n;
        });
        onCorrectRef.current?.(char);
        setElapsedMs(nowElapsed());
        return;
      }

      if (cur.length >= p.length) return;
      const expected = p[cur];
      setTotalKeys((t) => t + 1);
      if (char === expected) {
        const next = cur + char;
        typedRef.current = next;
        setTyped(next);
        setCorrectPresses((c) => c + 1);
        setCombo((c) => {
          const n = c + 1;
          setMaxCombo((m) => Math.max(m, n));
          return n;
        });
        onCorrectRef.current?.(char);
        if (next.length >= p.length) {
          setElapsedMs(nowElapsed());
          setIsComplete(true);
        }
      } else {
        setCombo(0);
        setLastError(char);
        setErrorNonce((n) => n + 1);
        onErrorRef.current?.(char);
      }
      setElapsedMs(nowElapsed());
    },
    [ensureStarted, nowElapsed]
  );

  const handleBackspace = useCallback(() => {
    const cur = typedRef.current;
    if (cur.length === 0) return;
    ensureStarted();
    const next = cur.slice(0, -1);
    typedRef.current = next;
    setTyped(next);
    setIsComplete(false);
  }, [ensureStarted]);

  const reset = useCallback(() => {
    typedRef.current = "";
    setTyped("");
    setTotalKeys(0);
    setCorrectPresses(0);
    setCombo(0);
    setMaxCombo(0);
    setElapsedMs(0);
    setIsComplete(false);
    setLastKey("");
    setLastError("");
    startRef.current = null;
    pausedMsRef.current = 0;
    pauseStartRef.current = null;
  }, []);

  // Reset when prompt changes.
  const promptKey = prompt;
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptKey]);

  // Global key listener (desktop). Mobile uses hidden input -> pressKey.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isBackspace(e.key)) {
        e.preventDefault();
        handleBackspace();
        return;
      }
      const ch = normalizeGameKey(e.key);
      if (ch === null) return;
      if (ch === "\n") {
        // Only consume Enter when prompt expects newline; else ignore.
        const cur = typedRef.current;
        if (!freeformRef.current && promptRef.current[cur.length] !== "\n") return;
      }
      e.preventDefault();
      pressKey(ch);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey, handleBackspace]);

  // Pause timer on blur / hidden tab.
  useEffect(() => {
    const pause = () => {
      if (startRef.current !== null && !isComplete && pauseStartRef.current === null) {
        pauseStartRef.current = performance.now();
      }
    };
    const resume = () => {
      if (pauseStartRef.current !== null) {
        pausedMsRef.current += performance.now() - pauseStartRef.current;
        pauseStartRef.current = null;
        setElapsedMs(nowElapsed());
      }
    };
    const onVis = () => {
      if (document.hidden) pause();
      else resume();
    };
    window.addEventListener("blur", pause);
    window.addEventListener("focus", resume);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("blur", pause);
      window.removeEventListener("focus", resume);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [isComplete, nowElapsed]);

  // Live elapsed tick.
  useEffect(() => {
    if (startRef.current === null || isComplete) return;
    const id = window.setInterval(() => setElapsedMs(nowElapsed()), 300);
    return () => window.clearInterval(id);
  }, [isComplete, totalKeys, nowElapsed]);

  return {
    typed,
    index: typed.length,
    correctChars: typed.length,
    totalKeys,
    correctPresses,
    combo,
    maxCombo,
    elapsedMs,
    isComplete,
    lastKey,
    lastError,
    errorNonce,
    pressKey,
    handleBackspace,
    reset,
  };
}
