import { NextResponse } from "next/server";
import { z } from "zod";

import { LOCALE_COOKIE_NAME } from "@/lib/i18n";

const localeSchema = z.object({
  locale: z.enum(["en", "zh"]),
});

export async function POST(request: Request) {
  const json = await request.json();
  const input = localeSchema.parse(json);
  const response = NextResponse.json({ ok: true, locale: input.locale });

  response.cookies.set(LOCALE_COOKIE_NAME, input.locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
