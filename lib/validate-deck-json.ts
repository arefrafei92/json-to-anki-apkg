import {
  deckJsonSchema,
  formatZodError,
  resolveDeckName,
  type DeckJson,
} from "./deck-schema";

export type DeckValidationResult =
  | {
      ok: true;
      data: DeckJson;
      deckName: string;
      cardCount: number;
    }
  | {
      ok: false;
      errors: string[];
      stage: "syntax" | "schema" | "deck";
    };

export function parseJsonText(text: string): {
  ok: true;
  value: unknown;
} | {
  ok: false;
  error: string;
} {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste deck JSON or upload a .json file." };
  }

  try {
    return { ok: true, value: JSON.parse(trimmed) };
  } catch (e) {
    const message =
      e instanceof SyntaxError ? e.message : "Could not parse JSON.";
    return {
      ok: false,
      error: `Invalid JSON syntax: ${message}`,
    };
  }
}

export function validateDeckJsonValue(value: unknown): DeckValidationResult {
  const parsed = deckJsonSchema.safeParse(value);
  if (!parsed.success) {
    return {
      ok: false,
      stage: "schema",
      errors: formatZodError(parsed.error)
        .split("\n")
        .filter(Boolean),
    };
  }

  try {
    const deckName = resolveDeckName(parsed.data);
    return {
      ok: true,
      data: parsed.data,
      deckName,
      cardCount: parsed.data.cards.length,
    };
  } catch (e) {
    return {
      ok: false,
      stage: "deck",
      errors: [
        e instanceof Error
          ? e.message
          : 'JSON must include "deckName", "name", or "deck".',
      ],
    };
  }
}

export function validateDeckJsonText(text: string): DeckValidationResult {
  const json = parseJsonText(text);
  if (!json.ok) {
    return { ok: false, stage: "syntax", errors: [json.error] };
  }

  if (json.value === null || typeof json.value !== "object" || Array.isArray(json.value)) {
    return {
      ok: false,
      stage: "schema",
      errors: ["Root value must be a JSON object with deck metadata and a cards array."],
    };
  }

  return validateDeckJsonValue(json.value);
}
