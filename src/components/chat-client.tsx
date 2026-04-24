"use client";

import Link from "next/link";
import {
  KeyboardEvent,
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import { getMoodOptions } from "@/lib/i18n";
import { formatDateTime } from "@/lib/utils";
import type {
  ChatReply,
  ChatReplyWithSession,
  ChatStreamEvent,
  ConversationMode,
  ConversationTurn,
  Locale,
} from "@/lib/types";

interface ChatState {
  alias: string;
  mode: ConversationMode;
  sessionId?: string;
  turns: ConversationTurn[];
  lastReply?: ChatReply;
}

interface ChatClientCopy {
  chattingAs: string;
  supportMode: string;
  ventMode: string;
  riskBanner: string;
  preMoodTitle: string;
  startTitle: string;
  startDescription: string;
  inputPlaceholder: string;
  thinking: string;
  send: string;
  urgentHelp: string;
  sessionError: string;
  sendError: string;
  starterPrompts: readonly string[];
}

export function ChatClient({ locale, copy }: { locale: Locale; copy: ChatClientCopy }) {
  const [state, setState] = useState<ChatState>({
    alias: locale === "zh" ? "安静的彗星" : "Quiet Comet",
    mode: "support",
    turns: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingAssistantId, setStreamingAssistantId] = useState<string | null>(null);
  const [preMoodSaved, setPreMoodSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const moodOptions = getMoodOptions(locale);

  const bootstrap = useEffectEvent(async () => {
    const alias = localStorage.getItem("eunoia-alias") || (locale === "zh" ? "安静的彗星" : "Quiet Comet");
    const mode = (localStorage.getItem("eunoia-mode") as ConversationMode) || "support";

    const response = await fetch("/api/chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alias, mode, locale }),
    });

    if (!response.ok) {
      throw new Error("Unable to create session");
    }

    const data = await response.json();
    setState((current) => ({
      ...current,
      alias: data.alias,
      mode: data.mode,
      sessionId: data.id,
    }));
    localStorage.setItem("eunoia-session-id", data.id);
  });

  useEffect(() => {
    startTransition(() => {
      bootstrap().catch(() => setError(copy.sessionError));
    });
  }, [copy.sessionError]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.turns.length, loading]);

  function changeMode(mode: ConversationMode) {
    setState((current) => ({ ...current, mode }));
    localStorage.setItem("eunoia-mode", mode);
  }

  async function saveMood(score: number) {
    if (!state.sessionId) {
      return;
    }

    const mood = moodOptions.find((item) => item.score === score);
    if (!mood) {
      return;
    }

    const response = await fetch("/api/mood/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: state.sessionId,
        score,
        label: mood.label,
        phase: "pre",
      }),
    });

    if (response.ok) {
      setPreMoodSaved(true);
    }
  }

  async function send(nextMessage: string) {
    const trimmed = nextMessage.trim();
    if (!trimmed || !state.sessionId || loading) {
      return;
    }

    const optimisticTurn: ConversationTurn = {
      id: `client-${Date.now()}`,
      role: "user",
      message: trimmed,
      createdAt: new Date().toISOString(),
    };

    setLoading(true);
    setStreamingAssistantId(null);
    setError(null);
    setState((current) => ({
      ...current,
      turns: [...current.turns, optimisticTurn],
    }));
    setMessage("");

    try {
      const response = await fetch("/api/chat/message/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          alias: state.alias,
          mode: state.mode,
          locale,
          message: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error(await getRouteErrorMessage(response));
      }

      if (!response.body) {
        throw new Error("Streaming response body is missing.");
      }

      const assistantTurnId = `assistant-${Date.now()}`;
      const assistantCreatedAt = new Date().toISOString();
      setStreamingAssistantId(assistantTurnId);

      const reply = await consumeChatStream(response.body, {
        onMeta: (event) => {
          setState((current) => ({
            ...current,
            sessionId: event.sessionId,
            alias: event.alias,
          }));
          localStorage.setItem("eunoia-session-id", event.sessionId);
        },
        onChunk: (text) => {
          setState((current) => {
            const existingTurnIndex = current.turns.findIndex(
              (turn) => turn.id === assistantTurnId,
            );

            if (existingTurnIndex === -1) {
              return {
                ...current,
                turns: [
                  ...current.turns,
                  {
                    id: assistantTurnId,
                    role: "assistant",
                    message: text,
                    createdAt: assistantCreatedAt,
                  },
                ],
              };
            }

            const turns = [...current.turns];
            const currentTurn = turns[existingTurnIndex];
            turns[existingTurnIndex] = {
              ...currentTurn,
              message: currentTurn.message + text,
            };

            return {
              ...current,
              turns,
            };
          });
        },
      });

      setState((current) => ({
        ...current,
        sessionId: reply.sessionId,
        alias: reply.alias,
        turns: upsertAssistantTurn(current.turns, {
          id: assistantTurnId,
          role: "assistant",
          message: reply.assistantMessage,
          createdAt: assistantCreatedAt,
          responseMode: reply.responseMode,
        }),
        lastReply: reply,
      }));
      localStorage.setItem("eunoia-session-id", reply.sessionId);
    } catch {
      setError(copy.sendError);
    } finally {
      setLoading(false);
      setStreamingAssistantId(null);
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void send(message);
    }
  }

  return (
    <section className="mx-auto flex h-[calc(100dvh-142px)] min-h-[620px] max-w-5xl flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <ModeButton active={state.mode === "support"} onClick={() => changeMode("support")}>
            {copy.supportMode}
          </ModeButton>
          <ModeButton active={state.mode === "vent"} onClick={() => changeMode("vent")}>
            {copy.ventMode}
          </ModeButton>
          <span className="text-xs text-slate-400">
            {copy.chattingAs} {state.alias}
          </span>
        </div>

        <Link
          href="/help-now"
          className="inline-flex min-h-10 items-center rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100"
        >
          {copy.urgentHelp}
        </Link>
      </div>

      {!preMoodSaved && state.turns.length === 0 ? (
        <div className="mb-4 rounded-3xl border border-cyan-100 bg-cyan-50/70 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium text-cyan-950">{copy.preMoodTitle}</div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {moodOptions.map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => saveMood(item.score)}
                  className="min-h-10 shrink-0 cursor-pointer rounded-2xl border border-cyan-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-500 hover:bg-cyan-50"
                >
                  {item.score} · {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-1 py-4">
        {state.turns.length === 0 ? (
          <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center text-center">
            <p className="text-lg font-medium text-slate-700">{copy.startTitle}</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{copy.startDescription}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {copy.starterPrompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void send(prompt)}
                  className="min-h-10 cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {state.turns.map((turn) => (
            <MessageBubble key={turn.id} turn={turn} alias={state.alias} locale={locale} />
          ))}
          {loading && !hasStreamingAssistantText(state.turns, streamingAssistantId) ? (
            <TypingIndicator />
          ) : null}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-1 pb-2 pt-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
          <label htmlFor="chat-message" className="sr-only">
            {copy.inputPlaceholder}
          </label>
          <textarea
            id="chat-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={copy.inputPlaceholder}
            className="min-h-20 w-full resize-none rounded-2xl border-0 bg-transparent px-3 py-3 text-base leading-7 text-slate-900 outline-none placeholder:text-slate-400"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1">
            <div className="text-xs leading-5 text-slate-400">{copy.riskBanner}</div>
            <button
              type="button"
              onClick={() => send(message)}
              disabled={loading || !message.trim() || !state.sessionId}
              className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {copy.send}
            </button>
          </div>
        </div>
        {error ? <div className="mt-2 px-3 text-sm font-medium text-red-700">{error}</div> : null}
      </div>
    </section>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 cursor-pointer rounded-2xl px-3.5 py-2 text-sm font-medium transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function MessageBubble({
  turn,
  alias,
  locale,
}: {
  turn: ConversationTurn;
  alias: string;
  locale: Locale;
}) {
  const isAssistant = turn.role === "assistant";

  return (
    <article className={`group flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[86%] ${isAssistant ? "text-slate-900" : "text-white"}`}>
        <div
          className={`rounded-3xl px-4 py-3 ${
            isAssistant
              ? "bg-white shadow-sm ring-1 ring-slate-200"
              : "bg-slate-950"
          }`}
        >
          <p className="whitespace-pre-wrap text-base leading-7">{turn.message}</p>
        </div>
        <div
          className={`mt-1 px-2 text-xs text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 ${
            isAssistant ? "text-left" : "text-right"
          }`}
        >
          <span>{isAssistant ? "Eunoia" : alias}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={turn.createdAt}>{formatDateTime(turn.createdAt, locale)}</time>
        </div>
      </div>
    </article>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-3xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
        <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
        <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
        <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
      </div>
    </div>
  );
}

function upsertAssistantTurn(
  turns: ConversationTurn[],
  nextTurn: ConversationTurn,
) {
  const existingTurnIndex = turns.findIndex((turn) => turn.id === nextTurn.id);
  if (existingTurnIndex === -1) {
    return [...turns, nextTurn];
  }

  const updatedTurns = [...turns];
  updatedTurns[existingTurnIndex] = {
    ...updatedTurns[existingTurnIndex],
    ...nextTurn,
  };
  return updatedTurns;
}

function hasStreamingAssistantText(
  turns: ConversationTurn[],
  streamingAssistantId: string | null,
) {
  if (!streamingAssistantId) {
    return false;
  }

  return Boolean(
    turns.find((turn) => turn.id === streamingAssistantId)?.message.trim(),
  );
}

async function consumeChatStream(
  stream: ReadableStream<Uint8Array>,
  handlers: {
    onMeta: (event: Extract<ChatStreamEvent, { type: "meta" }>) => void;
    onChunk: (text: string) => void;
  },
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalReply: ChatReplyWithSession | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          continue;
        }

        const event = JSON.parse(trimmedLine) as ChatStreamEvent;
        if (event.type === "meta") {
          handlers.onMeta(event);
          continue;
        }

        if (event.type === "chunk") {
          handlers.onChunk(event.text);
          continue;
        }

        if (event.type === "done") {
          finalReply = event.reply;
          continue;
        }

        if (event.type === "error") {
          throw new Error(event.error);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!finalReply) {
    throw new Error("Streaming response ended before completion.");
  }

  return finalReply;
}

async function getRouteErrorMessage(response: Response) {
  try {
    const json = (await response.json()) as { error?: string };
    return json.error || "Message failed";
  } catch {
    return "Message failed";
  }
}
