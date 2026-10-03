// Task 13: key normalization — ignore modifiers, accept printable + space/enter.

const IGNORED = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "Tab",
  "Escape",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Insert",
  "Delete",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
]);

export function isBackspace(key: string): boolean {
  return key === "Backspace";
}

/** Printable game key: single char, space, or Enter (as newline). */
export function normalizeGameKey(key: string): string | null {
  if (isBackspace(key)) return null;
  if (key === "Enter") return "\n";
  if (key === " ") return " ";
  if (key.length === 1) return key;
  if (IGNORED.has(key)) return null;
  return null;
}
