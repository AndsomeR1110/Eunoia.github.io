import { NextResponse } from "next/server";

import { updateResource } from "@/lib/server/store";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const json = await request.json();
  const updated = await updateResource(id, json);

  return NextResponse.json(updated);
}
