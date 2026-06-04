import { Helmet } from "react-helmet-async";
import { SEOHelmet, SchemaScript } from "./SEOHelmet";
import { generateProductSchema, generateBreadcrumbSchema } from "./seoData";
import { generateBreadcrumbs } from "./seoUtils";

/**
 * Reusable SEO Product Detail Template
 * Usage: Wrap your product page with this component
 * Provides: Product schema, structured data, breadcrumbs, rich snippets
 */
export const SEOProductTemplate = ({
  product = {},
  siteUrl = "https://arionorganicfood.com",
  children,
}) => {
  const {
    name,
    slug,
    description,
    image,
    images = [image],
    price,
    originalPrice,
    rating,
    reviews = [],
    stock,
    category,
    keywords,
    benefits,
  } = product;

  const breadcrumbs = generateBreadcrumbs(`/products/${slug}`);
  const pageUrl = `${siteUrl}/products/${slug}`;
  const shortDescription = description?.substring(0, 160) || `Premium ${category} - ${name}`;

  return (
    <>
      <SEOHelmet
        title={`${name} | Premium Organic ${category} in Pakistan`}
        description={shortDescription}
        keywords={keywords || `${name}, organic ${category.toLowerCase()}, buy online Pakistan`}
        image={image}
        url={`/products/${slug}`}
        type="product"
      >
        {/* Product-specific Meta Tags */}
        <meta name="product:price" content={price} />
        <meta name="product:currency" content="PKR" />
        {originalPrice && <meta name="product:sale_price" content={originalPrice} />}
        <meta name="product:availability" content={stock ? "in stock" : "out of stock"} />
        <meta name="product:category" content={category} />
      </SEOHelmet>

      {/* Product Schema */}
      <SchemaScript
        schema={generateProductSchema(
          {
            name,
            description,
            images,
            price,
            originalPrice,
            stock,
            slug,
            rating: rating || (reviews.length > 0 ? calculateAverageRating(reviews) : null),
            reviews: reviews.length > 0 ? reviews : null,
          },
          siteUrl
        )}
      />

      {/* Breadcrumb Schema */}
      <SchemaScript schema={generateBreadcrumbSchema(breadcrumbs, siteUrl)} />

      {/* Product Content */}
      <div className="product-page">
        {/* Breadcrumb Navigation */}
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <span className="separator"> / </span>}
              {crumb.url === `/products/${slug}` ? (
                <span className="current">{crumb.label}</span>
              ) : (
                <a href={crumb.url}>{crumb.label}</a>
              )}
            </span>
          ))}
        </nav>

        {/* Product Content */}
        {children}
      </div>
    </>
  );
};

/**
 * SEO-optimized Product Gallery
 * Provides proper image metadata for search engines
 */
export const SEOProductGallery = ({ images = [], productName = "Product" }) => {
  return (
    <figure className="product-gallery" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
      <img
        src={images[0]}
        alt={productName}
        loading="lazy"
        decoding="async"
        itemProp="url"
        className="product-main-image"
      />
      <meta itemProp="width" content="400" />
      <meta itemProp="height" content="400" />

      {images.length > 1 && (
        <div className="product-thumbnails">
          {images.map((image, i) => (
            <img
              key={i}
              src={image}
              alt={`${productName} - View ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="thumbnail"
            />
          ))}
        </div>
      )}
    </figure>
  );
};

/**
 * Product Features/Benefits Section with Schema
 */
export const ProductFeatures = ({ features = [] }) => {
  return (
    <section className="product-features">
      <h2>Key Features & Benefits</h2>
      <ul className="features-list">
        {features.map((feature, index) => (
          <li key={index} itemProp="feature">
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Product Reviews/Ratings Section
 * Optimized for rich snippets
 */
export const ProductReviews = ({ reviews = [], rating, productName = "Product" }) => {
  const averageRating = rating || (reviews.length > 0 ? calculateAverageRating(reviews) : 0);

  return (
    <section
      className="product-reviews"
      itemScope
      itemType="https://schema.org/AggregateRating"
    >
      <h2>Customer Reviews</h2>

      {/* Aggregate Rating */}
      {averageRating > 0 && (
        <div className="aggregate-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${i < Math.floor(averageRating) ? "filled" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-value">
            <strong itemProp="ratingValue">{averageRating.toFixed(1)}</strong>
            <span itemProp="bestRating" style={{ display: "none" }}>5</span>
            <span itemProp="worstRating" style={{ display: "none" }}>1</span>
          </span>
          <span className="review-count">
            <span itemProp="reviewCount">{reviews.length}</span> reviews
          </span>
        </div>
      )}

      {/* Individual Reviews */}
      {reviews.length > 0 && (
        <div className="reviews-list">
          {reviews.slice(0, 5).map((review, index) => (
            <article
              key={index}
              className="review-item"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="review-header">
                <strong itemProp="author">{review.author || "Anonymous"}</strong>
                <span className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < review.rating ? "filled" : ""}`}>
                      ★
                    </span>
                  ))}
                </span>
              </div>
              <p itemProp="reviewBody">{review.text}</p>
              {review.date && (
                <time itemProp="datePublished" dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString()}
                </time>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

/**
 * Related Products Component
 * Improves internal linking for SEO
 */
export const RelatedProducts = ({ currentProductId, products = [], limit = 4 }) => {
  const related = products.filter((p) => p.id !== currentProductId).slice(0, limit);

  return (
    <section className="related-products" aria-label="Related Products">
      <h2>You May Also Like</h2>
      <div className="products-grid">
        {related.map((product) => (
          <article
            key={product.id}
            className="product-card"
            itemScope
            itemType="https://schema.org/Product"
          >
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                decoding="async"
              />
            )}
            <h3>
              <a href={`/products/${product.slug}`} itemProp="name">
                {product.name}
              </a>
            </h3>
            {product.description && (
              <p itemProp="description">{product.description.substring(0, 100)}...</p>
            )}
            <span className="price" itemProp="price" itemScope itemType="https://schema.org/PriceSpecification">
              Rs {product.price}
              <meta itemProp="priceCurrency" content="PKR" />
            </span>
            <a href={`/products/${product.slug}`} className="view-product">
              View Details →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

/**
 * Product FAQ Section
 * Improves SEO with FAQ schema
 */
export const ProductFAQ = ({ faqs = [] }) => {
  const { generateFAQSchema } = require("./seoData");

  return (
    <>
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <section className="product-faq" aria-label="Frequently Asked Questions">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={index} className="faq-item">
              <summary className="faq-question">{faq.question}</summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
};

// Helper function to calculate average rating
function calculateAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
}
