import type { Metadata } from "next";
import { SharedDeckLibrary } from "../components/shared-deck-library";

export const metadata: Metadata = {
  title: "Shared decks · JSON to Anki",
  description: "Search ready-made Anki decks and download them as .apkg files.",
};

export default function DecksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-zinc-50 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-zinc-950">
      <SharedDeckLibrary />
    </div>
  );
}
