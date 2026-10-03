import data from "@/data/data.json";
import type { GameMode } from "@/data/tracksMeta";

export type PassageKind = "sentence" | "paragraph" | "code";

export interface Passage {
  id: string;
  kind: PassageKind;
  text: string;
  source: string;
}

const POOL = data as Passage[];

let lastId: string | null = null;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(pool: Passage[]): Passage {
  const fallback: Passage = {
    id: "fallback",
    kind: "sentence",
    text: "Keep typing and the melody will follow.",
    source: "EchoType",
  };
  if (pool.length === 0) return fallback;
  const shuffled = shuffle(pool);
  const next = shuffled.find((p) => p.id !== lastId) ?? shuffled[0];
  lastId = next.id;
  return next;
}

/** Random prompt text per mode. Freeform returns "" (open jam). */
export function randomPrompt(mode: GameMode): string {
  if (mode === "free") return "";
  if (mode === "code") return pick(POOL.filter((p) => p.kind === "code")).text;
  return pick(POOL.filter((p) => p.kind !== "code")).text;
}
