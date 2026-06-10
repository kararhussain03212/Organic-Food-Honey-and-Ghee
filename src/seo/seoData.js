// SEO Configuration for all pages
// Centralized metadata management for easy backend integration

export const seoData = {
  default: {
    siteName: "Arion Organic Food",
    siteUrl: "https://organicfood.swiftsigngeneraltrading.com",
    description: "Buy premium organic foods, honey, ghee, and wellness products in Pakistan. Certified, pure, and natural.",
    keywords: "organic food, organic honey, organic ghee, natural products, Pakistan",
    image: "https://organicfood.swiftsigngeneraltrading.com/og-image.png",
    twitterHandle: "@arionorganic",
  },

  // Home Page
  home: {
    title: "Organic Food Store in Pakistan | Pure & Natural Products",
    description: "Discover premium organic foods, honey, ghee, and wellness products. Certified quality, guaranteed purity. Shop authentic organic products in Pakistan.",
    keywords: "organic food, organic products Pakistan, natural honey, organic ghee, wellness products",
    slug: "/",
    type: "website",
  },

  // About Page
  about: {
    title: "About Arion Organic Food | Certified Organic Products",
    description: "Learn about our journey providing pure, certified organic foods to Pakistan. Committed to quality, sustainability, and natural wellness.",
    keywords: "organic food company, certified organic, food safety Pakistan, natural products",
    slug: "/about",
    type: "website",
  },

  // Products Page
  products: {
    title: "Organic Products | Premium Honey, Ghee & Wellness Items",
    description: "Browse our collection of PCSIR-certified organic honey, ghee, and natural wellness products. All products are 100% pure and natural.",
    keywords: "organic products, organic honey price, organic ghee, natural wellness, buy organic online Pakistan",
    slug: "/products",
    type: "collection",
  },

  // Product Detail Pages - Template
  productDetail: (productName, category) => ({
    title: `${productName} | Premium Organic ${category} in Pakistan`,
    description: `Buy pure, PCSIR-certified ${productName}. 100% natural, no additives. Premium quality organic ${category} delivered in Pakistan.`,
    keywords: `${productName}, organic ${category}, buy ${productName.toLowerCase()} online, ${category} price Pakistan`,
    type: "product",
  }),

  // Blog Page
  blog: {
    title: "Organic Food Blog | Health Tips & Product Guides",
    description: "Read expert articles about organic food benefits, health tips, and natural wellness. Learn about organic products and healthy living.",
    keywords: "organic food blog, health tips, natural wellness, organic nutrition, food guide",
    slug: "/blog",
    type: "website",
  },

  // Blog Detail Pages - Template
  blogDetail: (articleTitle, slug) => ({
    title: `${articleTitle} | Organic Food Blog`,
    description: `${articleTitle}. Expert tips and insights on organic food, health, and natural wellness.`,
    keywords: `${articleTitle.toLowerCase()}, organic health, natural wellness, food benefits`,
    slug: `/blog/${slug}`,
    type: "article",
  }),

  // Certification Page
  certification: {
    title: "PCSIR Certification | Guaranteed Organic Food Quality",
    description: "Learn about PCSIR certification for our organic products. Guaranteed purity, safety, and authenticity. Verify your products online.",
    keywords: "PCSIR certification, organic certification Pakistan, food quality, product verification",
    slug: "/certification",
    type: "website",
  },

  // Contact Page
  contact: {
    title: "Contact Us | Arion Organic Food",
    description: "Get in touch with Arion Organic Food. Customer support, inquiries, and feedback. Contact us via email, phone, or WhatsApp.",
    keywords: "contact us, customer support, organic food Pakistan, inquiries",
    slug: "/contact",
    type: "website",
  },

  // Policy Pages
  policies: {
    termsAndConditions: {
      title: "Terms & Conditions | Arion Organic Food",
      description: "Read our terms and conditions for shopping at Arion Organic Food.",
      slug: "/terms-and-conditions",
    },
    privacyPolicy: {
      title: "Privacy Policy | Arion Organic Food",
      description: "Our privacy policy outlines how we protect your personal information.",
      slug: "/privacy-policy",
    },
    returnPolicy: {
      title: "Return Policy | Arion Organic Food",
      description: "Easy returns and refunds policy for your peace of mind.",
      slug: "/return-policy",
    },
    shippingPolicy: {
      title: "Shipping Policy | Arion Organic Food",
      description: "Fast and reliable shipping policy for online orders in Pakistan.",
      slug: "/online-order-policy",
    },
  },
};

// Function to get SEO data for any page
export const getSEOData = (page, ...params) => {
  const data = seoData[page];
  if (typeof data === "function") {
    return { ...seoData.default, ...data(...params) };
  }
  return { ...seoData.default, ...data };
};

// JSON-LD Schema Generator
export const generateOrgSchema = (siteUrl) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arion Organic Food",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: "Premium organic food store in Pakistan offering certified natural products.",
  sameAs: [
    "https://www.facebook.com/arionorganic",
    "https://www.instagram.com/arionorganic",
    "https://www.linkedin.com/company/arion-organic",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    telephone: "+92-333-8399480",
    email: "info@swiftsigngeneraltrading.com",
    areaServed: "PK",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office 22, 4th Floor, Pakland City Center",
    addressLocality: "Islamabad",
    addressRegion: "Punjab",
    postalCode: "44000",
    addressCountry: "PK",
  },
});

export const generateProductSchema = (product, siteUrl) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: `${siteUrl}${product.images?.[0] || "/product-placeholder.png"}`,
  brand: {
    "@type": "Brand",
    name: "Arion Organic Food",
  },
  offers: {
    "@type": "Offer",
    url: `${siteUrl}/products/${product.slug}`,
    priceCurrency: "PKR",
    price: product.price,
    availability: product.stock ? "InStock" : "OutOfStock",
  },
  aggregateRating:
    product.rating || product.reviews?.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating || "4.8",
          reviewCount: product.reviews?.length || "1200",
        }
      : undefined,
  reviewedBy: {
    "@type": "Organization",
    name: "Pakistan Council of Scientific and Industrial Research",
  },
});

export const generateBlogSchema = (article, siteUrl) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: article.title,
  description: article.excerpt,
  image: `${siteUrl}${article.image}`,
  datePublished: article.date,
  dateModified: article.lastModified || article.date,
  author: {
    "@type": "Person",
    name: article.author || "Arion Organic Food",
  },
  publisher: {
    "@type": "Organization",
    name: "Arion Organic Food",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteUrl}/blog/${article.slug}`,
  },
});

export const generateBreadcrumbSchema = (breadcrumbs, siteUrl) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: `${siteUrl}${item.url}`,
  })),
});

export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
