import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getHeroSlides } from "../api/apiClient";
import { addToCart } from "../utils/cart";
import "../styles/CircleSlider.css";

// Helper to resolve images using Vite env
const apiRoot = (import.meta.env.VITE_API_URL || "/backend").replace(/\/$/, "");
const resolveImage = (img) => {
  const path = typeof img === "object" && img !== null ? img.url : img;
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return apiRoot + path;
  if (path.startsWith("/")) return path;
  return "/" + path;
};

const DEFAULT_GRADIENT = "radial-gradient(circle, #FCF5E5 0%, #E6C280 100%)";

// Orbit thumbnail angles (degrees, 0 = 12 o'clock, clockwise).
// Distributes however many thumbnails exist across the 40°–320° arc,
// keeping the top of the orbit clear — matches the original 5-thumb
// layout (40, 110, 180, 250, 320) when there are 6 slides.
const orbitAngles = (count) => {
  if (count <= 0) return [];
  if (count === 1) return [180];
  const step = 280 / (count - 1);
  return Array.from({ length: count }, (_, i) => 40 + i * step);
};

export default function CircleSlider() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [added, setAdded] = useState(false);

  // Load slides from the hero-slides API (admin-managed, product-linked)
  useEffect(() => {
    getHeroSlides().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setSlides(data);
        setActiveIdx(0);
      }
    });
  }, []);

  const activeProduct = slides[activeIdx];

  // Autoplay functionality: slide changes every 5 seconds
  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // The other slides go onto the orbit as thumbnails (preview ring)
  const remainingSlides = useMemo(() => {
    const list = [];
    for (let i = 1; i < slides.length; i++) {
      const idx = (activeIdx + i) % slides.length;
      list.push({
        ...slides[idx],
        originalIdx: idx,
      });
    }
    return list;
  }, [activeIdx, slides]);

  const angles = useMemo(() => orbitAngles(remainingSlides.length), [remainingSlides.length]);

  // Handle Add to Cart action
  const handleAddToCart = () => {
    const prod = activeProduct;
    addToCart({
      id: prod.product_id,
      name: prod.title,
      price: prod.price,
      qty: 1,
      image: resolveImage(prod.image),
      variant: prod.variant
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!activeProduct) return null;

  return (
    <section className="circle-hero-section" id="home">
      <div className="circle-hero-container">
        {/* Left column: product copywriting details */}
        <div key={activeIdx} className="circle-hero-details animate-fade-in">
          <p className="circle-hero-kicker">{activeProduct.eyebrow}</p>
          <h1 className="circle-hero-title">{activeProduct.title}</h1>

          <div className="circle-hero-tags">
            {(activeProduct.tags || []).map((tag) => (
              <span key={tag} className="circle-hero-tag">
                {tag}
              </span>
            ))}
            {activeProduct.variant ? (
              <span className="circle-hero-tag">{activeProduct.variant}</span>
            ) : null}
          </div>

          <p className="circle-hero-description">{activeProduct.description}</p>

          <div className="circle-hero-actions">
            <button className="circle-hero-btn-cart" onClick={handleAddToCart}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {added ? "Added!" : "Add to Cart"}
            </button>
            <button
              className="circle-hero-btn-view"
              onClick={() => {
                if (activeProduct.slug) navigate(`/products/${activeProduct.slug}`);
              }}
            >
              View Product
            </button>
          </div>

          <div className="circle-hero-indicators">
            <div className="circle-hero-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`circle-hero-dot ${i === activeIdx ? "active" : ""}`}
                  onClick={() => setActiveIdx(i)}
                />
              ))}
            </div>
            <div className="circle-hero-index-text">
              {activeProduct.category}
              <span>·</span>
              {activeIdx + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Right column: circular orbital slider */}
        <div className="circle-hero-slider-container">
          {/* Orbit dashed track */}
          <div className="circle-hero-orbit" />

          {/* Central Active Circle */}
          <div
            className="circle-hero-center-circle"
            style={{ background: activeProduct.gradient || DEFAULT_GRADIENT }}
          >
            <img
              key={activeIdx}
              src={resolveImage(activeProduct.image)}
              alt={activeProduct.title}
              className="circle-hero-center-image"
            />
          </div>

          {/* Orbiting Thumbnails */}
          {remainingSlides.map((slide, index) => {
            const angle = angles[index];
            const rad = (angle * Math.PI) / 180;
            // Orbit radius in pixels (aligns with CSS variables/media queries)
            // We use transform calc in style to leverage CSS custom properties `--orbit-radius`
            const x = Math.sin(rad);
            const y = -Math.cos(rad);

            return (
              <div
                key={slide.id}
                className="circle-hero-thumbnail-wrapper"
                style={{
                  transform: `translate(calc(-50% + var(--orbit-radius) * ${x}), calc(-50% + var(--orbit-radius) * ${y}))`,
                }}
              >
                <div
                  className="circle-hero-thumbnail"
                  onClick={() => setActiveIdx(slide.originalIdx)}
                >
                  <img src={resolveImage(slide.image)} alt={slide.title} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
