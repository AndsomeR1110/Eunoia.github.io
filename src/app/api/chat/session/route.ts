import { NextResponse } from "next/server";

import { createSessionSchema, startSession } from "@/lib/server/chat-service";

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({}));
  const input = createSessionSchema.parse(json);
  const session = await startSession(input.alias, input.mode, input.locale);

  return NextResponse.json(session);
}
