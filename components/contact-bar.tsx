import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export function ContactBar({ message }: { message?: string }) {
  return (
    <div className="bottom-bar">
      <a className="pill pill-dark" href={whatsappLink(message ?? `Hi ${siteConfig.contactName}, I'd like to discuss a property opportunity.`)} target="_blank" rel="noreferrer">
        <WhatsAppIcon size={16} /> WhatsApp
      </a>
      <a className="pill pill-outline" href={`tel:${siteConfig.phoneTel}`}>
        <PhoneIcon size={15} /> CALL {siteConfig.phoneDisplay}
      </a>
    </div>
  );
}
