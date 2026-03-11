import { NextResponse } from "next/server";
import { z } from "zod";

import { importKnowledgeDocument } from "@/lib/server/store";

const importSchema = z.object({
  title: z.string().min(1),
  category: z.enum(["anxiety", "stress", "relationships", "school", "coping", "crisis"]),
  source: z.string().min(1),
  sourceUrl: z.string().url(),
  body: z.string().min(20),
  tags: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  const json = await request.json();
  const input = importSchema.parse(json);
  const created = await importKnowledgeDocument(input);

  return NextResponse.json(created);
}
