import PolicyPage from "./PolicyPage";

const sections = [
  {
    heading: "Acceptance of Terms",
    paragraphs: [
      "By using our website and placing orders, you agree to these terms and all applicable laws.",
      "If you do not agree with any part of these terms, please do not use our services.",
    ],
  },
  {
    heading: "Product Information",
    paragraphs: [
      "We do our best to ensure descriptions, pricing, and availability are accurate.",
      "Minor differences in packaging or color may occur due to updates and display settings.",
    ],
  },
  {
    heading: "Orders and Payments",
    paragraphs: [
      "All orders are subject to confirmation and availability.",
      "We reserve the right to cancel or refuse orders in cases of pricing errors, stock issues, or suspicious activity.",
    ],
  },
];

const TermsAndConditions = () => {
  return (
    <PolicyPage
      title="Terms & Conditions"
      updatedOn="May 21, 2026"
      sections={sections}
    />
  );
};

export default TermsAndConditions;

