import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { sendMessage, sendMessageSchema } from "@/lib/server/chat-service";
import {
  ProviderConfigurationError,
  ProviderRequestError,
} from "@/lib/server/provider";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = sendMessageSchema.parse(json);
    const reply = await sendMessage(input);

    return NextResponse.json(reply);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request payload.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof ProviderConfigurationError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 503 },
      );
    }

    if (error instanceof ProviderRequestError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 502 },
      );
    }

    console.error("[Eunoia] chat message route failed", error);
    return NextResponse.json(
      {
        error: "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}
