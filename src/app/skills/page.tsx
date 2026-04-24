import { AppShell } from "@/components/app-shell";
import { Surface, SectionTitle } from "@/components/cards";
import {
  getDemoExerciseCopy,
  getExerciseCategoryLabel,
} from "@/lib/i18n";
import { getLocale, getServerDictionary } from "@/lib/server/locale";
import { listExercises } from "@/lib/server/store";
import type { Locale, SupportExercise } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const exercises = await listExercises();
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);

  return (
    <AppShell eyebrow={dict.pages.skills.eyebrow} title={dict.pages.skills.title}>
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <Surface className="border-cyan-100 bg-cyan-50/60">
            <SectionTitle
              title={locale === "zh" ? "随手就能开始的小练习" : "Small practices you can start right away"}
              description={
                locale === "zh"
                  ? "这些练习都可以在几分钟内完成。你不需要准备好很多，只需要先挑一个最像你现在状态的。"
                  : "Each exercise is short enough to try in the middle of a hard moment. Pick the one that feels closest to what you need now."
              }
            />
            <div className="flex flex-wrap gap-2">
              {exercises.map((exercise) => (
                <span
                  key={exercise.id}
                  className="rounded-2xl border border-cyan-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  {getExerciseCategoryLabel(locale, exercise.category)} · {exercise.durationMinutes} {dict.pages.skills.minute}
                </span>
              ))}
            </div>
          </Surface>

          <Surface>
            <SectionTitle
              title={locale === "zh" ? "你可以怎么选" : "How to choose"}
              description={
                locale === "zh"
                  ? "如果脑子停不下来，从呼吸或落地开始；如果反复想同一件事，再试书写或想法整理。"
                  : "If your body feels activated, start with breathing or grounding. If you keep looping on one story, move into journaling or thought checking."
              }
            />
            <div className="space-y-2">
              {getSelectionGuides(locale).map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">{item.description}</div>
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              locale={locale}
              minuteLabel={dict.pages.skills.minute}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function ExerciseCard({
  exercise,
  locale,
  minuteLabel,
}: {
  exercise: SupportExercise;
  locale: Locale;
  minuteLabel: string;
}) {
  const localized = getDemoExerciseCopy(locale, exercise.slug);
  const benefit = getExerciseBenefit(locale, exercise);
  const bestWhen = getExerciseBestWhen(locale, exercise);

  return (
    <Surface className="min-h-64">
      <SectionTitle
        title={localized?.title || exercise.title}
        description={localized?.summary || exercise.summary}
      />
      <div className="flex flex-wrap gap-2">
        <span className="rounded-2xl bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
          {getExerciseCategoryLabel(locale, exercise.category)}
        </span>
        <span className="rounded-2xl bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-900">
          {exercise.durationMinutes} {minuteLabel}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-xs font-semibold uppercase text-slate-500">
            {locale === "zh" ? "适合什么时候" : "Best when"}
          </div>
          <div className="mt-1 text-sm leading-6 text-slate-700">{bestWhen}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-xs font-semibold uppercase text-slate-500">
            {locale === "zh" ? "你会得到什么" : "What it helps with"}
          </div>
          <div className="mt-1 text-sm leading-6 text-slate-700">{benefit}</div>
        </div>
      </div>
    </Surface>
  );
}

function getSelectionGuides(locale: Locale) {
  return locale === "zh"
    ? [
        {
          title: "身体很紧",
          description: "先做呼吸练习，让身体从绷紧状态慢一点下来。",
        },
        {
          title: "脑子很乱",
          description: "先做落地练习，把注意力拉回当下，再决定要不要继续想。",
        },
        {
          title: "反复在想同一件事",
          description: "用想法整理类练习，把事实和脑中的故事分开。",
        },
      ]
    : [
        {
          title: "Your body feels activated",
          description: "Start with breathing to lower the intensity first.",
        },
        {
          title: "Your thoughts feel scattered",
          description: "Try grounding to come back to the present before doing anything else.",
        },
        {
          title: "You keep looping on one story",
          description: "Use a thought-check exercise to separate facts from assumptions.",
        },
      ];
}

function getExerciseBenefit(locale: Locale, exercise: SupportExercise) {
  if (locale === "zh") {
    if (exercise.category === "breathing") return "帮助身体从警觉状态慢一点降下来。";
    if (exercise.category === "grounding") return "把注意力从失控感拉回到此时此地。";
    if (exercise.category === "cbt") return "帮你看清哪些是事实，哪些是自动冒出来的故事。";
    return "给你一个更清晰、更可执行的下一步。";
  }

  if (exercise.category === "breathing") return "Helps your body come down from high alert.";
  if (exercise.category === "grounding") return "Pulls attention back into the present moment.";
  if (exercise.category === "cbt") return "Helps separate facts from the story your mind is building.";
  return "Gives you a clearer, more doable next step.";
}

function getExerciseBestWhen(locale: Locale, exercise: SupportExercise) {
  if (locale === "zh") {
    if (exercise.category === "breathing") return "心跳快、胸口紧、压力一下子冲上来的时候。";
    if (exercise.category === "grounding") return "觉得失控、发飘、脑中停不下来时。";
    if (exercise.category === "cbt") return "你一直在反复推演同一件事，或者想法越来越糟的时候。";
    return "你想先做一点什么，但还不想开始长时间对话的时候。";
  }

  if (exercise.category === "breathing") return "When your chest feels tight or stress spikes fast.";
  if (exercise.category === "grounding") return "When you feel overwhelmed, floaty, or stuck in a spiral.";
  if (exercise.category === "cbt") return "When one thought keeps replaying and getting worse.";
  return "When you want a small next step without starting a longer conversation.";
}
