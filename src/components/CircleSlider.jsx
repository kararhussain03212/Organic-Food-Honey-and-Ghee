import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/apiClient";
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

// Initial slide data with premium organic products
const initialSlides = [
  {
    key: "sidr-honey-500g",
    name: "Pure Sidr Honey",
    variant: "500g",
    price: 1850,
    tags: ["Best Seller", "100% Pure"],
    description: "Sourced from the premium Sidr valleys, our raw and unfiltered Sidr Honey is known for its rich flavor, deep golden hue, and powerful medicinal properties.",
    image: "/product-images/honey 500 g.png",
    category: "HONEY",
    gradient: "radial-gradient(circle, #FCF5E5 0%, #E6C280 100%)"
  },
  {
    key: "cow-ghee-500g",
    name: "Premium Cow Ghee",
    variant: "500g",
    price: 1650,
    tags: ["A2 Quality", "Pure Bilona"],
    description: "Traditionally churned from fresh cow milk using the ancient Bilona method, rich in fat-soluble vitamins, offering a golden texture and delightful aroma.",
    image: "/product-images/cow-ghee-500g.png",
    category: "GHEE",
    gradient: "radial-gradient(circle, #FDF9E2 0%, #E8D786 100%)"
  },
  {
    key: "shilajit-5g",
    name: "Himalayan Shilajit",
    variant: "5g",
    price: 1250,
    tags: ["Gold Grade", "Natural Energy"],
    description: "Pure organic resin harvested from high-altitude Himalayan peaks. Packed with fulvic acid and 85+ trace minerals to boost stamina and vitality naturally.",
    image: "/product-images/shilajit 5g.png",
    category: "SHILAJIT",
    gradient: "radial-gradient(circle, #F2F2F2 0%, #C0C0C0 100%)"
  },
  {
    key: "buffalo-ghee-500g",
    name: "Organic Buffalo Ghee",
    variant: "500g",
    price: 1450,
    tags: ["Rich Aroma", "Kitchen Essential"],
    description: "Sourced from premium grass-fed buffaloes, this ghee is perfect for high-heat cooking and baking, adding a rich, creamy taste to your traditional dishes.",
    image: "/product-images/buffalo-ghee-500g.png",
    category: "GHEE",
    gradient: "radial-gradient(circle, #F8F8F8 0%, #DCDCDC 100%)"
  },
  {
    key: "goat-ghee-500g",
    name: "Pure Goat Ghee",
    variant: "500g",
    price: 2450,
    tags: ["Superfood", "Easy Digestion"],
    description: "A rare and highly nutritious ghee churned from fresh goat milk. Sourced from free-roaming mountain goats, highly digestible and rich in medium-chain fatty acids.",
    image: "/product-images/goat-ghee-500g.png",
    category: "GHEE",
    gradient: "radial-gradient(circle, #EBF5EB 0%, #C2E0C2 100%)"
  },
  {
    key: "honey-1kg",
    name: "Wild Forest Honey",
    variant: "1kg",
    price: 2950,
    tags: ["Multi-Floral", "Raw & Sweet"],
    description: "Harvested from wild forest wildflowers, this dark amber multi-floral honey has an intense floral aroma and natural therapeutic enzyme richness.",
    image: "/product-images/honey-1kg.png",
    category: "HONEY",
    gradient: "radial-gradient(circle, #FEF2E4 0%, #D4A373 100%)"
  }
];

// Preset angles for orbit thumbnails (degrees, where 0 is 12 o'clock going clockwise)
// Symmetrical arrangement around the sides and bottom:
// Pos 0: 40° (Top-Right)
// Pos 1: 110° (Bottom-Right)
// Pos 2: 180° (Bottom-Center)
// Pos 3: 250° (Bottom-Left)
// Pos 4: 320° (Top-Left)
const angles = [40, 110, 180, 250, 320];

export default function CircleSlider() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState(initialSlides);
  const [activeIdx, setActiveIdx] = useState(0);
  const [added, setAdded] = useState(false);

  // Sync slides with database products on mount
  useEffect(() => {
    getProducts().then((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        // Map the top real products to our slider format
        const merged = initialSlides.map((slide, index) => {
          const dbProd = dbProducts[index];
          if (dbProd) {
            const images = typeof dbProd.images === "string" ? JSON.parse(dbProd.images || "[]") : (dbProd.images || []);
            const imagePath = images[0] ? resolveImage(images[0]) : slide.image;
            const variants = typeof dbProd.variants === "string" ? JSON.parse(dbProd.variants || "[]") : (dbProd.variants || []);
            const variant = variants[0] || dbProd.subtitle || slide.variant;
            
            return {
              ...slide,
              id: dbProd.id,
              slug: dbProd.slug,
              price: Number(dbProd.price) || slide.price,
              image: imagePath,
              name: dbProd.name || slide.name,
              description: dbProd.short_desc || dbProd.shortDesc || dbProd.description || slide.description,
              variant: variant,
              category: dbProd.category_name ? dbProd.category_name.toUpperCase() : slide.category,
            };
          }
          return slide;
        });
        setSlides(merged);
      }
    });
  }, []);

  const activeProduct = slides[activeIdx];

  // Autoplay functionality: slide changes every 5 seconds
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Compute indices of other 5 slides that go onto the orbit
  const remainingSlides = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 5; i++) {
      const idx = (activeIdx + i) % slides.length;
      list.push({
        ...slides[idx],
        originalIdx: idx,
      });
    }
    return list;
  }, [activeIdx, slides]);

  // Handle Add to Cart action
  const handleAddToCart = () => {
    const prod = activeProduct;
    // Fallback ID if not fetched from DB
    const itemId = prod.id || `local-${prod.key}`;
    addToCart({
      id: itemId,
      name: prod.name,
      price: prod.price,
      qty: 1,
      image: prod.image,
      variant: prod.variant
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="circle-hero-section" id="home">
      <div className="circle-hero-container">
        {/* Left column: product copywriting details */}
        <div key={activeIdx} className="circle-hero-details animate-fade-in">
          <p className="circle-hero-kicker">Premium Selection</p>
          <h1 className="circle-hero-title">{activeProduct.name}</h1>

          <div className="circle-hero-tags">
            {activeProduct.tags.map((tag) => (
              <span key={tag} className="circle-hero-tag">
                {tag}
              </span>
            ))}
            <span className="circle-hero-tag">{activeProduct.variant}</span>
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
            style={{ background: activeProduct.gradient }}
          >
            <img
              key={activeIdx}
              src={resolveImage(activeProduct.image)}
              alt={activeProduct.name}
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
                key={slide.key}
                className="circle-hero-thumbnail-wrapper"
                style={{
                  transform: `translate(calc(-50% + var(--orbit-radius) * ${x}), calc(-50% + var(--orbit-radius) * ${y}))`,
                }}
              >
                <div
                  className="circle-hero-thumbnail"
                  onClick={() => setActiveIdx(slide.originalIdx)}
                >
                  <img src={resolveImage(slide.image)} alt={slide.name} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
