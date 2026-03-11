import { AppShell } from "@/components/app-shell";
import { MoodTracker } from "@/components/mood-tracker";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export const dynamic = "force-dynamic";

export default async function MoodPage() {
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);

  return (
    <AppShell eyebrow={dict.pages.mood.eyebrow} title={dict.pages.mood.title}>
      <MoodTracker locale={locale} copy={dict.mood} />
    </AppShell>
  );
}
