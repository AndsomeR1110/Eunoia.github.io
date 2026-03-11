import { describe, expect, it } from "vitest";

import { sendMessage } from "@/lib/server/chat-service";

describe("sendMessage", () => {
  it("bypasses the model for high-risk messages", async () => {
    const reply = await sendMessage({
      alias: "Quiet Comet",
      mode: "support",
      locale: "en",
      message: "Nobody would care if I disappeared and I want to hurt myself.",
    });

    expect(reply.responseMode).toBe("scripted");
    expect(reply.riskLevel === "HIGH" || reply.riskLevel === "CRITICAL").toBe(true);
    expect(reply.assistantMessage).toContain("trusted adult");
  });

  it("returns generated replies for low-risk support messages", async () => {
    const reply = await sendMessage({
      alias: "Quiet Comet",
      mode: "support",
      locale: "en",
      message: "I am stressed about exams and need help focusing.",
    });

    expect(reply.responseMode).toBe("generated");
    expect(reply.riskLevel).toBe("LOW");
  });
});
