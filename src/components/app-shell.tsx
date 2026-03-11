import { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ShellNavLink } from "@/components/shell-nav-link";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export async function AppShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);
  const primaryLinks = [
    { href: "/", label: dict.shell.nav.overview },
    { href: "/onboarding", label: dict.shell.nav.onboarding },
    { href: "/chat", label: dict.shell.nav.chat },
    { href: "/mood", label: dict.shell.nav.mood },
    { href: "/skills", label: dict.shell.nav.skills },
    { href: "/help-now", label: dict.shell.nav.helpNow },
  ];
  const adminLinks = [
    { href: "/admin/content", label: dict.shell.nav.content },
    { href: "/admin/risk", label: dict.shell.nav.risk },
    { href: "/admin/resources", label: dict.shell.nav.resources },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,235,220,0.85),_transparent_35%),linear-gradient(180deg,_#fffaf4_0%,_#f8f4ef_50%,_#edf3f6_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-[0_24px_80px_rgba(54,51,67,0.08)] backdrop-blur">
          <div className="space-y-2">
            <div className="eyebrow-label text-xs font-semibold uppercase text-slate-500">Eunoia</div>
            <h1 className="display-subtitle text-3xl text-slate-950">{dict.shell.tagline}</h1>
            <p className="text-sm leading-6 text-slate-600">{dict.shell.description}</p>
          </div>

          <nav className="mt-8 space-y-6">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {dict.shell.sections.user}
              </div>
              <div className="space-y-2">
                {primaryLinks.map((link) => (
                  <ShellNavLink key={link.href} href={link.href} label={link.label} tone="warm" />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {dict.shell.sections.admin}
              </div>
              <div className="space-y-2">
                {adminLinks.map((link) => (
                  <ShellNavLink key={link.href} href={link.href} label={link.label} tone="cool" />
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <main className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_28px_90px_rgba(54,51,67,0.08)] backdrop-blur lg:p-8">
          <div className="mb-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,430px)] xl:items-start">
            <div className="min-w-0">
              <div className="eyebrow-label text-xs font-semibold uppercase text-slate-500">
                {eyebrow}
              </div>
              <h2 className="display-title mt-3 max-w-4xl text-[clamp(2.75rem,6vw,4.6rem)] text-slate-950">
                {title}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_156px] xl:justify-items-end">
              <div className="min-h-[88px] rounded-[28px] border border-[#d8e4ea] bg-[#edf5f7] px-5 py-4 text-sm leading-7 text-slate-600">
                {dict.shell.builtFor}
              </div>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
