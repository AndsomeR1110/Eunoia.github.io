"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Locale } from "@/lib/types";

interface OnboardingCopy {
  title: string;
  description: string;
  alias: string;
  aliasPlaceholder: string;
  chatMode: string;
  supportTitle: string;
  supportDescription: string;
  ventTitle: string;
  ventDescription: string;
  continue: string;
  safetyTitle: string;
  safetyDescription: string;
  bullets: readonly string[];
  previewHelp: string;
}

export function OnboardingForm({ locale, copy }: { locale: Locale; copy: OnboardingCopy }) {
  const router = useRouter();
  const [alias, setAlias] = useState(locale === "zh" ? "安静的彗星" : "Quiet Comet");
  const [mode, setMode] = useState<"support" | "vent">("support");

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">{copy.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{copy.description}</p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">{copy.alias}</span>
          <input
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
            placeholder={copy.aliasPlaceholder}
          />
        </label>

        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-500">{copy.chatMode}</div>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("support")}
              className={`min-h-32 cursor-pointer rounded-3xl border px-5 py-5 text-left transition ${
                mode === "support"
                  ? "border-slate-900 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="font-semibold">{copy.supportTitle}</div>
              <div className={`mt-2 text-sm leading-6 ${mode === "support" ? "text-slate-200" : "text-slate-500"}`}>
                {copy.supportDescription}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode("vent")}
              className={`min-h-32 cursor-pointer rounded-3xl border px-5 py-5 text-left transition ${
                mode === "vent"
                  ? "border-slate-900 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="font-semibold">{copy.ventTitle}</div>
              <div className={`mt-2 text-sm leading-6 ${mode === "vent" ? "text-slate-200" : "text-slate-500"}`}>
                {copy.ventDescription}
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(
                "eunoia-alias",
                alias.trim() || (locale === "zh" ? "安静的彗星" : "Quiet Comet"),
              );
              localStorage.setItem("eunoia-mode", mode);
              router.push("/chat");
            }}
            className="inline-flex min-h-12 cursor-pointer items-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {copy.continue}
          </button>
          <Link
            href="/help-now"
            className="inline-flex min-h-12 items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            {copy.previewHelp}
          </Link>
        </div>
      </div>
    </div>
  );
}
