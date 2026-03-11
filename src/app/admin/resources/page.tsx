import { AppShell } from "@/components/app-shell";
import { AdminHero } from "@/components/admin-chrome";
import { AdminResourceEditor } from "@/components/admin-resource-editor";
import { listResources } from "@/lib/server/store";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage() {
  const resources = await listResources();
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);
  const urgentCount = resources.filter((resource) => resource.urgency === "urgent").length;
  const regionCount = new Set(resources.map((resource) => resource.region)).size;
  const textCount = resources.filter((resource) => resource.textLine).length;

  return (
    <AppShell eyebrow={dict.pages.adminResources.eyebrow} title={dict.pages.adminResources.title}>
      <div className="space-y-6">
        <AdminHero
          eyebrow={dict.pages.adminResources.heroEyebrow}
          title={dict.pages.adminResources.heroTitle}
          description={dict.pages.adminResources.heroDescription}
          metrics={[
            {
              label: dict.pages.adminResources.metrics.total,
              value: String(resources.length),
              detail: dict.pages.adminResources.metricDetails.total,
              tone: "ink",
            },
            {
              label: dict.pages.adminResources.metrics.urgent,
              value: String(urgentCount),
              detail: dict.pages.adminResources.metricDetails.urgent,
              tone: "warm",
            },
            {
              label: dict.pages.adminResources.metrics.coverage,
              value: String(regionCount),
              detail:
                locale === "zh"
                  ? `${textCount} 个条目支持短信入口`
                  : `${textCount} entries include text-based access`,
              tone: "cool",
            },
          ]}
        />
        <AdminResourceEditor resources={resources} locale={locale} copy={dict.adminResources} />
      </div>
    </AppShell>
  );
}
