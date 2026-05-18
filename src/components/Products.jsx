import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";



const products = [
  {
    id: 1,
    name: "Pure Desi Ghee",
    subtitle: "Traditional Clarified Butter",
    price: "Rs 1,200",
    originalPrice: "Rs 1,500",
    img: "/products/ghee (1).png",
    badges: ["Best Seller", "Organic"],
    rating: 5,
    reviews: 248,
  },
  {
    id: 2,
    name: "Premium Ghee",
    subtitle: "A2 Grass-Fed Quality",
    price: "Rs 1,400",
    originalPrice: "Rs 1,800",
    img: "/products/ghee (2).png",
    badges: ["Pure"],
    rating: 5,
    reviews: 182,
  },
  {
    id: 3,
    name: "Artisan Ghee",
    subtitle: "Small-Batch Crafted",
    price: "Rs 1,100",
    originalPrice: null,
    img: "/products/ghee (3).png",
    badges: ["Organic"],
    rating: 4,
    reviews: 96,
  },
  {
    id: 4,
    name: "Raw Honey 500g",
    subtitle: "Unfiltered & Unheated",
    price: "Rs 950",
    originalPrice: "Rs 1,200",
    img: "/products/honey 500 g.png",
    badges: ["Best Seller", "Pure"],
    rating: 5,
    reviews: 312,
  },
  {
    id: 5,
    name: "Forest Honey",
    subtitle: "Wild Mountain Harvest",
    price: "Rs 800",
    originalPrice: null,
    img: "/products/honey.png",
    badges: ["Organic", "Limited Stock"],
    rating: 5,
    reviews: 167,
  },
  {
    id: 6,
    name: "Shilajit 10g",
    subtitle: "Himalayan Mineral Resin",
    price: "Rs 2,500",
    originalPrice: "Rs 3,000",
    img: "/products/shilajit 10 g.png",
    badges: ["Premium Quality"],
    rating: 5,
    reviews: 89,
  },
  {
    id: 7,
    name: "Shilajit 5g",
    subtitle: "Pure Himalayan Extract",
    price: "Rs 1,400",
    originalPrice: "Rs 1,800",
    img: "/products/shilajit 5g.png",
    badges: ["Pure", "Limited Stock"],
    rating: 4,
    reviews: 54,
  },
];

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
            <span className="prod-price">{product.price}</span>
            {product.originalPrice && (
              <span className="prod-original-price">
                {product.originalPrice}
              </span>
            )}
          </div>
          <button
            className={`prod-cart-btn ${inCart ? "prod-cart-added" : ""}`}
            onClick={() => setInCart(!inCart)}
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
                <span className="qv-price">{product.price}</span>
                {product.originalPrice && (
                  <span className="qv-original">{product.originalPrice}</span>
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
                  setInCart(true);
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
