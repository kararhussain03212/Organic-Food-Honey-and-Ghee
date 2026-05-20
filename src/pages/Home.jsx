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
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-kicker">Fresh market favorites</p>
            <h1 className="hero-title">
              Organic essentials delivered to your door.
            </h1>
            <p className="hero-text">
              Discover pantry staples, grains, and snacks curated for everyday
              wellness.
            </p>
            <div className="hero-actions">
              <a href="#products" className="hero-btn-primary">Shop Now</a>
              <a href="about" className="hero-btn-secondary">Our Story</a>
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
