import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { sharedDecks } from "../lib/shared-decks";
import { validateDeckJsonText } from "../lib/validate-deck-json";

const publicDir = path.join(process.cwd(), "public");
const deckDir = path.join(publicDir, "shared-decks");

async function main() {
  const problems: string[] = [];
  const listed = new Set<string>();

  for (const deck of sharedDecks) {
    const filePath = path.join(publicDir, deck.file);
    listed.add(path.basename(filePath));
    let text: string;
    try {
      text = await readFile(filePath, "utf8");
    } catch {
      problems.push(`${deck.id}: missing file ${deck.file}`);
      continue;
    }
    const result = validateDeckJsonText(text);
    if (!result.ok) {
      problems.push(`${deck.id}: ${result.errors.join("; ")}`);
    } else if (result.cardCount !== deck.cards) {
      problems.push(
        `${deck.id}: lib/shared-decks.ts says ${deck.cards} cards, file has ${result.cardCount}`,
      );
    } else {
      console.log(`ok  ${deck.id} (${result.cardCount} cards)`);
    }
  }

  for (const name of await readdir(deckDir)) {
    if (name.endsWith(".json") && !listed.has(name)) {
      problems.push(`public/shared-decks/${name} is not listed in lib/shared-decks.ts`);
    }
  }

  if (problems.length > 0) {
    console.error(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
    process.exit(1);
  }
  const total = sharedDecks.reduce((sum, d) => sum + d.cards, 0);
  console.log(`\n${sharedDecks.length} decks, ${total} cards`);
}

void main();
