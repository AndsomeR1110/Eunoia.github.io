import { AppShell } from "@/components/app-shell";
import { Surface, SectionTitle } from "@/components/cards";
import { getDemoResourceCopy } from "@/lib/i18n";
import { getLocale, getServerDictionary } from "@/lib/server/locale";
import { listResources } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export default async function HelpNowPage() {
  const resources = await listResources();
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);

  return (
    <AppShell eyebrow={dict.pages.helpNow.eyebrow} title={dict.pages.helpNow.title}>
      <div className="space-y-6">
        <Surface className="bg-[linear-gradient(145deg,_#fff0ea_0%,_#fff9f4_45%,_#ffffff_100%)]">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:items-start">
            <div>
              <SectionTitle
                title={dict.pages.helpNow.cardTitle}
                description={dict.pages.helpNow.cardDescription}
              />
              <div className="space-y-3 text-sm leading-7 text-slate-700">
                {dict.pages.helpNow.steps.map((step) => (
                  <div
                    key={step}
                    className="rounded-[22px] border border-[#f0d6c8] bg-white/85 px-4 py-4"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-[#f1ddcf] bg-white/92 p-5 shadow-[0_18px_50px_rgba(88,68,53,0.08)]">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#a95f39]">
                URGENT SUPPORT
              </div>
              <div className="section-title text-2xl text-slate-950">
                {locale === "zh"
                  ? "如果你现在有立即风险，请先联系真人。"
                  : "If there is immediate risk, reach a real person first."}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {locale === "zh"
                  ? "在 Eunoia 里继续聊天不应该替代现实中的帮助。优先联系身边可信任的人、危机热线，或当地紧急服务。"
                  : "Continuing to chat in Eunoia should never replace real-world help. Start with a trusted adult, a crisis line, or local emergency services."}
              </p>
            </div>
          </div>
        </Surface>

        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((resource) => {
            const resourceCopy = getDemoResourceCopy(locale, resource.id);

            return (
              <Surface
                key={resource.id}
                className="flex min-h-[250px] flex-col justify-between bg-[linear-gradient(180deg,_#ffffff_0%,_#f9fbfc_100%)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="section-title text-2xl text-slate-950">
                      {resourceCopy?.name || resource.name}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {resourceCopy?.description || resource.description}
                    </p>
                  </div>
                  <div className="rounded-full bg-[#edf5f8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#567d8f]">
                    {resourceCopy?.region || resource.region}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-700">
                  {resource.phone ? (
                    <span className="rounded-full bg-[#fff4eb] px-3 py-2 font-medium text-[#944925]">
                      {dict.pages.helpNow.callLabel}: {resource.phone}
                    </span>
                  ) : null}
                  {resource.textLine ? (
                    <span className="rounded-full bg-[#edf5f8] px-3 py-2 font-medium text-[#567d8f]">
                      {resource.textLine}
                    </span>
                  ) : null}
                  {resource.website ? (
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[#d6e3e9] bg-white px-4 py-2 font-semibold text-[#567d8f] transition hover:bg-[#f5fafc]"
                    >
                      {dict.pages.helpNow.visitWebsite}
                    </a>
                  ) : null}
                </div>
              </Surface>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
