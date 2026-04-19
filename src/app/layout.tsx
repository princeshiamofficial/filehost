import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vault - Secure & Fast File Hosting",
  description: "Experience the next generation of file hosting. Secure, lightning-fast uploads for everyone, powered by Vercel.",
  keywords: ["file hosting", "secure storage", "cloud sharing", "vercel blob"],
  authors: [{ name: "Antigravity", url: "https://antigravity.ai" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
