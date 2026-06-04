import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AIJudgeNotice } from "@/components/ai-judge-notice";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dukaan Mitra AI | Voice-first kirana agent",
  description:
    "Hindi and Hinglish voice inventory, MongoDB MCP actions, and festival-aware reordering for kirana stores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <AIJudgeNotice />
        <Providers>
          <SiteHeader />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
