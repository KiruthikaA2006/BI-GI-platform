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
  title: "BI-GI Platform | Enterprise Growth Intelligence & Analytics",
  description: "Next-generation Business Intelligence, AI Insights, Forecasting & Data Analytics Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#e4dac9] text-stone-900 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
