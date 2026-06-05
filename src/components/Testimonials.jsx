import { useEffect, useRef, useState } from "react";
import { getTestimonials } from "../api/apiClient";

const STATIC_FALLBACK = [
  {
    id: 1,
    name: "Ayesha Malik",
    role: "Mother of 3, Lahore",
    avatar: "/avatar1.png",
    rating: 5,
    quote: "Since switching to Arion's ghee and honey, I've noticed a real difference in my family's health. The quality is unmistakable — you can literally taste the purity.",
    product: "Pure Desi Ghee",
    verified: true,
  },
  {
    id: 2,
    name: "Bilal Chaudhry",
    role: "Nutritionist, Islamabad",
    avatar: "/avatar2.png",
    rating: 5,
    quote: "As a nutritionist, I'm very particular about what I recommend. Arion's products are genuinely chemical-free and traditionally sourced. I recommend them to all my clients.",
    product: "Raw Honey 500g",
    verified: true,
  },
  {
    id: 3,
    name: "Sadia Hussain",
    role: "Wellness Coach, Karachi",
    avatar: "/avatar3.png",
    rating: 5,
    quote: "The Shilajit quality is exceptional. I've tried several brands but nothing compares to the purity and potency of Arion's product.",
    product: "Himalayan Shilajit",
    verified: true,
  },
];

function StarRating({ rating }) {
  return (
    <div className="testimonial-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "star filled" : "star"}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, active }) {
  return (
    <div className={`testimonial-card${active ? " active" : ""}`}>
      <div className="testimonial-quote-icon">"</div>
      <p className="testimonial-quote">{testimonial.quote}</p>
      <StarRating rating={Number(testimonial.rating)} />
      <div className="testimonial-author">
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="testimonial-avatar"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
        <div className="testimonial-author-info">
          <span className="testimonial-name">
            {testimonial.name}
            {(testimonial.verified === 1 || testimonial.verified === true) && (
              <span className="testimonial-verified" title="Verified Purchase"> ✓</span>
            )}
          </span>
          <span className="testimonial-role">{testimonial.role}</span>
          {testimonial.product && (
            <span className="testimonial-product">on {testimonial.product}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    getTestimonials().then((data) => {
      setTestimonials(data.length > 0 ? data : STATIC_FALLBACK);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials-section" ref={sectionRef}>
      <div className="testimonials-inner">
        <div className={`testimonials-header${visible ? " fade-in" : ""}`}>
          <div className="testimonials-eyebrow">💬 What Our Customers Say</div>
          <h2 className="testimonials-heading">
            Trusted by <span className="testimonials-accent">Thousands</span>
          </h2>
        </div>

        <div className={`testimonials-carousel${visible ? " fade-in" : ""}`}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id ?? i} testimonial={t} active={i === current} />
          ))}
        </div>

        {testimonials.length > 1 && (
          <div className="testimonials-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot${i === current ? " active" : ""}`}
                onClick={() => { setCurrent(i); clearInterval(timerRef.current); }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
