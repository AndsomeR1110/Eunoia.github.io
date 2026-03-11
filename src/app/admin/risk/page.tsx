import { AppShell } from "@/components/app-shell";
import { AdminBadge, AdminHero, AdminSection } from "@/components/admin-chrome";
import { getRiskLevelLabel } from "@/lib/i18n";
import { listRiskEvents } from "@/lib/server/store";
import { getLocale, getServerDictionary } from "@/lib/server/locale";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminRiskPage() {
  const events = await listRiskEvents();
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);
  const criticalCount = events.filter((event) => event.riskLevel === "CRITICAL").length;
  const highCount = events.filter((event) => event.riskLevel === "HIGH").length;

  return (
    <AppShell eyebrow={dict.pages.adminRisk.eyebrow} title={dict.pages.adminRisk.title}>
      <div className="space-y-6">
        <AdminHero
          eyebrow={dict.pages.adminRisk.heroEyebrow}
          title={dict.pages.adminRisk.heroTitle}
          description={dict.pages.adminRisk.heroDescription}
          metrics={[
            {
              label: dict.pages.adminRisk.metrics.total,
              value: String(events.length),
              detail: dict.pages.adminRisk.metricDetails.total,
              tone: "ink",
            },
            {
              label: dict.pages.adminRisk.metrics.critical,
              value: String(criticalCount),
              detail: dict.pages.adminRisk.metricDetails.critical,
              tone: "warm",
            },
            {
              label: dict.pages.adminRisk.metrics.high,
              value: String(highCount),
              detail: dict.pages.adminRisk.metricDetails.high,
              tone: "cool",
            },
          ]}
        />
        <AdminSection
          title={dict.pages.adminRisk.queueTitle}
          description={dict.pages.adminRisk.queueDescription}
          badge={locale === "zh" ? "按最近时间倒序" : "Newest events first"}
          className="bg-[linear-gradient(180deg,_#ffffff_0%,_#fcfaf7_100%)]"
        >
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`rounded-[26px] border p-5 shadow-[0_14px_36px_rgba(58,56,70,0.04)] ${getRiskContainerClasses(event.riskLevel)}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminBadge tone={getRiskTone(event.riskLevel)}>
                      {getRiskLevelLabel(locale, event.riskLevel)}
                    </AdminBadge>
                    <span className="font-medium text-slate-950">{event.reason}</span>
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {formatDateTime(event.createdAt, locale)}
                  </div>
                </div>
                <div className="mt-4 rounded-[22px] border border-white/70 bg-white/75 px-4 py-4 text-sm leading-7 text-slate-700">
                  &quot;{event.excerpt}&quot;
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {dict.pages.adminRisk.signals}
                  </span>
                  {event.matchedSignals.map((signal) => (
                    <AdminBadge key={signal} tone="ink">
                      {signal}
                    </AdminBadge>
                  ))}
                </div>
              </div>
            ))}
            {events.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#d6e3e9] bg-[linear-gradient(180deg,_#f8fbfd_0%,_#ffffff_100%)] px-5 py-8 text-sm text-slate-500">
                {dict.pages.adminRisk.empty}
              </div>
            ) : null}
          </div>
        </AdminSection>
      </div>
    </AppShell>
  );
}

function getRiskTone(level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL") {
  if (level === "CRITICAL") {
    return "danger" as const;
  }

  if (level === "HIGH") {
    return "warm" as const;
  }

  return "ink" as const;
}

function getRiskContainerClasses(level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL") {
  if (level === "CRITICAL") {
    return "border-[#efc9bd] bg-[linear-gradient(180deg,_#fff6f2_0%,_#ffffff_100%)]";
  }

  if (level === "HIGH") {
    return "border-[#f0d8cb] bg-[linear-gradient(180deg,_#fff9f4_0%,_#ffffff_100%)]";
  }

  return "border-[#dbe7ec] bg-[linear-gradient(180deg,_#f7fbfd_0%,_#ffffff_100%)]";
}
