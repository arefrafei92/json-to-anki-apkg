import AnkiExport from "anki-apkg-export";
import { generateApkg } from "./generate-apkg";
import { basePath } from "./site-path";

export async function buildApkgInBrowser(input: unknown) {
  const wasmUrl = `${basePath}/sql-wasm.wasm`;
  return generateApkg(input, (deckName, options = {}) =>
    AnkiExport.create(deckName, {
      ...options,
      locateFile: () => wasmUrl,
    }),
  );
}
