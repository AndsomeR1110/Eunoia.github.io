"use client";

import { useRouter } from "next/navigation";

import { AdminBadge, AdminSection } from "@/components/admin-chrome";
import type { Locale, ResourceDirectoryEntry } from "@/lib/types";

interface AdminResourceCopy {
  title: string;
  description: string;
  fields: {
    phone: string;
    textLine: string;
    website: string;
    region: string;
  };
}

export function AdminResourceEditor({
  resources,
  locale,
  copy,
}: {
  resources: ResourceDirectoryEntry[];
  locale: Locale;
  copy: AdminResourceCopy;
}) {
  const router = useRouter();
  const urgentCount = resources.filter((resource) => resource.urgency === "urgent").length;
  const textEnabledCount = resources.filter((resource) => resource.textLine).length;

  async function update(id: string, field: keyof ResourceDirectoryEntry, value: string) {
    await fetch(`/api/admin/resources/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    router.refresh();
  }

  return (
    <AdminSection
      title={copy.title}
      description={copy.description}
      badge={locale === "zh" ? "保存于失焦时自动触发" : "Saves on field blur"}
      className="bg-[linear-gradient(180deg,_#ffffff_0%,_#f5fafc_100%)]"
    >
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <MetricCard
          label={locale === "zh" ? "资源总数" : "Total resources"}
          value={String(resources.length)}
          tone="ink"
        />
        <MetricCard
          label={locale === "zh" ? "紧急入口" : "Urgent entries"}
          value={String(urgentCount)}
          tone="warm"
        />
        <MetricCard
          label={locale === "zh" ? "短信可达" : "Text reachable"}
          value={String(textEnabledCount)}
          tone="cool"
        />
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="rounded-[26px] border border-[#dbe7ec] bg-white/95 p-5 shadow-[0_14px_36px_rgba(58,56,70,0.04)]"
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-medium text-slate-950">{resource.name}</div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{resource.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminBadge tone={resource.urgency === "urgent" ? "danger" : "warm"}>
                  {getUrgencyLabel(locale, resource.urgency)}
                </AdminBadge>
                <AdminBadge tone="cool">{getAudienceLabel(locale, resource.audience)}</AdminBadge>
                <AdminBadge tone="ink">{resource.region}</AdminBadge>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <EditableField
                label={copy.fields.phone}
                value={resource.phone || ""}
                onSave={(value) => update(resource.id, "phone", value)}
              />
              <EditableField
                label={copy.fields.textLine}
                value={resource.textLine || ""}
                onSave={(value) => update(resource.id, "textLine", value)}
              />
              <EditableField
                label={copy.fields.website}
                value={resource.website || ""}
                onSave={(value) => update(resource.id, "website", value)}
              />
              <EditableField
                label={copy.fields.region}
                value={resource.region}
                onSave={(value) => update(resource.id, "region", value)}
              />
            </div>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}

function EditableField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {label}
      </span>
      <input
        defaultValue={value}
        onBlur={(event) => onSave(event.target.value)}
        className="w-full rounded-2xl border border-[#e5dbcf] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#7da4b5] focus:bg-white"
      />
    </label>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "warm" | "cool" | "ink";
}) {
  const toneClasses = {
    warm: "border-[#efddcf] bg-[linear-gradient(180deg,_#fff7ef_0%,_#ffffff_100%)]",
    cool: "border-[#d7e7ed] bg-[linear-gradient(180deg,_#f2fafc_0%,_#ffffff_100%)]",
    ink: "border-[#dbe2e8] bg-[linear-gradient(180deg,_#f7f9fb_0%,_#ffffff_100%)]",
  };

  return (
    <div className={`rounded-[24px] border px-4 py-4 ${toneClasses[tone]}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <div className="mt-2 section-title text-3xl text-slate-950">{value}</div>
    </div>
  );
}

function getUrgencyLabel(locale: Locale, urgency: ResourceDirectoryEntry["urgency"]) {
  const labels = {
    en: {
      urgent: "Urgent",
      high: "High priority",
      support: "Support",
    },
    zh: {
      urgent: "紧急",
      high: "高优先级",
      support: "支持",
    },
  };

  return labels[locale][urgency];
}

function getAudienceLabel(locale: Locale, audience: ResourceDirectoryEntry["audience"]) {
  const labels = {
    en: {
      teen: "Teen",
      caregiver: "Caregiver",
      general: "General",
    },
    zh: {
      teen: "青少年",
      caregiver: "照护者",
      general: "通用",
    },
  };

  return labels[locale][audience];
}
