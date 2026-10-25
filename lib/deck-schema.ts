import { z } from "zod";

const basicCardSchema = z.object({
  type: z.literal("basic").optional(),
  front: z.string().min(1, "Card front cannot be empty"),
  back: z.string().min(1, "Card back cannot be empty"),
  explanation: z.string().optional(),
  example: z.string().optional(),
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

const cardSchema = z
  .union([basicCardSchema, clozeCardSchema])
  .superRefine((card, ctx) => {
    if (
      "type" in card &&
      card.type !== "cloze" &&
      card.type !== "basic" &&
      card.type !== undefined
    ) {
      ctx.addIssue({
        code: "custom",
        message: 'Card type must be "basic" or "cloze".',
        path: ["type"],
      });
    }
    if (!("type" in card && card.type === "cloze")) {
      if (!("front" in card) || !("back" in card)) {
        ctx.addIssue({
          code: "custom",
          message: "Basic cards require front and back fields.",
          path: ["front"],
        });
      }
    }
  });

export const deckJsonSchema = z
  .object({
    deckName: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    deck: z.string().min(1).optional(),
    description: z.string().optional(),
    cards: z.array(cardSchema).min(1, "At least one card is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.deckName && !data.name && !data.deck) {
      ctx.addIssue({
        code: "custom",
        message: 'Include "deckName", "name", or "deck" for the deck title.',
        path: ["deck"],
      });
    }
  });

export type DeckJson = z.infer<typeof deckJsonSchema>;
export type BasicCard = z.infer<typeof basicCardSchema>;
export type ClozeCard = z.infer<typeof clozeCardSchema>;

export function resolveDeckName(data: DeckJson): string {
  const name = data.deckName ?? data.name ?? data.deck;
  if (!name) {
    throw new Error('JSON must include "deckName", "name", or "deck"');
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

export function isClozeCard(
  card: DeckJson["cards"][number],
): card is ClozeCard {
  return "type" in card && card.type === "cloze";
}

export function isBasicCard(
  card: DeckJson["cards"][number],
): card is BasicCard {
  return !isClozeCard(card);
}
