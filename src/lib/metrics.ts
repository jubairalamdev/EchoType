// Task 14: pure scoring helpers — testable, no React.

export interface GameStats {
  wpm: number;
  accuracy: number;
  maxCombo: number;
  correctChars: number;
  totalKeys: number;
  elapsedMs: number;
}

/** Standard WPM: (correct chars / 5) / minutes. */
export function calcWPM(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || correctChars <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(correctChars / 5 / minutes);
}

export function calcAccuracy(correctPresses: number, totalPresses: number): number {
  if (totalPresses <= 0) return 100;
  return Math.round((correctPresses / totalPresses) * 100);
}

export function buildStats(args: {
  correctChars: number;
  correctPresses: number;
  totalKeys: number;
  maxCombo: number;
  elapsedMs: number;
}): GameStats {
  return {
    wpm: calcWPM(args.correctChars, args.elapsedMs),
    accuracy: calcAccuracy(args.correctPresses, args.totalKeys),
    maxCombo: args.maxCombo,
    correctChars: args.correctChars,
    totalKeys: args.totalKeys,
    elapsedMs: args.elapsedMs,
  };
}
