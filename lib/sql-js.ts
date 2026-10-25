import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import initSqlJs, { type SqlJsStatic } from "sql.js";

let sqlModule: Promise<SqlJsStatic> | undefined;

async function loadWasmBinary(): Promise<Uint8Array> {
  const candidates = [
    join(process.cwd(), "node_modules/sql.js/dist/sql-wasm.wasm"),
    join(process.cwd(), "node_modules/anki-apkg-export/dist/sql-wasm.wasm"),
  ];
  for (const path of candidates) {
    try {
      await access(path);
      const bytes = await readFile(/* turbopackIgnore: true */ path);
      return new Uint8Array(bytes);
    } catch {
      // try next path
    }
  }
  throw new Error(
    "Could not find sql-wasm.wasm. Run npm install and try again.",
  );
}

/** Initialize sql.js from disk so Next.js does not break WASM resolution. */
export function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlModule) {
    sqlModule = (async () => {
      const wasmBytes = await loadWasmBinary();
      const wasmBinary = wasmBytes.buffer.slice(
        wasmBytes.byteOffset,
        wasmBytes.byteOffset + wasmBytes.byteLength,
      ) as ArrayBuffer;
      return initSqlJs({ wasmBinary });
    })();
  }
  return sqlModule;
}
