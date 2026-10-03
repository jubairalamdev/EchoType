export interface CodeSnippet {
  id: string;
  title: string;
  language: "javascript" | "typescript";
  text: string;
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  { id: "c01", title: "Add", language: "javascript", text: "const add = (a, b) => a + b;" },
  { id: "c02", title: "Loop", language: "javascript", text: "for (let i = 0; i < 8; i++) play(i);" },
  { id: "c03", title: "Map", language: "javascript", text: "const xs = [1, 2, 3].map(n => n * 2);" },
  { id: "c04", title: "Fetch", language: "javascript", text: "const r = await fetch(url).then(x => x.json());" },
  { id: "c05", title: "Filter", language: "javascript", text: "const evens = nums.filter(n => n % 2 === 0);" },
  { id: "c06", title: "Oscillator", language: "javascript", text: "const o = ctx.createOscillator(); o.start();" },
  { id: "c07", title: "Gain envelope", language: "typescript", text: "gain.gain.setValueAtTime(0.12, t);" },
  { id: "c08", title: "Type guard", language: "typescript", text: "function isStr(x: unknown): x is string {" },
  { id: "c09", title: "Interface", language: "typescript", text: "interface Note { freq: number; t: number; }" },
  { id: "c10", title: "Await beat", language: "typescript", text: "async function beat(track: TrackId) {" },
  { id: "c11", title: "Clamp", language: "javascript", text: "const clamp = (v, lo, hi) => Math.min(hi, v);" },
  { id: "c12", title: "Debounce", language: "javascript", text: "clearTimeout(t); t = setTimeout(fn, 120);" },
  { id: "c13", title: "Scale map", language: "typescript", text: "const f: Record<string, number> = {};" },
  { id: "c14", title: "Canvas loop", language: "javascript", text: "requestAnimationFrame(draw); // groove" },
  { id: "c15", title: "Combo", language: "typescript", text: "combo = ok ? combo + 1 : 0; // keep flow" },
];

export function randomSnippet(): CodeSnippet {
  return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
}
