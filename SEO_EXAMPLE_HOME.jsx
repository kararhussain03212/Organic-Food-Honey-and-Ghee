/**
 * EXAMPLE: Home Page with Full SEO Implementation
 * This shows how to integrate SEO components into your existing pages
 *
 * To apply to your actual Home.jsx, follow the same pattern
 */

import { SEOHelmet, SchemaScript } from "@/seo/SEOHelmet";
import { generateOrgSchema, getSEOData } from "@/seo/seoData";
import { optimizeImage } from "@/seo/seoUtils";

const siteUrl = "https://arionorganicfood.com";

export default function HomePageWithSEO() {
  // Get SEO data for home page
  const seoData = getSEOData("home");

  return (
    <>
      {/* 1. SET PAGE METADATA */}
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url="/"
        type="website"
      />

      {/* 2. ADD ORGANIZATION SCHEMA */}
      <SchemaScript schema={generateOrgSchema(siteUrl)} />

      {/* 3. PAGE CONTENT */}
      <main>
        {/* Hero Section with proper heading */}
        <section className="hero" aria-label="Hero Section">
          {/* ONE H1 PER PAGE */}
          <h1>Premium Organic Food Store in Pakistan</h1>
          <p className="subtitle">
            Discover PCSIR-certified natural products directly from source to your door
          </p>

          {/* Optimized images with alt text */}
          <img
            {...optimizeImage(
              "/hero-image.png",
              "Fresh organic foods including honey, ghee, and natural products",
              "Arion Organic Food Products"
            )}
          />
        </section>

        {/* About Section */}
        <section className="about" aria-label="About Us">
          <h2>Why Choose Arion Organic Food?</h2>
          <p>
            We bring pure, certified organic products directly from trusted sources to your home.
          </p>

          {/* Use H3 for subsections, not H2 */}
          <article className="about-point">
            <h3>100% Natural & Pure</h3>
            <p>No additives, no preservatives, no chemicals. Just pure organic goodness.</p>
            <img
              {...optimizeImage(
                "/pure-icon.png",
                "Pure organic certification badge",
                "Certified Pure"
              )}
            />
          </article>

          <article className="about-point">
            <h3>PCSIR Certified</h3>
            <p>All products undergo rigorous testing by Pakistan Council of Scientific and Industrial Research.</p>
            <img
              {...optimizeImage(
                "/pcsir-badge.png",
                "PCSIR certification logo",
                "PCSIR Certified"
              )}
            />
          </article>

          <article className="about-point">
            <h3>Direct From Source</h3>
            <p>We work directly with farmers and producers for maximum freshness.</p>
            <img
              {...optimizeImage(
                "/source-icon.png",
                "Direct sourcing from farms",
                "Sourced Directly"
              )}
            />
          </article>
        </section>

        {/* Featured Products Section */}
        <section className="featured-products" aria-label="Featured Products">
          <h2>Featured Organic Products</h2>

          {/* Internal linking for SEO */}
          <div className="products-preview">
            <article className="product-preview">
              <img
                {...optimizeImage(
                  "/product-honey.png",
                  "Premium organic wildflower honey in a glass jar",
                  "Organic Honey"
                )}
              />
              <h3>
                <a href="/products/organic-honey">
                  Organic Wildflower Honey
                </a>
              </h3>
              <p>Raw, unfiltered, and naturally delicious organic honey.</p>
              <a href="/products/organic-honey" className="view-product">
                View Details →
              </a>
            </article>

            <article className="product-preview">
              <img
                {...optimizeImage(
                  "/product-ghee.png",
                  "Pure organic cow ghee in a traditional pot",
                  "Organic Ghee"
                )}
              />
              <h3>
                <a href="/products/cow-ghee-500g">
                  Pure Cow Ghee
                </a>
              </h3>
              <p>Traditional ghee made from grass-fed cow milk.</p>
              <a href="/products/cow-ghee-500g" className="view-product">
                View Details →
              </a>
            </article>

            <article className="product-preview">
              <img
                {...optimizeImage(
                  "/product-shilajit.png",
                  "Himalayan shilajit supplement in a container",
                  "Organic Shilajit"
                )}
              />
              <h3>
                <a href="/products/himalayan-shilajit-10g">
                  Himalayan Shilajit
                </a>
              </h3>
              <p>Premium fulvic acid-rich shilajit from Himalayan peaks.</p>
              <a href="/products/himalayan-shilajit-10g" className="view-product">
                View Details →
              </a>
            </article>
          </div>

          {/* Internal link to full products page */}
          <div className="see-all">
            <a href="/products" className="btn-primary">
              View All Products →
            </a>
          </div>
        </section>

        {/* Blog Section with internal links */}
        <section className="featured-blog" aria-label="Latest Blog Articles">
          <h2>Learn About Organic Living</h2>

          <article className="blog-preview">
            <img
              {...optimizeImage(
                "/blog-honey-benefits.png",
                "Spoon of organic honey with flowers",
                "Honey Benefits"
              )}
            />
            <h3>
              <a href="/blog/benefits-of-organic-honey">
                Amazing Health Benefits of Organic Honey
              </a>
            </h3>
            <p>Discover why organic honey is nature's perfect sweetener and health booster.</p>
            <a href="/blog/benefits-of-organic-honey" className="read-more">
              Read Article →
            </a>
          </article>

          <article className="blog-preview">
            <img
              {...optimizeImage(
                "/blog-ghee-cooking.png",
                "Pan with golden ghee for cooking",
                "Ghee Cooking"
              )}
            />
            <h3>
              <a href="/blog/ghee-cooking-guide">
                Complete Guide: Cooking with Organic Ghee
              </a>
            </h3>
            <p>Learn the best ways to use ghee in your daily cooking for optimal health.</p>
            <a href="/blog/ghee-cooking-guide" className="read-more">
              Read Article →
            </a>
          </article>

          <a href="/blog" className="view-all-blog">
            Read More Articles →
          </a>
        </section>

        {/* Certification Section */}
        <section className="certification-info" aria-label="Certification Information">
          <h2>PCSIR Certified Quality</h2>
          <p>
            All our products are tested and certified by the Pakistan Council of Scientific and
            Industrial Research (PCSIR) to ensure purity, safety, and authenticity.
          </p>
          <img
            {...optimizeImage(
              "/pcsir-certificate.png",
              "PCSIR official certification document",
              "PCSIR Certificate"
            )}
          />
          <a href="/certification" className="btn-secondary">
            View Certifications →
          </a>
        </section>

        {/* FAQ Section for SEO */}
        <section className="home-faq" aria-label="Frequently Asked Questions">
          <h2>Common Questions</h2>

          <details className="faq-item">
            <summary className="faq-question">
              Are all products 100% organic?
            </summary>
            <p className="faq-answer">
              Yes! All products are PCSIR certified organic with no additives or preservatives.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">
              How are products delivered?
            </summary>
            <p className="faq-answer">
              We deliver across Pakistan with secure packaging. Check our shipping policy for details.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">
              Can I track my order?
            </summary>
            <p className="faq-answer">
              Yes! You'll receive tracking details once your order ships.
            </p>
          </details>
        </section>

        {/* CTA Section */}
        <section className="cta-section" aria-label="Call to Action">
          <h2>Start Your Organic Journey Today</h2>
          <p>Experience the purity and quality of authentic organic products.</p>
          <a href="/products" className="btn-primary-large">
            Shop Now
          </a>
        </section>
      </main>

      {/* Footer will include internal links */}
    </>
  );
}

