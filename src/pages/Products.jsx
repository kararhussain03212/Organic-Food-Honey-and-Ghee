import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  products,
  productCategories,
  PRODUCTS_PER_PAGE,
} from "../data/productsData";
import "../styles/Products.css";

/* ─── Star rating ───────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="pr-stars" aria-label={`${rating} out of 5`}>
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

/* ─── Product Card ──────────────────────────────── */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const hasOriginal = Boolean(product.originalPrice);
  const priceLabel = `Rs ${product.price.toLocaleString()}`;
  const originalLabel = hasOriginal
    ? `Rs ${product.originalPrice.toLocaleString()}`
    : null;
  const cat = productCategories.find((c) => c.id === product.category);

  return (
    <article className="prc-card">
      {product.discount > 0 && (
        <span className="prc-discount-badge">{product.discount}% OFF</span>
      )}
      {product.featured && (
        <span className="prc-featured-badge">⭐ Featured</span>
      )}

      <div
        className="prc-img-wrap"
        onClick={() => navigate(`/products/${product.slug}`)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="prc-img"
          loading="lazy"
        />
        <div className="prc-img-overlay" />
        <button className="prc-quick-view">Quick View</button>
      </div>

      <div className="prc-body">
        {/* <span className="prc-cat-badge">
          {cat?.icon} {cat?.label}
        </span> */}
        <h3
          className="prc-name"
          onClick={() => navigate(`/products/${product.slug}`)}
        >
          {product.name}
        </h3>
        <p className="prc-desc">{product.shortDesc}</p>

        {/* <Stars rating={product.rating} />
        <span className="prc-reviews">({product.reviews} reviews)</span> */}

        {/* Variant pills */}
        <div className="prc-variants">
          {product.variants.map((v) => (
            <button
              key={v}
              className={`prc-variant-pill${selectedVariant === v ? " active" : ""}`}
              onClick={() => setSelectedVariant(v)}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="prc-price-row">
          <span className="prc-price">{priceLabel}</span>
          {hasOriginal && <span className="prc-original">{originalLabel}</span>}
        </div>

        <div className="prc-actions">
          <button
            className="prc-btn-detail"
            onClick={() => navigate(`/products/${product.slug}`)}
          >
            View Details
          </button>
          <button className="prc-btn-cart">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Category Cards ────────────────────────────── */
function CategoryCards({ onSelect }) {
  const cats = productCategories.filter((c) => c.id !== "all");
  return (
    <section className="prl-cats">
      <div className="prl-container">
        <div className="prl-section-label">Browse by Category</div>
        <h2 className="prl-section-title">Explore Our Collections</h2>
        <div className="prl-cats-grid">
          {cats.map((cat, i) => (
            <button
              key={cat.id}
              className="prl-cat-card"
              onClick={() => onSelect(cat.id)}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="prl-cat-icon">{cat.icon}</div>
              <div className="prl-cat-name">{cat.label}</div>
              <div className="prl-cat-count">{cat.count} items</div>
              <div className="prl-cat-arrow">→</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─────────────────────────────────── */
export default function Products() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchCat =
        activeCategory === "all" || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q));
      return matchCat && matchSearch;
    });
    if (sortBy === "price-asc")
      result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")
      result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="prl-page">
      {/* Decorative blobs */}
      <div className="prl-blob prl-blob-1" />
      <div className="prl-blob prl-blob-2" />

      {/* ── Hero ────────────────────────────────── */}
      <section className="prl-hero">
        <div className="prl-container">
          <div className="prl-hero-text">
            <div className="prl-eyebrow">✦ Arion Organics</div>
            <h1 className="prl-hero-title">
              Our <span className="prl-accent">Products</span>
            </h1>
            <p className="prl-hero-sub">
              Pure, traditional, and naturally sourced wellness essentials for
              your everyday life.
            </p>
          </div>

          {/* Search */}
          {/* <div className="prl-search-wrap">
            <div className="prl-search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search products, ingredients, benefits…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="prl-search-input"
              />
              {searchQuery && <button className="prl-search-clear" onClick={() => setSearchQuery("")}>✕</button>}
            </div>
          </div> */}

          {/* Category pills */}
          {/* <div className="prl-pills">
            {productCategories.map(cat => (
              <button
                key={cat.id}
                className={`prl-pill${activeCategory === cat.id ? " active" : ""}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                {cat.icon} {cat.label}
                <span className="prl-pill-count">{cat.count}</span>
              </button>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── Category Cards ───────────────────────── */}
      {/* {activeCategory === "all" && !searchQuery && <CategoryCards onSelect={handleCategorySelect} />} */}

      {/* ── Product Grid ─────────────────────────── */}
      <section className="prl-grid-section">
        <div className="prl-container">
          <div className="prl-grid-header">
            <div className="prl-grid-heading">
              {activeCategory === "all"
                ? "All Products"
                : productCategories.find((c) => c.id === activeCategory)?.label}
              <span className="prl-count"> ({filtered.length})</span>
            </div>
            <div className="prl-grid-controls">
              {(searchQuery || activeCategory !== "all") && (
                <button
                  className="prl-clear-btn"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                >
                  ✕ Clear filters
                </button>
              )}
              <select
                className="prl-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="prl-empty">
              <div className="prl-empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try a different search or category.</p>
              <button
                className="prl-clear-btn"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="prl-grid">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="prl-pagination">
              <button
                className="prl-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`prl-page-btn${p === currentPage ? " active" : ""}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="prl-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
