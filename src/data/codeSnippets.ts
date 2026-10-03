import data from "@/data/data.json";

export interface CodeSnippet {
  id: string;
  title: string;
  language: "javascript" | "typescript";
  text: string;
}

// Single source of truth: data.json (code kind).
export const CODE_SNIPPETS: CodeSnippet[] = (data as { id: string; kind: string; text: string; source: string }[])
  .filter((p) => p.kind === "code")
  .map((p) => ({
    id: p.id,
    title: p.source,
    language: p.source.endsWith(".ts") ? "typescript" : "javascript",
    text: p.text,
  }));

let lastIdx = -1;

export function randomSnippet(): CodeSnippet {
  const idx = (() => {
    if (CODE_SNIPPETS.length < 2) return 0;
    let i = Math.floor(Math.random() * CODE_SNIPPETS.length);
    let guard = 0;
    while (i === lastIdx && guard < 8) {
      i = Math.floor(Math.random() * CODE_SNIPPETS.length);
      guard++;
    }
    return i;
  })();
  lastIdx = idx;
  return CODE_SNIPPETS[idx];
}
