import { describe, expect, it } from "vitest";

import {
  importKnowledgeDocument,
  listKnowledgeDocuments,
  publishKnowledgeDocument,
  searchKnowledgeDocuments,
} from "@/lib/server/store";

describe("knowledge document workflow", () => {
  it("keeps drafts out of retrieval until published", async () => {
    const created = await importKnowledgeDocument({
      title: "Late-night overthinking",
      category: "stress",
      source: "Open Web Source",
      sourceUrl: "https://example.org/overthinking",
      body: "When overthinking spikes at night, grounding plus reducing doom-scrolling can help.",
      tags: ["stress", "sleep"],
    });

    const beforePublish = await searchKnowledgeDocuments("overthinking at night", 10);
    expect(beforePublish.find((document) => document.id === created.id)).toBeUndefined();

    await publishKnowledgeDocument(created.id);

    const afterPublish = await searchKnowledgeDocuments("overthinking at night", 10);
    expect(afterPublish.find((document) => document.id === created.id)).toBeDefined();
  });

  it("lists knowledge documents newest first", async () => {
    const items = await listKnowledgeDocuments();

    expect(items.length).toBeGreaterThan(0);
  });
});
