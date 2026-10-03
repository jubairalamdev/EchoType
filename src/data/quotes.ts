import data from "@/data/data.json";

export interface Quote {
  id: string;
  text: string;
  author: string;
  difficulty: "easy" | "medium" | "hard";
}

function difficultyOf(text: string): Quote["difficulty"] {
  if (text.length < 60) return "easy";
  if (text.length < 140) return "medium";
  return "hard";
}

// Single source of truth: data.json (sentences + paragraphs).
export const QUOTES: Quote[] = (data as { id: string; kind: string; text: string; source: string }[])
  .filter((p) => p.kind !== "code")
  .map((p) => ({ id: p.id, text: p.text, author: p.source, difficulty: difficultyOf(p.text) }));

let lastIdx = -1;

export function randomQuote(): Quote {
  const idx = (() => {
    if (QUOTES.length < 2) return 0;
    let i = Math.floor(Math.random() * QUOTES.length);
    let guard = 0;
    while (i === lastIdx && guard < 8) {
      i = Math.floor(Math.random() * QUOTES.length);
      guard++;
    }
    return i;
  })();
  lastIdx = idx;
  return QUOTES[idx];
}
