import { Helmet } from "react-helmet-async";
import { seoData } from "./seoData";

export const SEOHelmet = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  children,
}) => {
  const siteUrl = seoData.default.siteUrl;
  const finalUrl = url ? `${siteUrl}${url}` : siteUrl;
  const finalImage = image || seoData.default.image;

  return (
    <Helmet>
      {/* Primary Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={seoData.default.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      {seoData.default.twitterHandle && (
        <meta name="twitter:creator" content={seoData.default.twitterHandle} />
      )}

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content={seoData.default.siteName} />

      {/* Mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data */}
      {children}
    </Helmet>
  );
};

// Helper component for JSON-LD schema
export const SchemaScript = ({ schema }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  </Helmet>
);
