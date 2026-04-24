import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/chat/message/route";

describe("POST /api/chat/message", () => {
  it("returns 400 for invalid payloads", async () => {
    const request = new Request("http://localhost:3000/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("Invalid request payload.");
  });
});
