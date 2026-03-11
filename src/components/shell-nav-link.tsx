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
        "block rounded-2xl px-4 py-3 text-sm font-medium transition",
        tone === "cool"
          ? "text-slate-700 hover:bg-[#eaf2f5] hover:text-slate-950"
          : "text-slate-700 hover:bg-[#f5efe6] hover:text-slate-950",
        isActive &&
          (tone === "cool"
            ? "bg-[linear-gradient(135deg,_#edf5f7_0%,_#ffffff_100%)] text-slate-950 shadow-[inset_0_0_0_1px_rgba(180,208,220,0.7)]"
            : "bg-[linear-gradient(135deg,_#fff6ee_0%,_#ffffff_100%)] text-slate-950 shadow-[inset_0_0_0_1px_rgba(239,210,190,0.85)]"),
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
