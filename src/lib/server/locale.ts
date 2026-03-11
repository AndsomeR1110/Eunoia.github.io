import { cookies } from "next/headers";

import { getDictionary, LOCALE_COOKIE_NAME } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const raw = store.get(LOCALE_COOKIE_NAME)?.value;
  return raw === "zh" ? "zh" : "en";
}

export async function getServerDictionary(locale?: Locale) {
  const resolved = locale ?? (await getLocale());
  return getDictionary(resolved);
}
