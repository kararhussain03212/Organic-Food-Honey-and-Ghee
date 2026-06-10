import { useEffect, useState, useMemo } from "react";
import { getHeroSlides } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";
import PurityPromise from "../components/PurityPromise";
import OurStory from "../components/OurStory";
import Products from "../components/Products";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

const resolveMedia = (value, apiRoot) => {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/uploads/")) return apiRoot + value;
  if (value.startsWith("/")) return value;
  return apiRoot + "/uploads/" + value;
};

const Home = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  useEffect(() => {
    getHeroSlides().then((slides) => {
      const active = Array.isArray(slides) ? slides.find((s) => s.is_active === 1 || s.is_active === true) : null;
      if (active) {
        const videoUrl = active.video_url ? resolveMedia(active.video_url, apiRoot) : null;
        const imageUrl = active.image ? resolveMedia(active.image, apiRoot) : null;
        const mediaUrl = videoUrl || imageUrl;
        const isVideo = Boolean(videoUrl) || (mediaUrl && /\.(mp4|webm|ogg)$/i.test(mediaUrl));

        setHero({
          kicker: active.kicker,
          title: active.title,
          text: active.subtitle,
          btnText: active.button_text,
          btnLink: active.button_link,
          secondaryBtnText: active.secondary_button_text,
          secondaryBtnLink: active.secondary_button_link,
          media: mediaUrl,
          isVideo: isVideo,
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [apiRoot]);

  if (loading) {
    return <main style={{ padding: "2rem", textAlign: "center" }}>Loading...</main>;
  }

  return (
    <>
      {/* Hero Section - Only show if data is available */}
      {hero && (
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
          ) : hero.media ? (
            <img
              className="hero-video"
              src={hero.media}
              alt="Hero Background"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="hero-video" style={{ background: "#f0f0f0" }} />
          )}
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-copy">
              {hero.kicker && <p className="hero-kicker">{hero.kicker}</p>}
              {hero.title && <h1 className="hero-title">{hero.title}</h1>}
              {hero.text && <p className="hero-text">{hero.text}</p>}
              {(hero.btnText || hero.secondaryBtnText) && (
                <div className="hero-actions">
                  {hero.btnText && hero.btnLink && (
                    <a href={hero.btnLink} className="hero-btn-primary">
                      {hero.btnText}
                    </a>
                  )}
                  {hero.secondaryBtnText && hero.secondaryBtnLink && (
                    <a href={hero.secondaryBtnLink} className="hero-btn-secondary">
                      {hero.secondaryBtnText}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
