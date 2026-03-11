import type { Locale } from "@/lib/types";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function generateId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function formatDateTime(value: string, locale: Locale = "en") {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function scoreKeywordOverlap(query: string, body: string) {
  const tokenize = (input: string) =>
    input
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2);

  const queryTokens = new Set(tokenize(query));
  const bodyTokens = tokenize(body);

  return bodyTokens.reduce((score, token) => {
    return queryTokens.has(token) ? score + 1 : score;
  }, 0);
}
