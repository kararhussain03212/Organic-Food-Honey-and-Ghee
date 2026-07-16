import { useParams, useNavigate } from "react-router-dom";
import Testimonials from "../components/Testimonials";
import { SEOHelmet } from "../seo/SEOHelmet";
import { getSEOData } from "../seo/seoData";
import "../styles/CertificationReport.css";

const reportData = {
  "QR-001": {
    name: "Pure Cow Ghee 500g",
    subtitle: "PCSIR Report",
    batch: "B001-2024",
    qrCode: "QR-001",
    certImage: "/product-images/cow-ghee-500g.png",
    productImages: [
      "/product-images/cow-ghee-500g.png",
      "/product-images/ghee-cow-1kg.png",
      "/product-images/buffalo-ghee-500g.png",
    ],
    description:
      "From the same pure, untouched environments as our premium cow ghee variety, Pure Cow Ghee is certified by PCSIR to be 100% natural and free from contaminants. With its rich, traditional flavor and high nutrient profile, it's perfect for those who seek the best nature has to offer. Each batch undergoes rigorous testing, so you can enjoy its purity and authentic taste with confidence. Treat your body to the gift of nature — PCSIR-certified Cow Ghee, now available for you!",
    intro:
      "From the same pure, untouched environments as our premium ghee variety, Pure Cow Ghee is certified by PCSIR to be 100% natural and free from contaminants.",
  },
  "QR-002": {
    name: "Pure Wildflower Honey 500g",
    subtitle: "PCSIR Report",
    batch: "B002-2024",
    qrCode: "QR-002",
    certImage: "/product-images/honey-1kg.png",
    productImages: [
      "/product-images/honey-1kg.png",
      "/product-images/honey-1kg.png",
      "/product-images/honey-1kg.png",
    ],
    description:
      "From the same pure, untouched environments as our Big Bee variety, Pure Honey is certified by PCSIR to be 100% natural and free from contaminants. With its light, delicate flavor and rich nutrient profile, it's perfect for those who seek the best nature has to offer. Each batch undergoes rigorous testing, so you can enjoy its purity and authentic taste with confidence.",
    intro:
      "From the same pure, untouched environments as our Big Bee variety, Pure Honey is certified by PCSIR to be 100% natural and free from contaminants.",
  },
  "QR-003": {
    name: "Himalayan Shilajit 10g",
    subtitle: "PCSIR Report",
    batch: "B003-2024",
    qrCode: "QR-003",
    certImage: "/product-images/shilajit 5g.png",
    productImages: [
      "/product-images/shilajit 5g.png",
      "/product-images/shilajit 10g.png",
      "/product-images/shilajit 5g.png",
    ],
    description:
      "From the same pure, untouched environments as our premium collection, Himalayan Shilajit is certified by PCSIR to be 100% natural and free from contaminants. Extracted from high-altitude rock formations, it contains potent fulvic acid and 78+ essential minerals. Each batch undergoes rigorous testing so you can enjoy its purity and authentic benefits with confidence.",
    intro:
      "From the same pure, untouched environments as our premium collection, Himalayan Shilajit is certified by PCSIR to be 100% natural and free from contaminants.",
  },
  "QR-004": {
    name: "Eucalyptus Honey 500g",
    subtitle: "PCSIR Report",
    batch: "B004-2024",
    qrCode: "QR-004",
    certImage: "/product-images/honey-1kg.png",
    productImages: [
      "/product-images/honey-1kg.png",
      "/product-images/honey-1kg.png",
      "/product-images/honey-1kg.png",
    ],
    description:
      "Eucalyptus Honey is certified by PCSIR to be 100% natural and free from contaminants. Known for its distinctive mild flavor and therapeutic properties, it's perfect for those who seek the best that nature has to offer. Each batch undergoes rigorous testing, so you can enjoy its purity and authentic taste with confidence.",
    intro:
      "Eucalyptus Honey is certified by PCSIR to be 100% natural and free from contaminants.",
  },
  "QR-005": {
    name: "Acacia Honey 500g",
    subtitle: "PCSIR Report",
    batch: "B005-2024",
    qrCode: "QR-005",
    certImage: "/product-images/honey-1kg.png",
    productImages: [
      "/product-images/honey-1kg.png",
      "/product-images/honey-1kg.png",
      "/product-images/honey-1kg.png",
    ],
    description:
      "Acacia Honey is certified by PCSIR to be 100% natural and free from contaminants. Light in color and mild in flavor, it is one of the most prized varieties of honey in the world. Each batch undergoes rigorous testing, so you can enjoy its purity and authentic taste with confidence.",
    intro:
      "Acacia Honey is certified by PCSIR to be 100% natural and free from contaminants.",
  },
};

