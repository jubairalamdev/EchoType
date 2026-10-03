// Task 7: A-natural-minor key -> frequency map (2 octaves).
// Home row = low octave, top row = high octave. Non-letters fall back
// to a deterministic hash so every key still sounds musical.

// A3 to A5, A natural minor: A B C D E F G
const LOW_OCTAVE = [
  220.0, // A3
  246.94, // B3
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.0, // G4
  440.0, // A4
];

const HIGH_OCTAVE = [
  493.88, // B4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.0, // A5
];

const KEY_TO_FREQ: Record<string, number> = {
  // home row -> low octave
  a: LOW_OCTAVE[0],
  s: LOW_OCTAVE[1],
  d: LOW_OCTAVE[2],
  f: LOW_OCTAVE[3],
  g: LOW_OCTAVE[4],
  h: LOW_OCTAVE[5],
  j: LOW_OCTAVE[6],
  k: LOW_OCTAVE[7],
  // top row -> high octave
  q: HIGH_OCTAVE[0],
  w: HIGH_OCTAVE[1],
  e: HIGH_OCTAVE[2],
  r: HIGH_OCTAVE[3],
  t: HIGH_OCTAVE[4],
  y: HIGH_OCTAVE[5],
  u: HIGH_OCTAVE[6],
};

export function freqForKey(key: string): number {
  const lower = key.toLowerCase();
  if (KEY_TO_FREQ[lower] !== undefined) return KEY_TO_FREQ[lower];
  // Deterministic fallback inside minor-ish range (220-880Hz)
  const code = lower.charCodeAt(0) || 0;
  return 300 + ((code * 37) % 560);
}
