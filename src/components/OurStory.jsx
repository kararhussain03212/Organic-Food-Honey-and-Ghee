import { useEffect, useRef, useState, useMemo } from "react";
import { subscribeSettings, parseJsonField, isSectionActive } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";


export default function OurStory() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);
  const [active, setActive] = useState(true);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = (val) => {
    if (!val) return "";
    if (val.startsWith("http")) return val;
    if (val.startsWith("/uploads/")) return apiRoot + val;
    return val; // local frontend asset (e.g. /story_farm.png)
  };

  const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "avi", "mkv", "flv", "m4v"];
  const isVideoUrl = (val) => {
    const ext = String(val || "").split(/[?#]/)[0].split(".").pop()?.toLowerCase();
    return !!ext && VIDEO_EXTENSIONS.includes(ext);
  };

  useEffect(() => {
    return subscribeSettings((s) => {
      setActive(isSectionActive(s, "home_about"));
      if (s && s.home_story_heading) {
        setData({
          eyebrow: s.home_story_eyebrow,
          heading: s.home_story_heading,
          headingAccent: s.home_story_heading_accent,
          text: s.home_story_text,
          image: s.home_story_image,
          bullets: parseJsonField(s.home_story_bullets, []),
          btnText: s.home_story_btn_text,
          btnLink: s.home_story_btn_link,
        });
      }
    });
  }, []);

  useEffect(() => {
    // Re-attach once data arrives: before that the component renders null,
    // so sectionRef.current doesn't exist yet on the initial mount.
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [data]);

  if (!active || !data || !data.heading) return null;

  return (
    <section className="story2-section" id="our-story" ref={sectionRef}>
      <div className="story2-inner">

        {/* LEFT — Single image */}
        <div className={`story2-hex-wrap ${visible ? "story2-fade-left" : "story2-hidden"}`}>
          {data.image && (
            isVideoUrl(data.image) ? (
              <video
                src={toImageUrl(data.image)}
                className="story2-single-img"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img src={toImageUrl(data.image)} alt="Our Story" className="story2-single-img" />
            )
          )}
        </div>

        {/* RIGHT — Content */}
        <div className={`story2-content ${visible ? "story2-fade-right" : "story2-hidden"}`}>
          {data.eyebrow && (
            <div className="story2-eyebrow">
              <span className="story2-bee-icon">🍯</span>
              {data.eyebrow}
            </div>
          )}

          {data.heading && (
            <h2 className="story2-heading">
              {data.heading}<br />
              {data.headingAccent && <span className="story2-accent">{data.headingAccent}</span>}
            </h2>
          )}

          {data.text && <p className="story2-desc">{data.text}</p>}

          {data.bullets && data.bullets.length > 0 && (
            <ul className="story2-bullets">
              {data.bullets.map((bullet, i) => (
                <li key={i}>
                  <span className="story2-bullet-dot" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {data.btnText && data.btnLink && (
            <a href={data.btnLink} className="story2-btn">
              {data.btnText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
