import OpenAI from "openai";
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

import { EUNOIA_SYSTEM_PROMPT } from "@/lib/prompts";
import { isProduction, serverEnv } from "@/lib/server/env";
import type { ConversationTurn, KnowledgeDocument, Locale, RiskLevel } from "@/lib/types";

interface GenerateReplyInput {
  locale: Locale;
  riskLevel: RiskLevel;
  mode: "support" | "vent";
  message: string;
  conversation: ConversationTurn[];
  knowledge: KnowledgeDocument[];
}

export interface ChatProvider {
  generateReply(input: GenerateReplyInput): Promise<string>;
  streamReply(input: GenerateReplyInput): AsyncIterable<string>;
}

export class ProviderConfigurationError extends Error {
  constructor(message = "AI provider is not configured.") {
    super(message);
    this.name = "ProviderConfigurationError";
  }
}

export class ProviderRequestError extends Error {
  constructor(message = "AI provider request failed.") {
    super(message);
    this.name = "ProviderRequestError";
  }
}

class OpenAICompatibleProvider implements ChatProvider {
  private client: OpenAI | null;
  private model: string;
  private timeoutMs: number;

  constructor() {
    const apiKey = serverEnv.openAiApiKey;
    this.client = apiKey
      ? new OpenAI({
          apiKey,
          baseURL: serverEnv.openAiBaseUrl,
        })
      : null;
    this.model = serverEnv.openAiModel;
    this.timeoutMs = serverEnv.openAiTimeoutMs;
  }

  async generateReply(input: GenerateReplyInput) {
    if (!this.client) {
      if (shouldUseDemoFallback()) {
        return buildFallbackReply(input);
      }

      throw new ProviderConfigurationError(
        "Missing OPENAI_API_KEY while demo mode is disabled.",
      );
    }

    try {
      const response = (await withTimeout(
        this.client.chat.completions.create(
          buildChatCompletionRequest(input) as unknown as Parameters<
            OpenAI["chat"]["completions"]["create"]
          >[0],
        ),
        this.timeoutMs,
      )) as ChatCompletion;

      return response.choices[0]?.message?.content?.trim() || buildFallbackReply(input);
    } catch (error) {
      console.error("[Eunoia] provider request failed", error);

      if (shouldUseDemoFallback()) {
        return buildFallbackReply(input);
      }

      throw new ProviderRequestError(getProviderFailureMessage(error));
    }
  }

  async *streamReply(input: GenerateReplyInput) {
    if (!this.client) {
      if (shouldUseDemoFallback()) {
        yield buildFallbackReply(input);
        return;
      }

      throw new ProviderConfigurationError(
        "Missing OPENAI_API_KEY while demo mode is disabled.",
      );
    }

    const requestBody = {
      ...buildChatCompletionRequest(input),
      stream: true,
    };

    const { signal, clearTimeoutHandle, didTimeout } = createTimeoutSignal(
      this.timeoutMs,
    );

    let producedText = false;

    try {
      const stream = (await this.client.chat.completions.create(
        requestBody as unknown as Parameters<
          OpenAI["chat"]["completions"]["create"]
        >[0],
        { signal },
      )) as AsyncIterable<ChatCompletionChunk>;

      for await (const chunk of stream) {
        const text = extractChunkText(chunk);
        if (!text) {
          continue;
        }

        producedText = true;
        yield text;
      }

      if (!producedText) {
        yield buildFallbackReply(input);
      }
    } catch (error) {
      console.error("[Eunoia] provider stream failed", error);

      if (shouldUseDemoFallback()) {
        yield buildFallbackReply(input);
        return;
      }

      throw new ProviderRequestError(
        getProviderFailureMessage(
          didTimeout() ? createTimeoutError(this.timeoutMs) : error,
        ),
      );
    } finally {
      clearTimeoutHandle();
    }
  }
}

