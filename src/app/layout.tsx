// =============================================
// App Layout - Root
// =============================================

import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: {
    default: "AI Platform | منصة الذكاء الاصطناعي",
    template: "%s | AI Platform",
  },
  description: "منصة شاملة لأدوات الذكاء الاصطناعي - اكتشف، تعلم، وقارن بين أفضل أدوات AI",
  keywords: ["أدوات الذكاء الاصطناعي", "AI", "ChatGPT", "أدوات عربية"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibmPlexArabic.variable} font-sans min-h-screen flex flex-col bg-background`}>
        {children}
      </body>
    </html>
  );
}