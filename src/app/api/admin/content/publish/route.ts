import { NextResponse } from "next/server";
import { z } from "zod";

import { publishKnowledgeDocument } from "@/lib/server/store";

const publishSchema = z.object({
  id: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json();
  const input = publishSchema.parse(json);
  const document = await publishKnowledgeDocument(input.id);

  return NextResponse.json(document);
}
