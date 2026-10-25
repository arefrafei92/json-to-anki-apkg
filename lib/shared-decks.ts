export const deckCategories = [
  "Java engineering",
  "Performance and production",
  "Tools and delivery",
  "Architecture and interviews",
  "English at work",
  "Samples",
] as const;

export type DeckCategory = (typeof deckCategories)[number];

export type SharedDeck = {
  id: string;
  title: string;
  description: string;
  category: DeckCategory;
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
    category: "Java engineering",
    file: "/examples/java-11-17-junior-to-mid.json",
    cards: 43,
    topics: ["Java 11", "Java 17", "JVM", "Concurrency"],
  },
  {
    id: "jvm-memory-and-debugging",
    title: "JVM Memory and Debugging",
    description:
      "Heap, metaspace, GC logs, heap and thread dumps, JFR, and how to chase an OutOfMemoryError or a stuck service step by step.",
    category: "Java engineering",
    file: "/examples/jvm-memory-and-debugging.json",
    cards: 35,
    topics: ["Heap", "GC", "Heap dumps", "jcmd", "JFR"],
  },
  {
    id: "spring-boot-and-jpa-at-work",
    title: "Spring Boot and JPA at Work",
    description:
      "Beans and proxies, transactions, N+1 queries, lazy loading, connection pools, and the mistakes that show up in code review.",
    category: "Java engineering",
    file: "/examples/spring-boot-and-jpa-at-work.json",
    cards: 35,
    topics: ["Spring", "Transactions", "JPA", "Hibernate"],
  },
  {
    id: "caching-in-java-services",
    title: "Caching in Java Services",
    description:
      "Caffeine and Redis, Spring @Cacheable traps, TTL versus invalidation, stampedes, hot keys, and how to prove a cache helps.",
    category: "Performance and production",
    file: "/examples/caching-in-java-services.json",
    cards: 30,
    topics: ["Caffeine", "Redis", "Spring Cache", "Invalidation"],
  },
  {
    id: "observability-and-incidents",
    title: "Observability and Incidents",
    description:
      "Logs, metrics, traces, percentiles, alerts that page for the right reason, and a calm playbook for a production incident.",
    category: "Performance and production",
    file: "/examples/observability-and-incidents.json",
    cards: 30,
    topics: ["Logging", "Metrics", "Tracing", "On-call"],
  },
  {
    id: "docker-and-containers",
    title: "Docker and Containers",
    description:
      "Images, layers, Dockerfiles for Java, networking, volumes, JVM memory inside a container, and debugging a container that will not start.",
    category: "Tools and delivery",
    file: "/examples/docker-and-containers.json",
    cards: 34,
    topics: ["Docker", "Dockerfile", "JVM in containers", "Compose"],
  },
  {
    id: "git-commands-and-situations",
    title: "Git — Commands and Situations",
    description:
      "Merge, rebase, amend, reset, revert, cherry-pick, conflicts, and recovering a mistake from the reflog.",
    category: "Tools and delivery",
    file: "/examples/git-commands-and-situations.json",
    cards: 37,
    topics: ["Merge", "Rebase", "Amend", "Recovery"],
  },
  {
    id: "system-design-and-dsa",
    title: "System Design and DSA — Junior to Mid",
    description:
      "Complexity and interview patterns, then caching, indexes, sharding, consistent hashing, CAP, and queues.",
    category: "Architecture and interviews",
    file: "/examples/system-design-and-dsa.json",
    cards: 39,
    topics: ["DSA", "Databases", "CAP", "Caching"],
  },
  {
    id: "english-at-work-java",
    title: "English at Work — Java Developer",
    description:
      "Small talk, meetings, grammar, standup, Slack, and Java conversations for day-to-day fluency.",
    category: "English at work",
    file: "/examples/english-at-work-java.json",
    cards: 122,
    topics: ["Small talk", "Meetings", "Grammar", "Java"],
  },
  {
    id: "workplace-english-intermediate",
    title: "Workplace English — Intermediate",
    description:
      "Short set of practical phrases for updates, meetings, and common workplace collocations.",
    category: "English at work",
    file: "/examples/workplace-english-intermediate.json",
    cards: 20,
    topics: ["Meetings", "Phrases"],
  },
  {
    id: "sample-vocabulary",
    title: "Sample vocabulary",
    description: "A few cards to try paste, validate, and download.",
    category: "Samples",
    file: "/examples/sample-deck.json",
    cards: 3,
    topics: ["Sample"],
  },
];
