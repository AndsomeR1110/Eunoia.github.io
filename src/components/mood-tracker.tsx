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
  const [sessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("eunoia-session-id");
  });
  const [history, setHistory] = useState<MoodCheckIn[]>([]);
  const [note, setNote] = useState("");
  const moodOptions = getMoodOptions(locale);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/mood/check-in?sessionId=${sessionId}`)
        .then((response) => response.json())
        .then((data) => setHistory(data.items || []));
    }
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
      <Surface className="bg-[linear-gradient(145deg,_#fff4ea_0%,_#fffdf8_45%,_#eef7fa_100%)]">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-[#efd8c7] bg-white/85 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#9f5832]">
            DAILY CHECK-IN
          </div>
          <SectionTitle title={copy.logTitle} description={copy.logDescription} />
        {!sessionId ? (
          <p className="text-sm text-slate-600">{copy.missingSession}</p>
        ) : (
          <div className="space-y-4">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={copy.notePlaceholder}
              className="min-h-28 w-full rounded-[24px] border border-[#e5dbcf] bg-white/90 px-4 py-3 outline-none focus:border-[#ec9c6c]"
            />
            <div className="grid gap-3">
              {moodOptions.map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => save(item.score)}
                  className="flex items-center justify-between rounded-[22px] border border-[#e5dbcf] bg-white px-4 py-4 text-left transition hover:border-[#7da4b5] hover:bg-[#f7fbfd]"
                >
                  <span className="font-medium text-slate-900">{item.label}</span>
                  <span className="text-sm text-slate-500">{item.score}/5</span>
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
      </Surface>

      <Surface className="bg-[linear-gradient(180deg,_#fff_0%,_#f5fafc_100%)]">
        <SectionTitle title={copy.trendTitle} description={copy.trendDescription} />
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-[#dbe7ec] bg-white p-4 shadow-[0_12px_36px_rgba(58,56,70,0.04)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="font-medium text-slate-900">{item.label}</div>
                <div className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {getPhaseLabel(locale, item.phase)} • {formatDateTime(item.createdAt, locale)}
                </div>
              </div>
              {item.note ? <div className="mt-2 text-sm text-slate-600">{item.note}</div> : null}
            </div>
          ))}
          {history.length === 0 ? <div className="text-sm text-slate-500">{copy.empty}</div> : null}
        </div>
      </Surface>
    </div>
  );
}
