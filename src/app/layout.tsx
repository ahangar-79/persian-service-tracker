import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import StructuredData from "../components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "سیستم ردیابی خدمات فارسی",
    template: "%s | سیستم ردیابی خدمات فارسی"
  },
  description: "سیستم مدیریت و ردیابی خدمات با داشبورد تحلیلی برای کاربران و سرویس‌دهندگان",
  keywords: ["ردیابی خدمات", "داشبورد", "مدیریت کاربران", "آنالیتیک", "سرویس", "فارسی"],
  authors: [{ name: "Persian Service Tracker Team" }],
  creator: "Persian Service Tracker",
  publisher: "Persian Service Tracker",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "سیستم ردیابی خدمات فارسی",
    title: "سیستم ردیابی خدمات فارسی",
    description: "سیستم مدیریت و ردیابی خدمات با داشبورد تحلیلی برای کاربران و سرویس‌دهندگان",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "سیستم ردیابی خدمات فارسی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سیستم ردیابی خدمات فارسی",
    description: "سیستم مدیریت و ردیابی خدمات با داشبورد تحلیلی",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "سیستم ردیابی خدمات فارسی",
    "description": "سیستم مدیریت و ردیابی خدمات با داشبورد تحلیلی برای کاربران و سرویس‌دهندگان",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "inLanguage": "fa-IR",
    "author": {
      "@type": "Organization",
      "name": "Persian Service Tracker Team"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <StructuredData data={structuredData} />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
