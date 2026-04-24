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
import type { ChatReplyWithSession } from "@/lib/types";

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
  const prepared = await prepareMessageResponse(input);

  let assistantMessage = prepared.assistantMessage;
  if (!assistantMessage) {
    assistantMessage = await collectStreamText(prepared.stream);
  }

  return finalizePreparedMessage(prepared, assistantMessage);
}

export async function prepareMessageStream(input: z.infer<typeof sendMessageSchema>) {
  const prepared = await prepareMessageResponse(input);

  return {
    sessionId: prepared.session.id,
    alias: prepared.session.alias,
    riskLevel: prepared.safetyDecision.riskLevel,
    responseMode: prepared.responseMode,
    stream: prepared.stream,
    complete: (assistantMessage: string) =>
      finalizePreparedMessage(prepared, assistantMessage),
  };
}

async function prepareMessageResponse(input: z.infer<typeof sendMessageSchema>) {
  const session = await ensureSession(input.sessionId, input.alias, input.mode);
  await appendTurn(session.id, {
    role: "user",
    message: input.message,
  });

  const safetyDecision = classifyMessageRisk(input.message, input.locale);
  const resources = await listResources();
  const resourceLinks = filterResourcesForRisk(resources, safetyDecision.riskLevel);

  let responseMode: ChatReply["responseMode"] = "generated";
  let knowledgeSources: ChatReply["knowledgeSources"] = [];
  let assistantMessage = "";
  let stream: AsyncIterable<string>;

  if (safetyDecision.shouldBypassModel) {
    assistantMessage = buildCrisisReply(safetyDecision.riskLevel, resourceLinks, input.locale);
    responseMode = "scripted";
    stream = createStaticStream(assistantMessage);

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

    stream = chatProvider.streamReply({
      locale: input.locale,
      riskLevel: safetyDecision.riskLevel,
      mode: input.mode,
      message: input.message,
      conversation: session.turns,
      knowledge,
    });
  }

  return {
    session,
    assistantMessage,
    responseMode,
    knowledgeSources,
    resourceLinks,
    safetyDecision,
    stream,
  };
}

async function finalizePreparedMessage(
  prepared: Awaited<ReturnType<typeof prepareMessageResponse>>,
  assistantMessage: string,
) {
  const finalMessage = assistantMessage.trim();

  await appendTurn(prepared.session.id, {
    role: "assistant",
    message: finalMessage,
    riskLevel: prepared.safetyDecision.riskLevel,
    responseMode: prepared.responseMode,
  });

  return {
    sessionId: prepared.session.id,
    alias: prepared.session.alias,
    assistantMessage: finalMessage,
    riskLevel: prepared.safetyDecision.riskLevel,
    responseMode: prepared.responseMode,
    recommendedActions: prepared.safetyDecision.recommendedActions,
    resourceLinks: prepared.resourceLinks,
    knowledgeSources: prepared.knowledgeSources,
    safetyDecision: prepared.safetyDecision,
  } satisfies ChatReplyWithSession;
}

async function collectStreamText(stream: AsyncIterable<string>) {
  let assistantMessage = "";

  for await (const chunk of stream) {
    assistantMessage += chunk;
  }

  return assistantMessage.trim();
}

async function* createStaticStream(message: string) {
  yield message;
}
