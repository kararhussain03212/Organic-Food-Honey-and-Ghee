// Sitemap Generator for SEO
// Note: To use this with dynamic data, pass products and blogs as parameters
import { seoData } from "./seoData";

const siteUrl = seoData.default.siteUrl;

// Generate XML sitemap entries
const generateSitemapEntry = (url, lastModified = new Date().toISOString(), priority = 0.8, changefreq = "weekly") => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified.split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

// Build complete sitemap XML
export const generateSitemap = (products = [], blogPosts = []) => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">`;

  // Static Pages
  const staticPages = [
    { url: `${siteUrl}/`, priority: 1.0, changefreq: "daily" },
    { url: `${siteUrl}/products`, priority: 0.9, changefreq: "daily" },
    { url: `${siteUrl}/about`, priority: 0.7, changefreq: "monthly" },
    { url: `${siteUrl}/blog`, priority: 0.8, changefreq: "daily" },
    { url: `${siteUrl}/contact`, priority: 0.5, changefreq: "monthly" },
    { url: `${siteUrl}/certification`, priority: 0.8, changefreq: "weekly" },
    { url: `${siteUrl}/terms-and-conditions`, priority: 0.3, changefreq: "yearly" },
    { url: `${siteUrl}/privacy-policy`, priority: 0.3, changefreq: "yearly" },
    { url: `${siteUrl}/return-policy`, priority: 0.3, changefreq: "yearly" },
    { url: `${siteUrl}/online-order-policy`, priority: 0.3, changefreq: "yearly" },
  ];

  staticPages.forEach(({ url, priority, changefreq }) => {
    sitemap += generateSitemapEntry(url, new Date().toISOString(), priority, changefreq);
  });

  // Product Pages
  products?.forEach((product) => {
    const productUrl = `${siteUrl}/products/${product.slug}`;
    const imageEntry = product.images?.[0]
      ? `
    <image:image>
      <image:loc>${siteUrl}${product.images[0]}</image:loc>
      <image:title>${product.name}</image:title>
    </image:image>`
      : "";

    sitemap += `
  <url>
    <loc>${productUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imageEntry}
  </url>`;
  });

  // Blog Pages
  blogPosts?.forEach((post) => {
    const blogUrl = `${siteUrl}/blog/${post.slug}`;
    const imageEntry = post.image
      ? `
    <image:image>
      <image:loc>${siteUrl}${post.image}</image:loc>
      <image:title>${post.title}</image:title>
    </image:image>`
      : "";

    sitemap += `
  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${post.date || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imageEntry}
  </url>`;
  });

  // Certification Reports
  const qrCodes = ["QR-001", "QR-002", "QR-003", "QR-004", "QR-005"];
  qrCodes.forEach((qr) => {
    sitemap += generateSitemapEntry(
      `${siteUrl}/certification/${qr}`,
      new Date().toISOString(),
      0.8,
      "weekly"
    );
  });

  sitemap += `\n</urlset>`;
  return sitemap;
};

// Function to write sitemap to public folder
export const writeSitemapFile = async () => {
  if (typeof window === "undefined") {
    // Server-side only
    const sitemap = generateSitemap();
    // This would be handled by your build process or a backend endpoint
    return sitemap;
  }
};

// Sitemap index for large sites (future use)
export const generateSitemapIndex = (sitemapUrls) => {
  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  sitemapUrls.forEach((url) => {
    sitemapIndex += `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
  });

  sitemapIndex += `\n</sitemapindex>`;
  return sitemapIndex;
};
