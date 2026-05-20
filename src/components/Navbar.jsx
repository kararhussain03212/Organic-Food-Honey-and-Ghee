import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiInstagram } from "react-icons/fi";
import { FaFacebookSquare, FaWhatsapp } from "react-icons/fa";
import { getCartItems, removeFromCart } from "../utils/cart";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [city, setCity] = useState("Peshawar");
  const [area, setArea] = useState("Askari 5");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const areasByCity = useMemo(
    () => ({
      Peshawar: ["Askari 5", "Hayatabad", "University Town"],
      Islamabad: ["F-10", "G-11", "I-8", "Blue Area", "Bahria Town"],
      Lahore: ["Gulberg", "DHA", "Model Town", "Johar Town", "Wapda Town"],
      Karachi: ["Clifton", "DHA", "Gulshan-e-Iqbal", "North Nazimabad"],
      Rawalpindi: ["Saddar", "Bahria Town", "Chaklala", "Satellite Town"],
      Faisalabad: ["D Ground", "People's Colony", "Civil Lines"],
      Multan: ["Cantt", "Gulgasht", "Bosan Road"],
      Quetta: ["Cantt", "Jinnah Road", "Brewery Road"],
      Sialkot: ["Cantt", "Paris Road", "Daska Road"],
      Gujranwala: ["Satellite Town", "Model Town", "Civil Lines"],
    }),
    [],
  );

  const cityOptions = Object.keys(areasByCity);
  const areaOptions = areasByCity[city] || [];

  const handleCityChange = (event) => {
    const nextCity = event.target.value;
    const nextAreas = areasByCity[nextCity] || [];
    setCity(nextCity);
    setArea(nextAreas[0] || "");
    setUseCurrentLocation(false);
  };

  const handleAreaChange = (event) => {
    setArea(event.target.value);
    setUseCurrentLocation(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  useEffect(() => {
    const handleCartUpdate = () => setCartItems(getCartItems());
    window.addEventListener("cart:updated", handleCartUpdate);
    return () => window.removeEventListener("cart:updated", handleCartUpdate);
  }, []);

  const handleRemoveItem = (id, variant) => {
    removeFromCart(id, variant);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const lines = cartItems.map(
      (item) =>
        `- ${item.name} x${item.qty} (Rs ${item.price.toLocaleString()})`,
    );
    const message = [
      "Hi! I want to order:",
      ...lines,
      `Subtotal: Rs ${subtotal.toLocaleString()}`,
    ].join("\n");
    const url = `https://wa.me/923008543450?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <header className="site-header">
      {/* <div className="top-strip">
        <div className="top-inner">
          <div className="top-links">
            {topLinks.map((link) => (
              <a className="top-link" href="#" key={link}>
                {link}
              </a>
            ))}
          </div>
          <span>USA Organic Pantry</span>
        </div>
      </div> */}

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
            <Link className="nav-link" to={item.path} key={item.label}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <form
            className="search-box"
            role="search"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="search"
              name="q"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 14h-.8l-.3-.3a6 6 0 1 0-.9.9l.3.3v.8l4.7 4.7 1.4-1.4-4.4-4.7zM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
              </svg>
            </button>
          </form>

          {/* <button className="icon-btn" type="button" aria-label="Account">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.3 0-6 1.3-6 3v1h12v-1c0-1.7-2.7-3-6-3z" />
            </svg>
          </button> */}

          <button
            className="icon-btn"
            type="button"
            aria-label="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2zM6.2 6h12.9l-1.3 6.1a2 2 0 0 1-2 1.6H8.1a2 2 0 0 1-2-1.6L4.3 3H2V1h3.4z" />
            </svg>
            <span className="badge" aria-hidden="true">
              {cartItems.length}
            </span>
          </button>

          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* <div className="promo-strip">{promoMessage}</div> */}

      <div className="info-strip">
        <div className="info-inner">
          <button
            className="info-item"
            type="button"
            onClick={() => setIsLocationOpen(true)}
          >
            <span className="info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.3 6.1 12.3 6.4 12.6a.8.8 0 0 0 1.2 0C12.9 21.3 19 14.3 19 9a7 7 0 0 0-7-7zm0 9.4A2.4 2.4 0 1 1 12 6a2.4 2.4 0 0 1 0 4.4z" />
              </svg>
            </span>
            <div>
              <span className="info-title">Delivery to</span>
              <span className="info-subtitle">
                {area} , {city}
              </span>
            </div>
          </button>

          <div className="info-item">
            <span className="info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M19.2 15.4c-1-.1-2 .1-3 .4-.7.2-1.6 0-2.1-.6l-3-3c-.5-.5-.7-1.4-.6-2.1.3-1 .5-2 .4-3A2.9 2.9 0 0 0 8 4.4c-1.9-.4-3.4 1.1-3 3C6 12 12 18 16.6 19c1.9.4 3.4-1.1 3-3.6a2.9 2.9 0 0 0-.4-.1z" />
              </svg>
            </span>
            <span className="info-text">+923008543450</span>
          </div>

          <div className="info-item">
            <span className="info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm2.2 0L12 10.2 17.8 6H6.2z" />
              </svg>
            </span>
            <span className="info-text">
              Onlinesupport@swiftsignorganicfood.com
            </span>
          </div>

          <div className="info-item info-right">
            <span className="info-text">
              Welcome to Swift sign organic food
            </span>
          </div>
        </div>
      </div>

      <div
        className={`mobile-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      <div
        className={`cart-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden={!isCartOpen}
      />

      <div
        className={`mobile-panel ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mobile-panel-header">
          <div className="mobile-brand">
            <img src="/logo/General trading storke.png" alt="Swift Sign logo" />
            <div>
              <span className="mobile-brand-title">Swift Sign</span>
              <span className="mobile-brand-subtitle">Organic Foods</span>
            </div>
          </div>
          <button
            className="mobile-panel-close"
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="nav-links mobile" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              className="nav-link"
              to={item.path}
              key={`mob-${item.label}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-contact">
          <div>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.3 6.1 12.3 6.4 12.6a.8.8 0 0 0 1.2 0C12.9 21.3 19 14.3 19 9a7 7 0 0 0-7-7zm0 9.4A2.4 2.4 0 1 1 12 6a2.4 2.4 0 0 1 0 4.4z" />
            </svg>
            <div>
              <span>I-8 Markaz, Islamabad, Pakistan</span>
            </div>
          </div>
          <div>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.2 15.4c-1-.1-2 .1-3 .4-.7.2-1.6 0-2.1-.6l-3-3c-.5-.5-.7-1.4-.6-2.1.3-1 .5-2 .4-3A2.9 2.9 0 0 0 8 4.4c-1.9-.4-3.4 1.1-3 3C6 12 12 18 16.6 19c1.9.4 3.4-1.1 3-3.6a2.9 2.9 0 0 0-.4-.1z" />
            </svg>
            <div>
              <span>+92 333 8399480</span>
              <small>Call support</small>
            </div>
          </div>
        </div>

        <div className="mobile-socials" aria-label="Social links">
          <a href="#" aria-label="Instagram">
            <FiInstagram />
          </a>
          <a href="#" aria-label="Facebook">
            <FaFacebookSquare />
          </a>
          <a href="#" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </div>
      </div>

      <aside
        className={`cart-panel ${isCartOpen ? "open" : ""}`}
        aria-label="Cart sidebar"
      >
        <div className="cart-header">
          <div>
            <span className="cart-title">Your Cart</span>
            <span className="cart-subtitle">{cartItems.length} items</span>
          </div>
          <button
            className="cart-close"
            type="button"
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
          >
            ×
          </button>
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
                  <span className="cart-item-meta">
                    Qty {item.qty}
                    {item.variant ? ` • ${item.variant}` : ""}
                  </span>
                  <button
                    className="cart-remove"
                    type="button"
                    onClick={() => handleRemoveItem(item.id, item.variant)}
                  >
                    Remove
                  </button>
                </div>
                <span className="cart-item-price">
                  Rs {item.price.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="cart-total">
          <span>Subtotal</span>
          <strong>Rs {subtotal.toLocaleString()}</strong>
        </div>
        <div className="cart-actions">
          <button
            className="cart-btn primary"
            type="button"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        </div>
      </aside>

      {isLocationOpen && (
        <div className="location-modal-overlay">
          <div className="location-modal">
            <button
              className="location-modal-close btn-ripple"
              type="button"
              aria-label="Close"
              onClick={() => setIsLocationOpen(false)}
            >
              ×
            </button>

            <div className="location-modal-header">
              <div className="location-modal-brand">
                <img
                  src="/src/assets/logo/General trading storke.png"
                  alt="logo"
                  className="h-20"
                />
                <div>
                  <p className="location-modal-kicker">Swift Sign</p>
                  <h3 className="location-modal-title">
                    Choose Delivery Location
                  </h3>
                  <p className="location-modal-subtitle">
                    Fresh products delivered near you
                  </p>
                </div>
              </div>

              <div className="location-modal-hero">
                <div className="location-modal-pill btn-ripple">Delivery</div>
                <div className="location-modal-illustration" aria-hidden="true">
                  <svg viewBox="0 0 64 64">
                    <path d="M8 36h30v10H8z" />
                    <path d="M38 26h10l8 8v12H38z" />
                    <circle cx="20" cy="48" r="5" />
                    <circle cx="46" cy="48" r="5" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="location-modal-body">
              <div className="location-modal-success">
                <div className="location-modal-success-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M9.5 16.2 5.8 12.6l-1.4 1.4 5.1 5 10.1-10-1.4-1.4z" />
                  </svg>
                </div>
                <div>
                  <p className="location-modal-success-title">
                    Great! Delivery is available in your area
                  </p>
                  <p className="location-modal-success-note">
                    {useCurrentLocation
                      ? "Using current location for near shop availability."
                      : `Near shop is available for ${area}, ${city}.`}
                  </p>
                </div>
              </div>

              <button
                className={`location-modal-current btn-ripple ${
                  useCurrentLocation ? "is-active" : ""
                }`}
                type="button"
                onClick={() => setUseCurrentLocation(true)}
              >
                <span
                  className="location-modal-current-icon"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.3 6.1 12.3 6.4 12.6a.8.8 0 0 0 1.2 0C12.9 21.3 19 14.3 19 9a7 7 0 0 0-7-7zm0 9.4A2.4 2.4 0 1 1 12 6a2.4 2.4 0 0 1 0 4.4z" />
                  </svg>
                </span>
                Use Current Location
              </button>

              <div className="location-modal-fields">
                <label className="field">
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.3 6.1 12.3 6.4 12.6a.8.8 0 0 0 1.2 0C12.9 21.3 19 14.3 19 9a7 7 0 0 0-7-7zm0 9.4A2.4 2.4 0 1 1 12 6a2.4 2.4 0 0 1 0 4.4z" />
                    </svg>
                  </span>
                  <select
                    className="field-select"
                    value={city}
                    onChange={handleCityChange}
                  >
                    {cityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="field-label">Select City / Region</span>
                </label>

                <label className="field">
                  <span className="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.3 6.1 12.3 6.4 12.6a.8.8 0 0 0 1.2 0C12.9 21.3 19 14.3 19 9a7 7 0 0 0-7-7zm0 9.4A2.4 2.4 0 1 1 12 6a2.4 2.4 0 0 1 0 4.4z" />
                    </svg>
                  </span>
                  <select
                    className="field-select"
                    value={area}
                    onChange={handleAreaChange}
                  >
                    {areaOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="field-label">Select Area / Sub Region</span>
                </label>
              </div>

              <button
                className="location-modal-submit btn-ripple"
                type="button"
                onClick={() => setIsLocationOpen(false)}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
