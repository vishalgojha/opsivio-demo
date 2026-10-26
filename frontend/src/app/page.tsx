import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BrokerLandingClient from "./BrokerLandingClient";

export const metadata: Metadata = {
  title: "Property Management Software for Brokers | Opsivio demo",
  description:
    "Opsivio demo helps real-estate brokers turn WhatsApp conversations into searchable listings, client requirements, matches, and follow-ups in one workspace.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Property Management Software for Brokers | Opsivio demo",
    description:
      "Organise your WhatsApp property network into a searchable broker workspace for listings, requirements, matches, and deals.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function BrokerLandingPage() {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "")
    .toLowerCase()
    .split(":", 1)[0]
    .replace(/\.$/, "");
  if (host === "app.opsivio.in") redirect("/inbox");
  if (host === "admin.opsivio.in") redirect("/admin");
  return <BrokerLandingClient />;
}
