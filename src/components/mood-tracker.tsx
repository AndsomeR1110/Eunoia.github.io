"use client";

import { useEffect, useState } from "react";

import { Surface, SectionTitle } from "@/components/cards";
import { getMoodOptions, getPhaseLabel } from "@/lib/i18n";
import { formatDateTime } from "@/lib/utils";
import type { Locale, MoodCheckIn } from "@/lib/types";

interface MoodTrackerCopy {
  logTitle: string;
  logDescription: string;
  missingSession: string;
  notePlaceholder: string;
  trendTitle: string;
  trendDescription: string;
  empty: string;
}

export function MoodTracker({ locale, copy }: { locale: Locale; copy: MoodTrackerCopy }) {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("eunoia-session-id");
  });
  const [history, setHistory] = useState<MoodCheckIn[]>([]);
  const [note, setNote] = useState("");
  const moodOptions = getMoodOptions(locale);
  const latestEntry = history[0];
  const averageScore = history.length
    ? (history.reduce((sum, item) => sum + item.score, 0) / history.length).toFixed(1)
    : null;
  const encouragement = getMoodEncouragement(locale, latestEntry?.score);
  const reflectionPrompts = getReflectionPrompts(locale);

  useEffect(() => {
    if (sessionId || typeof window === "undefined") {
      return;
    }

    const alias = localStorage.getItem("eunoia-alias") || (locale === "zh" ? "安静的彗星" : "Quiet Comet");
    const mode = localStorage.getItem("eunoia-mode") || "support";

    fetch("/api/chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alias, mode, locale }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("eunoia-session-id", data.id);
        setSessionId(data.id);
      })
      .catch(() => undefined);
  }, [locale, sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    fetch(`/api/mood/check-in?sessionId=${sessionId}`)
      .then((response) => response.json())
      .then((data) => setHistory(data.items || []));
  }, [sessionId]);

  async function save(score: number) {
    if (!sessionId) {
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
        sessionId,
        score,
        label: mood.label,
        note,
        phase: "post",
      }),
    });

    const created = await response.json();
    setHistory((current) => [created, ...current]);
    setNote("");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(320px,1.08fr)]">
      <Surface>
        <div className="space-y-5">
          <SectionTitle title={copy.logTitle} description={copy.logDescription} />

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              label={locale === "zh" ? "最近状态" : "Latest state"}
              value={latestEntry?.label || (locale === "zh" ? "还没有记录" : "No check-ins yet")}
            />
            <MetricCard
              label={locale === "zh" ? "平均分" : "Average score"}
              value={averageScore ? `${averageScore}/5` : "--"}
            />
          </div>

          <div className="space-y-4">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={copy.notePlaceholder}
              className="min-h-28 w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
            />
            <div className="grid gap-3">
              {moodOptions.map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => save(item.score)}
                  disabled={!sessionId}
                  className="flex min-h-14 cursor-pointer items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="font-medium text-slate-900">{item.label}</span>
                  <span className="text-sm text-slate-500">{item.score}/5</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-100 bg-cyan-50 px-4 py-4">
            <div className="text-sm font-semibold text-cyan-950">
              {locale === "zh" ? "给现在的你一句话" : "A gentle note for right now"}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{encouragement}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {reflectionPrompts.map((prompt) => (
                <span
                  key={prompt}
                  className="rounded-2xl border border-cyan-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"
                >
                  {prompt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Surface>

      <Surface>
        <SectionTitle title={copy.trendTitle} description={copy.trendDescription} />

        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <MetricCard
            label={locale === "zh" ? "记录次数" : "Entries"}
            value={String(history.length)}
          />
          <MetricCard
            label={locale === "zh" ? "最近一次" : "Last check-in"}
            value={latestEntry ? formatDateTime(latestEntry.createdAt, locale) : "--"}
            compact
          />
          <MetricCard
            label={locale === "zh" ? "当前倾向" : "Current lean"}
            value={latestEntry ? getTrendTone(locale, latestEntry.score) : "--"}
            compact
          />
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="font-medium text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-400">
                  {getPhaseLabel(locale, item.phase)} · {formatDateTime(item.createdAt, locale)}
                </div>
              </div>
              {item.note ? <div className="mt-2 text-sm leading-6 text-slate-600">{item.note}</div> : null}
            </div>
          ))}
          {history.length === 0 ? <div className="text-sm text-slate-500">{copy.empty}</div> : null}
        </div>
      </Surface>
    </div>
  );
}

function MetricCard({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className={`mt-2 font-semibold text-slate-950 ${compact ? "text-sm" : "text-2xl"}`}>
        {value}
      </div>
    </div>
  );
}

function getMoodEncouragement(locale: Locale, score?: number) {
  if (locale === "zh") {
    if (!score) {
      return "不需要一下子把今天讲完整，先记录一个最接近你此刻的状态就够了。";
    }
    if (score <= 2) {
      return "如果今天很沉，先把目标缩小一点：喝口水、离开屏幕一会儿，或者告诉一个可信的人你今天不太好。";
    }
    if (score === 3) {
      return "当感受很复杂时，先记下一个最明显的情绪，比逼自己想清楚全部更有帮助。";
    }
    return "能感觉到一点稳定或希望，本身就很重要。把这份状态也记录下来，给之后的自己留个锚点。";
  }

  if (!score) {
    return "You do not have to explain the whole day. Just choose the closest feeling and start there.";
  }
  if (score <= 2) {
    return "If today feels heavy, shrink the next step: water, a short pause, or telling one trusted person that today is hard.";
  }
  if (score === 3) {
    return "When things feel mixed, naming the clearest feeling is often more useful than trying to untangle everything at once.";
  }
  return "Feeling a little steadier matters too. Logging that state gives future-you something solid to look back on.";
}

function getReflectionPrompts(locale: Locale) {
  return locale === "zh"
    ? ["身体最明显的感觉是什么", "今天最耗能的事是什么", "什么让你稍微好一点"]
    : [
        "What does your body feel most strongly?",
        "What took the most energy today?",
        "What helped even a little?",
      ];
}

function getTrendTone(locale: Locale, score: number) {
  if (locale === "zh") {
    if (score <= 2) return "需要更多照顾";
    if (score === 3) return "有点复杂";
    return "相对稳定";
  }

  if (score <= 2) return "Needs extra care";
  if (score === 3) return "Mixed";
  return "More steady";
}
