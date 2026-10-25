import AnkiExport, { type ExportOptions } from "anki-apkg-export";
import type { SqlJsStatic } from "sql.js";
import {
  isClozeCard,
  parseDeckJson,
  resolveDeckName,
} from "./deck-schema";
import { formatBasicBack } from "./format-card-back";

export function sanitizeApkgFilename(name: string): string {
  const base = name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .replace(/\s+/g, " ")
    .slice(0, 120);
  return `${base || "deck"}.apkg`;
}

type CreateExporter = (
  deckName: string,
  options?: Omit<ExportOptions, "sql">,
) => Promise<AnkiExport>;

export async function generateApkg(
  input: unknown,
  createExporter: CreateExporter,
): Promise<{
  bytes: Uint8Array;
  deckName: string;
  filename: string;
}> {
  const data = parseDeckJson(input);
  const deckName = resolveDeckName(data);
  const hasCloze = data.cards.some(isClozeCard);
  const hasBasic = data.cards.some((c) => !isClozeCard(c));

  const apkg =
    hasCloze && hasBasic
      ? await createExporter(deckName)
      : await createExporter(deckName, {
          kind: hasCloze ? "cloze" : "basic",
        });

  for (const card of data.cards) {
    if (isClozeCard(card)) {
      apkg.addCloze(card.text, card.extra ?? "", {
        tags: card.tags,
        deck: card.deck,
        noteId: card.noteId,
      });
    } else {
      const back = formatBasicBack(
        card.back,
        card.explanation,
        card.example,
      );
      apkg.addCard(card.front, back, {
        tags: card.tags,
        deck: card.deck,
        noteId: card.noteId,
      });
    }
  }

  const bytes = await apkg.save({ type: "uint8array" });
  apkg.close();
  return { bytes, deckName, filename: sanitizeApkgFilename(deckName) };
}

export type { SqlJsStatic };
