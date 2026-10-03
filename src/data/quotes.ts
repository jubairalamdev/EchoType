export interface Quote {
  id: string;
  text: string;
  author: string;
  difficulty: "easy" | "medium" | "hard";
}

export const QUOTES: Quote[] = [
  { id: "q01", text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", difficulty: "easy" },
  { id: "q02", text: "Code is like humor. When you have to explain it, it is bad.", author: "Cory House", difficulty: "easy" },
  { id: "q03", text: "First, solve the problem. Then, write the code.", author: "John Johnson", difficulty: "easy" },
  { id: "q04", text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde", difficulty: "easy" },
  { id: "q05", text: "The best way out is always through.", author: "Robert Frost", difficulty: "easy" },
  { id: "q06", text: "What we think, we become.", author: "Buddha", difficulty: "easy" },
  { id: "q07", text: "Stay hungry, stay foolish.", author: "Stewart Brand", difficulty: "easy" },
  { id: "q08", text: "Programs must be written for people to read.", author: "Harold Abelson", difficulty: "medium" },
  { id: "q09", text: "Truth can only be found in one place: the code.", author: "Robert C. Martin", difficulty: "medium" },
  { id: "q10", text: "The function of good software is to make the complex appear simple.", author: "Grady Booch", difficulty: "medium" },
  { id: "q11", text: "Walking on water and developing software are easy if both are frozen.", author: "Edward Berard", difficulty: "medium" },
  { id: "q12", text: "It is not a bug, it is an undocumented feature.", author: "Anonymous", difficulty: "medium" },
  { id: "q13", text: "The neon city hums while your fingers learn to sing.", author: "EchoType", difficulty: "medium" },
  { id: "q14", text: "Every keystroke is a note, every sentence is a song waiting to be played.", author: "EchoType", difficulty: "medium" },
  { id: "q15", text: "Rhythm is the metronome of mastery; accuracy is its melody.", author: "EchoType", difficulty: "hard" },
  { id: "q16", text: "In the terminal glow, the patient typist becomes the performer.", author: "EchoType", difficulty: "hard" },
  { id: "q17", text: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan", difficulty: "hard" },
  { id: "q18", text: "Controlling complexity is the essence of computer programming.", author: "Brian Kernighan", difficulty: "hard" },
  { id: "q19", text: "The quieter you become, the more you can hear the music in the machine.", author: "EchoType", difficulty: "hard" },
  { id: "q20", text: "Type softly, listen closely, and the synth will answer every finger.", author: "EchoType", difficulty: "hard" },
];

export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
