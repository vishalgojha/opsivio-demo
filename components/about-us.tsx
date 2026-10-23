"use client";

import { useEffect, useState } from "react";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import type { SiteContent } from "@/lib/site-content";
import { siteConfig, whatsappLink } from "@/lib/site-config";

const FALLBACK_ABOUT: Partial<SiteContent> = {
  title: `About ${siteConfig.name}`,
  contentBody:
    `${siteConfig.name} is a focused property team helping clients find, evaluate and move into the right space. You speak directly to a real advisor, never a portal.`,
  highlightBulletPoints: [
    "Curated inventory with clear pricing and useful context",
    "Responsive local advice from a real property team",
    "A simple, direct path from first conversation to viewing",
  ],
};

export function AboutUs() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/site-content?section=about_us")
      .then((response) => response.json())
      .then((payload) => {
        if (!active) return;
        setContent(payload?.data ?? null);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!loaded) {
    return (
      <section className="section about-us" id="about-us">
        <div className="section-head">
          <div>
            <p className="kicker">About the agency</p>
            <h2 className="skeleton-line" style={{ width: 220 }}>&nbsp;</h2>
          </div>
        </div>
        <div className="listing-skeleton" style={{ height: 120, marginBottom: 16 }} />
      </section>
    );
  }

  const about = content ?? (FALLBACK_ABOUT as SiteContent);
  const bullets = about.highlightBulletPoints?.length ? about.highlightBulletPoints : [];

  return (
    <section className="section about-us" id="about-us">
      <div className="section-head">
        <div>
          <p className="kicker">About the agency</p>
      <h2>{about.title || `About ${siteConfig.name}`}</h2>
        </div>
      </div>

      <div className="about-grid">
        <p className="about-body">{about.contentBody || FALLBACK_ABOUT.contentBody}</p>
        {bullets.length ? (
          <ul className="about-bullets">
            {bullets.map((point) => (
              <li key={point}>
                <CheckIcon size={14} /> {point}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="about-cta">
        <a
          className="btn-primary"
          href={about.ctaLink || whatsappLink(`Hi ${siteConfig.contactName}, I'd like to know more about ${siteConfig.name}.`)}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon size={16} /> Talk to {siteConfig.contactName}
        </a>
      </div>
    </section>
  );
}
