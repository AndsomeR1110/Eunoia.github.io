import { NextResponse } from "next/server";

import { listRiskEvents } from "@/lib/server/store";

export async function GET() {
  const items = await listRiskEvents();
  return NextResponse.json({ items });
}
