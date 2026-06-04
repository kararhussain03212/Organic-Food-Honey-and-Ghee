const Marquee = () => {
  const message =
    "100% Organic & Natural Arion Products\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Nationwide Delivery\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Call WhatsApp: +92 333 8399480";

  return (
    <div className="top-strip" aria-label="Announcement">
      <div className="top-inner marquee-inner">
        <div className="marquee" role="status" aria-live="polite">
          <div className="marquee-track">
            <span className="marquee-item">{message}</span>
            <span className="marquee-item" aria-hidden="true">{message}</span>
            <span className="marquee-item" aria-hidden="true">{message}</span>
            <span className="marquee-item" aria-hidden="true">{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
