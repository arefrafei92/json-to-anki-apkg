export type SharedDeck = {
  id: string;
  title: string;
  description: string;
  /** Path under public/, fetched with the site base path. */
  file: string;
  cards: number;
  topics: string[];
};

/** Decks shipped in examples/ and public/examples/. Add a JSON file, then a row here. */
export const sharedDecks: readonly SharedDeck[] = [
  {
    id: "english-at-work-java",
    title: "English at Work — Java Developer",
    description:
      "Small talk, meetings, grammar, standup, Slack, and Java conversations for day-to-day fluency.",
    file: "/examples/english-at-work-java.json",
    cards: 122,
    topics: ["Small talk", "Meetings", "Grammar", "Java"],
  },
  {
    id: "workplace-english-intermediate",
    title: "Workplace English — Intermediate",
    description:
      "Short set of practical phrases for updates, meetings, and common workplace collocations.",
    file: "/examples/workplace-english-intermediate.json",
    cards: 20,
    topics: ["Meetings", "Phrases", "Cloze"],
  },
  {
    id: "sample-vocabulary",
    title: "Sample vocabulary",
    description: "A few cards to try paste, validate, and download.",
    file: "/examples/sample-deck.json",
    cards: 3,
    topics: ["Sample"],
  },
];
