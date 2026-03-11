import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MetricTone = "warm" | "cool" | "ink";
type BadgeTone = "warm" | "cool" | "sage" | "ink" | "danger";

const metricToneClasses: Record<MetricTone, string> = {
  warm: "border-[#efddcf] bg-[linear-gradient(180deg,_rgba(255,248,241,0.96)_0%,_rgba(255,255,255,0.96)_100%)]",
  cool: "border-[#d7e7ed] bg-[linear-gradient(180deg,_rgba(239,247,250,0.96)_0%,_rgba(255,255,255,0.96)_100%)]",
  ink: "border-[#dbe2e8] bg-[linear-gradient(180deg,_rgba(247,249,251,0.98)_0%,_rgba(255,255,255,0.96)_100%)]",
};

const badgeToneClasses: Record<BadgeTone, string> = {
  warm: "border-[#efd8c7] bg-[#fff6ef] text-[#9f5832]",
  cool: "border-[#d7e7ed] bg-[#f4fafc] text-[#41657a]",
  sage: "border-[#d5e4dd] bg-[#f3f8f5] text-[#456455]",
  ink: "border-[#dbe2e8] bg-[#f7f9fb] text-slate-700",
  danger: "border-[#efc9bd] bg-[#fff2ee] text-[#9d4a34]",
};

export function AdminHero({
  eyebrow,
  title,
  description,
  metrics,
}: {
  eyebrow: string;
  title: string;
  description: string;
  metrics: Array<{
    label: string;
    value: string;
    detail: string;
    tone?: MetricTone;
  }>;
}) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-[#ede4da] bg-[radial-gradient(circle_at_top_left,_rgba(255,240,225,0.9),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(229,241,246,0.9),_transparent_28%),linear-gradient(135deg,_#fff8f1_0%,_#ffffff_46%,_#eef6f8_100%)] p-6 shadow-[0_24px_80px_rgba(62,56,74,0.08)] lg:p-7">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-end">
        <div className="max-w-3xl">
          <div className="eyebrow-label text-xs font-semibold uppercase text-slate-500">{eyebrow}</div>
          <h3 className="display-subtitle mt-3 text-[clamp(2rem,4vw,3.35rem)] text-slate-950">
            {title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={cn(
                "rounded-[26px] border px-4 py-4 shadow-[0_14px_36px_rgba(52,48,61,0.04)]",
                metricToneClasses[metric.tone ?? "ink"],
              )}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {metric.label}
              </div>
              <div className="mt-2 section-title text-3xl text-slate-950">{metric.value}</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">{metric.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminSection({
  title,
  description,
  badge,
  children,
  className,
}: {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[30px] border border-[#ebe4dc] bg-[linear-gradient(180deg,_#ffffff_0%,_#fcfaf7_100%)] px-5 py-5 shadow-[0_18px_60px_rgba(62,56,74,0.06)]",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <h3 className="section-title text-[1.65rem] text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        </div>
        {badge ? <AdminBadge tone="ink">{badge}</AdminBadge> : null}
      </div>
      {children}
    </section>
  );
}

export function AdminBadge({
  children,
  tone = "ink",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        badgeToneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
