"use client";

import { useRouter } from "next/navigation";

import type { Locale } from "@/lib/types";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  async function setLocale(nextLocale: Locale) {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale }),
    });
    router.refresh();
  }

  return (
    <div className="inline-flex min-h-11 w-[156px] rounded-2xl border border-slate-200 bg-white p-1 text-sm shadow-sm">
      {(["en", "zh"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`flex-1 cursor-pointer rounded-xl px-3 py-1.5 text-center font-semibold transition ${locale === item ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          {item === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
