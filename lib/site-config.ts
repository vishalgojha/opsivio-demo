/**
 * Client-facing site configuration.
 *
 * Every public brand decision lives here. Set the NEXT_PUBLIC_SITE_* variables
 * in a client deployment (or edit the defaults for a white-label starter).
 * Keeping this typed makes the scaffold safe to customise without hunting
 * through page components.
 */
export type SiteConfig = {
  name: string;
  shortName: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  locationLabel: string;
  logoPath: string;
  faviconPath: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappNumber: string;
  instagramUrl: string;
  websiteUrl: string;
  contactName: string;
  primaryColor: string;
  accentColor: string;
  surfaceColor: string;
  heroImage: string;
};

const env = (key: string, fallback: string) => process.env[key]?.trim() || fallback;

export const siteConfig: SiteConfig = {
  name: env("NEXT_PUBLIC_SITE_NAME", "Your Realty Co."),
  shortName: env("NEXT_PUBLIC_SITE_SHORT_NAME", "Your Realty"),
  tagline: env("NEXT_PUBLIC_SITE_TAGLINE", "A sharper way to find your next place."),
  heroTitle: env("NEXT_PUBLIC_SITE_HERO_TITLE", "Find a place that feels like yours."),
  heroDescription: env("NEXT_PUBLIC_SITE_HERO_DESCRIPTION", "Curated homes, workspaces and opportunities — presented clearly and backed by a real local team."),
  locationLabel: env("NEXT_PUBLIC_SITE_LOCATION", "Your city · Your neighborhood"),
  logoPath: env("NEXT_PUBLIC_SITE_LOGO", "/brand/logo.svg"),
  faviconPath: env("NEXT_PUBLIC_SITE_FAVICON", "/brand/favicon.svg"),
  phoneDisplay: env("NEXT_PUBLIC_SITE_PHONE_DISPLAY", "+00 00000 00000"),
  phoneTel: env("NEXT_PUBLIC_SITE_PHONE_TEL", "+000000000000"),
  whatsappNumber: env("NEXT_PUBLIC_SITE_WHATSAPP", "000000000000"),
  instagramUrl: env("NEXT_PUBLIC_SITE_INSTAGRAM", "https://instagram.com/"),
  websiteUrl: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  contactName: env("NEXT_PUBLIC_SITE_CONTACT_NAME", "Your property advisor"),
  primaryColor: env("NEXT_PUBLIC_SITE_PRIMARY", "#16324f"),
  accentColor: env("NEXT_PUBLIC_SITE_ACCENT", "#d7a63d"),
  surfaceColor: env("NEXT_PUBLIC_SITE_SURFACE", "#faf7f0"),
  heroImage: env("NEXT_PUBLIC_SITE_HERO_IMAGE", ""),
};

export function whatsappLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function brandStyle() {
  return {
    "--brand-primary": siteConfig.primaryColor,
    "--brand-accent": siteConfig.accentColor,
    "--brand-surface": siteConfig.surfaceColor,
  } as import("react").CSSProperties;
}
