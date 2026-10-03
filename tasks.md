# EchoType — Task List

Stack locked: Next.js 16 App Router + React 19 + TS + Tailwind v4 + Framer Motion + Raw Web Audio + Raw Canvas + LocalStorage only. Feature-based structure.

Legend: `[ ]` todo, `[~]` in-progress, `[x]` done (:tick-mark:).

## Phase A — Setup
- [x] 1. Install `framer-motion, clsx, tailwind-merge`, verify `next dev` + `next build` passes
- [x] 2. Replace `src/app/globals.css` with dark `#0d1117` base + Tailwind v4 `@theme` neon tokens (cyan/magenta/amber) + glow utilities + cursor pulse keyframes
- [x] 3. Update `src/app/layout.tsx` metadata/title/fonts for EchoType
- [x] 4. Create folder skeleton `features/*, audio/*, components/ui/*, data/*, lib/*`
- [x] 5. Create reusable `components/ui/Button.tsx, Card.tsx, Modal.tsx, Badge.tsx`

## Phase B — Audio Engine (Raw Web Audio, A-minor)
- [x] 6. Implement `audio/AudioEngine.ts` singleton: lazy AudioContext, master gain, analyser, resume()
- [x] 7. Implement `audio/scales.ts`: A-minor 2-octave key->freq map + fallback hash
- [x] 8. Implement `playNote(key, trackPatch)` with envelope `0.12 -> 0.0001 / 0.4s`
- [x] 9. Implement `playError()` low thud + `setVolume/mute/setPatch()`
- [x] 10. Implement `audio/tracks.ts`: Lo-Fi / Synthwave / Ambient `{bpm, wave, filter, beatPattern}`
- [x] 11. Implement backing-beat step sequencer start/stop (or stub if deferred)

## Phase C — Data + Core Logic
- [x] 12. Seed `data/quotes.ts (20), data/codeSnippets.ts (15), data/tracksMeta.ts`
- [x] 13. Implement `lib/keyboard.ts`: normalize + ignore Shift/Ctrl/Alt
- [x] 14. Implement `lib/metrics.ts`: WPM, accuracy, combo (pure functions)
- [x] 15. Implement `lib/storage.ts`: `echotype:settings, echotype:best, echotype:history` localStorage helpers
- [x] 16. Implement `features/game/hooks/useTypingEngine.ts`: keydown, diff, timer, correct/error callbacks
- [x] 17. Implement `features/game/hooks/useRhythmTracker.ts`: inter-key ms array

## Phase D — Game UI
- [ ] 18. Build landing `TrackSelect.tsx + ModeSelect.tsx` wired in `src/app/page.tsx`
- [ ] 19. Build `features/game/components/GameScreen.tsx` container + `HUD.tsx` (live WPM/acc/combo)
- [ ] 20. Build `features/game/components/TypeArea.tsx`: char render (correct/current/error), ripples, floating notes
- [ ] 21. Build `features/game/components/VirtualKeyboard.tsx`: rows light up via Framer Motion, error shake
- [ ] 22. Build `features/game/components/VisualizerCanvas.tsx`: rAF particles + analyser wave + resize handling
- [ ] 23. Build `features/settings/components/SettingsBar.tsx`: volume, mute, patch select, reduce-motion
- [ ] 24. Handle mobile hidden-input fallback + focus management

## Phase E — Results
- [ ] 25. Build `features/results/components/RhythmGraph.tsx` SVG from rhythm data
- [ ] 26. Build `features/results/components/ResultModal.tsx` vinyl/soundwave card: WPM, acc, combo, graph, replay/share/copy
- [ ] 27. Wire completion flow: finish -> compute stats -> save best/history -> show modal
- [ ] 28. Wire replay (same prompt) + new prompt + back-to-landing

## Phase F — Polish + Ship
- [ ] 29. Add Framer Motion screen transitions landing<->play<->results
- [ ] 30. Accessibility: `prefers-reduced-motion`, focus rings, aria-live stats
- [ ] 31. Manual QA matrix: 3 tracks x 3 modes, fast typing, Backspace, blur, mute, mobile
- [ ] 32. `next build + lint` clean, README update, Vercel deploy check

## Open decisions (answer before build)
- [ ] Backing beats for MVP: full sequencer vs notes-only V1?
- [ ] Backspace counts as error or neutral? Timer pause on blur?
- [ ] Share = copy-text only or PNG export too?
- [ ] Single `page.tsx` state machine vs `/play` route for V1?
