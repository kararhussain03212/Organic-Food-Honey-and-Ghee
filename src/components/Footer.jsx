import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getSettings, parseJsonField } from "../api/apiClient";
import { footerContent as staticFooter } from "../data/siteContent";
import { FiInstagram } from "react-icons/fi";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io5";

const STATIC_LINKS = staticFooter.timings.links;

const ICON_MAP = {
  instagram: FiInstagram,
  facebook: FaFacebookSquare,
  tiktok: AiFillTikTok,
  youtube: IoLogoYoutube,
};

const Footer = () => {
  const [s, setS] = useState(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data && Object.keys(data).length > 0) setS(data);
    });
  }, []);

  const brandTitle   = s?.footer_brand_title    || staticFooter.brand.title;
  const brandSub     = s?.footer_brand_subtitle || staticFooter.brand.subtitle;
  const aboutText    = s?.footer_about_text || staticFooter.contact.items[1]?.value || "";
  const phone        = s?.footer_phone     || staticFooter.contact.items[0]?.value || "";
  const email        = s?.footer_email     || staticFooter.contact.items[1]?.value || "";
  const address      = s?.footer_address   || staticFooter.contact.items[2]?.value || "";
  const copyright    = s?.footer_copyright || staticFooter.bottom;

  const footerLinks = useMemo(() => {
    const parsed = parseJsonField(s?.footer_links, []);
    return parsed.length > 0 ? parsed : STATIC_LINKS;
  }, [s?.footer_links]);

  const socialLinks = useMemo(() => {
    const parsed = parseJsonField(s?.footer_social_links, []);
    if (parsed.length > 0) return parsed;
    return [
      { label: "instagram", url: "https://www.instagram.com/ssarionorganicfood/", icon: "instagram" },
      { label: "facebook", url: "https://www.facebook.com/SSgeneraltradinguae", icon: "facebook" },
      { label: "youtube", url: "https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing", icon: "youtube" },
      { label: "tiktok", url: "https://www.tiktok.com/@ssarionorganicfood", icon: "tiktok" },
    ];
  }, [s?.footer_social_links]);

  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid">
        <div className="footer-brand-block">
          <div className="footer-logo" aria-hidden="true">
            <img src="/logo/General trading white storke.png" alt="logo" />
          </div>
          <div>
            <div className="footer-title">{brandTitle}</div>
            <div className="footer-subtitle">{brandSub}</div>
          </div>
        </div>

        <div className="footer-contact">
          <h3>{staticFooter.contact.heading}</h3>
          {phone && <p><strong>WhatsApp:</strong> {phone}</p>}
          {email && <p><strong>Email:</strong> {email}</p>}
          {address && <p><strong>Address:</strong> {address}</p>}
          <p className="follow-label">Follow Us:</p>
          <div className="socials" aria-label="Social links">
            {socialLinks.map((link) => {
              const IconComponent = ICON_MAP[link.icon] || FiInstagram;
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>

        <div className="footer-timings">
          <div className="timing-row">
            <h3>{s?.footer_timings_heading || staticFooter.timings.heading}</h3>
            <div className="date-time-row">
              <p>{s?.footer_timings_days || staticFooter.timings.days}</p>
              <p>{s?.footer_timings_time || staticFooter.timings.time}</p>
            </div>
          </div>
        </div>

        <div className="footer-poli">
          <div className="footer-links">
            {footerLinks.map((link) => {
              const isExternal = link.path?.startsWith("http://") || link.path?.startsWith("https://");
              const target = link.target || "_self";
              return isExternal ? (
                <a
                  key={link.label}
                  href={link.path}
                  target={target}
                  rel={target === "_blank" ? "noopener noreferrer" : ""}
                >
                  {link.label}
                </a>
              ) : (
                <Link to={link.path} key={link.label}>{link.label}</Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="footer-bottom">{copyright}</div>
    </footer>
  );
};

export default Footer;
