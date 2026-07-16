import { SEOHelmet } from "../seo/SEOHelmet";
import { getSEOData } from "../seo/seoData";
import PolicyPage from "./PolicyPage";

const sections = [
  {
    heading: "Live Policy Synced",
    paragraphs: [
      "Live policy synced from Arion Organic Food app configuration.",
    ],
  },
  {
    heading: "Return Policy",
    paragraphs: [
      "Ab 14 Din Mein Return Karen!",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "Email: info@arionorganicfood.com",
      "WhatsApp: +92 333 8399480",
      "Hours: Mon-Sun: 10am - 7pm",
    ],
  },
];

const ReturnPolicy = () => {
  const seo = getSEOData("policies").returnPolicy;
  return (
    <>
      <SEOHelmet
        title={seo.title}
        description={seo.description}
      />
      <PolicyPage
        title="Return Policy"
        updatedOn="May 21, 2026"
        sections={sections}
      />
    </>
  );
};

export default ReturnPolicy;

