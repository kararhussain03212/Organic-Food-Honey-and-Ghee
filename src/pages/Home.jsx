import { useEffect, useState, useMemo } from "react";
import { getHeroSlides } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";
import PurityPromise from "../components/PurityPromise";
import OurStory from "../components/OurStory";
import Products from "../components/Products";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

const STATIC_HERO = {
  kicker: "Arion Organic Food",
  title: "Pure by Nature - Proven by Integrity.",
  text: "Discover Natural Arion Honey, Ghee, and Shilajit.",
  btnText: "Shop Now",
  btnLink: "#products",
  secondaryBtnText: "Our Story",
  secondaryBtnLink: "/about",
  media: "/Banner_Hero.mp4",
  isVideo: true,
};

const resolveMedia = (value, apiRoot) => {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/uploads/")) return apiRoot + value;
  if (value.startsWith("/")) return value;
  return apiRoot + "/uploads/" + value;
};

const Home = () => {
  const [hero, setHero] = useState(STATIC_HERO);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  useEffect(() => {
    getHeroSlides().then((slides) => {
      const active = Array.isArray(slides) ? slides.find((s) => s.is_active === 1 || s.is_active === true) : null;
      if (active) {
        const videoUrl = active.video_url ? resolveMedia(active.video_url, apiRoot) : null;
        const imageUrl = active.image ? resolveMedia(active.image, apiRoot) : null;
        const mediaUrl = videoUrl || imageUrl || STATIC_HERO.media;
        const isVideo = Boolean(videoUrl) || (mediaUrl && /\.(mp4|webm|ogg)$/i.test(mediaUrl));

        setHero({
          kicker: active.kicker || STATIC_HERO.kicker,
          title: active.title || STATIC_HERO.title,
          text: active.subtitle || STATIC_HERO.text,
          btnText: active.button_text || STATIC_HERO.btnText,
          btnLink: active.button_link || STATIC_HERO.btnLink,
          secondaryBtnText: active.secondary_button_text || STATIC_HERO.secondaryBtnText,
          secondaryBtnLink: active.secondary_button_link || STATIC_HERO.secondaryBtnLink,
          media: mediaUrl,
          isVideo: isVideo,
        });
      }
    });
  }, [apiRoot]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        {hero.isVideo ? (
          <video
            className="hero-video"
            src={hero.media}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            className="hero-video"
            src={hero.media}
            alt="Hero Background"
            style={{ objectFit: "cover" }}
          />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-kicker">{hero.kicker}</p>
            <h1 className="hero-title">{hero.title}</h1>
            <p className="hero-text">{hero.text}</p>
            <div className="hero-actions">
              <a href={hero.btnLink} className="hero-btn-primary">
                {hero.btnText}
              </a>
              <a href={hero.secondaryBtnLink} className="hero-btn-secondary">
                {hero.secondaryBtnText}
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
