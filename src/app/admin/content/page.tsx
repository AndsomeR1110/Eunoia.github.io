import { AppShell } from "@/components/app-shell";
import { AdminHero } from "@/components/admin-chrome";
import { AdminLogoutButton } from "@/components/admin-session-actions";
import { AdminContentStudio } from "@/components/admin-content-studio";
import { listKnowledgeDocuments } from "@/lib/server/store";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const documents = await listKnowledgeDocuments();
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);
  const publishedCount = documents.filter((document) => document.status === "published").length;
  const draftCount = documents.length - publishedCount;

  return (
    <AppShell
      eyebrow={dict.pages.adminContent.eyebrow}
      title={dict.pages.adminContent.title}
      headerAction={<AdminLogoutButton label={dict.adminLogin.logout} />}
    >
      <div className="space-y-6">
        <AdminHero
          eyebrow={dict.pages.adminContent.heroEyebrow}
          title={dict.pages.adminContent.heroTitle}
          description={dict.pages.adminContent.heroDescription}
          metrics={[
            {
              label: dict.pages.adminContent.metrics.total,
              value: String(documents.length),
              detail: dict.pages.adminContent.metricDetails.total,
              tone: "ink",
            },
            {
              label: dict.pages.adminContent.metrics.published,
              value: String(publishedCount),
              detail: dict.pages.adminContent.metricDetails.published,
              tone: "cool",
            },
            {
              label: dict.pages.adminContent.metrics.drafts,
              value: String(draftCount),
              detail: dict.pages.adminContent.metricDetails.drafts,
              tone: "warm",
            },
          ]}
        />
        <AdminContentStudio documents={documents} locale={locale} copy={dict.adminContent} />
      </div>
    </AppShell>
  );
}
