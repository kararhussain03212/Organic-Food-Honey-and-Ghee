import { footerContent } from "../data/siteContent";

const Footer = () => {
  const { brand, contact, timings, bottom } = footerContent;

  return (
    <footer className="site-footer">
      <div className="footer-inner footer-grid">
        <div className="footer-brand-block">
          <div className="footer-logo" aria-hidden="true">
            {/* {brand.initials} */}
            <img src="/logo/General trading storke.png" alt="logo" />
          </div>
          <div>
            <div className="footer-title">{brand.title}</div>
            <div className="footer-subtitle">{brand.subtitle}</div>
          </div>
        </div>

        <div className="footer-contact">
          <h3>{contact.heading}</h3>
          {contact.items.map((item) => (
            <p key={item.label}>
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
          <p className="follow-label">Follow Us:</p>
          {/* <div className="socials" aria-label="Social links">
            {contact.socials.map((social) => (
              <a href="#" key={social} aria-label={social}>
                {social[0]}
              </a>
            ))}
          </div> */}
        </div>

        <div className="footer-timings">
          <div className="timing-row">
            <div>
              <h3>{timings.heading}</h3>
              <p>{timings.days}</p>
            </div>
            <p className="timing-time">{timings.time}</p>
          </div>
          <div className="footer-links">
            {timings.links.map((link) => (
              <a href="#" key={link}>
                {link}
              </a>
            ))}
          </div>
          {/* <div className="app-badges">
            {timings.appBadges.map((badge) => (
              <button type="button" key={badge}>
                {badge}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      <div className="footer-bottom">{bottom}</div>
    </footer>
  );
};

export default Footer;
