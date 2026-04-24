import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);

  return (
    <AppShell eyebrow={dict.pages.home.eyebrow} title={dict.pages.home.title}>
      <section className="mx-auto flex min-h-[calc(100dvh-150px)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="text-sm font-medium text-slate-400">Eunoia</div>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">
          {dict.pages.home.heroTitle}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
          {dict.pages.home.heroDescription}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/chat"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {dict.pages.home.primaryAction}
          </Link>
          <Link
            href="/help-now"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-100"
          >
            {dict.pages.home.helpAction}
          </Link>
        </div>
        <Link
          href="/mood"
          className="mt-5 text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
        >
          {dict.pages.home.secondaryAction}
        </Link>
      </section>
    </AppShell>
  );
}
