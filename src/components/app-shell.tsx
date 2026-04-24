import { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ShellNavLink } from "@/components/shell-nav-link";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export async function AppShell({
  title,
  children,
  headerAction,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  headerAction?: ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);
  const primaryLinks = [
    { href: "/chat", label: dict.shell.nav.chat },
    { href: "/mood", label: dict.shell.nav.mood },
    { href: "/skills", label: dict.shell.nav.skills },
    { href: "/help-now", label: dict.shell.nav.helpNow },
  ];

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-lg font-semibold text-slate-950">Eunoia</div>
              <p className="max-w-xl text-xs leading-5 text-slate-500">{dict.shell.tagline}</p>
            </div>
            <div className="flex items-center gap-3">
              {headerAction ? <div>{headerAction}</div> : null}
              <LanguageSwitcher locale={locale} />
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1" aria-label={dict.shell.sections.user}>
            {primaryLinks.map((link) => (
              <ShellNavLink key={link.href} href={link.href} label={link.label} tone="warm" />
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 lg:px-6 lg:py-6">
        <h1 className="sr-only">{title}</h1>

        {children}
      </main>
    </div>
  );
}
