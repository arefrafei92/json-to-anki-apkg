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
    id: "java-11-17-junior-to-mid",
    title: "Java 11 and 17 — Junior to Mid",
    description:
      "Core Java plus what actually shipped by the 17 LTS: var, HTTP client, switch expressions, text blocks, records, instanceof patterns, and sealed classes.",
    file: "/examples/java-11-17-junior-to-mid.json",
    cards: 43,
    topics: ["Java 11", "Java 17", "JVM", "Concurrency"],
  },
  {
    id: "git-commands-and-situations",
    title: "Git — Commands and Situations",
    description:
      "Merge, rebase, amend, reset, revert, cherry-pick, conflicts, and recovering a mistake from the reflog.",
    file: "/examples/git-commands-and-situations.json",
    cards: 37,
    topics: ["Merge", "Rebase", "Amend", "Recovery"],
  },
  {
    id: "system-design-and-dsa",
    title: "System Design and DSA — Junior to Mid",
    description:
      "Complexity and interview patterns, then caching, indexes, sharding, consistent hashing, CAP, and queues.",
    file: "/examples/system-design-and-dsa.json",
    cards: 39,
    topics: ["DSA", "Databases", "CAP", "Caching"],
  },
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
