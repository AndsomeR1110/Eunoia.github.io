import type {
  KnowledgeDocument,
  ResourceDirectoryEntry,
  SupportExercise,
} from "@/lib/types";

const now = new Date().toISOString();

export const demoExercises: SupportExercise[] = [
  {
    id: "ex-breathe-box",
    slug: "box-breathing",
    title: "Box Breathing Reset",
    category: "breathing",
    summary: "A 2-minute breathing pattern for calming stress spikes.",
    durationMinutes: 2,
    steps: [
      "Inhale for four counts.",
      "Hold for four counts.",
      "Exhale for four counts.",
      "Hold for four counts and repeat four rounds.",
    ],
    isPublished: true,
  },
  {
    id: "ex-ground-54321",
    slug: "54321-grounding",
    title: "5-4-3-2-1 Grounding",
    category: "grounding",
    summary: "A sensory grounding routine for overwhelm and spiraling thoughts.",
    durationMinutes: 5,
    steps: [
      "Name five things you can see.",
      "Name four things you can touch.",
      "Name three things you can hear.",
      "Name two things you can smell.",
      "Name one thing you can taste or are grateful for.",
    ],
    isPublished: true,
  },
  {
    id: "ex-journal-story",
    slug: "thought-story-check",
    title: "Thought Story Check",
    category: "cbt",
    summary: "Separate facts from the story your mind is telling.",
    durationMinutes: 6,
    steps: [
      "Write the situation in one sentence.",
      "List the facts you know for sure.",
      "List the story your brain is adding.",
      "Rewrite the story in a kinder, more balanced way.",
    ],
    isPublished: true,
  },
];

export const demoKnowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "doc-anxiety-exams",
    title: "How to Steady Yourself Before Exams",
    category: "school",
    source: "Student Wellbeing Collective",
    sourceUrl: "https://example.org/exam-anxiety",
    body: "Exam anxiety often shows up as racing thoughts, muscle tension, nausea, and the feeling that one test defines everything. Helpful short-term actions include paced breathing, breaking revision into one small block, and reaching out to a teacher or counselor when stress starts affecting sleep or safety.",
    status: "published",
    tags: ["exams", "school", "anxiety", "stress"],
    createdAt: now,
    publishedAt: now,
  },
  {
    id: "doc-friendship-conflict",
    title: "Friendship Conflict Without Spiraling",
    category: "relationships",
    source: "Teen Support Notes",
    sourceUrl: "https://example.org/friendship-conflict",
    body: "When a friendship feels shaky, it can help to slow the story down. Notice what happened, what you assumed it meant, and what you need next. A calm check-in message, a pause from doom-scrolling, and talking to one trusted person can reduce the intensity.",
    status: "published",
    tags: ["friendship", "conflict", "social"],
    createdAt: now,
    publishedAt: now,
  },
  {
    id: "doc-crisis-escalation",
    title: "When to Reach Out Right Away",
    category: "crisis",
    source: "Youth Crisis Resource Draft",
    sourceUrl: "https://example.org/crisis-help",
    body: "If someone feels unable to stay safe, has a plan to hurt themselves, or believes others would be better off without them, immediate human help matters. Contact emergency services, a crisis line, or a trusted adult nearby.",
    status: "draft",
    tags: ["crisis", "suicide", "urgent"],
    createdAt: now,
  },
];

export const demoResources: ResourceDirectoryEntry[] = [
  {
    id: "res-988",
    name: "988 Suicide & Crisis Lifeline",
    region: "United States",
    urgency: "urgent",
    phone: "988",
    website: "https://988lifeline.org/",
    description: "24/7 crisis support by call or chat.",
    audience: "teen",
  },
  {
    id: "res-crisis-text",
    name: "Crisis Text Line",
    region: "United States",
    urgency: "high",
    textLine: "Text HOME to 741741",
    website: "https://www.crisistextline.org/",
    description: "Text-based support when talking out loud feels hard.",
    audience: "teen",
  },
  {
    id: "res-trevor",
    name: "The Trevor Project",
    region: "International",
    urgency: "high",
    phone: "1-866-488-7386",
    website: "https://www.thetrevorproject.org/get-help/",
    description: "Crisis and counseling support for LGBTQ+ young people.",
    audience: "teen",
  },
  {
    id: "res-emergency",
    name: "Emergency Services",
    region: "Local",
    urgency: "urgent",
    phone: "911 / local emergency number",
    description: "Use when there is immediate danger or someone cannot stay safe.",
    audience: "general",
  },
];

export const moodLabels = [
  { score: 1, label: "Barely holding on" },
  { score: 2, label: "Heavy" },
  { score: 3, label: "Mixed" },
  { score: 4, label: "Steady" },
  { score: 5, label: "Hopeful" },
] as const;
