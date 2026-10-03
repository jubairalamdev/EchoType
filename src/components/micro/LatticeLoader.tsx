"use client";

// Lattice loader in the spirit of ReactBits Lattice Loader.
// Full-screen overlay for async work (backend calls later, session prep now).
const CELLS = 35;

export function LatticeLoader({ text = "Tuning the synth…" }: { text?: string }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-[#07070f]/80 backdrop-blur-sm"
      role="status"
      aria-label={text}
    >
      <div className="grid grid-cols-7 gap-2" aria-hidden="true">
        {Array.from({ length: CELLS }).map((_, i) => {
          const row = Math.floor(i / 7);
          const col = i % 7;
          return (
            <span
              key={i}
              className="lattice-cell h-3 w-3 rounded-[4px] bg-gradient-to-br from-[#8b7cf6] to-[#5b8cff]"
              style={{ animationDelay: `${(row + col) * 0.09}s` }}
            />
          );
        })}
      </div>
      <p className="text-sm text-zinc-400">{text}</p>
    </div>
  );
}
