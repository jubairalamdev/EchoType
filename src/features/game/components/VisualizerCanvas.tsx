"use client";

import { useEffect, useRef } from "react";
import { getAudioEngine } from "@/audio/AudioEngine";

// Task 22: background canvas — analyser waveform + pulse particles.
// Respects prefers-reduced-motion (waveform only, no particles).
export function VisualizerCanvas({ pulse }: { pulse: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef(pulse);

  useEffect(() => {
    pulseRef.current = pulse;
  }, [pulse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
      h = canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
    };
    resize();
    window.addEventListener("resize", resize);

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      hue: number;
    }
    let parts: P[] = [];
    let lastPulse = pulseRef.current;
    const data = new Uint8Array(128);

    const spawn = () => {
      for (let i = 0; i < 6; i++) {
        parts.push({
          x: Math.random() * w,
          y: h * (0.4 + Math.random() * 0.5),
          vx: (Math.random() - 0.5) * 1.6,
          vy: -(0.6 + Math.random() * 1.8),
          life: 1,
          hue: Math.random() < 0.6 ? 250 : 220,
        });
      }
      parts = parts.slice(-220);
    };

    const draw = () => {
      if (pulseRef.current !== lastPulse) {
        lastPulse = pulseRef.current;
        if (!reduceMotion) spawn();
      }
      ctx.clearRect(0, 0, w, h);

      // Waveform from analyser
      const analyser = getAudioEngine().getAnalyser();
      if (analyser) {
        analyser.getByteTimeDomainData(data);
        ctx.beginPath();
        const step = w / data.length;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          const x = i * step;
          const y = h * 0.72 + v * h * 0.2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(139,124,246,0.55)";
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.stroke();
      }

      if (!reduceMotion) {
        for (const p of parts) {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.012;
          if (p.life <= 0) continue;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2 * devicePixelRatio * p.life, 0, Math.PI * 2);
          ctx.fillStyle =
            p.hue > 235
              ? `rgba(139,124,246,${0.7 * p.life})`
              : `rgba(91,140,255,${0.7 * p.life})`;
          ctx.fill();
        }
        parts = parts.filter((p) => p.life > 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}
