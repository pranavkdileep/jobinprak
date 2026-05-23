import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JobInPark — AI-Driven Job Discovery Platform",
    template: "%s | JobInPark",
  },
  description:
    "JobInPark is an AI-driven job platform that connects talent with opportunities using intelligent matching. Search jobs, get real-time notifications, and generate AI-powered application emails.",
  keywords: [
    "job search",
    "AI job matching",
    "career platform",
    "job notifications",
    "tech jobs",
    "JobInPark",
    "AI email generation",
    "job portal",
  ],
  authors: [{ name: "Pranav K Dileep" }],
  creator: "Pranav K Dileep",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jobinpark.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "JobInPark",
    title: "JobInPark — AI-Driven Job Discovery Platform",
    description:
      "Intelligent job matching, real-time notifications, and AI-powered application emails. Find your next opportunity with JobInPark.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JobInPark — AI-Driven Job Discovery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JobInPark — AI-Driven Job Discovery Platform",
    description:
      "Intelligent job matching, real-time notifications, and AI-powered application emails.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
