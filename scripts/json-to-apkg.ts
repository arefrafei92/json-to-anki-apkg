#!/usr/bin/env node
/**
 * Convert a JSON deck definition to an Anki .apkg file.
 *
 * Usage:
 *   npm run json-to-apkg -- deck.json
 *   npm run json-to-apkg -- deck.json -o my-deck.apkg
 *   cat deck.json | npm run json-to-apkg -- -
 */

import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { buildApkgFromJson } from "../lib/build-apkg";

const help = `json-to-apkg — build an Anki .apkg from JSON

Usage:
  npm run json-to-apkg -- <input.json> [-o output.apkg]
  cat deck.json | npm run json-to-apkg -- -

JSON shape:
  {
    "deckName": "My deck",
    "cards": [
      { "front": "Question", "back": "Answer", "tags": ["tag1"] },
      { "type": "cloze", "text": "The {{c1::answer}} is here." }
    ]
  }

Use "name" instead of "deckName" if you prefer.
`;

async function readInput(pathArg: string | undefined): Promise<string> {
  if (pathArg === "-" || !pathArg) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf8");
  }
  return readFile(resolve(pathArg), "utf8");
}

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  let output: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      return { help: true as const };
    }
    if (arg === "-o" || arg === "--output") {
      output = argv[++i];
      continue;
    }
    positional.push(arg);
  }
  return { input: positional[0], output };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if ("help" in args && args.help) {
    console.log(help);
    return;
  }
  if (!("input" in args) || (!args.input && process.stdin.isTTY)) {
    console.log(help);
    process.exit(1);
  }

  const raw = await readInput(args.input);
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Invalid JSON:", message);
    process.exit(1);
  }

  try {
    const { bytes, filename } = await buildApkgFromJson(json);
    const outPath = resolve(
      args.output ??
        (args.input && args.input !== "-"
          ? basename(args.input).replace(/\.json$/i, "") + ".apkg"
          : filename),
    );
    await writeFile(outPath, bytes);
    console.log(`Wrote ${outPath} (${bytes.byteLength} bytes)`);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(message);
    process.exit(1);
  }
}

main();
