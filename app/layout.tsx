import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://jaskaransingh.dev"),
  title: {
    default: "Jaskaran Singh",
    template: "%s — Jaskaran Singh",
  },
  description:
    "Jaskaran Singh — software engineer building TrueMile.AI. AI dispatch, fintech, and applied ML. Statistics & Data Science at UCLA.",
  openGraph: {
    title: "Jaskaran Singh",
    description:
      "Software engineer building TrueMile.AI. AI dispatch, fintech, and applied ML.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
