import { AppShell } from "@/components/app-shell";
import { ChatClient } from "@/components/chat-client";
import { getLocale, getServerDictionary } from "@/lib/server/locale";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const locale = await getLocale();
  const dict = await getServerDictionary(locale);

  return (
    <AppShell eyebrow={dict.pages.chat.eyebrow} title={dict.pages.chat.title}>
      <ChatClient locale={locale} copy={dict.chat} />
    </AppShell>
  );
}
