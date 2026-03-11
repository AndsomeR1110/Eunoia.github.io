import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { getLocale } from "@/lib/server/locale";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Eunoia",
  description: "Youth-centered AI mental health support framework",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body className={`${manrope.variable} ${plexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
