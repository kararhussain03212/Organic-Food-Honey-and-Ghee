import PolicyPage from "./PolicyPage";

const sections = [
  {
    heading: "Delivery Coverage",
    paragraphs: [
      "Arion Organic Food delivers across Pakistan through trusted logistics partners.",
      "Delivery performance may vary in remote or restricted locations.",
    ],
  },
  {
    heading: "Estimated Delivery Time",
    paragraphs: [
      "Major cities: typically 4 to 5 working days. Other areas: typically 7 to 10 working days.",
      "Timelines are estimates and may be affected by weather, holidays, operational load, or courier constraints.",
    ],
  },
  {
    heading: "Shipping Charges",
    paragraphs: [
      "Shipping charges are fixed and added at checkout.",
      "Free shipping promotions may apply on selected campaigns.",
    ],
  },
  {
    heading: "Order Processing",
    paragraphs: [
      "Orders are usually processed within 24 to 48 hours.",
      "Orders placed on weekends or public holidays are processed on the next working day.",
    ],
  },
  {
    heading: "Order Tracking",
    paragraphs: [
      "Tracking updates are shared through WhatsApp, SMS, or email links.",
    ],
  },
  {
    heading: "Failed Delivery Attempts",
    paragraphs: [
      "Delivery may be retried if the first attempt fails.",
      "Orders may be cancelled after repeated unsuccessful attempts or unreachable delivery conditions.",
    ],
  },
  {
    heading: "Delayed Fulfillment and Quality Checks",
    paragraphs: [
      "If an item is delayed at source, shipment may be held until complete.",
      "All items pass quality checks before dispatch to reduce post-delivery issues.",
    ],
  },
  {
    heading: "Buyer Protection",
    paragraphs: [
      "Eligible shipments are protected under Arion Organic Food buyer protection and service quality policies.",
    ],
  },
];

const OnlineOrderPolicy = () => {
  return (
    <PolicyPage
      title="Shipping Policy"
      updatedOn="May 21, 2026"
      sections={sections}
    />
  );
};

export default OnlineOrderPolicy;