export default function CertificationReport() {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const report = reportData[qrCode];
  const seo = report ? getSEOData("certificationReport", report, qrCode) : null;

  if (!report) {
    return (
      <main className="rp-page">
        <SEOHelmet
          title="Arion Organic Foods | Premium PCSIR Certification"
          description="The PCSIR certification report could not be found."
          url={`/certification/${qrCode}`}
        />
        <section className="rp-not-found">
          <h1>Report Not Found</h1>
          <p>The PCSIR certification report for this product could not be found.</p>
          <button className="rp-btn-back" onClick={() => navigate("/certification")}>
            ← Back to Certification
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="rp-page">
      {seo && (
        <SEOHelmet
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          image={report.certImage || seo.image}
          url={seo.slug}
          type={seo.type}
        />
      )}

      {/* ── Page Title ─────────────────────────────────────── */}
      <section className="rp-page-title">
        <div className="rp-page-title-inner">
          <h1 className="rp-page-heading">
            {report.name} {report.subtitle}
          </h1>
          <p className="rp-page-intro">
            From the same pure, untouched environments as our{" "}
            <strong>premium variety, {report.name}</strong> is certified by
            PCSIR to be 100% natural and free from contaminants.
          </p>
        </div>
      </section>

      {/* ── Two Column Main ────────────────────────────────── */}
      <section className="rp-main">
        <div className="rp-container">

          {/* Left — Certificate Document */}
          <div className="rp-left">
            <div className="rp-cert-doc">
              <img
                src={report.certImage}
                alt="PCSIR Certificate"
                className="rp-cert-img"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {/* Government-style certificate mockup shown below image */}
              <div className="rp-cert-mock">
                <div className="rp-cert-mock-header">
                  <div className="rp-cert-mock-logo">🏛️</div>
                  <div className="rp-cert-mock-gov">
                    <p className="rp-gov-line1">GOVERNMENT OF PAKISTAN</p>
                    <p className="rp-gov-line2">Ministry of Science &amp; Technology</p>
                    <p className="rp-gov-line3">Pakistan Council of Scientific &amp; Industrial Research</p>
                    <p className="rp-gov-line4">Laboratories Complex, Lahore</p>
                    <p className="rp-gov-line5">FEROZPUR ROAD, LAHORE-54600 — PAKISTAN</p>
                  </div>
                  <div className="rp-cert-mock-unicef">
                    <div className="rp-unicef-badge">UNICEF<br />ISO MARK</div>
                  </div>
                </div>

                <div className="rp-cert-mock-serial">
                  Sr. No. PCSIR-LLC: <span>238767</span>
                </div>

                <h2 className="rp-cert-mock-title">TEST REPORT</h2>

                <div className="rp-cert-mock-meta">
                  <div className="rp-cert-meta-row">
                    <span>Report No:</span><span>FBRC/SF/ANAL/REP/J 734</span>
                    <span>Dated:</span><span>May 27, 2024</span>
                  </div>
                  <div className="rp-cert-meta-row">
                    <span>Name &amp; Address of Client:</span>
                    <span>M/s Arion Organics, Islamabad, Pakistan</span>
                  </div>
                  <div className="rp-cert-meta-row">
                    <span>Description of Sample:</span>
                    <span>{report.name}</span>
                    <span>No. of Samples:</span><span>One</span>
                  </div>
                  <div className="rp-cert-meta-row">
                    <span>Testing Date:</span><span>17-05-24 to 24-05-24</span>
                  </div>
                </div>

                <div className="rp-cert-results-title">RESULTS</div>
                <p className="rp-cert-results-sub">Microbiological Examination</p>

                <table className="rp-cert-table">
                  <thead>
                    <tr>
                      <th>Parameters Examined</th>
                      <th>Reported Values</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Moisture (%)</td><td>17.40</td></tr>
                    <tr><td>Ash (%)</td><td>0.10</td></tr>
                    <tr><td>HMF (mg/Kg)</td><td>0.21</td></tr>
                    <tr><td>Acidity (meq/Kg)</td><td>18.80</td></tr>
                    <tr><td>Sucrose (%)</td><td>2.98</td></tr>
                    <tr><td>Reducing sugar (%)</td><td>77.77</td></tr>
                    <tr><td>Water insoluble contents (%)</td><td>Not detected</td></tr>
                    <tr><td>Fiehe's test</td><td>Negative</td></tr>
                    <tr><td>Diastase activity (DN)</td><td>37.50</td></tr>
                    <tr><td>Antibiotic residue (Chloramphenicol)</td><td>Not detected</td></tr>
                    <tr><td>Total plate count (cfu/g)*</td><td>&lt;10</td></tr>
                    <tr><td>Total Aflatoxins (ppb)*</td><td>Not detected</td></tr>
                  </tbody>
                </table>

                <p className="rp-cert-scope">*Accredited scope</p>
                <p className="rp-cert-end">— END —</p>

                <div className="rp-cert-signatures">
                  <div className="rp-cert-sig">
                    <div className="rp-cert-sig-line"></div>
                    <p>Prepared by</p>
                    <p className="rp-cert-sig-role">TMR/ Section Incharge</p>
                  </div>
                  <div className="rp-cert-sig">
                    <div className="rp-cert-sig-line"></div>
                    <p>Counter signature</p>
                    <p className="rp-cert-sig-date">30-05-24</p>
                  </div>
                  <div className="rp-cert-sig">
                    <div className="rp-cert-sig-line"></div>
                    <p>Head of the Centre</p>
                    <p className="rp-cert-sig-role">Director General</p>
                  </div>
                </div>

                <div className="rp-cert-stamp">
                  <div className="rp-stamp-circle">✦</div>
                </div>

                <p className="rp-cert-footer-note">
                  Tel No: 042-99230754, PABX: 042-99230840-95, Fax: 042-99230788
                  Email: pecslab@gmail.com website: www.pcsir.lhr.gov.pk
                </p>
                <p className="rp-cert-page">Page 1 of 1</p>
                <p className="rp-cert-computer">****Computer Code****</p>
              </div>
            </div>
          </div>

          {/* Right — Info Card */}
          <div className="rp-right">
            <div className="rp-info-card">

              <h2 className="rp-info-title">PCSIR Certified Food Report</h2>

              <p className="rp-info-text">
                The Pakistan Council of Scientific and Industrial Research (PCSIR) ensures{" "}
                <strong>quality</strong>, <strong>safety</strong>, and{" "}
                <strong>authenticity</strong> in food and natural products. PCSIR
                certification guarantees that our {report.name.split(" ")[0].toLowerCase()} and other offerings meet the{" "}
                <strong>highest purity standards</strong>.
              </p>

              <div className="rp-badges">
                <span className="rp-badge">✓ Pure</span>
                <span className="rp-badge">✓ Authentic</span>
                <span className="rp-badge">✓ Tested</span>
              </div>

              <button className="rp-view-btn" onClick={() => window.print()}>
                View Full Report
              </button>

              {/* Product Images */}
              <div className="rp-product-gallery">
                {report.productImages.map((img, i) => (
                  <div key={i} className="rp-gallery-item">
                    <img src={img} alt={`${report.name} ${i + 1}`} className="rp-gallery-img" />
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="rp-product-desc">
                {report.description.split(report.name).map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {part}
                      <strong>{report.name}</strong>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </p>

              {/* Back Button */}
              {/* <button className="rp-back-btn" onClick={() => navigate("/certification")}>
                ← Back to Certification
              </button> */}
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      {/* <Testimonials /> */}
    </main>
  );
}
