import { z } from "zod";

import { buildCrisisReply, classifyMessageRisk, filterResourcesForRisk } from "@/lib/safety";
import { chatProvider } from "@/lib/server/provider";
import {
  appendTurn,
  ensureSession,
  listResources,
  recordRiskEvent,
  searchKnowledgeDocuments,
} from "@/lib/server/store";
import type { ChatReply, ConversationMode, Locale } from "@/lib/types";

export const createSessionSchema = z.object({
  alias: z.string().trim().min(1).max(32).default("Quiet Comet"),
  mode: z.enum(["support", "vent"]).default("support"),
  locale: z.enum(["en", "zh"]).default("en"),
});

export const sendMessageSchema = z.object({
  sessionId: z.string().optional(),
  alias: z.string().trim().min(1).max(32).default("Quiet Comet"),
  mode: z.enum(["support", "vent"]).default("support"),
  locale: z.enum(["en", "zh"]).default("en"),
  message: z.string().trim().min(1).max(1500),
});

export async function startSession(alias: string, mode: ConversationMode, locale: Locale) {
  void locale;
  return ensureSession(undefined, alias, mode);
}

export async function sendMessage(input: z.infer<typeof sendMessageSchema>) {
  const session = await ensureSession(input.sessionId, input.alias, input.mode);
  await appendTurn(session.id, {
    role: "user",
    message: input.message,
  });

  const safetyDecision = classifyMessageRisk(input.message, input.locale);
  const resources = await listResources();
  const resourceLinks = filterResourcesForRisk(resources, safetyDecision.riskLevel);

  let assistantMessage = "";
  let responseMode: ChatReply["responseMode"] = "generated";
  let knowledgeSources: ChatReply["knowledgeSources"] = [];

  if (safetyDecision.shouldBypassModel) {
    assistantMessage = buildCrisisReply(safetyDecision.riskLevel, resourceLinks, input.locale);
    responseMode = "scripted";

    await recordRiskEvent({
      sessionId: session.id,
      riskLevel: safetyDecision.riskLevel,
      reason: safetyDecision.reason,
      matchedSignals: safetyDecision.matchedSignals,
      excerpt: input.message.slice(0, 220),
    });
  } else {
    const knowledge = await searchKnowledgeDocuments(input.message, 3);
    knowledgeSources = knowledge.map((document) => ({
      id: document.id,
      title: document.title,
      sourceUrl: document.sourceUrl,
    }));

    assistantMessage = await chatProvider.generateReply({
      locale: input.locale,
      riskLevel: safetyDecision.riskLevel,
      mode: input.mode,
      message: input.message,
      conversation: session.turns,
      knowledge,
    });
  }

  await appendTurn(session.id, {
    role: "assistant",
    message: assistantMessage,
    riskLevel: safetyDecision.riskLevel,
    responseMode,
  });

  return {
    sessionId: session.id,
    alias: session.alias,
    assistantMessage,
    riskLevel: safetyDecision.riskLevel,
    responseMode,
    recommendedActions: safetyDecision.recommendedActions,
    resourceLinks,
    knowledgeSources,
    safetyDecision,
  } satisfies ChatReply & { sessionId: string; alias: string };
}
