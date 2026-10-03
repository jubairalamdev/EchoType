"use client";

// Orb loader (Uiverse by andrew-manzyk, recolored violet/blue).
// Full-screen overlay for async work, replacing the lattice loader.
export function OrbLoader({ text = "Tuning the synth…" }: { text?: string }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-[#07070f]/80 backdrop-blur-sm"
      role="status"
      aria-label={text}
    >
      <div className="orb-loader">
        <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <mask id="orb-clipping">
              <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
              <polygon points="25,25 75,25 50,75" fill="white"></polygon>
              <polygon points="50,25 75,75 25,75" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
            </mask>
          </defs>
        </svg>
        <div className="orb-box"></div>
      </div>
      <p className="text-sm text-zinc-400">{text}</p>
    </div>
  );
}
