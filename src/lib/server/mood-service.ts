import { z } from "zod";

import { createMoodCheckIn, listMoodCheckIns } from "@/lib/server/store";

export const moodCheckInSchema = z.object({
  sessionId: z.string(),
  score: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  label: z.string().min(1).max(80),
  note: z.string().max(240).optional(),
  phase: z.enum(["pre", "post"]),
});

export async function saveMoodCheckIn(input: z.infer<typeof moodCheckInSchema>) {
  return createMoodCheckIn(input);
}

export async function getMoodTimeline(sessionId?: string) {
  return listMoodCheckIns(sessionId);
}
