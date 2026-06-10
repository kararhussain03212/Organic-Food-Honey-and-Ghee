import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiInstagram } from "react-icons/fi";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io5";
import { clearCart, getCartItems, removeFromCart } from "../utils/cart";
import Marquee from "./Marquee";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { getSettings, parseJsonField } from "../api/apiClient";

const DELIVERY_KEY = "delivery_location";

const SOCIAL_ICON_MAP = {
  instagram: <FiInstagram />,
  facebook:  <FaFacebookSquare />,
  youtube:   <IoLogoYoutube />,
  tiktok:    <AiFillTikTok />,
};

const DEFAULT_SOCIAL_LINKS = [
  { label: "Instagram", url: "https://www.instagram.com/ssarionorganicfood/", icon: "instagram" },
  { label: "Facebook",  url: "https://www.facebook.com/SSgeneraltradinguae",  icon: "facebook"  },
  { label: "YouTube",   url: "https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw", icon: "youtube" },
  { label: "TikTok",   url: "https://www.tiktok.com/@ssarionorganicfood",    icon: "tiktok"    },
];

const DEFAULT_NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Products", path: "/products" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];


function loadSaved() {
  try { return JSON.parse(localStorage.getItem(DELIVERY_KEY) || "null") || {}; }
  catch { return {}; }
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [pendingWaMessage, setPendingWaMessage] = useState("");
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const [searchTerm, setSearchTerm] = useState("");
  const [settings, setSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getSettings().then((data) => {
      if (data && Object.keys(data).length > 0) setSettings(data);
    });
  }, []);

  const brandTitle    = settings.navbar_brand_title    || "Arion Organic Food";
  const brandSubtitle = settings.navbar_brand_subtitle || "Organic Foods";
  const navPhone      = settings.navbar_phone          || "+92 333 8399480";
  const navEmail      = settings.navbar_email          || "info@arionorganic.com";
  const welcomeText   = settings.navbar_welcome_text   || "Welcome to Arion Organic Food";
  const waNumber      = settings.whatsapp_number       || "923338399480";

  const navItems = useMemo(() => {
    const parsed = parseJsonField(settings.nav_links, []);
    return parsed.length > 0 ? parsed : DEFAULT_NAV_ITEMS;
  }, [settings.nav_links]);

  const socialLinks = useMemo(() => {
    const parsed = parseJsonField(settings.footer_social_links, []);
    if (parsed.length > 0) return parsed;
    // fall back to individual contact settings
    const fallback = [];
    if (settings.contact_instagram) fallback.push({ label: "Instagram", url: settings.contact_instagram, icon: "instagram" });
    if (settings.contact_facebook)  fallback.push({ label: "Facebook",  url: settings.contact_facebook,  icon: "facebook"  });
    if (settings.contact_youtube)   fallback.push({ label: "YouTube",   url: settings.contact_youtube,   icon: "youtube"   });
    if (settings.contact_tiktok)    fallback.push({ label: "TikTok",    url: settings.contact_tiktok,    icon: "tiktok"    });
    return fallback.length > 0 ? fallback : DEFAULT_SOCIAL_LINKS;
  }, [settings.footer_social_links, settings.contact_instagram, settings.contact_facebook, settings.contact_youtube, settings.contact_tiktok]);

  const saved = loadSaved();
  const [firstName, setFirstName] = useState(saved.firstName || "");
  const [lastName, setLastName] = useState(saved.lastName || "");
  const [streetAddress, setStreetAddress] = useState(saved.streetAddress || "");
  const [apartment, setApartment] = useState(saved.apartment || "");
  const [city, setCity] = useState(saved.city || "");
  const [postalCode, setPostalCode] = useState(saved.postalCode || "");
  const [phone, setPhone] = useState(saved.phone || "");

  const hasSavedLocation = Boolean(firstName && lastName && streetAddress && city && phone);
  const canSubmitLocation = Boolean(
    firstName.trim() && lastName.trim() && streetAddress.trim() && city.trim() && phone.trim(),
  );

  const buildDeliveryBlock = () =>
    [
      "",
      "📍 Delivery Details:",
      `👤 Name: ${firstName.trim()} ${lastName.trim()}`,
      `🏠 Address: ${streetAddress.trim()}${apartment.trim() ? ` | ${apartment.trim()}` : ""}`,
      `🏙️ City: ${city.trim()}${postalCode.trim() ? ` | ${postalCode.trim()}` : ""}`,
      `📱 Phone: ${phone.trim()}`,
      `🌍 Country: Pakistan`,
    ].join("\n");

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchTerm("");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    const handleCartUpdate = () => setCartItems(getCartItems());
    window.addEventListener("cart:updated", handleCartUpdate);
    return () => window.removeEventListener("cart:updated", handleCartUpdate);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      setPendingWaMessage(e.detail.message || "");
      setIsLocationOpen(true);
    };
    window.addEventListener("shop:requestLocation", handler);
    return () => window.removeEventListener("shop:requestLocation", handler);
  }, []);

  const saveLocation = () => {
    localStorage.setItem(
      DELIVERY_KEY,
      JSON.stringify({ firstName, lastName, streetAddress, apartment, city, postalCode, phone }),
    );
  };

  const handleRemoveItem = (id, variant) => removeFromCart(id, variant);

  const completeCheckout = () => {
    if (cartItems.length === 0) return;
    const lines = cartItems.map(
      (item) => `  • ${item.name} × ${item.qty} (Rs ${item.price.toLocaleString()})`,
    );
    const message = [
      "🛒 *ORDER REQUEST*",
      "",
      "Items:",
      ...lines,
      "",
      `💰 Subtotal: Rs ${subtotal.toLocaleString()}`,
      buildDeliveryBlock(),
    ].join("\n");
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    clearCart();
    setIsCartOpen(false);
  };

  const handleCheckout = () => setIsLocationOpen(true);

  const handleSelectLocation = () => {
    if (!canSubmitLocation) return;
    saveLocation();
    setIsLocationOpen(false);
    if (pendingWaMessage) {
      window.open(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(pendingWaMessage + buildDeliveryBlock())}`,
        "_blank",
        "noopener,noreferrer",
      );
      setPendingWaMessage("");
    } else {
      completeCheckout();
    }
  };

  return (
    <header className="site-header">
      <Marquee />

      <div className="main-nav">
        <Link className="brand" to="/" aria-label={`${brandTitle} home`}>
          <div className="logo-badge" aria-hidden="true">
            <img src="/logo/General trading storke.png" alt="logo" />
          </div>
          <div className="brand-text">
            <span className="brand-title">{brandTitle}</span>
            <span className="brand-subtitle">{brandSubtitle}</span>
          </div>
        </Link>

        <nav className="nav-links desktop" aria-label="Main navigation">
          {navItems.map((item) => {
            const isExternal = item.path?.startsWith("http://") || item.path?.startsWith("https://");
            const target = item.target || "_self";
            return isExternal ? (
              <a
                key={item.label}
                className="nav-link"
                href={item.path}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : ""}
              >
                {item.label}
              </a>
            ) : (
              <Link className="nav-link" to={item.path} key={item.label}>{item.label}</Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <form className="search-box" role="search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              name="q"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search"><IoSearch /></button>
          </form>

          <button className="icon-btn" type="button" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2zM6.2 6h12.9l-1.3 6.1a2 2 0 0 1-2 1.6H8.1a2 2 0 0 1-2-1.6L4.3 3H2V1h3.4z" />
            </svg>
            <span className="badge" aria-hidden="true">{cartItems.length}</span>
          </button>

          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className="info-strip">
        <div className="info-inner">
          <div className="info-left">
            <div className="info-item">
              <span className="info-icon" aria-hidden="true"><IoCall /></span>
              <span className="info-text">{navPhone}</span>
            </div>
            <div className="info-item">
              <span className="info-icon" aria-hidden="true"><MdEmail /></span>
              <span className="info-text">{navEmail}</span>
            </div>
          </div>
          <div className="info-left">
            <div className="info-item info-right">
              <span className="info-text">{welcomeText}</span>
            </div>
            {/* <div className="info-socials">
              {socialLinks.map((link) => (
                <a key={link.icon} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label || link.icon} className="info-social-link">
                  {SOCIAL_ICON_MAP[link.icon] ?? null}
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      <div className={`mobile-overlay ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)} aria-hidden={!isOpen} />
      <div className={`cart-overlay ${isCartOpen ? "open" : ""}`} onClick={() => setIsCartOpen(false)} aria-hidden={!isCartOpen} />

      {/* Mobile panel */}
      <div className={`mobile-panel ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="mobile-panel-header">
          <div className="mobile-brand">
            <img src="/logo/General trading storke.png" alt={`${brandTitle} logo`} />
            <div>
              <span className="mobile-brand-title">{brandTitle}</span>
              <span className="mobile-brand-subtitle">{brandSubtitle}</span>
            </div>
          </div>
          <button className="mobile-panel-close" type="button" aria-label="Close menu" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <nav className="nav-links mobile" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const isExternal = item.path?.startsWith("http://") || item.path?.startsWith("https://");
            const target = item.target || "_self";
            return isExternal ? (
              <a
                key={`mob-${item.label}`}
                className="nav-link"
                href={item.path}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : ""}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link className="nav-link" to={item.path} key={`mob-${item.label}`} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* <div className="mobile-contact">
          <div>
            <FaLocationDot />
            <div><span>Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan.</span></div>
          </div>
          <div>
            <IoCall />
            <div><span>{navPhone}</span><small>Call support</small></div>
          </div>
        </div> */}

        <div className="mobile-socials" aria-label="Social links">
          {socialLinks.map((link) => (
            <a key={link.icon} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label || link.icon}>
              {SOCIAL_ICON_MAP[link.icon] ?? null}
            </a>
          ))}
        </div>
      </div>

      {/* Cart panel */}
      <aside className={`cart-panel ${isCartOpen ? "open" : ""}`} aria-label="Cart sidebar">
        <div className="cart-header">
          <div>
            <span className="cart-title">Your Cart</span>
            <span className="cart-subtitle">{cartItems.length} items</span>
          </div>
          <button className="cart-close" type="button" aria-label="Close cart" onClick={() => setIsCartOpen(false)}>×</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">Your cart is empty.</div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.variant}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-meta">Qty {item.qty}{item.variant ? ` • ${item.variant}` : ""}</span>
                  <button className="cart-remove" type="button" onClick={() => handleRemoveItem(item.id, item.variant)}>Remove</button>
                </div>
                <span className="cart-item-price">Rs {item.price.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>

        <div className="cart-total">
          <span>Subtotal</span>
          <strong>Rs {subtotal.toLocaleString()}</strong>
        </div>

        <div className="cart-actions">
          <button className="cart-btn primary" type="button" onClick={handleCheckout} disabled={cartItems.length === 0}>
            Checkout
          </button>
        </div>
      </aside>

      {/* Location / Delivery modal */}
      {isLocationOpen && (
        <div className="location-modal-overlay">
          <div className="location-modal">
            <button
              className="location-modal-close"
              type="button"
              aria-label="Close"
              onClick={() => { setIsLocationOpen(false); setPendingWaMessage(""); }}
            >
              ×
            </button>

            <div className="location-modal-header">
              <div className="location-modal-brand">
                <div className="location-modal-logo">
                  <img src="/logo/General trading storke.png" alt={`${brandTitle} logo`} />
                </div>
                <div>
                  <p className="location-modal-kicker">{brandTitle}</p>
                  <h3 className="location-modal-title">Choose Delivery Location</h3>
                  <p className="location-modal-subtitle">Fresh products delivered near you</p>
                </div>
              </div>
              <div className="location-modal-pill btn-ripple">Delivery</div>
            </div>

            <div className="location-modal-body">
              <div className="location-modal-success">
                <div className="location-modal-success-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M9.5 16.2 5.8 12.6l-1.4 1.4 5.1 5 10.1-10-1.4-1.4z" /></svg>
                </div>
                <div>
                  <p className="location-modal-success-title">Great! Delivery is available in your area</p>
                  <p className="location-modal-success-note">
                    {hasSavedLocation
                      ? `Delivering to: ${streetAddress}, ${city}`
                      : "Please fill in your delivery details below."}
                  </p>
                </div>
              </div>

              {/* Country — fixed */}
              <div className="dlv-country">
                <label className="dlv-label">Country / Region</label>
                <div className="dlv-country-val">Pakistan</div>
              </div>

              {/* Name row */}
              <div className="dlv-row">
                <div className="dlv-field">
                  <label className="dlv-label">First name *</label>
                  <input className="dlv-input" type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="dlv-field">
                  <label className="dlv-label">Last name *</label>
                  <input className="dlv-input" type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              {/* Street address */}
              <div className="dlv-field">
                <label className="dlv-label">Address *</label>
                <input className="dlv-input" type="text" placeholder="Street address" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
              </div>

              {/* Apartment */}
              <div className="dlv-field">
                <label className="dlv-label">Apartment, suite, etc. <span className="dlv-optional">(optional)</span></label>
                <input className="dlv-input" type="text" placeholder="Apartment, suite, etc." value={apartment} onChange={(e) => setApartment(e.target.value)} />
              </div>

              {/* City + Postal code */}
              <div className="dlv-row">
                <div className="dlv-field">
                  <label className="dlv-label">City *</label>
                  <input className="dlv-input" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="dlv-field">
                  <label className="dlv-label">Postal code <span className="dlv-optional">(optional)</span></label>
                  <input className="dlv-input" type="text" placeholder="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
              </div>

              {/* Phone */}
              <div className="dlv-field">
                <label className="dlv-label">Phone *</label>
                <input className="dlv-input" type="tel" placeholder="+92 300 0000000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <button
                className="location-modal-submit btn-ripple"
                type="button"
                disabled={!canSubmitLocation}
                onClick={handleSelectLocation}
              >
                Confirm &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
