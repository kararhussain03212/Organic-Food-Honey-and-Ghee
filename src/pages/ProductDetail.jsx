import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductBySlug,
  getRelatedProducts,
} from "../data/productsData";
import { addToCart } from "../utils/cart";
import "../styles/Products.css";

/* ─── Image Gallery ─────────────────────────────── */
function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);
  return (
    <div className="pd-gallery">
      <div className="pd-gallery-main">
        <img src={images[active]} alt={name} className="pd-gallery-img" />
      </div>
      {/* {images.length > 1 && (
        <div className="pd-gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`pd-thumb${active === i ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img src={img} alt={`${name} view ${i + 1}`} />
            </button>
          ))}
        </div>
      )} */}
    </div>
  );
}

/* ─── FAQ Accordion ─────────────────────────────── */
function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="pd-faqs">
      {faqs.map((faq, i) => (
        <div key={i} className={`pd-faq-item${openIndex === i ? " open" : ""}`}>
          <button
            className="pd-faq-toggle"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{faq.q}</span>
            <svg
              className="pd-faq-chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className="pd-faq-body">
            <p>{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Stars ─────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="pr-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          viewBox="0 0 24 24"
          className={s <= Math.round(rating) ? "pr-star filled" : "pr-star"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="pr-rating-num">{rating}</span>
    </div>
  );
}

/* ─── Related Card ──────────────────────────────── */
function RelatedCard({ product, navigate }) {
  const hasOriginal = Boolean(product.originalPrice);
  return (
    <article
      className="pd-related-card"
      onClick={() => navigate(`/products/${product.slug}`)}
    >
      <div className="pd-related-img-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="pd-related-img"
        />
      </div>
      <div className="pd-related-body">
        <h4 className="pd-related-name">{product.name}</h4>
        <div className="pd-related-price">
          Rs {product.price.toLocaleString()}
          {hasOriginal && (
            <span className="pd-related-original">
              Rs {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <button className="pd-related-btn">View Details →</button>
      </div>
    </article>
  );
}

/* ─── Main Page ─────────────────────────────────── */
export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const related = getRelatedProducts(slug);

  const selectedVariant = product.size || product.variants[0];
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const selectedPrice =
    product.variantPrices?.[selectedVariant] ?? product.price;
  const selectedOriginal =
    product.variantOriginalPrices?.[selectedVariant] ?? product.originalPrice;
  const hasOriginal = Boolean(selectedOriginal);
  const totalPrice = selectedPrice * qty;
  const totalOriginal = hasOriginal ? selectedOriginal * qty : 0;
  const totalSavings = hasOriginal
    ? (selectedOriginal - selectedPrice) * qty
    : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQty(1);
    setAddedToCart(false);
  }, [slug]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedPrice,
      qty,
      image: product.images[0],
      variant: selectedVariant,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const waMessage = `Hi! I'd like to order *${product.name}* (${selectedVariant} × ${qty}) from Arion Organics.`;
  const waUrl = `https://wa.me/923338399480?text=${encodeURIComponent(waMessage)}`;

  const scrollSlider = (dir) => {
    const el = document.querySelector(".pd-related-slider");
    if (el) el.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <main className="pd-page">
      {/* ── Breadcrumb ──────────────────────────── */}
      <nav className="pd-breadcrumb">
        <div className="pd-container">
          <button onClick={() => navigate("/")}>Home</button>
          <span>/</span>
          <button onClick={() => navigate("/products")}>Products</button>
          <span>/</span>
          <span>{product.name}</span>
        </div>
      </nav>

      {/* ── Hero Product Section ─────────────────── */}
      <section className="pd-hero">
        <div className="pd-container">
          <div className="pd-hero-grid">
            {/* Left: Image gallery */}
            <ImageGallery images={product.images} name={product.name} />

            {/* Right: Product info */}
            <div className="pd-info">
              <span className="pd-cat-badge">
                Health & Wellness Arion Organic Food
              </span>
              {product.discount > 0 && (
                <span className="pd-discount-badge">
                  {product.discount}% OFF
                </span>
              )}

              <h1 className="pd-name">{product.name}</h1>

              {/* <div className="pd-rating-row">
                <Stars rating={product.rating} />
                <span className="pd-reviews">
                  {product.reviews} verified reviews
                </span>
              </div> */}

              <div className="pd-stock">
                <span
                  className={`pd-stock-dot ${product.stock ? "in" : "out"}`}
                />
                {product.stock ? "In Stock — Ready to Ship" : "Out of Stock"}
              </div>

              {/* Price */}
              <div className="pd-price-block">
                <span className="pd-price">
                  Rs {totalPrice.toLocaleString()}
                </span>
                {hasOriginal && (
                  <span className="pd-price-original">
                    Rs {totalOriginal.toLocaleString()}
                  </span>
                )}
                {hasOriginal && (
                  <span className="pd-save">
                    You save Rs {totalSavings.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="pd-field">
                <label className="pd-field-label">Size / Weight</label>
                <div className="pd-variant-pills">
                  <button className="pd-variant-pill active">
                    {selectedVariant}
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="pd-field">
                <label className="pd-field-label">Quantity</label>
                <div className="pd-qty">
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="pd-qty-num">{qty}</span>
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="pd-btn-group">
                <button
                  className={`pd-btn-cart${addedToCart ? " added" : ""}`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>{" "}
                      Added!
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>{" "}
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-wa-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
                </svg>
                Order on WhatsApp
              </a>

              {/* Trust tags */}
              {/* <div className="pd-trust-tags">
                <span>🌿 100% Organic</span>
                <span>🚚 Fast Delivery</span>
                <span>✅ Verified Quality</span>
                <span>↩️ Easy Returns</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── Description + Benefits ───────────────── */}
      <section className="pd-content-section">
        <div className="pd-container">
          <div className="pd-content-grid">
            {/* Description */}
            <div className="pd-desc-card">
              <h2 className="pd-card-title">Product Description</h2>
              <p className="pd-desc-text">{product.description}</p>
              {product.ingredients && (
                <div className="pd-ingredients">
                  <span className="pd-ingr-label">Ingredients:</span>
                  <span className="pd-ingr-value">{product.ingredients}</span>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="pd-benefits-card">
              <h2 className="pd-card-title">Key Benefits</h2>
              <ul className="pd-benefits-list">
                {product.benefits.map((b, i) => (
                  <li key={i}>
                    <span className="pd-benefit-dot" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Use ───────────────────────────── */}
      {/* <section className="pd-how-section">
        <div className="pd-container">
          <div className="pd-section-label">Instructions</div>
          <h2 className="pd-section-title">How to Use</h2>
          <div className="pd-steps">
            {product.howToUse.map((step, i) => (
              <div key={i} className="pd-step" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="pd-step-num">{step.step}</div>
                <div className="pd-step-content">
                  <div className="pd-step-icon">
                    {["☀️","💧","📦","❄️"][i] || "✦"}
                  </div>
                  <p className="pd-step-text">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── FAQs ─────────────────────────────────── */}
      <section className="pd-faq-section">
        <div className="pd-container">
          <div className="pd-section-label">Common Questions</div>
          <h2 className="pd-section-title">Frequently Asked Questions</h2>
          <FAQAccordion faqs={product.faqs} />
        </div>
      </section>

      {/* ── Related Products ─────────────────────── */}
      <section className="pd-related-section">
        <div className="pd-container">
          <div className="pd-related-header">
            <div>
              <div className="pd-section-label">You May Also Like</div>
              <h2 className="pd-section-title">Related Products</h2>
            </div>
            <div className="pd-slider-controls">
              <button
                className="pd-slider-btn"
                onClick={() => scrollSlider(-1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="pd-slider-btn" onClick={() => scrollSlider(1)}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="pd-related-slider">
            {related.map((p) => (
              <RelatedCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