function buildChatCompletionRequest(input: GenerateReplyInput) {
  const knowledgeBlock =
    input.knowledge.length > 0
      ? `Grounded knowledge:\n${input.knowledge
          .map((document) => `- ${document.title}: ${document.body}`)
          .join("\n")}`
      : "Grounded knowledge: none";

  const conversation = input.conversation
    .slice(-6)
    .map((turn) => `${turn.role.toUpperCase()}: ${turn.message}`)
    .join("\n");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `${EUNOIA_SYSTEM_PROMPT}\n\nConversation mode: ${input.mode}\nRisk level: ${input.riskLevel}\nPreferred output language: ${input.locale === "zh" ? "Simplified Chinese" : "English"}\n${knowledgeBlock}`,
    },
    {
      role: "user",
      content: `Recent conversation:\n${conversation}\n\nLatest teen message:\n${input.message}`,
    },
  ];

  // DashScope accepts non-standard OpenAI-compatible fields like `extra_body`,
  // but the upstream SDK types do not currently model them.
  return {
    model: serverEnv.openAiModel,
    messages,
    temperature: 0.7,
    max_tokens: 220,
    extra_body: {
      enable_thinking: serverEnv.openAiEnableThinking,
    },
  };
}

function shouldUseDemoFallback() {
  if (isProduction()) {
    return serverEnv.allowDemoMode;
  }

  return true;
}

function getProviderFailureMessage(error: unknown) {
  if (
    (error instanceof Error && error.name === "TimeoutError") ||
    (error instanceof Error && error.name === "AbortError")
  ) {
    return "AI provider timed out.";
  }

  return "AI provider request failed.";
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeoutHandle: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      const timeoutError = new Error(`Timed out after ${timeoutMs}ms`);
      timeoutError.name = "TimeoutError";
      reject(timeoutError);
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  let didTimeout = false;
  const timeoutHandle = setTimeout(() => {
    didTimeout = true;
    controller.abort(createTimeoutError(timeoutMs));
  }, timeoutMs);

  return {
    signal: controller.signal,
    didTimeout: () => didTimeout,
    clearTimeoutHandle: () => clearTimeout(timeoutHandle),
  };
}

function createTimeoutError(timeoutMs: number) {
  const timeoutError = new Error(`Timed out after ${timeoutMs}ms`);
  timeoutError.name = "TimeoutError";
  return timeoutError;
}

function extractChunkText(chunk: ChatCompletionChunk) {
  const delta = chunk.choices[0]?.delta?.content as unknown;
  if (typeof delta === "string") {
    return delta;
  }

  if (!Array.isArray(delta)) {
    return "";
  }

  return delta
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }

      if ("text" in part && typeof part.text === "string") {
        return part.text;
      }

      return "";
    })
    .join("");
}

function buildFallbackReply(input: GenerateReplyInput) {
  const snippets = input.knowledge.slice(0, 2).map((document) => document.title);
  if (input.locale === "zh") {
    const validation =
      input.mode === "vent"
        ? "你现在不需要立刻把一切都解决。"
        : "你会觉得这一切很难受，是很可以理解的。";

    const supportStep =
      input.riskLevel === "MODERATE"
        ? "先选一个很小的下一步，例如喝一口水、做两分钟呼吸练习，或者给一个信任的人发消息。"
        : "如果你愿意，我们可以把事情放慢一点，一次只看一小部分。";

    const grounded =
      snippets.length > 0 ? ` 也许和你相关的支持主题有：${snippets.join("、")}。` : "";

    return `${validation}${supportStep}${grounded}`.trim();
  }

  const validation =
    input.mode === "vent"
      ? "You do not have to solve everything in this moment."
      : "It makes sense that this feels like a lot right now.";

  const supportStep =
    input.riskLevel === "MODERATE"
      ? "Pick one tiny next step: a glass of water, a two-minute breathing reset, or texting one trusted person."
      : "If it helps, we can slow this down together and focus on one part at a time.";

  const grounded =
    snippets.length > 0
      ? ` A couple of support topics that may fit are ${snippets.join(" and ")}.`
      : "";

  return `${validation} ${supportStep}${grounded}`.trim();
}

export function getProviderRuntimeStatus() {
  return {
    configured: Boolean(serverEnv.openAiApiKey),
    baseUrl: serverEnv.openAiBaseUrl,
    model: serverEnv.openAiModel,
    thinkingEnabled: serverEnv.openAiEnableThinking,
    timeoutMs: serverEnv.openAiTimeoutMs,
    demoModeEnabled: shouldUseDemoFallback(),
  };
}

export const chatProvider: ChatProvider = new OpenAICompatibleProvider();
