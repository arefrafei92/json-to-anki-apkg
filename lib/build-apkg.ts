import AnkiExport from "anki-apkg-export";
import { generateApkg } from "./generate-apkg";
import { getSqlJs } from "./sql-js";

export async function buildApkgFromJson(input: unknown) {
  return generateApkg(input, async (deckName, options = {}) => {
    const sql = await getSqlJs();
    return AnkiExport.create(deckName, { ...options, sql });
  });
}
