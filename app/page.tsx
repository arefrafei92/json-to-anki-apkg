import { DeckConverter } from "./components/deck-converter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-zinc-50 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-zinc-950">
      <DeckConverter />
    </div>
  );
}
