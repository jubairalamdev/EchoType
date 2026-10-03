"use client";

// Task 25: SVG rhythm graph from inter-keystroke ms intervals.
export function RhythmGraph({ intervals }: { intervals: number[] }) {
  if (intervals.length === 0) {
    return <p className="text-xs text-zinc-500">No rhythm data yet — play to record flow.</p>;
  }
  const W = 400;
  const H = 90;
  const max = Math.max(...intervals, 500);
  const pts = intervals
    .map((v, i) => {
      const x = (i / Math.max(1, intervals.length - 1)) * W;
      const y = H - 8 - (Math.min(v, max) / max) * (H - 20);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const avgY = H - 8 - (Math.min(avg, max) / max) * (H - 20);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-black/40" role="img" aria-label="Typing rhythm graph">
        <line x1={0} y1={avgY} x2={W} y2={avgY} stroke="rgba(255,47,179,0.5)" strokeDasharray="4 4" />
        <polyline points={pts} fill="none" stroke="rgba(34,211,238,0.9)" strokeWidth="2" />
      </svg>
      <p className="mt-1 text-xs text-zinc-500">avg gap {Math.round(avg)}ms · lower = steadier flow</p>
    </div>
  );
}
