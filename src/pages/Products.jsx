import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/apiClient";
import { addToCart } from "../utils/cart";
import "../styles/Products.css";

const PRODUCTS_PER_PAGE = 9;

/* ─── Product Card ──────────────────────────────── */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const currentPrice = Number(product.price);
  const currentOriginal = product.original_price ? Number(product.original_price) : null;
  const hasOriginal = Boolean(currentOriginal);
  const priceLabel = `Rs ${currentPrice.toLocaleString()}`;
  const originalLabel = hasOriginal ? `Rs ${currentOriginal.toLocaleString()}` : null;
  const variant = product.size;
  const images = typeof product.images === "string"
    ? (() => { try { return JSON.parse(product.images); } catch { return []; } })()
    : (Array.isArray(product.images) ? product.images : []);

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: currentPrice, qty: 1, image: images[0], variant });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="prc-card">
      {product.discount > 0 && (
        <span className="prc-discount-badge">{product.discount}% OFF</span>
      )}
      {product.featured === 1 || product.featured === true ? (
        <span className="prc-featured-badge">⭐ Featured</span>
      ) : null}

      <div
        className="prc-img-wrap"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/products/${product.slug}`)}
      >
        <img src={images[0] || "/product-images/cow-ghee-500g.png"} alt={product.name} className="prc-img" loading="lazy" />
        <div className="prc-img-overlay" />
      </div>

      <div className="prc-body">
        <h3 className="prc-name" onClick={() => navigate(`/products/${product.slug}`)}>
          {product.name}
        </h3>
        <p className="prc-desc">{product.short_desc || product.shortDesc}</p>

        <div className="prc-price-row">
          <span className="prc-price">{priceLabel}</span>
          {hasOriginal && <span className="prc-original">{originalLabel}</span>}
        </div>

        <div className="prc-actions">
          <button className="prc-btn-detail" onClick={() => navigate(`/products/${product.slug}`)}>
            View Details
          </button>
          <button className="prc-btn-cart" onClick={handleAddToCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {added ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <article className="prc-card" style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
      <div className="prc-img-wrap" style={{ background: "rgba(255,255,255,0.07)", minHeight: 200 }} />
      <div className="prc-body">
        <div style={{ height: 16, background: "rgba(255,255,255,0.07)", borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 12, width: "70%", background: "rgba(255,255,255,0.05)", borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 20, width: "40%", background: "rgba(255,255,255,0.07)", borderRadius: 6 }} />
      </div>
    </article>
  );
}

/* ─── Main Page ─────────────────────────────────── */
export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setAllProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const cats = [{ id: "all", label: "All Products" }];
    const seen = new Set();
    allProducts.forEach((p) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        const label = p.category.charAt(0).toUpperCase() + p.category.slice(1);
        cats.push({ id: p.category, label });
      }
    });
    return cats;
  }, [allProducts]);

  const filtered = useMemo(() => {
    let result = allProducts.filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const matchSearch =
        !q ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.short_desc || p.shortDesc || "").toLowerCase().includes(q) ||
        tags.some((t) => String(t).toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
    if (sortBy === "price-asc") result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-desc") result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "rating") result = [...result].sort((a, b) => Number(b.rating) - Number(a.rating));
    return result;
  }, [allProducts, activeCategory, searchQuery, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const clearFilters = () => {
    setActiveCategory("all");
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <main className="prl-page">
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
          {searchQuery && (
            <div className="prl-search-result-banner">
              Showing results for: <strong>"{searchQuery}"</strong>
              <button className="prl-search-clear-link" onClick={clearFilters}>
                ✕ Clear
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Product Grid ─────────────────────────── */}
      <section className="prl-grid-section">
        <div className="prl-container">
          <div className="prl-grid-header">
            <div className="prl-grid-heading">
              {searchQuery
                ? `Search: "${searchQuery}"`
                : activeCategory === "all"
                ? "All Products"
                : categories.find((c) => c.id === activeCategory)?.label}
              {!loading && <span className="prl-count"> ({filtered.length})</span>}
            </div>
            <div className="prl-grid-controls">
              {(searchQuery || activeCategory !== "all") && (
                <button className="prl-clear-btn" onClick={clearFilters}>
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

          {loading ? (
            <div className="prl-grid">
              {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="prl-empty">
              <div className="prl-empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try a different search or category.</p>
              <button className="prl-clear-btn" onClick={clearFilters}>
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

          {!loading && totalPages > 1 && (
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
