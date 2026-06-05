import { useEffect, useState } from "react";
import { getHeroSlides } from "../api/apiClient";
import PurityPromise from "../components/PurityPromise";
import OurStory from "../components/OurStory";
import Products from "../components/Products";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

const STATIC_HERO = {
  kicker: "Arion Organic Food",
  title: "Pure by Nature Proven by Integrity.",
  text: "Discover Natural Arion Honey, Ghee, and Shilajit.",
};

const Home = () => {
  const [hero, setHero] = useState(STATIC_HERO);

  useEffect(() => {
    getHeroSlides().then((slides) => {
      const active = Array.isArray(slides) ? slides.find((s) => s.is_active === 1 || s.is_active === true) : null;
      if (active) {
        setHero({
          kicker: "Arion Organic Food",
          title: active.title || STATIC_HERO.title,
          text: active.subtitle || STATIC_HERO.text,
          btnText: active.button_text,
          btnLink: active.button_link,
        });
      }
    });
  }, []);

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
            <p className="hero-kicker">{hero.kicker}</p>
            <h1 className="hero-title">{hero.title}</h1>
            <p className="hero-text">{hero.text}</p>
            <div className="hero-actions">
              <a href={hero.btnLink || "#products"} className="hero-btn-primary">
                {hero.btnText || "Shop Now"}
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
