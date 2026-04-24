import { AppShell } from "@/components/app-shell";
import { Surface, SectionTitle } from "@/components/cards";
import { getDemoResourceCopy } from "@/lib/i18n";
import { getLocale, getServerDictionary } from "@/lib/server/locale";
import { listResources } from "@/lib/server/store";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HelpNowPage() {
  const resources = await listResources();
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);
  const urgentResources = resources.filter((resource) => resource.urgency === "urgent");
  const textResources = resources.filter((resource) => resource.textLine);

  return (
    <AppShell eyebrow={dict.pages.helpNow.eyebrow} title={dict.pages.helpNow.title}>
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <Surface className="border-red-100 bg-red-50/70">
            <SectionTitle
              title={dict.pages.helpNow.cardTitle}
              description={dict.pages.helpNow.cardDescription}
            />
            <div className="space-y-3 text-sm leading-7 text-slate-700">
              {dict.pages.helpNow.steps.map((step) => (
                <div
                  key={step}
                  className="rounded-3xl border border-red-100 bg-white px-4 py-4"
                >
                  {step}
                </div>
              ))}
            </div>
          </Surface>

          <Surface>
            <SectionTitle
              title={locale === "zh" ? "最快的求助路径" : "Fastest paths to support"}
              description={
                locale === "zh"
                  ? "如果你现在不确定点哪个，先看你最容易做到哪一步。"
                  : "If you are not sure what to choose, start with the option that feels easiest to do right now."
              }
            />
            <div className="space-y-2">
              {getHelpModes(locale, urgentResources.length, textResources.length).map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">{item.description}</div>
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((resource) => {
            const resourceCopy = getDemoResourceCopy(locale, resource.id);

            return (
              <Surface
                key={resource.id}
                className="flex min-h-56 flex-col justify-between"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-semibold text-slate-950">
                      {resourceCopy?.name || resource.name}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {resourceCopy?.description || resource.description}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    {resourceCopy?.region || resource.region}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-semibold uppercase text-slate-500">
                      {locale === "zh" ? "适合什么时候" : "Best when"}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-700">
                      {getResourceUseCase(locale, resource.id)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                    {resource.phone ? (
                      <span className="rounded-2xl bg-red-50 px-3 py-2 font-medium text-red-800">
                        {dict.pages.helpNow.callLabel}: {resource.phone}
                      </span>
                    ) : null}
                    {resource.textLine ? (
                      <span className="rounded-2xl bg-slate-100 px-3 py-2 font-medium text-slate-600">
                        {resource.textLine}
                      </span>
                    ) : null}
                    {resource.website ? (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-50"
                      >
                        {dict.pages.helpNow.visitWebsite}
                      </a>
                    ) : null}
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function getHelpModes(locale: Locale, urgentCount: number, textCount: number) {
  return locale === "zh"
    ? [
        {
          title: "马上打电话",
          description: `如果你有立即风险，优先使用电话类资源。当前可见 ${urgentCount} 个更偏紧急的入口。`,
        },
        {
          title: "不想开口说话",
          description: `如果你现在不方便说话，也可以先走短信或网页路径。当前有 ${textCount} 个文字类入口。`,
        },
        {
          title: "先找身边的人",
          description: "如果可以，尽量优先告诉身边可信任的大人、朋友、老师或照护者你现在需要陪伴。",
        },
      ]
    : [
        {
          title: "Call first",
          description: `If there is immediate risk, start with phone-based resources. ${urgentCount} urgent routes are available here.`,
        },
        {
          title: "Use text if speaking feels hard",
          description: `If talking out loud feels impossible, start with text or web-based support. ${textCount} text-friendly routes are available.`,
        },
        {
          title: "Reach someone nearby",
          description: "If possible, tell one trusted adult, friend, teacher, or caregiver that you need support right now.",
        },
      ];
}

function getResourceUseCase(locale: Locale, resourceId: string) {
  const zh: Record<string, string> = {
    "res-988": "你需要尽快和真人通话，或者已经不太确定自己能否安全度过接下来的时间。",
    "res-crisis-text": "你不想打电话，或者觉得通过文字更容易把话说出来。",
    "res-trevor": "你希望找到对 LGBTQ+ 青少年更有经验、更理解相关处境的支持。",
    "res-emergency": "现场已经有立即危险，或者你无法保证自己或他人的安全。",
  };

  const en: Record<string, string> = {
    "res-988": "Use this when you need to connect to a real person quickly or are unsure you can stay safe.",
    "res-crisis-text": "Use this when speaking aloud feels too hard and texting is the easier first step.",
    "res-trevor": "Use this if LGBTQ+ specific support would feel safer, more relevant, or easier to trust.",
    "res-emergency": "Use this when there is immediate danger or someone cannot stay safe right now.",
  };

  return (locale === "zh" ? zh : en)[resourceId] || "";
}
