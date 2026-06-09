import { useState } from "react";

export default function LocationCard({ locations = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!locations || locations.length === 0) {
    return null;
  }

  const currentLocation = locations[selectedIndex] || {};

  return (
    <div className="location-section">
      <div className="location-card">
        {/* Location tabs if multiple */}
        {locations.length > 1 && (
          <div className="location-tabs">
            {locations.map((location, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`location-tab ${index === selectedIndex ? "active" : ""}`}
                title={location.address}
              >
                Location {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Location content */}
        <div className="location-content">
          {currentLocation.address && (
            <div className="location-address">
              <span className="location-icon">📍</span>
              <div>
                <h3>Address</h3>
                <p>{currentLocation.address}</p>
              </div>
            </div>
          )}

          {currentLocation.google_map_url && (
            <div className="location-map-link">
              <a
                href={currentLocation.google_map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                <span>🗺️</span> View on Google Maps
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .location-section {
          width: 100%;
        }

        .location-card {
          background: rgba(73, 99, 72, 0.08);
          border: 1.5px solid rgba(73, 99, 72, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          overflow: hidden;
        }

        .location-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .location-tab {
          padding: 0.6rem 1.2rem;
          background: transparent;
          border: 1.5px solid rgba(73, 99, 72, 0.2);
          border-radius: 10px;
          color: #496348;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .location-tab:hover {
          border-color: #496348;
          background: rgba(73, 99, 72, 0.1);
        }

        .location-tab.active {
          background: #496348;
          color: white;
          border-color: #496348;
        }

        .location-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .location-address {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .location-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .location-address h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #496348;
          margin-bottom: 0.3rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .location-address p {
          color: #5B5248;
          line-height: 1.6;
          font-size: 0.95rem;
          margin: 0;
        }

        .location-map-link {
          display: flex;
          justify-content: center;
          padding-top: 0.5rem;
        }

        .map-button {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(120deg, #496348, #3a4e39);
          color: white;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(73, 99, 72, 0.2);
        }

        .map-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(73, 99, 72, 0.3);
        }

        .map-button span {
          font-size: 1.1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .location-card {
            padding: 1.2rem;
          }

          .location-tabs {
            gap: 0.4rem;
          }

          .location-tab {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }

          .location-address {
            gap: 0.8rem;
          }

          .location-icon {
            font-size: 1.3rem;
          }

          .location-address h3 {
            font-size: 0.85rem;
          }

          .location-address p {
            font-size: 0.9rem;
          }

          .map-button {
            padding: 0.65rem 1.2rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
