import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { GTProvider } from "gt-next";
import { getLocale, getLocaleDirection } from "gt-next/server";
import "@/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Afghanistan Agricultural Supply Chain OS",
    template: "%s | Afghanistan Agricultural Supply Chain OS",
  },
  description: "A workspace for agricultural wholesalers and distributors.",
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const direction = await getLocaleDirection();

  return (
    <html
      dir={direction}
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <GTProvider>
        <body className="min-h-full bg-page font-sans text-ink">
          {children}
        </body>
      </GTProvider>
    </html>
  );
}
