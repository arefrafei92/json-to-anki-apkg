"use client";

import { buildApkgInBrowser } from "@/lib/build-apkg-browser";
import { downloadBytes } from "@/lib/download-bytes";
import {
  deckCategories,
  sharedDecks,
  type DeckCategory,
  type SharedDeck,
} from "@/lib/shared-decks";
import { withBasePath } from "@/lib/site-path";
import { validateDeckJsonText } from "@/lib/validate-deck-json";
import { useCallback, useMemo, useState } from "react";
import { SiteHeader } from "./site-header";

type CategoryFilter = DeckCategory | "All";
type DeckState =
  | { kind: "loading" }
  | { kind: "done" }
  | { kind: "error"; message: string };

// Keeps the spinner on screen long enough to register, even for small decks.
const MIN_LOADING_MS = 450;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function matchesQuery(deck: SharedDeck, query: string) {
  if (!query) return true;
  const haystack = [deck.title, deck.description, deck.category, ...deck.topics]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

async function generateSharedDeck(deck: SharedDeck) {
  const res = await fetch(withBasePath(deck.file));
  if (!res.ok) throw new Error(`Could not load the deck file (HTTP ${res.status}).`);
  const result = validateDeckJsonText(await res.text());
  if (!result.ok) throw new Error(result.errors.join(" "));
  const { bytes, filename } = await buildApkgInBrowser(result.data);
  downloadBytes(bytes, filename);
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function SharedDeckLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [states, setStates] = useState<Record<string, DeckState>>({});

  const filtered = useMemo(
    () =>
      sharedDecks.filter(
        (d) =>
          (category === "All" || d.category === category) &&
          matchesQuery(d, query.trim()),
      ),
    [category, query],
  );

  const grouped = useMemo(
    () =>
      deckCategories
        .map((c) => ({ category: c, decks: filtered.filter((d) => d.category === c) }))
        .filter((g) => g.decks.length > 0),
    [filtered],
  );

  const totalCards = useMemo(
    () => filtered.reduce((sum, d) => sum + d.cards, 0),
    [filtered],
  );

  const download = useCallback(async (deck: SharedDeck) => {
    setStates((s) => ({ ...s, [deck.id]: { kind: "loading" } }));
    try {
      await Promise.all([generateSharedDeck(deck), sleep(MIN_LOADING_MS)]);
      setStates((s) => ({ ...s, [deck.id]: { kind: "done" } }));
      setTimeout(() => {
        setStates((s) => {
          if (s[deck.id]?.kind !== "done") return s;
          const next = { ...s };
          delete next[deck.id];
          return next;
        });
      }, 2500);
    } catch (e) {
      setStates((s) => ({
        ...s,
        [deck.id]: {
          kind: "error",
          message: e instanceof Error ? e.message : "Could not generate this deck.",
        },
      }));
    }
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <SiteHeader />

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Shared decks
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Ready-made Anki decks
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Click a deck to generate its <code className="text-zinc-800 dark:text-zinc-200">.apkg</code>{" "}
          right in your browser, then import it in Anki with File → Import.
        </p>
      </header>

      <div className="space-y-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decks — try “heap”, “redis”, “meetings”, “git rebase”"
            aria-label="Search shared decks"
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none ring-emerald-600/30 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {(["All", ...deckCategories] as CategoryFilter[]).map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950"
                      : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400" aria-live="polite">
            {filtered.length} deck{filtered.length === 1 ? "" : "s"} · {totalCards} cards
          </p>
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">No decks match “{query}”.</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Try a broader word, or clear the search and category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Show all decks
          </button>
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.category} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {group.category}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {group.decks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  state={states[deck.id]}
                  onDownload={() => void download(deck)}
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function DeckCard({
  deck,
  state,
  onDownload,
}: {
  deck: SharedDeck;
  state: DeckState | undefined;
  onDownload: () => void;
}) {
  const loading = state?.kind === "loading";
  const done = state?.kind === "done";

  return (
    <li className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700">
      <button
        type="button"
        onClick={onDownload}
        disabled={loading}
        aria-busy={loading}
        aria-label={`Generate and download ${deck.title}`}
        className="flex flex-1 flex-col gap-2 rounded-t-xl px-4 pt-4 pb-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 disabled:cursor-wait"
      >
        <span className="flex items-start justify-between gap-3">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{deck.title}</span>
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {deck.cards} cards
          </span>
        </span>
        <span className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {deck.description}
        </span>
        <span className="flex flex-wrap gap-1.5">
          {deck.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-md bg-zinc-50 px-2 py-0.5 text-xs text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-400 dark:ring-zinc-700"
            >
              {topic}
            </span>
          ))}
        </span>
      </button>

      <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <a
          href={withBasePath(deck.file)}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          View JSON
        </a>
        <button
          type="button"
          onClick={onDownload}
          disabled={loading}
          className={`inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold shadow-sm transition disabled:cursor-wait ${
            done
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900"
              : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-80 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
          }`}
        >
          {loading ? <Spinner /> : done ? <CheckIcon /> : <DownloadIcon />}
          {loading ? "Generating…" : done ? "Downloaded" : "Download .apkg"}
        </button>
      </div>

      {state?.kind === "error" ? (
        <p role="alert" className="mx-4 mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.message}
        </p>
      ) : null}
    </li>
  );
}
