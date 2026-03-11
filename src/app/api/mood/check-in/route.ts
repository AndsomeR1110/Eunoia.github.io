import { NextResponse } from "next/server";

import { getMoodTimeline, moodCheckInSchema, saveMoodCheckIn } from "@/lib/server/mood-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") || undefined;
  const items = await getMoodTimeline(sessionId);

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const json = await request.json();
  const input = moodCheckInSchema.parse(json);
  const created = await saveMoodCheckIn(input);

  return NextResponse.json(created);
}
