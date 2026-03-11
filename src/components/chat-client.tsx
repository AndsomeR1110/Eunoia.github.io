"use client";

import Link from "next/link";
import { startTransition, useEffect, useEffectEvent, useState } from "react";

import { Surface, SectionTitle } from "@/components/cards";
import {
  getMoodOptions,
  getResponseModeLabel,
  getRiskLevelLabel,
} from "@/lib/i18n";
import { formatDateTime } from "@/lib/utils";
import type {
  ChatReply,
  ConversationMode,
  ConversationTurn,
  Locale,
  SafetyDecision,
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
  supportSummaryTitle: string;
  supportSummaryDescription: string;
  latestResponse: string;
  waiting: string;
  recommendedActions: string;
  actionGuidance: string;
  resourceLinks: string;
  safetyLedgerTitle: string;
  safetyLedgerDescription: string;
  riskLevel: string;
  reason: string;
  matchedSignals: string;
  noMessages: string;
  noneDetected: string;
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
  const [preMoodSaved, setPreMoodSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const moodOptions = getMoodOptions(locale);

  const bootstrap = useEffectEvent(async () => {
    const alias = localStorage.getItem("eunoia-alias") || (locale === "zh" ? "安静的彗星" : "Quiet Comet");
    const mode = (localStorage.getItem("eunoia-mode") as ConversationMode) || "support";

    const response = await fetch("/api/chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alias, mode, locale }),
    });

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

  async function saveMood(score: number) {
    if (!state.sessionId) {
      return;
    }

    const mood = moodOptions.find((item) => item.score === score);
    if (!mood) {
      return;
    }

    await fetch("/api/mood/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: state.sessionId,
        score,
        label: mood.label,
        phase: "pre",
      }),
    });
    setPreMoodSaved(true);
  }

  async function send(nextMessage: string) {
    if (!nextMessage.trim() || !state.sessionId) {
      return;
    }

    const optimisticTurn: ConversationTurn = {
      id: `client-${Date.now()}`,
      role: "user",
      message: nextMessage,
      createdAt: new Date().toISOString(),
    };

    setLoading(true);
    setError(null);
    setState((current) => ({
      ...current,
      turns: [...current.turns, optimisticTurn],
    }));
    setMessage("");

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          alias: state.alias,
          mode: state.mode,
          locale,
          message: nextMessage,
        }),
      });

      const reply = (await response.json()) as ChatReply & { sessionId: string };
      const assistantTurn: ConversationTurn = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        message: reply.assistantMessage,
        createdAt: new Date().toISOString(),
        riskLevel: reply.riskLevel,
        responseMode: reply.responseMode,
      };

      setState((current) => ({
        ...current,
        sessionId: reply.sessionId,
        turns: [...current.turns, assistantTurn],
        lastReply: reply,
      }));
    } catch {
      setError(copy.sendError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_380px]">
      <Surface className="min-h-[760px] bg-[linear-gradient(180deg,_#ffffff_0%,_#fcfaf7_100%)]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-slate-500">
              {copy.chattingAs} {state.alias}
            </div>
            <div className="section-title mt-2 text-3xl text-slate-950">
              {state.mode === "vent" ? copy.ventMode : copy.supportMode}
            </div>
          </div>
          <div className="rounded-full border border-[#f1dccf] bg-[#fff7f0] px-4 py-2 text-sm text-[#9f5832]">
            {copy.riskBanner}
          </div>
        </div>

        {!preMoodSaved && (
          <div className="mb-6 rounded-[28px] border border-[#f1dccf] bg-[linear-gradient(180deg,_#fff8f2_0%,_#fffdf9_100%)] p-5">
            <div className="mb-3 text-sm font-semibold tracking-[0.12em] text-[#9f5832]">
              {copy.preMoodTitle}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {moodOptions.map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => saveMood(item.score)}
                  className="rounded-full border border-[#e6d6c4] bg-white px-3.5 py-2.5 text-sm text-slate-700 transition hover:border-[#ec9c6c] hover:bg-[#fff8f2]"
                >
                  {item.score}. {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-[32px] border border-[#ebe7e1] bg-[#fcfbf8] p-4 sm:p-5">
          <div className="space-y-4">
          {state.turns.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#d8e4ea] bg-[linear-gradient(180deg,_#f7fbfd_0%,_#ffffff_100%)] p-6">
              <div className="section-title text-2xl text-slate-950">{copy.startTitle}</div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {copy.startDescription}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {copy.starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setMessage(prompt)}
                    className="rounded-[22px] border border-[#d4e3ea] bg-white px-4 py-4 text-left text-sm leading-6 text-slate-700 transition hover:bg-[#edf5f8]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {state.turns.map((turn) => (
            <div
              key={turn.id}
              className={`max-w-3xl rounded-[28px] border px-5 py-4 shadow-[0_12px_36px_rgba(58,56,70,0.04)] ${turn.role === "assistant" ? "border-[#dce9ee] bg-[#f7fbfd]" : "ml-auto border-[#f1ddcf] bg-[#fff4eb]"}`}
            >
              <div className="mb-2 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                <span>{turn.role === "assistant" ? "Eunoia" : state.alias}</span>
                <span>{formatDateTime(turn.createdAt, locale)}</span>
                {turn.riskLevel ? <span>{getRiskLevelLabel(locale, turn.riskLevel)}</span> : null}
              </div>
              <p className="text-sm leading-7 text-slate-800">{turn.message}</p>
            </div>
          ))}
          </div>
        </div>

        <div className="mt-6 rounded-[30px] border border-[#e9e3da] bg-white p-4 shadow-[0_16px_50px_rgba(52,48,61,0.05)]">
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={copy.inputPlaceholder}
              className="min-h-32 w-full rounded-[24px] border border-[#e5dbcf] bg-[#fffdf9] px-5 py-4 outline-none transition focus:border-[#ec9c6c]"
            />
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => send(message)}
                disabled={loading}
                className="rounded-full bg-[#1f3341] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#182833] disabled:opacity-50"
              >
                {loading ? copy.thinking : copy.send}
              </button>
              <Link
                href="/help-now"
                className="rounded-full border border-[#f1ddcf] bg-[#fff7f1] px-5 py-3 text-sm font-semibold text-[#a94f28] transition hover:bg-[#fff1e8]"
              >
                {copy.urgentHelp}
              </Link>
            </div>
          </div>
        </div>
      </Surface>

      <div className="sticky top-6 space-y-6 self-start">
        <SupportSummary locale={locale} copy={copy} lastReply={state.lastReply} />
        <SafetyLedger locale={locale} copy={copy} safetyDecision={state.lastReply?.safetyDecision} />
      </div>
    </div>
  );
}

