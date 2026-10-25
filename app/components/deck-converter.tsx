"use client";

import { buildApkgInBrowser } from "@/lib/build-apkg-browser";
import { withBasePath } from "@/lib/site-path";
import {
  validateDeckJsonText,
  type DeckValidationResult,
} from "@/lib/validate-deck-json";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_JSON = `{
  "deckName": "My deck",
  "cards": [
    {
      "front": "Question",
      "back": "Answer"
    }
  ]
}`;

type Status = "idle" | "validating" | "building" | "error";

function validationMessage(result: DeckValidationResult | null): string | null {
  if (!result || result.ok) return null;
  return result.errors.join("\n");
}

export function DeckConverter() {
  const [jsonText, setJsonText] = useState(DEFAULT_JSON);
  const [status, setStatus] = useState<Status>("idle");
  const [uploadName, setUploadName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [debouncedJson, setDebouncedJson] = useState(jsonText);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedJson(jsonText), 350);
    return () => window.clearTimeout(timer);
  }, [jsonText]);

  const validation = useMemo(
    () => validateDeckJsonText(debouncedJson),
    [debouncedJson],
  );

  const isDirty = jsonText !== debouncedJson;
  const isValid = validation.ok && !isDirty;
  const validationError = isDirty ? null : validationMessage(validation);

  const lineCount = useMemo(() => jsonText.split("\n").length, [jsonText]);

  const loadExample = useCallback(async (path: string) => {
    setStatus("idle");
    setUploadName(null);
    setUploadError(null);
    try {
      const res = await fetch(withBasePath(path));
      if (!res.ok) throw new Error("Could not load sample");
      setJsonText(await res.text());
    } catch (e) {
      setUploadError(
        e instanceof Error ? e.message : "Failed to load sample",
      );
    }
  }, []);

  const onFilePick = useCallback(async (file: File | null) => {
    if (!file) return;
    setUploadError(null);
    setUploadName(file.name);

    const name = file.name.toLowerCase();
    if (!name.endsWith(".json")) {
      setUploadError("Please choose a .json file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("JSON file is too large (max 5 MB).");
      return;
    }

    setStatus("validating");
    try {
      const text = await file.text();
      setJsonText(text);
      setStatus("idle");
    } catch {
      setUploadError("Could not read that file.");
      setStatus("error");
    }
  }, []);

  const downloadApkg = useCallback(async () => {
    setStatus("building");
    const result = validateDeckJsonText(jsonText);
    if (!result.ok) {
      setStatus("error");
      return;
    }

    try {
      const { bytes, filename } = await buildApkgInBrowser(result.data);
      const blob = new Blob([bytes.slice()], {
        type: "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      console.error(e);
    }
  }, [jsonText]);

  const displayError = uploadError ?? validationError;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
          Anki deck builder
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          JSON to .apkg
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600">
          Paste or upload a <code className="text-sm">.json</code> deck file. We
          validate the format, then build an Anki package in your browser—nothing
          is uploaded to a server.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => loadExample("/examples/sample-deck.json")}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
        >
          Load sample JSON
        </button>
        <button
          type="button"
          onClick={() =>
            loadExample("/examples/english-at-work-java.json")
          }
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
        >
          Load Java workplace deck
        </button>
        <label className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50">
          Select .json file
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              void onFilePick(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {uploadName ? (
        <p className="text-sm text-zinc-600">
          File: <span className="font-medium text-zinc-900">{uploadName}</span>
        </p>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="deck-json" className="text-sm font-medium text-zinc-800">
            Deck JSON
          </label>
          <span className="text-xs text-zinc-500">{lineCount} lines</span>
        </div>
        <textarea
          id="deck-json"
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setUploadName(null);
            setUploadError(null);
            if (status === "error") setStatus("idle");
          }}
          spellCheck={false}
          aria-invalid={Boolean(displayError)}
          aria-describedby={displayError ? "deck-json-error" : "deck-json-hint"}
          className={`min-h-[320px] w-full resize-y rounded-xl border bg-zinc-50/80 p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-inner outline-none ring-emerald-600/30 focus:ring-2 ${
            displayError
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : isValid
                ? "border-emerald-300 focus:border-emerald-600"
                : "border-zinc-200 focus:border-emerald-600"
          }`}
        />
      </div>

      {isDirty ? (
        <p id="deck-json-hint" className="text-sm text-zinc-500">
          Checking format…
        </p>
      ) : isValid ? (
        <div
          id="deck-json-hint"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          Format looks good. Ready to build{" "}
          <span className="font-semibold">{validation.deckName}</span> with{" "}
          {validation.cardCount} card{validation.cardCount === 1 ? "" : "s"}.
        </div>
      ) : null}

      {displayError ? (
        <div
          id="deck-json-error"
          role="alert"
          className="whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {displayError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={!isValid || status === "building"}
          onClick={() => void downloadApkg()}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "building" ? "Generating deck…" : "Generate .apkg"}
        </button>
        <p className="text-sm text-zinc-500">
          {isValid
            ? "Download the file, then import it in Anki (File → Import)."
            : "Fix validation errors above to enable generation."}
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm">
        <h2 className="mb-2 font-semibold text-zinc-900">Required JSON shape</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <code className="text-zinc-800">deckName</code>,{" "}
            <code className="text-zinc-800">name</code>, or{" "}
            <code className="text-zinc-800">deck</code> — deck title
          </li>
          <li>
            <code className="text-zinc-800">cards</code> — at least one basic card (
            <code className="text-zinc-800">front</code>,{" "}
            <code className="text-zinc-800">back</code>, optional{" "}
            <code className="text-zinc-800">explanation</code>,{" "}
            <code className="text-zinc-800">example</code>) or cloze card (
            <code className="text-zinc-800">type: &quot;cloze&quot;</code>,{" "}
            <code className="text-zinc-800">text</code>)
          </li>
          <li>Optional per card: <code className="text-zinc-800">tags</code></li>
        </ul>
      </section>
    </div>
  );
}
