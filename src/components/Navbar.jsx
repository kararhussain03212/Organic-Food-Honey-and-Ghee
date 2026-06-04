import { useEffect, useState } from "react";
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

const DELIVERY_KEY = "delivery_location";

const NAV_ITEMS = [
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
  const navigate = useNavigate();

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
      (item) => `- ${item.name} x${item.qty} (Rs ${item.price.toLocaleString()})`,
    );
    const message = [
      "Hi! I want to order:",
      ...lines,
      `Subtotal: Rs ${subtotal.toLocaleString()}`,
      buildDeliveryBlock(),
    ].join("\n");
    window.open(
      `https://wa.me/923338399480?text=${encodeURIComponent(message)}`,
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
        `https://wa.me/923338399480?text=${encodeURIComponent(pendingWaMessage + buildDeliveryBlock())}`,
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
        <Link className="brand" to="/" aria-label="Swift Sign home">
          <div className="logo-badge" aria-hidden="true">
            <img src="/logo/General trading storke.png" alt="logo" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Swift Sign</span>
            <span className="brand-subtitle">Organic Foods</span>
          </div>
        </Link>

        <nav className="nav-links desktop" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link className="nav-link" to={item.path} key={item.label}>{item.label}</Link>
          ))}
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
              <span className="info-text">+92 333 8399480</span>
            </div>
            <div className="info-item">
              <span className="info-icon" aria-hidden="true"><MdEmail /></span>
              <span className="info-text">info@swiftsigngeneraltrading.com</span>
            </div>
          </div>
          <div className="info-left">
            <div className="info-item info-right">
              <span className="info-text">Welcome to Swift Sign Arion Organic Food</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`mobile-overlay ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)} aria-hidden={!isOpen} />
      <div className={`cart-overlay ${isCartOpen ? "open" : ""}`} onClick={() => setIsCartOpen(false)} aria-hidden={!isCartOpen} />

      {/* Mobile panel */}
      <div className={`mobile-panel ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="mobile-panel-header">
          <div className="mobile-brand">
            <img src="/logo/General trading storke.png" alt="Swift Sign logo" />
            <div>
              <span className="mobile-brand-title">Swift Sign</span>
              <span className="mobile-brand-subtitle">Organic Foods</span>
            </div>
          </div>
          <button className="mobile-panel-close" type="button" aria-label="Close menu" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <nav className="nav-links mobile" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link className="nav-link" to={item.path} key={`mob-${item.label}`} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-contact">
          <div>
            <FaLocationDot />
            <div><span>Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan.</span></div>
          </div>
          <div>
            <IoCall />
            <div><span>+92 333 8399480</span><small>Call support</small></div>
          </div>
        </div>

        <div className="mobile-socials" aria-label="Social links">
          <a href="https://www.instagram.com/ssarionorganicfood/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
          <a href="https://www.facebook.com/SSgeneraltradinguae" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookSquare /></a>
          <a href="https://www.youtube.com/channel/UCv62oVoa-UmP8ePbMPuHydw/editing" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IoLogoYoutube /></a>
          <a href="https://www.tiktok.com/@ssarionorganicfood" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><AiFillTikTok /></a>
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
                  <img src="/logo/General trading storke.png" alt="Swift Sign logo" />
                </div>
                <div>
                  <p className="location-modal-kicker">Swift Sign</p>
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
