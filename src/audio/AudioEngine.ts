"use client";

// Task 6: Singleton wrapper around Web Audio.
// Lazy AudioContext (autoplay policy), master gain + analyser for VisualizerCanvas.

export interface TrackPatch {
  wave: OscillatorType;
  filterFreq: number;
}

const DEFAULT_PATCH: TrackPatch = { wave: "triangle", filterFreq: 2400 };

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private patch: TrackPatch = DEFAULT_PATCH;
  private volume = 0.8;
  private muted = false;

  private ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.master.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  resume() {
    const ctx = this.ensureCtx();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }

  getAnalyser(): AnalyserNode | null {
    this.ensureCtx();
    return this.analyserNode;
  }

  setVolume(v: number) {
    this.volume = Math.min(1, Math.max(0, v));
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        this.muted ? 0 : this.volume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        m ? 0 : this.volume,
        this.ctx.currentTime,
        0.02
      );
    }
  }

  setPatch(patch: TrackPatch) {
    this.patch = patch;
  }

  protected getContext(): AudioContext | null {
    return this.ensureCtx();
  }

  protected getMaster(): GainNode | null {
    this.ensureCtx();
    return this.master;
  }

  protected getPatch(): TrackPatch {
    return this.patch;
  }

  dispose() {
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.master = null;
      this.analyserNode = null;
    }
  }
}

let instance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!instance) instance = new AudioEngine();
  return instance;
}

export type { AudioEngine };
