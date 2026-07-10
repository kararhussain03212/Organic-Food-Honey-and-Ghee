import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getSettings, parseJsonField, isSectionActive } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";
import { FiInstagram } from "react-icons/fi";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io5";


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

  const brandTitle   = s?.footer_brand_title;
  const brandSub     = s?.footer_brand_subtitle;
  const phone        = s?.footer_phone;
  const email        = s?.footer_email;
  const address      = s?.footer_address;
  const copyright    = s?.footer_copyright;
  const contactHeading = s?.footer_contact_heading;
  const timingsHeading = s?.footer_timings_heading;
  const timingsDays = s?.footer_timings_days;
  const timingsTime = s?.footer_timings_time;

  const footerLogoUrl = useMemo(() => {
    const logo = s?.footer_logo;
    if (!logo) return null;
    if (logo.startsWith("http")) return logo;
    if (logo.startsWith("/uploads/")) return getBackendRoot() + logo;
    if (logo.startsWith("/")) return getBackendRoot() + logo;
    return getBackendRoot() + "/uploads/" + logo;
  }, [s?.footer_logo]);

  const footerQuickLinks = useMemo(() => {
    return parseJsonField(s?.footer_quick_links, []);
  }, [s?.footer_quick_links]);

  const footerLinks = useMemo(() => {
    return parseJsonField(s?.footer_links, []);
  }, [s?.footer_links]);

  const socialLinks = useMemo(() => {
    return parseJsonField(s?.footer_social_links, []);
  }, [s?.footer_social_links]);

  if (!s || !isSectionActive(s, "footer")) return null;

  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid">
        {(brandTitle || brandSub) && (
          <div className="footer-brand-block">
            <div className="footer-logo" aria-hidden="true">
              <img src={footerLogoUrl} alt={`${brandTitle} - Organic Food Pakistan`} />
            </div>
            <div>
              {brandTitle && <div className="footer-title">{brandTitle}</div>}
              {brandSub && <div className="footer-subtitle">{brandSub}</div>}
            </div>
          </div>
        )}

        {(contactHeading || phone || email || address || socialLinks.length > 0) && (
          <div className="footer-contact">
            {contactHeading && <h3>{contactHeading}</h3>}
            {phone && <p><strong>WhatsApp:</strong> {phone}</p>}
            {email && <p><strong>Email:</strong> {email}</p>}
            {address && <p><strong>Address:</strong> {address}</p>}
            {socialLinks.length > 0 && (
              <>
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
              </>
            )}
          </div>
        )}

        {(timingsHeading || timingsDays || timingsTime) && (
          <div className="footer-timings">
            <div className="timing-row">
              {timingsHeading && <h3>{timingsHeading}</h3>}
              <div className="date-time-row">
                {timingsDays && <p>{timingsDays}</p>}
                {timingsTime && <p>{timingsTime}</p>}
              </div>
            </div>
          </div>
        )}

        {footerQuickLinks.length > 0 && (
          <div className="footer-quick">
            <div className="footer-links">
              {footerQuickLinks.map((link) => {
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
        )}

        {footerLinks.length > 0 && (
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
        )}
      </div>

      {copyright && <div className="footer-bottom">{copyright}</div>}
    </footer>
  );
};

export default Footer;
