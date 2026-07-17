import { useEffect, useMemo, useRef, useState } from "react";
import { FiInstagram } from "react-icons/fi";
import {
  FaHeart,
  FaComment,
  FaFacebookSquare,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getSettings, parseJsonField, isSectionActive } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";
import "../styles/InstagramFeed.css";

const SOCIAL_ICON_MAP = {
  instagram: FiInstagram,
  facebook: FaFacebookSquare,
  tiktok: AiFillTikTok,
  youtube: IoLogoYoutube,
  whatsapp: FaWhatsapp,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  pinterest: FaPinterest,
};

const defaultData = {
  eyebrow: "Social Feed",
  heading: "Follow us on social media",
  subtext:
    "Get a behind-the-scenes look at our organic honey harvesting, pure ghee production, and healthy recipes.",
  icons: [
    { label: "Instagram", url: "https://www.instagram.com/", icon: "instagram" },
    { label: "Facebook", url: "https://www.facebook.com/", icon: "facebook" },
    { label: "TikTok", url: "https://www.tiktok.com/", icon: "tiktok" },
    { label: "YouTube", url: "https://www.youtube.com/", icon: "youtube" },
  ],
  videos: [
    { src: "/images/instagram_1.mp4", likes: "1.8k", comments: "142", link: "https://www.instagram.com/" },
    { src: "/images/instagram_2.mp4", likes: "2.4k", comments: "198", link: "https://www.instagram.com/" },
    { src: "/images/instagram_3.mp4", likes: "1.5k", comments: "87", link: "https://www.instagram.com/" },
    { src: "/images/instagram_4.mp4", likes: "3.2k", comments: "256", link: "https://www.instagram.com/" },
  ],
};

export default function InstagramFeed() {
  const videoRefs = useRef([]);
  const [data, setData] = useState(defaultData);
  const [active, setActive] = useState(true);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toMediaUrl = (val) => {
    if (!val) return "";
    if (val.startsWith("http")) return val;
    if (val.startsWith("/uploads/")) return apiRoot + val;
    return val; // local frontend asset (e.g. /images/instagram_1.mp4)
  };

  useEffect(() => {
    getSettings().then((s) => {
      setActive(isSectionActive(s, "home_social"));
      if (!s) return;

      const icons = parseJsonField(s.home_social_icons, [])
        .map((item) => ({
          label: String(item?.label || ""),
          url: String(item?.url || ""),
          icon: String(item?.icon || "").toLowerCase(),
        }))
        .filter((item) => item.url && SOCIAL_ICON_MAP[item.icon]);

      const videos = parseJsonField(s.home_social_videos, [])
        .map((item) => ({
          src: String(item?.src || ""),
          likes: String(item?.likes || ""),
          comments: String(item?.comments || ""),
          link: String(item?.link || ""),
        }))
        .filter((item) => item.src);

      setData({
        eyebrow: s.home_social_eyebrow ?? defaultData.eyebrow,
        heading: s.home_social_heading ?? defaultData.heading,
        subtext: s.home_social_subtext ?? defaultData.subtext,
        // Fall back to defaults only when the setting has never been saved.
        // An empty saved list means the admin deleted the items on purpose.
        icons: s.home_social_icons === undefined ? defaultData.icons : icons,
        videos: s.home_social_videos === undefined ? defaultData.videos : videos,
      });
    });
  }, []);

  useEffect(() => {
    // Ensure all videos play continuously
    videoRefs.current.forEach((video) => {
      if (video) {
        // Explicitly set attributes to guarantee autoplay
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        video.play().catch((err) => {
          console.warn("Autoplay was prevented by browser policy, waiting for user interaction:", err);
        });
      }
    });
  }, [data]);

  const handleCardClick = (link) => {
    if (!link) return;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  if (!active) return null;

  const renderCard = (video, index) => (
    <div
      key={`${video.src}-${index}`}
      className="instagram-card"
      onClick={() => handleCardClick(video.link)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick(video.link);
        }
      }}
      aria-label={`Social media reel ${index + 1}`}
    >
      <div className="video-wrapper">
        <video
          ref={(el) => (videoRefs.current[index] = el)}
          src={toMediaUrl(video.src)}
          className="instagram-video"
          loop
          muted
          playsInline
          autoPlay
        />
        <div className="instagram-overlay">
          <div className="overlay-content">
            <FiInstagram className="overlay-insta-icon" />
            <div className="overlay-stats">
              {video.likes && (
                <span className="stat-item" aria-label={`${video.likes} likes`}>
                  <FaHeart /> {video.likes}
                </span>
              )}
              {video.comments && (
                <span className="stat-item" aria-label={`${video.comments} comments`}>
                  <FaComment /> {video.comments}
                </span>
              )}
            </div>
            <span className="view-button">View Reel</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="instagram-section">
      <div className="instagram-container">
        <div className="instagram-header">
          {data.eyebrow && <span className="insta-eyebrow">{data.eyebrow}</span>}
          {data.heading && <h2 className="insta-title">{data.heading}</h2>}
          {data.icons.length > 0 && (
            <div className="feed-social-icons">
              {data.icons.map((item, i) => {
                const Icon = SOCIAL_ICON_MAP[item.icon];
                return (
                  <a
                    key={`${item.icon}-${i}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label || item.icon}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}
          {data.subtext && <p className="insta-subtitle">{data.subtext}</p>}
        </div>

        {data.videos.length > 4 ? (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            breakpoints={{
              480: { slidesPerView: 2 },
              992: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="instagram-swiper"
          >
            {data.videos.map((video, index) => (
              <SwiperSlide key={`${video.src}-${index}`}>
                {renderCard(video, index)}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="instagram-grid">
            {data.videos.map((video, index) => renderCard(video, index))}
          </div>
        )}
      </div>
    </section>
  );
}
