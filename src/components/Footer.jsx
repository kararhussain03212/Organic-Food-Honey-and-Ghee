import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSettings } from "../api/apiClient";
import { footerContent as staticFooter } from "../data/siteContent";
import { FiInstagram } from "react-icons/fi";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io5";

const STATIC_LINKS = staticFooter.timings.links;

const Footer = () => {
  const [s, setS] = useState(null);

  useEffect(() => {
    getSettings().then((data) => {
      if (data && Object.keys(data).length > 0) setS(data);
    });
  }, []);

  const brandTitle   = staticFooter.brand.title;
  const brandSub     = staticFooter.brand.subtitle;
  const aboutText    = s?.footer_about_text || staticFooter.contact.items[1]?.value || "";
  const phone        = s?.footer_phone     || staticFooter.contact.items[0]?.value || "";
  const email        = s?.footer_email     || staticFooter.contact.items[1]?.value || "";
  const address      = s?.footer_address   || staticFooter.contact.items[2]?.value || "";
  const copyright    = s?.footer_copyright || staticFooter.bottom;

  const fbUrl  = s?.footer_social_facebook  || "https://www.facebook.com/SSgeneraltradinguae";
  const igUrl  = s?.footer_social_instagram || "https://www.instagram.com/ssarionorganicfood/";
  const ytUrl  = s?.footer_social_youtube   || "https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing";
  const tkUrl  = s?.footer_social_tiktok    || "https://www.tiktok.com/@ssarionorganicfood";

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
          {aboutText && <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", opacity: 0.7, lineHeight: 1.6 }}>{aboutText}</p>}
        </div>

        <div className="footer-contact">
          <h3>{staticFooter.contact.heading}</h3>
          {phone && <p><strong>WhatsApp:</strong> {phone}</p>}
          {email && <p><strong>Email:</strong> {email}</p>}
          {address && <p><strong>Address:</strong> {address}</p>}
          <p className="follow-label">Follow Us:</p>
          <div className="socials" aria-label="Social links">
            <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
            <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookSquare /></a>
            <a href={ytUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IoLogoYoutube /></a>
            <a href={tkUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><AiFillTikTok /></a>
          </div>
        </div>

        <div className="footer-timings">
          <div className="timing-row">
            <h3>{staticFooter.timings.heading}</h3>
            <div className="date-time-row">
              <p>{staticFooter.timings.days}</p>
              <p>{staticFooter.timings.time}</p>
            </div>
          </div>
        </div>

        <div className="footer-poli">
          <div className="footer-links">
            {STATIC_LINKS.map((link) => (
              <Link to={link.path} key={link.label}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">{copyright}</div>
    </footer>
  );
};

export default Footer;
