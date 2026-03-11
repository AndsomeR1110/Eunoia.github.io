import { describe, expect, it } from "vitest";

import { classifyMessageRisk } from "@/lib/safety";

describe("classifyMessageRisk", () => {
  it("marks explicit self-harm intent as critical", () => {
    const result = classifyMessageRisk("I want to die and I have a suicide plan.");

    expect(result.riskLevel).toBe("CRITICAL");
    expect(result.shouldBypassModel).toBe(true);
  });

  it("marks indirect hopelessness as high or moderate depending on signal", () => {
    const result = classifyMessageRisk("I think everyone would be better off without me.");

    expect(result.riskLevel).toBe("HIGH");
    expect(result.matchedSignals).toContain("better off without me");
  });

  it("keeps everyday stress as low risk", () => {
    const result = classifyMessageRisk("I am nervous about exams and feel behind.");

    expect(result.riskLevel).toBe("LOW");
    expect(result.shouldBypassModel).toBe(false);
  });
});
