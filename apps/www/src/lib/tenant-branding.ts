import { headers } from "next/headers";
import { getServerSupabase } from "@/lib/supabase";

export type TenantBranding = {
  tenant_id?: string;
  display_name: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  surface_color: string;
  text_color: string;
  font_body: string;
  font_display: string;
  hero_image_url: string;
  tagline: string;
  description: string;
  whatsapp_number: string;
  support_email: string;
  city_label: string;
  seo_title: string;
  seo_description: string;
  is_published?: boolean;
};

export const DEFAULT_TENANT_BRANDING: TenantBranding = {
  display_name: "Opsivio demo", logo_url: "/propai-logo.svg?v=3", favicon_url: "/favicon.svg?v=3",
  primary_color: "#2f6e4f", secondary_color: "#e6f1ea", surface_color: "#fffefa", text_color: "#18232b",
  font_body: "DM Sans", font_display: "Newsreader", hero_image_url: "",
  tagline: "Live listings from local broker networks",
  description: "Find fresh property opportunities from the conversations where brokers move first.",
  whatsapp_number: "", support_email: "", city_label: "Mumbai", seo_title: "", seo_description: "",
};

export async function getRequestTenantBranding(): Promise<TenantBranding> {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "")
    .trim().toLowerCase().split(":", 1)[0].replace(/\.$/, "");
  if (!host || host === "opsivio.in" || host === "www.opsivio.in" || host === "localhost") return DEFAULT_TENANT_BRANDING;
  const supabase = getServerSupabase();
  if (!supabase) return DEFAULT_TENANT_BRANDING;
  const { data } = await supabase.from("tenant_domains").select("tenant_id,tenant_brand_profiles(*)").eq("domain", host).eq("is_active", true).limit(1).maybeSingle();
  const profile = Array.isArray(data?.tenant_brand_profiles) ? data?.tenant_brand_profiles[0] : data?.tenant_brand_profiles;
  if (!profile || profile.is_published !== true) return DEFAULT_TENANT_BRANDING;
  return { ...DEFAULT_TENANT_BRANDING, ...profile } as TenantBranding;
}
