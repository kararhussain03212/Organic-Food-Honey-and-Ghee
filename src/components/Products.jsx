import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { getProducts, getSettings, isSectionActive } from "../api/apiClient";
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


const apiRoot = (import.meta.env.VITE_API_URL || "/backend").replace(/\/$/, "");
const resolveImage = (path) => {
  if (!path) return null;
  if (path.startsWith("/uploads/")) return apiRoot + path;
  return path;
};

function ProductCard({ product }) {
  const navigate = useNavigate();
  const images = typeof product.images === "string" ? JSON.parse(product.images || "[]") : (product.images || []);
  const productImage = resolveImage(images[0]) || resolveImage("/uploads/product-images/cow-ghee-500g.png");
  const variants = typeof product.variants === "string" ? JSON.parse(product.variants || "[]") : (product.variants || []);
  const variant = variants[0] ?? product.subtitle;
  const variantPrices = typeof product.variant_prices === "string" ? JSON.parse(product.variant_prices || "{}") : (product.variantPrices || {});
  const price = variantPrices[variant] ?? product.price;

  const discountPercentage = product.discount
    ? Number(product.discount)
    : (product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : null);

  const handleShopNow = () => {
    const message = `🛍️ *ORDER REQUEST*\n\n*Product:* ${product.name}\n*Variant:* ${variant}\n*Price:* Rs ${Number(price).toLocaleString()}`;
    window.dispatchEvent(new CustomEvent("shop:requestLocation", { detail: { message } }));
  };

  const goToProduct = () => navigate(`/products/${product.slug}`);

  const badges = typeof product.badges === "string" ? JSON.parse(product.badges || "[]") : (Array.isArray(product.badges) ? product.badges : []);

  return (
    <div className="swiper-prod-card">
      <div className="prod-img-wrap" style={{ cursor: "pointer" }} onClick={goToProduct}>
        <img src={productImage} alt={product.name} className="prod-img" />
        <div className="prod-badges">
          {discountPercentage && (
            <span className="prod-badge" style={{ background: "#C7A66B", color: "#fff" }}>
              {discountPercentage}% OFF
            </span>
          )}
          {/* {badges.slice(0, 2).map((b) => (
            <span key={b} className="prod-badge" style={badgeColors[b]}>{b}</span>
          ))} */}
        </div>
        {/* {product.original_price && <div className="prod-sale-tag">SALE</div>} */}
      </div>

      <div className="prod-info">
        <div className="prod-name">{product.name}</div>
        <div className="prod-subtitle">{product.subtitle}</div>
        <div className="prod-price-row">
          <span className="prod-price">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="prod-original-price">{formatPrice(product.original_price)}</span>
          )}
        </div>
        <button className="prod-cart-btn" onClick={handleShopNow}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
          </svg>
          Shop Now
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="swiper-prod-card" style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
      <div className="prod-img-wrap" style={{ background: "rgba(255,255,255,0.07)", minHeight: 220 }} />
      <div className="prod-info">
        <div style={{ height: 16, background: "rgba(255,255,255,0.07)", borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 12, width: "60%", background: "rgba(255,255,255,0.05)", borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 20, width: "40%", background: "rgba(255,255,255,0.07)", borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });

    getSettings().then((s) => {
      if (!s) return;
      setActive(isSectionActive(s, "home_company"));
      setHeader({
        eyebrow: s.home_collection_eyebrow,
        heading: s.home_collection_heading,
        headingAccent: s.home_collection_heading_accent,
        subtext: s.home_collection_subtext,
        btnText: s.home_collection_btn_text,
        btnLink: s.home_collection_btn_link,
      });
    });
  }, []);

  if (!active || !header || !header.heading) return null;

  const displayItems = loading ? Array.from({ length: 4 }, (_, i) => i) : products;

  return (
    <section className="products-section" id="products">
      <div className="products-inner">
        <div className="products-header">
          <div className="products-eyebrow">🛒 {header.eyebrow}</div>
          <h2 className="products-heading">
            {header.heading} <span className="products-accent">{header.headingAccent}</span>
          </h2>
          <p className="products-subtext">{header.subtext}</p>
        </div>

        <Swiper
          slidesPerView={4}
          spaceBetween={24}
          freeMode={true}
          loop={!loading && products.length > 0}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
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
          {loading
            ? displayItems.map((i) => (
                <SwiperSlide key={i} className="products-swiper-slide">
                  <SkeletonCard />
                </SwiperSlide>
              ))
            : products.map((product) => (
                <SwiperSlide key={product.id} className="products-swiper-slide">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
        </Swiper>

        <div className="products-view-all" style={{ marginTop: "2.5rem" }}>
          <a href={header.btnLink} className="view-all-btn">
            {header.btnText}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
