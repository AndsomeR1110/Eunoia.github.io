import { ZodError } from "zod";

import { prepareMessageStream, sendMessageSchema } from "@/lib/server/chat-service";
import {
  ProviderConfigurationError,
  ProviderRequestError,
} from "@/lib/server/provider";
import type { ChatStreamEvent } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = sendMessageSchema.parse(json);
    const prepared = await prepareMessageStream(input);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const writeEvent = (event: ChatStreamEvent) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        };

        let assistantMessage = "";

        try {
          writeEvent({
            type: "meta",
            sessionId: prepared.sessionId,
            alias: prepared.alias,
            riskLevel: prepared.riskLevel,
            responseMode: prepared.responseMode,
          });

          for await (const chunk of prepared.stream) {
            assistantMessage += chunk;
            writeEvent({
              type: "chunk",
              text: chunk,
            });
          }

          const reply = await prepared.complete(assistantMessage);
          writeEvent({
            type: "done",
            reply,
          });
        } catch (error) {
          console.error("[Eunoia] chat stream route failed", error);
          writeEvent({
            type: "error",
            error: getStreamErrorMessage(error),
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: "Invalid request payload.",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return Response.json(
        {
          error: "Request body must be valid JSON.",
        },
        { status: 400 },
      );
    }

    if (error instanceof ProviderConfigurationError) {
      return Response.json(
        {
          error: error.message,
        },
        { status: 503 },
      );
    }

    if (error instanceof ProviderRequestError) {
      return Response.json(
        {
          error: error.message,
        },
        { status: 502 },
      );
    }

    console.error("[Eunoia] chat stream route bootstrap failed", error);
    return Response.json(
      {
        error: "Unexpected server error.",
      },
      { status: 500 },
    );
  }
}

function getStreamErrorMessage(error: unknown) {
  if (
    error instanceof ProviderConfigurationError ||
    error instanceof ProviderRequestError
  ) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected server error.";
}
