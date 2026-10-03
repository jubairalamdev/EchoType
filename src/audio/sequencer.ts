import type { TrackId } from "@/audio/tracks";

// Task 11 (deferred): backing-beat sequencer stub.
// V1 ships notes-only per open decision. Interface is fixed so Phase D
// can call startBeat/stopBeat without changes when the sequencer lands.

export interface BeatHandle {
  stop: () => void;
}

export function startBeat(track: TrackId): BeatHandle {
  // TODO(Phase B+): lookahead step sequencer (kick/hat/pad via oscillators).
  void track;
  return { stop: () => {} };
}
