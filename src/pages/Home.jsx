import heroVideo from "../assets/hero/WEB HERO.mp4";
import PurityPromise from "../components/PurityPromise";
import OurStory from "../components/OurStory";
import Products from "../components/Products";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <video
          className="hero-video"
          src="/Banner_Hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-kicker">Arion Organic Food</p>
            <h1 className="hero-title">Pure by Nature Proven by Integrity.</h1>
            <p className="hero-text">
              Discover Natural Arion Honey, Ghee, and Shilajit.
            </p>
            <div className="hero-actions">
              <a href="#products" className="hero-btn-primary">
                Shop Now
              </a>
              <a href="about" className="hero-btn-secondary">
                Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* All premium sections */}
      <PurityPromise />
      <OurStory />
      <Products />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Home;
