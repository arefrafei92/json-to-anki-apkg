# JSON to Anki (.apkg)

Turn a JSON list of flashcards into an **Anki package** (`.apkg`) you can import in Anki desktop or AnkiWeb.

Includes:

- A small **web app** — paste JSON and download the deck
- A **CLI script** — convert `.json` files locally

## Quick start (web)

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
  "deckName": "My deck",
  "cards": [
    {
      "front": "Question",
      "back": "Answer",
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

- Use **`deckName`** or **`name`** for the deck title (required).
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
