# EchoType QA Matrix (Task 31)

Run `npm run dev`, open http://localhost:3000, and check each row.
Mark `[x]` when verified locally.

## Tracks x Modes (9 combos)
- [ ] Lo-Fi x Freeform — notes play, Finish jam opens modal
- [ ] Lo-Fi x Quote — correct advances, wrong thuds, combo resets
- [ ] Lo-Fi x Code — symbols (`=`, `>`, `;`, `{`) advance correctly
- [ ] Synthwave x Freeform / Quote / Code (same 3 checks)
- [ ] Ambient x Freeform / Quote / Code (same 3 checks)

## Core behavior
- [ ] First keystroke resumes AudioContext (sound audible, no console error)
- [ ] Backspace pops one char, does not count as error
- [ ] Blur / tab-hide pauses timer (WPM stable across a 5s blur)
- [ ] Combo increments on streak, `maxCombo` correct in modal
- [ ] WPM = 0 before start, sane value after ~10 correct chars
- [ ] Mute silences notes + thud; volume slider changes loudness
- [ ] Best persists after reload (`localStorage echotype:best`)
- [ ] History keeps last 20 (`echotype:history`)
- [ ] Copy result writes `EchoType encore: …` to clipboard

## UI / Motion / Mobile
- [ ] Landing -> play -> modal transitions animate (no flash)
- [ ] VirtualKeyboard highlights last key, shakes on error
- [ ] Canvas waveform moves while typing; particles spawn per key
- [ ] `prefers-reduced-motion`: particles off, waveform still draws
- [ ] Mobile: Tap to open keyboard focuses hidden input, keys register
- [ ] Skip link appears on Tab, jumps to #main

## Ship gates
- [ ] `npm run lint` clean
- [ ] `npm run build` clean
