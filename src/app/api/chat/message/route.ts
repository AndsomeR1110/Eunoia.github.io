import { NextResponse } from "next/server";

import { sendMessage, sendMessageSchema } from "@/lib/server/chat-service";

export async function POST(request: Request) {
  const json = await request.json();
  const input = sendMessageSchema.parse(json);
  const reply = await sendMessage(input);

  return NextResponse.json(reply);
}
