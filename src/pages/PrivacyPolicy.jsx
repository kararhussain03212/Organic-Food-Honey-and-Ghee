import PolicyPage from "./PolicyPage";

const sections = [
  {
    heading: "Information We Collect",
    paragraphs: [
      "We may collect personal details such as your name, phone number, email, delivery address, and payment-related transaction references.",
    ],
  },
  {
    heading: "How We Use Your Information",
    paragraphs: [
      "Your information is used for order fulfillment, customer support, fraud prevention, delivery coordination, and service improvements.",
      "We may also use your data for personalized recommendations and relevant promotional communication.",
    ],
  },
  {
    heading: "Payments and Security",
    paragraphs: [
      "Arion Organic Food only deals in advance payment or Cash on Delivery.",
    ],
  },
  {
    heading: "Data Sharing",
    paragraphs: [
      "We share limited necessary data only with logistics partners.",
    ],
  },
  {
    heading: "Policy Updates",
    paragraphs: [
      "We may update this Privacy Policy from time to time.",
      "Updated versions will be published on this page with revised effective information.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "For privacy questions or data requests, contact us at info@swiftsigngeneraltrading.com.",
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <PolicyPage
      title="Privacy Policy"
      updatedOn="May 21, 2026"
      sections={sections}
    />
  );
};

export default PrivacyPolicy;

