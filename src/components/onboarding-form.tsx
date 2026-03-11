"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Surface, SectionTitle } from "@/components/cards";
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
      <Surface className="bg-[linear-gradient(145deg,_#fff3e8_0%,_#fffdf9_42%,_#eef7fa_100%)]">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-[#efd8c7] bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#9f5832]">
            01
          </div>
          <SectionTitle title={copy.title} description={copy.description} />
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{copy.alias}</span>
              <input
                value={alias}
                onChange={(event) => setAlias(event.target.value)}
                className="w-full rounded-[24px] border border-[#e5dbcf] bg-white/90 px-5 py-4 text-base outline-none ring-0 transition focus:border-[#ec9c6c] focus:bg-white"
                placeholder={copy.aliasPlaceholder}
              />
            </label>

            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-700">{copy.chatMode}</div>
              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("support")}
                  className={`min-h-[168px] rounded-[26px] border px-5 py-5 text-left transition ${mode === "support" ? "border-[#f08c5a] bg-white shadow-[0_18px_40px_rgba(240,140,90,0.14)]" : "border-[#e5dbcf] bg-white/80 hover:bg-white"}`}
                >
                  <div className="mb-3 inline-flex rounded-full bg-[#fff1e7] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#9f5832]">
                    A
                  </div>
                  <div className="font-semibold text-slate-900">{copy.supportTitle}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-600">{copy.supportDescription}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("vent")}
                  className={`min-h-[168px] rounded-[26px] border px-5 py-5 text-left transition ${mode === "vent" ? "border-[#7aa2b3] bg-white shadow-[0_18px_40px_rgba(95,143,168,0.14)]" : "border-[#e5dbcf] bg-white/80 hover:bg-white"}`}
                >
                  <div className="mb-3 inline-flex rounded-full bg-[#edf5f8] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#5f8fa8]">
                    B
                  </div>
                  <div className="font-semibold text-slate-900">{copy.ventTitle}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-600">{copy.ventDescription}</div>
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
                className="rounded-full bg-[#1f3341] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#182833]"
              >
                {copy.continue}
              </button>
              <Link
                href="/help-now"
                className="rounded-full border border-[#e5dbcf] bg-white/90 px-5 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-white"
              >
                {copy.previewHelp}
              </Link>
            </div>
          </div>
        </div>
      </Surface>

      <Surface className="bg-[linear-gradient(180deg,_#fffaf5_0%,_#ffffff_45%,_#f7fbfc_100%)]">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-[#d9e7ec] bg-white px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#5d889d]">
            SAFETY
          </div>
          <SectionTitle title={copy.safetyTitle} description={copy.safetyDescription} />
          <div className="space-y-3">
            {copy.bullets.map((bullet) => (
              <div
                key={bullet}
                className="rounded-[22px] border border-[#e8ede8] bg-white px-4 py-4 text-sm leading-7 text-slate-700"
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>
      </Surface>
    </div>
  );
}
