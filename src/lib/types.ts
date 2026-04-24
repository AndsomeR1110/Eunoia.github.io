export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type Locale = "en" | "zh";

export type ResponseMode = "generated" | "scripted";

export type ConversationMode = "support" | "vent";

export type TurnRole = "user" | "assistant" | "system";

export interface ResourceDirectoryEntry {
  id: string;
  name: string;
  region: string;
  urgency: "urgent" | "high" | "support";
  phone?: string;
  textLine?: string;
  website?: string;
  description: string;
  audience: "teen" | "caregiver" | "general";
}

export interface RecommendedAction {
  id: string;
  label: string;
  description: string;
}

export interface SafetyDecision {
  riskLevel: RiskLevel;
  shouldBypassModel: boolean;
  reason: string;
  matchedSignals: string[];
  recommendedActions: RecommendedAction[];
}

export interface ConversationTurn {
  id: string;
  role: TurnRole;
  message: string;
  createdAt: string;
  riskLevel?: RiskLevel;
  responseMode?: ResponseMode;
}

export interface ConversationSession {
  id: string;
  alias: string;
  mode: ConversationMode;
  summary: string;
  lastMoodLabel?: string;
  createdAt: string;
  updatedAt: string;
  turns: ConversationTurn[];
}

export interface MoodCheckIn {
  id: string;
  sessionId: string;
  score: 1 | 2 | 3 | 4 | 5;
  label: string;
  note?: string;
  phase: "pre" | "post";
  createdAt: string;
}

export interface SupportExercise {
  id: string;
  slug: string;
  title: string;
  category: "grounding" | "breathing" | "journaling" | "cbt" | "dbt";
  summary: string;
  durationMinutes: number;
  steps: string[];
  isPublished: boolean;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category:
    | "anxiety"
    | "stress"
    | "relationships"
    | "school"
    | "coping"
    | "crisis";
  source: string;
  sourceUrl: string;
  body: string;
  status: "draft" | "published";
  tags: string[];
  createdAt: string;
  publishedAt?: string;
}

export interface RiskEvent {
  id: string;
  sessionId: string;
  riskLevel: RiskLevel;
  reason: string;
  matchedSignals: string[];
  excerpt: string;
  createdAt: string;
}

export interface ChatReply {
  assistantMessage: string;
  riskLevel: RiskLevel;
  responseMode: ResponseMode;
  recommendedActions: RecommendedAction[];
  resourceLinks: ResourceDirectoryEntry[];
  knowledgeSources: Pick<KnowledgeDocument, "id" | "title" | "sourceUrl">[];
  safetyDecision: SafetyDecision;
}

export type ChatReplyWithSession = ChatReply & {
  sessionId: string;
  alias: string;
};

export type ChatStreamEvent =
  | {
      type: "meta";
      sessionId: string;
      alias: string;
      riskLevel: RiskLevel;
      responseMode: ResponseMode;
    }
  | {
      type: "chunk";
      text: string;
    }
  | {
      type: "done";
      reply: ChatReplyWithSession;
    }
  | {
      type: "error";
      error: string;
    };
