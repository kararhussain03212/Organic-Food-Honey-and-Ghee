import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHelmet } from "../seo/SEOHelmet";
import { getSEOData } from "../seo/seoData";
import Testimonials from "../components/Testimonials";
import "../styles/Certification.css";

const certifications = [
  {
    icon: "✅",
    title: "Rigorous Testing",
    description: "Every batch undergoes comprehensive laboratory testing to ensure quality and safety standards.",
  },
  {
    icon: "🌟",
    title: "Consumer Confidence",
    description: "PCSIR certification guarantees you're getting authentic, safe, and quality products.",
  },
  {
    icon: "🔐",
    title: "Transparency",
    description: "Full traceability from source to your door. Know exactly what you're purchasing.",
  },
  {
    icon: "💚",
    title: "Our Promise",
    description: "We stand behind every product. Your trust is our most valuable asset.",
  },
];

const products = [
  { name: "Pure Ghee 500g",     qr: "QR-001", batch: "B001-2024" },
  { name: "Pure Honey 500g",    qr: "QR-002", batch: "B002-2024" },
  { name: "Shilajit 10g",       qr: "QR-003", batch: "B003-2024" },
  { name: "Eucalyptus Honey",   qr: "QR-004", batch: "B004-2024" },
  { name: "Acacia Honey",       qr: "QR-005", batch: "B005-2024" },
];

const verificationSteps = [
  {
    number: "1",
    title: "Locate the QR Code",
    description: "Find the QR code on your jar or product label.",
  },
  {
    number: "2",
    title: "Scan the Code",
    description: "Open your phone's camera or QR code scanner app.",
  },
  {
    number: "3",
    title: "Access the Report",
    description: "Instantly view the PCSIR certification and batch-specific details.",
  },
];

const faqs = [
  {
    question: "What is PCSIR?",
    answer:
      "Pakistan Council of Scientific and Industrial Research (PCSIR) is the premier institution dedicated to ensuring quality, safety, and authenticity of food and natural products.",
  },
  {
    question: "What does PCSIR certification mean?",
    answer:
      "PCSIR certification means our products have undergone rigorous testing and meet all required quality standards for purity, safety, and authenticity.",
  },
  {
    question: "Which products can be certified by PCSIR?",
    answer:
      "All our organic products including pure ghee, honey, and herbal products are PCSIR certified to ensure consumer safety and quality assurance.",
  },
  {
    question: "Why is PCSIR certification important for consumers?",
    answer:
      "It protects you by guaranteeing that the products you purchase are authentic, safe, and meet the highest quality standards set by government authorities.",
  },
];

export default function Certification() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const navigate = useNavigate();
  const seo = getSEOData("certification");

  return (
    <main>
      <SEOHelmet
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
      />
      {/* ── Hero ── */}
      <section className="cert-hero">
        <div className="cert-hero-inner">
          <span className="cert-eyebrow">✦ Certified Organic Products</span>
          <h1 className="cert-hero-title">What is PCSIR Certification?</h1>
          <p className="cert-hero-text">
            The Pakistan Council of Scientific and Industrial Research (PCSIR) is a premier institution
            dedicated to ensuring quality, safety, and authenticity in food and natural products. PCSIR
            certification guarantees that our honey, Shilajit, and other offerings meet the highest purity standards.
          </p>
          <button className="cert-btn">SHOP CERTIFIED PRODUCTS</button>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="cert-features">
        <div className="cert-features-grid">
          {certifications.map((cert) => (
            <div key={cert.title} className="cert-feature-card">
              <span className="cert-feature-icon">{cert.icon}</span>
              <h3 className="cert-feature-title">{cert.title}</h3>
              <p className="cert-feature-desc">{cert.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Certification Matters ── */}
      <section className="cert-why">
        <div className="cert-why-inner">
          <h2 className="cert-section-title">Why Certification Matters to You</h2>
          <p className="cert-section-text">
            In a world of synthetic additives and adulterated products, PCSIR certification gives you the
            assurance that our products are natural, safe, and authentic. Our commitment to certification
            reflects our dedication to providing you with the best.
          </p>
        </div>
      </section>

      {/* ── Certified Products ── */}
      <section className="cert-products">
        <div className="cert-products-inner">
          <h2 className="cert-section-title" style={{ textAlign: "center" }}>Our Certified Products</h2>
          <div className="cert-products-grid">
            {products.map((product) => (
              <div key={product.qr} className="cert-product-card">
                <div className="cert-product-image">📦</div>
                <p className="cert-product-name">{product.name}</p>
                <p className="cert-product-qr">Batch: {product.batch}</p>
                <button className="cert-product-btn" onClick={() => navigate(`/certification/${product.qr}`)}>View Report</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verification Process ── */}
      <section className="cert-verify">
        <div className="cert-verify-inner">
          <h2 className="cert-section-title" style={{ textAlign: "center" }}>Verify Your Product in Seconds</h2>
          <p className="cert-section-text" style={{ textAlign: "center" }}>
            Every jar of Arion honey and Shilajit comes with a unique QR code. Simply scan the code with
            your smartphone to access the PCSIR test report for your specific batch.
          </p>
          <div className="cert-verify-grid">
            {verificationSteps.map((step) => (
              <div key={step.number} className="cert-verify-step">
                <div className="cert-verify-number">{step.number}</div>
                <h3 className="cert-verify-step-title">{step.title}</h3>
                <p className="cert-verify-step-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Transparency ── */}
      <section className="cert-transparency">
        <div className="cert-transparency-inner">
          <h2 className="cert-transparency-title">Why We Prioritize Transparency</h2>
          <p className="cert-transparency-text">
            At Arion Organics, we believe you deserve to know exactly what goes into the products you consume.
            By partnering with PCSIR, we ensure every product meets stringent quality standards. From sourcing
            to certification, our process is designed with your health and trust in mind.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="cert-faq">
        <div className="cert-faq-inner">
          <h2 className="cert-faq-title">PCSIR Certification FAQs</h2>
          <div className="cert-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="cert-faq-item">
                <button
                  className="cert-faq-btn"
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                >
                  <span className="cert-faq-question">{faq.question}</span>
                  <span className="cert-faq-toggle">{openFaqIndex === i ? "−" : "+"}</span>
                </button>
                {openFaqIndex === i && (
                  <div className="cert-faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
          <p className="cert-faq-footer">
            Still have questions? Email us at{" "}
            <a href="mailto:info@arionorganicfood.com" className="cert-faq-email">
              info@arionorganicfood.com
            </a>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cert-cta">
        <h2 className="cert-cta-title">Experience the Purity of PCSIR-Certified Products</h2>
        <button className="cert-btn-gold">SHOP NOW</button>
      </section>

      {/* ── Testimonials — same component as Home page ── */}
      <Testimonials />
    </main>
  );
}
