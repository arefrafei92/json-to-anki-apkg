"use client";

import { useCallback, useMemo, useState } from "react";

const DEFAULT_JSON = `{
  "deckName": "My deck",
  "cards": [
    {
      "front": "Question",
      "back": "Answer"
    }
  ]
}`;

type Status = "idle" | "loading" | "error";

export function DeckConverter() {
  const [jsonText, setJsonText] = useState(DEFAULT_JSON);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const lineCount = useMemo(() => jsonText.split("\n").length, [jsonText]);

  const loadSample = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/examples/sample-deck.json");
      if (!res.ok) throw new Error("Could not load sample");
      setJsonText(await res.text());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sample");
    }
  }, []);

  const onFilePick = useCallback(async (file: File | null) => {
    if (!file) return;
    setError(null);
    try {
      setJsonText(await file.text());
    } catch {
      setError("Could not read that file");
    }
  }, []);

  const downloadApkg = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      let payload: unknown;
      try {
        payload = JSON.parse(jsonText);
      } catch {
        throw new Error("Fix JSON syntax before generating the deck.");
      }

      const res = await fetch("/api/apkg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
          details?: string;
        } | null;
        const detail = data?.details ? `\n${data.details}` : "";
        throw new Error((data?.error ?? "Generation failed") + detail);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "deck.apkg";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }, [jsonText]);

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
          Paste or upload deck JSON, then download an Anki package you can import in
          Anki desktop or AnkiWeb. Anki uses the{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">.apkg</code>{" "}
          format (sometimes called a deck package).
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={loadSample}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50"
        >
          Load sample JSON
        </button>
        <label className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50">
          Upload .json
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => onFilePick(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

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
            setError(null);
            if (status === "error") setStatus("idle");
          }}
          spellCheck={false}
          className="min-h-[320px] w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 font-mono text-sm leading-relaxed text-zinc-900 shadow-inner outline-none ring-emerald-600/30 focus:border-emerald-600 focus:ring-2"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={status === "loading"}
          onClick={downloadApkg}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Building deck…" : "Download .apkg"}
        </button>
        <p className="text-sm text-zinc-500">
          Import in Anki: File → Import, then choose the downloaded file.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-sm">
        <h2 className="mb-2 font-semibold text-zinc-900">JSON format</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <code className="text-zinc-800">deckName</code> or{" "}
            <code className="text-zinc-800">name</code> — deck title
          </li>
          <li>
            <code className="text-zinc-800">cards</code> — array of basic cards (
            <code className="text-zinc-800">front</code>,{" "}
            <code className="text-zinc-800">back</code>) or cloze cards (
            <code className="text-zinc-800">type: &quot;cloze&quot;</code>,{" "}
            <code className="text-zinc-800">text</code>)
          </li>
          <li>Optional per card: <code className="text-zinc-800">tags</code>, subdeck{" "}
            <code className="text-zinc-800">deck</code>
          </li>
        </ul>
        <p className="mt-3">
          CLI:{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-800">
            npm run json-to-apkg -- examples/sample-deck.json
          </code>
        </p>
      </section>
    </div>
  );
}
