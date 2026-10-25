export const deckCategories = [
  "Java",
  "Software engineering",
  "System design and coding",
  "Production and performance",
  "English communication",
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

const file = (id: string) => `/shared-decks/${id}.json`;

/** Decks served from public/shared-decks/. Add a JSON file there, then a row here. */
export const sharedDecks: readonly SharedDeck[] = [
  {
    id: "modern-java-junior-to-mid",
    title: "Modern Java — Junior to Mid",
    description:
      "Equality and hashing, collections, generics, exceptions, streams and collectors, Optional, records, sealed types, and pattern matching up to Java 21.",
    category: "Java",
    file: file("modern-java-junior-to-mid"),
    cards: 43,
    topics: ["Core Java", "Java 17", "Java 21", "Streams"],
  },
  {
    id: "java-concurrency",
    title: "Java Concurrency in Practice",
    description:
      "Memory model, locks and atomics, thread pools and their traps, CompletableFuture, virtual threads, deadlocks, and testing async code.",
    category: "Java",
    file: file("java-concurrency"),
    cards: 35,
    topics: ["Threads", "Executors", "CompletableFuture", "Virtual threads"],
  },
  {
    id: "jvm-memory-and-debugging",
    title: "JVM Memory and Debugging",
    description:
      "Heap, metaspace, GC logs, heap and thread dumps, JFR, and how to chase an OutOfMemoryError or a stuck service step by step.",
    category: "Java",
    file: file("jvm-memory-and-debugging"),
    cards: 35,
    topics: ["Heap", "GC", "Heap dumps", "jcmd", "JFR"],
  },
  {
    id: "spring-boot-and-jpa-at-work",
    title: "Spring Boot and JPA at Work",
    description:
      "Beans and proxies, transactions, N+1 queries, lazy loading, connection pools, locking, and the mistakes that show up in code review.",
    category: "Java",
    file: file("spring-boot-and-jpa-at-work"),
    cards: 35,
    topics: ["Spring", "Transactions", "JPA", "Hibernate"],
  },
  {
    id: "software-engineering-fundamentals",
    title: "Software Engineering Fundamentals",
    description:
      "SOLID, design patterns, clean code and refactoring, testing strategy, code review, REST API design, security basics, and CI/CD.",
    category: "Software engineering",
    file: file("software-engineering-fundamentals"),
    cards: 36,
    topics: ["Design", "Testing", "APIs", "Security"],
  },
  {
    id: "sql-and-databases",
    title: "SQL and Databases at Work",
    description:
      "Transactions and isolation, indexes and EXPLAIN, joins and NULL traps, window functions, upserts, locking, and safe schema changes.",
    category: "Software engineering",
    file: file("sql-and-databases"),
    cards: 28,
    topics: ["SQL", "PostgreSQL", "Indexes", "Transactions"],
  },
  {
    id: "git-commands-and-situations",
    title: "Git — Commands and Situations",
    description:
      "Merge, rebase, amend, reset, revert, cherry-pick, conflicts, reflog recovery, and the team etiquette around force-pushing.",
    category: "Software engineering",
    file: file("git-commands-and-situations"),
    cards: 41,
    topics: ["Rebase", "Reset", "Reflog", "Conflicts"],
  },
  {
    id: "docker-and-containers",
    title: "Docker and Containers",
    description:
      "Images, layers, Dockerfiles for Java, networking, volumes, JVM memory inside a container, and debugging a container that will not start.",
    category: "Software engineering",
    file: file("docker-and-containers"),
    cards: 34,
    topics: ["Dockerfile", "Compose", "JVM in containers", "Debugging"],
  },
  {
    id: "system-design-fundamentals",
    title: "System Design Fundamentals",
    description:
      "Estimation, scaling, caching, databases, replication, sharding, consistency, messaging, idempotency, sagas, and classic designs.",
    category: "System design and coding",
    file: file("system-design-fundamentals"),
    cards: 42,
    topics: ["Scaling", "Consistency", "Kafka", "Estimation"],
  },
  {
    id: "coding-interview-patterns",
    title: "Coding Interview Patterns (DSA)",
    description:
      "Complexity, hash maps, two pointers, sliding window, heaps, intervals, binary search, graphs, backtracking, and DP, with Java tips.",
    category: "System design and coding",
    file: file("coding-interview-patterns"),
    cards: 41,
    topics: ["Algorithms", "Data structures", "Graphs", "DP"],
  },
  {
    id: "caching-in-java-services",
    title: "Caching in Java Services",
    description:
      "Caffeine and Redis, Spring @Cacheable traps, TTL versus invalidation, stampedes, hot keys, and how to prove a cache helps.",
    category: "Production and performance",
    file: file("caching-in-java-services"),
    cards: 30,
    topics: ["Caffeine", "Redis", "Spring Cache", "Invalidation"],
  },
  {
    id: "observability-and-incidents",
    title: "Observability and Incidents",
    description:
      "Logs, metrics, traces, percentiles, alerts that page for the right reason, and a calm playbook for a production incident.",
    category: "Production and performance",
    file: file("observability-and-incidents"),
    cards: 30,
    topics: ["Logging", "Metrics", "Tracing", "On-call"],
  },
  {
    id: "professional-english-at-work",
    title: "Professional English at Work",
    description:
      "Meetings, standups, Slack, email, code review, demos, feedback, and interviews — answer each situation out loud, then flip.",
    category: "English communication",
    file: file("professional-english-at-work"),
    cards: 113,
    topics: ["Meetings", "Email", "Code review", "Collocations"],
  },
  {
    id: "casual-english-and-small-talk",
    title: "Casual English and Small Talk",
    description:
      "Greetings, reactions, invitations, plans, phrasal verbs, spoken reductions, and idioms for natural everyday conversation.",
    category: "English communication",
    file: file("casual-english-and-small-talk"),
    cards: 45,
    topics: ["Small talk", "Phrasal verbs", "Idioms", "Reactions"],
  },
  {
    id: "english-grammar-for-work",
    title: "English Grammar That Matters",
    description:
      "Tenses, articles, uncountable nouns, gerunds vs infinitives, question word order, conditionals, prepositions, and common mistakes.",
    category: "English communication",
    file: file("english-grammar-for-work"),
    cards: 57,
    topics: ["Tenses", "Articles", "Word order", "Common mistakes"],
  },
];