/**
 * KEY SEO IMPLEMENTATION CHECKLIST FOR THIS PAGE:
 *
 * ✅ METADATA
 * - One unique page title (30-60 chars)
 * - Unique meta description (50-160 chars)
 * - Canonical URL automatically set
 * - Open Graph tags for social sharing
 *
 * ✅ HEADINGS
 * - ONE H1 tag (main topic)
 * - H2 tags for sections
 * - H3 tags for subsections
 * - Natural keyword integration
 *
 * ✅ IMAGES
 * - Descriptive alt text for all images
 * - loading="lazy" for performance
 * - Meaningful filenames
 * - Optimized file sizes
 *
 * ✅ INTERNAL LINKING
 * - Links to related products
 * - Links to blog articles
 * - Links to category pages
 * - Links to policy pages in footer
 *
 * ✅ STRUCTURED DATA
 * - Organization schema on homepage
 * - Schema already in structured format
 *
 * ✅ ACCESSIBILITY
 * - ARIA labels on sections
 * - Semantic HTML (article, section, nav)
 * - Proper heading hierarchy
 * - Alt text on all images
 *
 * ✅ PERFORMANCE
 * - Lazy loading images
 * - Code splitting ready
 * - Optimized assets
 *
 * ✅ MOBILE
 * - Responsive images
 * - Mobile-first viewport
 * - Touch-friendly links
 */
