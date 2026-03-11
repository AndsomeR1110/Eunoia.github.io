import { demoExercises, demoKnowledgeDocuments, demoResources } from "@/lib/demo-data";
import { generateId, scoreKeywordOverlap } from "@/lib/utils";
import type {
  ConversationMode,
  ConversationSession,
  ConversationTurn,
  KnowledgeDocument,
  MoodCheckIn,
  ResourceDirectoryEntry,
  RiskEvent,
  SupportExercise,
} from "@/lib/types";

interface StoreState {
  sessions: Map<string, ConversationSession>;
  moods: MoodCheckIn[];
  exercises: SupportExercise[];
  knowledgeDocuments: KnowledgeDocument[];
  resources: ResourceDirectoryEntry[];
  riskEvents: RiskEvent[];
}

declare global {
  var __eunoiaStore: StoreState | undefined;
}

function createStoreState(): StoreState {
  return {
    sessions: new Map(),
    moods: [],
    exercises: [...demoExercises],
    knowledgeDocuments: [...demoKnowledgeDocuments],
    resources: [...demoResources],
    riskEvents: [],
  };
}

function getState() {
  if (!globalThis.__eunoiaStore) {
    globalThis.__eunoiaStore = createStoreState();
  }

  return globalThis.__eunoiaStore;
}

export async function createSession(alias: string, mode: ConversationMode = "support") {
  const state = getState();
  const session: ConversationSession = {
    id: generateId("session"),
    alias,
    mode,
    summary: "New conversation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    turns: [],
  };

  state.sessions.set(session.id, session);
  return session;
}

export async function getSession(sessionId: string) {
  return getState().sessions.get(sessionId) ?? null;
}

export async function ensureSession(sessionId: string | undefined, alias: string, mode: ConversationMode) {
  if (sessionId) {
    const existing = await getSession(sessionId);
    if (existing) {
      return existing;
    }
  }

  return createSession(alias, mode);
}

export async function appendTurn(sessionId: string, turn: Omit<ConversationTurn, "id" | "createdAt">) {
  const state = getState();
  const session = state.sessions.get(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  const completeTurn: ConversationTurn = {
    id: generateId("turn"),
    createdAt: new Date().toISOString(),
    ...turn,
  };

  session.turns.push(completeTurn);
  session.summary = session.turns.slice(-4).map((item) => `${item.role}: ${item.message}`).join(" ").slice(0, 320);
  session.updatedAt = new Date().toISOString();
  state.sessions.set(sessionId, session);

  return completeTurn;
}

export async function listExercises() {
  return getState().exercises.filter((exercise) => exercise.isPublished);
}

export async function listKnowledgeDocuments() {
  return [...getState().knowledgeDocuments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function searchKnowledgeDocuments(query: string, limit = 3) {
  return getState()
    .knowledgeDocuments
    .filter((document) => document.status === "published")
    .map((document) => ({
      document,
      score: scoreKeywordOverlap(query, `${document.title} ${document.body} ${document.tags.join(" ")}`),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.document);
}

export async function importKnowledgeDocument(
  document: Pick<KnowledgeDocument, "title" | "category" | "source" | "sourceUrl" | "body" | "tags">,
) {
  const state = getState();
  const created: KnowledgeDocument = {
    id: generateId("doc"),
    status: "draft",
    createdAt: new Date().toISOString(),
    ...document,
  };

  state.knowledgeDocuments.unshift(created);
  return created;
}

export async function publishKnowledgeDocument(id: string) {
  const state = getState();
  const index = state.knowledgeDocuments.findIndex((document) => document.id === id);

  if (index === -1) {
    throw new Error("Knowledge document not found");
  }

  state.knowledgeDocuments[index] = {
    ...state.knowledgeDocuments[index],
    status: "published",
    publishedAt: new Date().toISOString(),
  };

  return state.knowledgeDocuments[index];
}

export async function listResources() {
  return [...getState().resources];
}

export async function updateResource(id: string, patch: Partial<ResourceDirectoryEntry>) {
  const state = getState();
  const index = state.resources.findIndex((resource) => resource.id === id);

  if (index === -1) {
    throw new Error("Resource not found");
  }

  state.resources[index] = {
    ...state.resources[index],
    ...patch,
  };

  return state.resources[index];
}

export async function createMoodCheckIn(
  input: Omit<MoodCheckIn, "id" | "createdAt">,
) {
  const state = getState();
  const checkIn: MoodCheckIn = {
    id: generateId("mood"),
    createdAt: new Date().toISOString(),
    ...input,
  };

  state.moods.unshift(checkIn);
  const session = state.sessions.get(input.sessionId);
  if (session) {
    session.lastMoodLabel = input.label;
    session.updatedAt = new Date().toISOString();
    state.sessions.set(input.sessionId, session);
  }

  return checkIn;
}

export async function listMoodCheckIns(sessionId?: string) {
  return getState().moods.filter((checkIn) => !sessionId || checkIn.sessionId === sessionId);
}

export async function recordRiskEvent(event: Omit<RiskEvent, "id" | "createdAt">) {
  const state = getState();
  const record: RiskEvent = {
    id: generateId("risk"),
    createdAt: new Date().toISOString(),
    ...event,
  };

  state.riskEvents.unshift(record);
  return record;
}

export async function listRiskEvents() {
  return [...getState().riskEvents];
}
