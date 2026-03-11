import { AppShell } from "@/components/app-shell";
import { Surface, SectionTitle } from "@/components/cards";
import {
  getDemoExerciseCopy,
  getExerciseCategoryLabel,
} from "@/lib/i18n";
import { listExercises } from "@/lib/server/store";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const exercises = await listExercises();
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);

  return (
    <AppShell eyebrow={dict.pages.skills.eyebrow} title={dict.pages.skills.title}>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {exercises.map((exercise) => (
          <Surface key={exercise.id} className="bg-[linear-gradient(180deg,_#fff_0%,_#f7fbfd_100%)]">
            <SectionTitle
              title={getDemoExerciseCopy(locale, exercise.slug)?.title || exercise.title}
              description={getDemoExerciseCopy(locale, exercise.slug)?.summary || exercise.summary}
            />
            <div className="mb-4 text-sm text-slate-500">
              {getExerciseCategoryLabel(locale, exercise.category)} • {exercise.durationMinutes}{" "}
              {dict.pages.skills.minute}
            </div>
            <ol className="space-y-2 text-sm leading-6 text-slate-700">
              {(getDemoExerciseCopy(locale, exercise.slug)?.steps || exercise.steps).map(
                (step, index) => (
                <li key={step}>
                  {index + 1}. {step}
                </li>
                ),
              )}
            </ol>
          </Surface>
        ))}
      </div>
    </AppShell>
  );
}
