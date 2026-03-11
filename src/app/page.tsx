import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Surface, SectionTitle } from "@/components/cards";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);

  return (
    <AppShell eyebrow={dict.pages.home.eyebrow} title={dict.pages.home.title}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <Surface className="min-h-[360px] bg-[linear-gradient(135deg,_#fff0e4_0%,_#ffffff_48%,_#eef6f8_100%)]">
            <div className="flex h-full flex-col justify-between gap-8">
              <SectionTitle
                title={dict.pages.home.heroTitle}
                description={dict.pages.home.heroDescription}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <Link
                  href="/chat"
                  className="rounded-[24px] bg-[#1f3341] px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#182833]"
                >
                  {dict.pages.home.primaryAction}
                </Link>
                <Link
                  href="/mood"
                  className="rounded-[24px] border border-[#d6e3e9] bg-white px-5 py-4 text-center text-sm font-semibold text-slate-800 transition hover:bg-[#f7fbfd]"
                >
                  {dict.pages.home.secondaryAction}
                </Link>
                <Link
                  href="/help-now"
                  className="rounded-[24px] border border-[#efc9b9] bg-[#fff6f1] px-5 py-4 text-center text-sm font-semibold text-[#944925] transition hover:bg-[#fff1e9]"
                >
                  {dict.pages.home.helpAction}
                </Link>
              </div>
            </div>
          </Surface>

          <Surface className="min-h-[360px] bg-[linear-gradient(180deg,_#edf5f8_0%,_#ffffff_100%)]">
            <SectionTitle
              title={dict.pages.home.safetyTitle}
              description={dict.pages.home.safetyDescription}
            />
            <div className="space-y-3">
              {dict.pages.home.safetyBullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-[22px] border border-[#d7e4ea] bg-white/90 px-4 py-4 text-sm leading-7 text-slate-700"
                >
                  {bullet}
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dict.pages.home.featureCards.map((card) => (
            <Surface
              key={card.title}
              className="flex min-h-[260px] flex-col justify-between bg-[linear-gradient(180deg,_#ffffff_0%,_#f9fbfc_100%)]"
            >
              <div>
                <h3 className="section-title text-2xl text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
              <Link
                href={card.href}
                className="mt-6 inline-flex w-fit rounded-full border border-[#d6e3e9] bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-[#f2f7f9]"
              >
                {card.cta}
              </Link>
            </Surface>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
