import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HAIKU_LINES = [
  "cursor blinks at three",
  "a lone breakpoint waits for dawn",
  "it was my typo",
];

const EXPECTED_SYLLABLES = [5, 7, 5];
const MAX_CHARS = 200;

function countSyllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.endsWith("e")) w = w.slice(0, -1);
  if (w.length === 0) return 1;
  const groups = w.match(/[aeiouy]+/g);
  return groups ? groups.length : 1;
}

function validateHaiku(lines) {
  if (lines.length !== 3) {
    throw new Error("haiku must have exactly 3 lines, got " + lines.length);
  }
  lines.forEach((line, i) => {
    if (line.trim().length === 0) {
      throw new Error("line " + (i + 1) + " is empty");
    }
    const count = line
      .split(/\s+/)
      .reduce((sum, word) => sum + countSyllables(word), 0);
    if (count !== EXPECTED_SYLLABLES[i]) {
      throw new Error(
        "line " + (i + 1) + " has " + count + " syllables, expected " + EXPECTED_SYLLABLES[i]
      );
    }
  });
  const text = lines.join("\n");
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error("haiku must be 1-200 characters, got " + text.length);
  }
  return text;
}

const haiku = validateHaiku(HAIKU_LINES);
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), haiku + "\n");
console.log(haiku);
console.log("wrote " + join(outDir, "entry.txt") + " (" + haiku.length + " chars)");
