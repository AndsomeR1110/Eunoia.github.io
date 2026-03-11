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
    <div className="inline-flex w-[156px] rounded-full border border-[#d8e4ea] bg-white p-1 text-sm">
      {(["en", "zh"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`flex-1 rounded-full px-3 py-1.5 text-center font-medium transition ${locale === item ? "bg-[#1f3341] text-white" : "text-slate-600 hover:bg-[#f1f5f7]"}`}
        >
          {item === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
