"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function ShellNavLink({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone: "warm" | "cool";
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-2xl px-3.5 py-2 text-sm font-medium transition",
        tone === "cool"
          ? "text-slate-600 hover:bg-cyan-50 hover:text-slate-950"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
        isActive &&
          (tone === "cool"
            ? "bg-cyan-50 text-cyan-900 ring-1 ring-cyan-200"
            : "bg-slate-900 text-white"),
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
