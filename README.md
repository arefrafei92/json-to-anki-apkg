# JSON to Anki (.apkg)

Turn a JSON list of flashcards into an **Anki package** (`.apkg`) you can import in Anki desktop or AnkiWeb.

Includes:

- A small **web app** — paste JSON and download the deck
- A **CLI script** — convert `.json` files locally

## Shared decks

Shared JSON decks live in [`public/shared-decks/`](public/shared-decks/) and are listed on the **Shared decks** page (`/decks`), which comes from [`lib/shared-decks.ts`](lib/shared-decks.ts). You can search them by title, topic, or category. Click a deck to generate and download its `.apkg`. To add another shared deck:

1. Add `public/shared-decks/your-deck.json`.
2. Add an entry in `lib/shared-decks.ts`.

To build one from the command line: `npm run json-to-apkg -- public/shared-decks/docker-and-containers.json`.

## Live site (free on GitHub Pages)

**https://arefrafei92.github.io/json-to-anki-apkg/**

Public repos get free static hosting from GitHub. This app runs entirely in your
browser (JSON never leaves your device). After each push to `main`, GitHub Actions
deploys the site automatically.

First-time setup (once per repo): GitHub → **Settings → Pages → Build and
deployment → Source: GitHub Actions**.

## Quick start (local)

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123), paste or upload JSON, then click **Download .apkg**.

## CLI

```bash
npm run json-to-apkg -- examples/sample-deck.json
# writes examples/sample-deck.apkg

npm run json-to-apkg -- deck.json -o my-cards.apkg

cat deck.json | npm run json-to-apkg -- -
```

## JSON format

```json
{
  "deck": "My deck",
  "description": "Optional notes for yourself",
  "cards": [
    {
      "type": "basic",
      "front": "Question",
      "back": "Answer",
      "explanation": "Optional short note",
      "example": "Optional example sentence",
      "tags": ["optional", "tags"]
    },
    {
      "type": "cloze",
      "text": "The {{c1::answer}} goes here.",
      "extra": "Optional footnote on the back"
    }
  ]
}
```

- Use **`deckName`**, **`name`**, or **`deck`** for the deck title (required).
- **`description`** is accepted in JSON for your own reference (not written into the `.apkg` metadata yet).
- Basic cards may include **`explanation`** and **`example`**; they appear on the back of the card below the answer.
- **`cards`** must contain at least one card.
- Basic cards need **`front`** and **`back`**.
- Cloze cards use **`type": "cloze"`**, **`text`**, and optional **`extra`**.
- Optional on any card: **`tags`** (string or array), **`deck`** (subdeck name, supports `Parent::Child`), **`noteId`** (stable id when you edit notes later).

See [`examples/sample-deck.json`](examples/sample-deck.json).

## Import into Anki

1. Download or generate a `.apkg` file.
2. In Anki: **File → Import** and select the file.
3. Confirm import options if Anki prompts you.

## GitHub

Push this folder to a new repository on GitHub. The app can be deployed to any Node host that supports Next.js (for example Vercel) so you always have the HTML converter available.

## License

MIT
