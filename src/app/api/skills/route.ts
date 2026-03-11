import { NextResponse } from "next/server";

import { listExercises } from "@/lib/server/store";

export async function GET() {
  const items = await listExercises();
  return NextResponse.json({ items });
}
