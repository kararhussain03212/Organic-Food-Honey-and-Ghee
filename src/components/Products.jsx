import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { products } from "../data/productsData";
import { addToCart } from "../utils/cart";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const formatPrice = (value) => `Rs ${value.toLocaleString()}`;

const badgeColors = {
  "Best Seller": { background: "#c8a04a", color: "#fff" },
  Organic: { background: "#2e6b4f", color: "#fff" },
  Pure: { background: "#4a7c59", color: "#fff" },
  "Limited Stock": { background: "#c0392b", color: "#fff" },
  "Premium Quality": { background: "#8b4513", color: "#fff" },
};

function Stars({ rating }) {
  return (
    <div className="prod-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          viewBox="0 0 24 24"
          className={s <= rating ? "star-filled" : "star-empty"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const [inCart, setInCart] = useState(false);
  const [quickView, setQuickView] = useState(false);

  const handleAdd = () => {
    const defaultVariant = product.variants?.[0] ?? product.subtitle;
    const price = product.variantPrices?.[defaultVariant] ?? product.price;
    addToCart({
      id: product.id,
      name: product.name,
      price,
      qty: 1,
      image: product.img,
      variant: defaultVariant,
    });
    setInCart(true);
  };

  return (
    <>
      <div className="swiper-prod-card">
        {/* Image area */}
        <div className="prod-img-wrap">
          <img src={product.img} alt={product.name} className="prod-img" />

          {/* Hover overlay — Quick View */}
          <div className="prod-img-overlay">
            <button
              className="prod-quick-btn"
              onClick={() => setQuickView(true)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Quick View
            </button>
          </div>

          {/* Badges */}
          <div className="prod-badges">
            {product.badges.slice(0, 2).map((b) => (
              <span key={b} className="prod-badge" style={badgeColors[b]}>
                {b}
              </span>
            ))}
          </div>

          {product.originalPrice && <div className="prod-sale-tag">SALE</div>}
        </div>

        {/* Info */}
        <div className="prod-info">
          <div className="prod-name">{product.name}</div>
          <div className="prod-subtitle">{product.subtitle}</div>
          {/* <Stars rating={product.rating} /> */}
          {/* <div className="prod-review-count">({product.reviews} reviews)</div> */}
          <div className="prod-price-row">
            <span className="prod-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="prod-original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            className={`prod-cart-btn ${inCart ? "prod-cart-added" : ""}`}
            onClick={handleAdd}
          >
            {inCart ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
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
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickView && (
        <div className="qv-overlay" onClick={() => setQuickView(false)}>
          <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qv-close" onClick={() => setQuickView(false)}>
              ✕
            </button>
            <img src={product.img} alt={product.name} className="qv-img" />
            <div className="qv-info">
              <div className="qv-name">{product.name}</div>
              <div className="qv-sub">{product.subtitle}</div>
              <Stars rating={product.rating} />
              <div className="qv-price-row">
                <span className="qv-price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="qv-original">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="qv-desc">
                Sourced from pristine natural environments and crafted using
                time-honored traditional methods — this product represents the
                peak of organic purity.
              </p>
              <button
                className="qv-cart-btn"
                onClick={() => {
                  handleAdd();
                  setQuickView(false);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Products() {
  return (
    <section className="products-section" id="products">
      <div className="products-inner">
        {/* Header */}
        <div className="products-header">
          <div className="products-eyebrow">🛒 Our Collection</div>
          <h2 className="products-heading">
            Premium Organic <span className="products-accent">Products</span>
          </h2>
          <p className="products-subtext">
            Each product is carefully sourced, traditionally crafted, and
            rigorously tested — bringing the finest of nature directly to your
            home.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          slidesPerView={4}
          spaceBetween={24}
          freeMode={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="products-swiper"
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 16 },
            580: { slidesPerView: 2, spaceBetween: 20 },
            900: { slidesPerView: 3, spaceBetween: 22 },
            1200: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="products-swiper-slide">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View all */}
        <div className="products-view-all" style={{ marginTop: "2.5rem" }}>
          <a href="#" className="view-all-btn">
            View All Products
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
