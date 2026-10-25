"use client";

import { buildApkgInBrowser } from "@/lib/build-apkg-browser";
import { downloadBytes } from "@/lib/download-bytes";
import { sharedDecks } from "@/lib/shared-decks";
import {
  validateDeckJsonText,
  type DeckValidationResult,
} from "@/lib/validate-deck-json";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "./site-header";

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

const secondaryButton =
  "rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800";

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

  const onFilePick = useCallback(async (file: File | null) => {
    if (!file) return;
    setUploadError(null);
    setUploadName(file.name);

    if (!file.name.toLowerCase().endsWith(".json")) {
      setUploadError("Please choose a .json file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("JSON file is too large (max 5 MB).");
      return;
    }

    setStatus("validating");
    try {
      setJsonText(await file.text());
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
      downloadBytes(bytes, filename);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setUploadError(
        e instanceof Error ? `Could not build the deck: ${e.message}` : "Could not build the deck.",
      );
    }
  }, [jsonText]);

  const displayError = uploadError ?? validationError;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
      <SiteHeader />

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Anki deck builder
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          JSON to .apkg
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Paste or upload your own deck JSON. We validate the format, then build
          an Anki package in your browser.
        </p>
      </header>

      <Link
        href="/decks"
        className="group flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30 dark:hover:border-emerald-700"
      >
        <span className="text-emerald-900 dark:text-emerald-200">
          <span className="font-semibold">Looking for a ready-made deck?</span>{" "}
          Browse {sharedDecks.length} shared decks and download any of them in one click.
        </span>
        <span aria-hidden="true" className="font-semibold text-emerald-700 transition group-hover:translate-x-0.5 dark:text-emerald-400">
          →
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <label className={`cursor-pointer ${secondaryButton}`}>
          Select a .json file
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
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          File:{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {uploadName}
          </span>
        </p>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <label
            htmlFor="deck-json"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Deck JSON
          </label>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {lineCount} lines
          </span>
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
          className={`min-h-[320px] w-full resize-y rounded-xl border bg-zinc-50/80 p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-inner outline-none ring-emerald-600/30 focus:ring-2 dark:bg-zinc-900/80 dark:text-zinc-100 ${
            displayError
              ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-800 dark:focus:ring-red-900"
              : isValid
                ? "border-emerald-300 focus:border-emerald-600 dark:border-emerald-800"
                : "border-zinc-200 focus:border-emerald-600 dark:border-zinc-700"
          }`}
        />
      </div>

      {isDirty ? (
        <p id="deck-json-hint" className="text-sm text-zinc-500 dark:text-zinc-400">
          Checking format…
        </p>
      ) : isValid ? (
        <div
          id="deck-json-hint"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
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
          className="whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        >
          {displayError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={!isValid || status === "building"}
          onClick={() => void downloadApkg()}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
        >
          {status === "building" ? "Generating deck…" : "Generate .apkg"}
        </button>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {isValid
            ? "Download the file, then import it in Anki (File → Import)."
            : "Fix validation errors above to enable generation."}
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <h2 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
          Required JSON shape
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <code className="text-zinc-800 dark:text-zinc-200">deckName</code>,{" "}
            <code className="text-zinc-800 dark:text-zinc-200">name</code>, or{" "}
            <code className="text-zinc-800 dark:text-zinc-200">deck</code> — deck title
          </li>
          <li>
            <code className="text-zinc-800 dark:text-zinc-200">cards</code> — at least one basic card (
            <code className="text-zinc-800 dark:text-zinc-200">front</code>,{" "}
            <code className="text-zinc-800 dark:text-zinc-200">back</code>, optional{" "}
            <code className="text-zinc-800 dark:text-zinc-200">explanation</code>,{" "}
            <code className="text-zinc-800 dark:text-zinc-200">example</code>) or cloze card (
            <code className="text-zinc-800 dark:text-zinc-200">type: &quot;cloze&quot;</code>,{" "}
            <code className="text-zinc-800 dark:text-zinc-200">text</code>)
          </li>
          <li>
            Optional per card:{" "}
            <code className="text-zinc-800 dark:text-zinc-200">tags</code>
          </li>
        </ul>
      </section>
    </div>
  );
}
