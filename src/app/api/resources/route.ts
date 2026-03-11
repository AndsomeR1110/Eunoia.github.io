import { NextResponse } from "next/server";

import { listResources } from "@/lib/server/store";

export async function GET() {
  const items = await listResources();
  return NextResponse.json({ items });
}
