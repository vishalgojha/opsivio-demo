import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "./pwa-register";
import { brandStyle, siteConfig } from "@/lib/site-config";

const SITE_URL = siteConfig.websiteUrl;

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  metadataBase: new URL(SITE_URL),
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.heroDescription,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.heroDescription,
    images: [{ url: siteConfig.logoPath, width: 512, height: 512, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.heroDescription,
    images: [siteConfig.logoPath],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: siteConfig.faviconPath,
    apple: siteConfig.logoPath,
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={brandStyle()}><PwaRegister />{children}</body>
    </html>
  );
}
