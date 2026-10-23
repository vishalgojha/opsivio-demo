import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { siteConfig, whatsappLink } from "@/lib/site-config";

const INSTAGRAM = siteConfig.instagramUrl;

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="shell public-shell topbar-inner">
        <a className="brand" href="/">
<span className="brand-logo">
              <img src={siteConfig.logoPath} alt={siteConfig.name} />
            </span>
          <span>
            <span className="brand-name">
              {siteConfig.shortName}
            </span>
            <span className="brand-sub">{siteConfig.locationLabel}</span>
          </span>
        </a>

        <nav className="topnav" aria-label="Sections">
          <a href="/neighborhoods">Neighborhoods</a>
          <a href="/#opportunities">Listings</a>
          <a href="/about">About</a>
        </nav>

        <div className="header-actions">
          <a className="header-instagram" href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon size={17} />
          </a>
          <a className="pill pill-dark pill-sm" href={whatsappLink(`Hi ${siteConfig.contactName}, I'd like to discuss a property opportunity.`)} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={15} /> WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
