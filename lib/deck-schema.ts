import { z } from "zod";

const cardSchema = z.object({
  front: z.string().min(1, "Card front cannot be empty"),
  back: z.string().min(1, "Card back cannot be empty"),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  deck: z.string().optional(),
  noteId: z.union([z.string(), z.number()]).optional(),
});

const clozeCardSchema = z.object({
  type: z.literal("cloze"),
  text: z.string().min(1, "Cloze text cannot be empty"),
  extra: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  deck: z.string().optional(),
  noteId: z.union([z.string(), z.number()]).optional(),
});

export const deckJsonSchema = z.object({
  deckName: z.string().min(1, "deckName is required").optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  cards: z
    .array(z.union([cardSchema, clozeCardSchema]))
    .min(1, "At least one card is required"),
});

export type DeckJson = z.infer<typeof deckJsonSchema>;
export type BasicCard = z.infer<typeof cardSchema>;
export type ClozeCard = z.infer<typeof clozeCardSchema>;

export function resolveDeckName(data: DeckJson): string {
  const name = data.deckName ?? data.name;
  if (!name) {
    throw new Error('JSON must include "deckName" or "name"');
  }
  return name;
}

export function parseDeckJson(input: unknown): DeckJson {
  return deckJsonSchema.parse(input);
}

export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join("\n");
}
