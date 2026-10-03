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

    let w = 0;
    let h = 0;
    const SPACING = 26;

    const render = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.clearRect(0, 0, w, h);
      for (let gy = SPACING / 2; gy * dpr < h + SPACING; gy += SPACING) {
        for (let gx = SPACING / 2; gx * dpr < w + SPACING; gx += SPACING) {
          ctx.beginPath();
          ctx.arc(gx * dpr, gy * dpr, 1.1 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(139,124,246,0.16)";
          ctx.fill();
        }
      }
    };
    // Static grid: no pointer tracking, no animation loop.
    render();
    window.addEventListener("resize", render);

    return () => {
      window.removeEventListener("resize", render);
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
