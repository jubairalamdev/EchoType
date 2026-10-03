"use client";

import { useEffect, useRef } from "react";

// Dot-field backdrop in the spirit of ReactBits Dot Field:
// violet/blue dot grid that brightens around the pointer.
export function DotField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const px = { x: -9999, y: -9999 };
    const tx = { x: -9999, y: -9999 };
    const SPACING = 26;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      tx.x = e.clientX * dpr;
      tx.y = e.clientY * dpr;
    };
    window.addEventListener("pointermove", onMove);

    const draw = () => {
      px.x += (tx.x - px.x) * 0.12;
      px.y += (tx.y - px.y) * 0.12;
      ctx.clearRect(0, 0, w, h);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const R = 130 * dpr;
      for (let gy = SPACING / 2; gy * dpr < h + SPACING; gy += SPACING) {
        for (let gx = SPACING / 2; gx * dpr < w + SPACING; gx += SPACING) {
          const x = gx * dpr;
          const y = gy * dpr;
          const dx = x - px.x;
          const dy = y - px.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - d / R);
          const r = (1.1 + near * 1.8) * dpr;
          const violet = near > 0.02;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = violet
            ? `rgba(139,124,246,${0.25 + near * 0.65})`
            : "rgba(139,124,246,0.16)";
          ctx.fill();
        }
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };
    if (reduceMotion) {
      draw();
    } else {
      const loop = () => {
        draw();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 -z-10 ${className}`}
      aria-hidden="true"
    />
  );
}
