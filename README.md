# EchoType — Type to Make Music

Cyberpunk Lo-Fi musical typing game. Every correct keystroke plays an
A-minor synth note with neon ripple feedback. Wrong keys thud and break combo.

## Stack
Next.js 16 App Router + React 19 + TypeScript + Tailwind v4 + Framer Motion.
Audio: raw Web Audio only. Visuals: raw Canvas only. State: LocalStorage only.

## Run
```bash
npm.cmd install
npm.cmd run dev   # http://localhost:3000
npm.cmd run lint
npm.cmd run build
```

## Play
1. Pick a track: Lo-Fi Chill, Synthwave Groove, Ambient Drone.
2. Pick a mode: Freeform Jam (no mistakes), Quote Challenge, Code Snippet.
3. Type. Correct keys sing, errors thud, combo builds.
4. Encore modal shows WPM, accuracy, max combo, rhythm graph, best badge.
5. Replay same prompt, roll a new prompt, copy result text, or exit.

## Rules
- Backspace is neutral (pop one char, no penalty).
- Timer pauses on blur / hidden tab.
- Freeform never auto-completes — press Finish jam.

## Structure
- `src/app/` — `layout.tsx`, `page.tsx` (landing <-> play state machine)
- `src/features/landing|game|results|settings/` — feature UI + hooks
- `src/audio/` — `AudioEngine`, `scales`, `tracks`, `sequencer` stub
- `src/components/ui/` — Button, Card, Badge, Modal
- `src/data/` — quotes, code snippets, track/mode meta
- `src/lib/` — `cn`, `keyboard`, `metrics`, `storage`

## Test
See `QA.md` matrix, then `tasks.md` for the full 32-task history.
Deploys anywhere Next.js runs (Vercel recommended).
