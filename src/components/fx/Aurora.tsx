"use client";

import { useEffect, useRef } from "react";

// Aurora backdrop in the spirit of ReactBits Aurora
// (same props: colorStops, amplitude, blend, speed), drawn with raw WebGL
// so no extra dependency is needed.
export function Aurora({
  colorStops = ["#8b7cf6", "#5b8cff", "#3b2d8f"],
  amplitude = 1.0,
  blend = 0.6,
  speed = 0.6,
  className = "",
}: {
  colorStops?: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optsRef = useRef({ colorStops, amplitude, blend, speed });

  useEffect(() => {
    optsRef.current = { colorStops, amplitude, blend, speed };
  }, [colorStops, amplitude, blend, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false });
    if (!gl) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hex = (s: string): [number, number, number] => {
      const n = parseInt(s.replace("#", ""), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    };

    const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
    const fs = `
      precision highp float;
      uniform vec2 uRes;
      uniform float uTime;
      uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2;
      uniform float uAmp; uniform float uBlend;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
        return v;
      }
      void main(){
        vec2 uv = gl_FragCoord.xy / uRes;
        float t = uTime;
        float warp = fbm(vec2(uv.x * 3.0 + t * 0.12, t * 0.08));
        float y = uv.y + (warp - 0.5) * 0.55 * uAmp;
        float b0 = smoothstep(0.85, 0.0, abs(y - 0.32)) * (0.4 + 0.6 * fbm(uv * 4.0 + vec2(t * 0.18, 0.0)));
        float b1 = smoothstep(0.85, 0.0, abs(y - 0.55)) * (0.4 + 0.6 * fbm(uv * 4.0 + vec2(-t * 0.14, t * 0.1)));
        float glow = pow(fbm(uv * 2.0 - t * 0.04), 2.0) * 0.5;
        vec3 base = vec3(0.027, 0.027, 0.059);
        vec3 col = base + (uC0 * b0 + uC1 * b1 + uC2 * glow) * uBlend;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uC0 = u("uC0");
    const uC1 = u("uC1");
    const uC2 = u("uC2");
    const uAmp = u("uAmp");
    const uBlend = u("uBlend");

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const frame = () => {
      const o = optsRef.current;
      const c0 = hex(o.colorStops[0]);
      const c1 = hex(o.colorStops[1]);
      const c2 = hex(o.colorStops[2]);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, ((performance.now() - start) / 1000) * o.speed);
      gl.uniform3f(uC0, c0[0], c0[1], c0[2]);
      gl.uniform3f(uC1, c1[0], c1[1], c1[2]);
      gl.uniform3f(uC2, c2[0], c2[1], c2[2]);
      gl.uniform1f(uAmp, o.amplitude);
      gl.uniform1f(uBlend, o.blend);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduceMotion) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
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
