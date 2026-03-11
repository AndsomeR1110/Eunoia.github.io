import { AppShell } from "@/components/app-shell";
import { OnboardingForm } from "@/components/onboarding-form";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export default async function OnboardingPage() {
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);

  return (
    <AppShell eyebrow={dict.pages.onboarding.eyebrow} title={dict.pages.onboarding.title}>
      <OnboardingForm locale={locale} copy={dict.onboarding} />
    </AppShell>
  );
}
