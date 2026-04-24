import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MetricTone = "warm" | "cool" | "ink";
type BadgeTone = "warm" | "cool" | "sage" | "ink" | "danger";

const metricToneClasses: Record<MetricTone, string> = {
  warm: "border-red-100 bg-red-50",
  cool: "border-cyan-100 bg-cyan-50",
  ink: "border-slate-200 bg-slate-50",
};

const badgeToneClasses: Record<BadgeTone, string> = {
  warm: "border-orange-200 bg-orange-50 text-orange-800",
  cool: "border-cyan-200 bg-cyan-50 text-cyan-900",
  sage: "border-emerald-200 bg-emerald-50 text-emerald-800",
  ink: "border-slate-200 bg-slate-50 text-slate-700",
  danger: "border-red-200 bg-red-50 text-red-800",
};

export function AdminHero({
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
    <section className="grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={cn(
            "rounded-3xl border px-4 py-4 shadow-sm",
            metricToneClasses[metric.tone ?? "ink"],
          )}
        >
          <div className="text-xs font-semibold uppercase text-slate-500">
            {metric.label}
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">{metric.value}</div>
          <div className="mt-1 text-sm leading-6 text-slate-500">{metric.detail}</div>
        </div>
      ))}
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
        "rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm",
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
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
        "inline-flex rounded-2xl border px-3 py-1 text-[11px] font-semibold uppercase",
        badgeToneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
