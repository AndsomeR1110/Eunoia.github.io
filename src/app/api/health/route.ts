import { NextResponse } from "next/server";

import { isProduction } from "@/lib/server/env";
import { getProviderRuntimeStatus } from "@/lib/server/provider";

export async function GET() {
  const provider = getProviderRuntimeStatus();

  return NextResponse.json({
    ok: provider.configured || provider.demoModeEnabled,
    environment: isProduction() ? "production" : "development",
    provider,
    timestamp: new Date().toISOString(),
  });
}
