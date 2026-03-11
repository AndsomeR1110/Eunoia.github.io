"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AdminBadge, AdminSection } from "@/components/admin-chrome";
import { formatDateTime } from "@/lib/utils";
import type { KnowledgeDocument, Locale } from "@/lib/types";

interface AdminContentCopy {
  importTitle: string;
  importDescription: string;
  placeholders: {
    title: string;
    source: string;
    sourceUrl: string;
    tags: string;
    body: string;
  };
  importButton: string;
  reviewTitle: string;
  reviewDescription: string;
  sourceLink: string;
  publish: string;
  status: {
    draft: string;
    published: string;
  };
}

export function AdminContentStudio({
  documents,
  locale,
  copy,
}: {
  documents: KnowledgeDocument[];
  locale: Locale;
  copy: AdminContentCopy;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    category: "coping",
    source: "",
    sourceUrl: "",
    body: "",
    tags: "stress, school",
  });
  const publishedCount = documents.filter((document) => document.status === "published").length;
  const draftCount = documents.length - publishedCount;

  async function importDocument() {
    await fetch("/api/admin/content/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      }),
    });
    router.refresh();
  }

  async function publishDocument(id: string) {
    await fetch("/api/admin/content/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.1fr)]">
      <AdminSection
        title={copy.importTitle}
        description={copy.importDescription}
        badge={locale === "zh" ? "草稿优先流程" : "Draft-first workflow"}
        className="bg-[linear-gradient(160deg,_#fff7ef_0%,_#ffffff_58%,_#f1f8fa_100%)]"
      >
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[#efddcf] bg-white/90 px-4 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {locale === "zh" ? "待审核文档" : "Docs awaiting review"}
            </div>
            <div className="mt-2 section-title text-3xl text-slate-950">{draftCount}</div>
          </div>
          <div className="rounded-[24px] border border-[#d7e7ed] bg-white/90 px-4 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {locale === "zh" ? "已发布文档" : "Published docs"}
            </div>
            <div className="mt-2 section-title text-3xl text-slate-950">{publishedCount}</div>
          </div>
        </div>

        <div className="space-y-3">
          {(["title", "source", "sourceUrl"] as const).map((field) => (
            <input
              key={field}
              value={form[field as keyof typeof form]}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              placeholder={copy.placeholders[field]}
              className="w-full rounded-2xl border border-[#e5dbcf] bg-white/90 px-4 py-3 outline-none transition focus:border-[#ec9c6c] focus:bg-white"
            />
          ))}
          <select
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            className="w-full rounded-2xl border border-[#e5dbcf] bg-white/90 px-4 py-3 outline-none transition focus:border-[#ec9c6c] focus:bg-white"
          >
            <option value="coping">coping</option>
            <option value="stress">stress</option>
            <option value="school">school</option>
            <option value="relationships">relationships</option>
            <option value="anxiety">anxiety</option>
            <option value="crisis">crisis</option>
          </select>
          <input
            value={form.tags}
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            placeholder={copy.placeholders.tags}
            className="w-full rounded-2xl border border-[#e5dbcf] bg-white/90 px-4 py-3 outline-none transition focus:border-[#ec9c6c] focus:bg-white"
          />
          <textarea
            value={form.body}
            onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
            placeholder={copy.placeholders.body}
            className="min-h-40 w-full rounded-[24px] border border-[#e5dbcf] bg-white/90 px-4 py-3 outline-none transition focus:border-[#ec9c6c] focus:bg-white"
          />
          <button
            type="button"
            onClick={importDocument}
            className="rounded-full bg-[#1f3341] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#182833]"
          >
            {copy.importButton}
          </button>
        </div>
      </AdminSection>

      <AdminSection
        title={copy.reviewTitle}
        description={copy.reviewDescription}
        badge={`${documents.length} ${locale === "zh" ? "份文档" : "documents"}`}
        className="bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbfd_100%)]"
      >
        <div className="space-y-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="rounded-[26px] border border-[#dbe7ec] bg-white/95 p-5 shadow-[0_14px_36px_rgba(58,56,70,0.04)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-950">{document.title}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <AdminBadge tone="cool">{getCategoryLabel(locale, document.category)}</AdminBadge>
                    <AdminBadge tone={document.status === "published" ? "sage" : "warm"}>
                      {document.status === "published" ? copy.status.published : copy.status.draft}
                    </AdminBadge>
                    <AdminBadge tone="ink">{document.source}</AdminBadge>
                  </div>
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {formatDateTime(document.createdAt, locale)}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{document.body}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {document.tags.map((tag) => (
                  <AdminBadge key={tag} tone="warm">
                    {tag}
                  </AdminBadge>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href={document.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[#5d889d] transition hover:text-[#3b667b]"
                >
                  {copy.sourceLink}
                </a>
                {document.status === "draft" ? (
                  <button
                    type="button"
                    onClick={() => publishDocument(document.id)}
                    className="rounded-full bg-[#1f3341] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#182833]"
                  >
                    {copy.publish}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}

function getCategoryLabel(locale: Locale, category: KnowledgeDocument["category"]) {
  const labels = {
    en: {
      anxiety: "Anxiety",
      stress: "Stress",
      relationships: "Relationships",
      school: "School",
      coping: "Coping",
      crisis: "Crisis",
    },
    zh: {
      anxiety: "焦虑",
      stress: "压力",
      relationships: "关系",
      school: "学业",
      coping: "应对",
      crisis: "危机",
    },
  };

  return labels[locale][category];
}