function SupportSummary({
  lastReply,
  locale,
  copy,
}: {
  lastReply?: ChatReply;
  locale: Locale;
  copy: ChatClientCopy;
}) {
  return (
    <Surface className="bg-[linear-gradient(180deg,_#eff6f8_0%,_#ffffff_100%)]">
      <SectionTitle
        title={copy.supportSummaryTitle}
        description={copy.supportSummaryDescription}
      />

      <div className="space-y-4 text-sm text-slate-700">
        <div className="rounded-2xl bg-white/90 p-4">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{copy.latestResponse}</div>
          <div className="mt-2 font-medium text-slate-900">
            {lastReply
              ? `${getRiskLevelLabel(locale, lastReply.riskLevel)} • ${getResponseModeLabel(locale, lastReply.responseMode)}`
              : copy.waiting}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500">{copy.recommendedActions}</div>
          <div className="space-y-2">
            {(lastReply?.recommendedActions || []).map((action) => (
              <div key={action.id} className="rounded-[22px] border border-[#dbe7ec] bg-white p-4">
                <div className="font-medium text-slate-900">{action.label}</div>
                <div className="mt-1 text-slate-600">{action.description}</div>
              </div>
            ))}
            {!lastReply ? <div className="text-slate-500">{copy.actionGuidance}</div> : null}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500">{copy.resourceLinks}</div>
          <div className="space-y-2">
            {(lastReply?.resourceLinks || []).map((resource) => (
              <a
                key={resource.id}
                href={resource.website}
                target="_blank"
                rel="noreferrer"
                className="block rounded-[22px] border border-[#dbe7ec] bg-white p-4 transition hover:border-[#7da4b5]"
              >
                <div className="font-medium text-slate-900">{resource.name}</div>
                <div className="mt-1 text-slate-600">
                  {resource.phone || resource.textLine || resource.website}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

function SafetyLedger({
  safetyDecision,
  locale,
  copy,
}: {
  safetyDecision?: SafetyDecision;
  locale: Locale;
  copy: ChatClientCopy;
}) {
  return (
    <Surface>
      <SectionTitle title={copy.safetyLedgerTitle} description={copy.safetyLedgerDescription} />
      <div className="space-y-3 text-sm text-slate-700">
        <RiskRow
          label={copy.riskLevel}
          value={getRiskLevelLabel(locale, safetyDecision?.riskLevel || "LOW")}
        />
        <RiskRow label={copy.reason} value={safetyDecision?.reason || copy.noMessages} />
        <RiskRow
          label={copy.matchedSignals}
          value={safetyDecision?.matchedSignals.join(", ") || copy.noneDetected}
        />
      </div>
    </Surface>
  );
}

function RiskRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-[#f8f5f0] p-4">
      <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</div>
      <div className="mt-1 text-slate-900">{value}</div>
    </div>
  );
}
