import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Surface({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-[#ebe4dc] bg-white px-5 py-5 shadow-[0_18px_60px_rgba(62,56,74,0.06)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 space-y-1">
      <h3 className="section-title text-2xl text-slate-950">{title}</h3>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
