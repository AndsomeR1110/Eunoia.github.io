import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns backend health status", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveProperty("ok");
    expect(json).toHaveProperty("environment");
    expect(json).toHaveProperty("provider");
    expect(json.provider).toHaveProperty("configured");
  });
});
