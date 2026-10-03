"use client";

import { freqForKey } from "@/audio/scales";

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

  // Task 8: pitch-shifted pluck, 0.4s decay envelope.
  playNote(key: string) {
    const ctx = this.ensureCtx();
    const master = this.getMaster();
    if (!ctx || !master || key.length === 0) return;
    if (ctx.state === "suspended") void ctx.resume();

    const freq = freqForKey(key);
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = this.patch.wave;
    osc.frequency.setValueAtTime(freq, t);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(this.patch.filterFreq, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Task 9: muted low thud for wrong keys (breaks combo feel).
  playError() {
    const ctx = this.ensureCtx();
    const master = this.getMaster();
    if (!ctx || !master) return;
    if (ctx.state === "suspended") void ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.15);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

    osc.connect(gain);
    gain.connect(master);

    osc.start(t);
    osc.stop(t + 0.16);
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
