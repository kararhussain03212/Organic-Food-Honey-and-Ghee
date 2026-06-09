# Multiple Locations Integration Example

This file shows how to integrate the new LocationCard component into your Contact page.

## Example: Updated Contact Page

Here's how to update your existing Contact page to display multiple locations:

```jsx
// src/pages/Contact.jsx
import { useEffect, useState } from "react";
import { getContactPage } from "../api/apiClient";
import LocationCard from "../components/LocationCard";
import "../styles/Contact.css";

export default function Contact() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactPage()
      .then((data) => {
        setContactData(data);
      })
      .catch((error) => {
        console.error("Failed to load contact data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="contact-loading">Loading...</div>;
  }

  if (!contactData) {
    return <div className="contact-error">Failed to load contact information</div>;
  }

  const locations = contactData.locations || [];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="eyebrow">{contactData.hero_badge}</span>
          <h1>
            {contactData.hero_heading}{" "}
            <span className="highlight">{contactData.hero_highlight}</span>
          </h1>
          <p>{contactData.hero_description}</p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="contact-section">
        <div className="contact-container">
          {/* Contact Form */}
          <div className="contact-form-wrapper">
            {/* Your existing form code */}
          </div>

          {/* Contact Info Card with Multiple Locations */}
          <div className="contact-info-wrapper">
            <div className="contact-info-card">
              <h2>{contactData.contact_heading}</h2>
              <p className="contact-description">
                {contactData.contact_description}
              </p>

              {/* Availability Info */}
              {contactData.availability_text && (
                <div className="availability-info">
                  <span className="availability-badge">
                    ✓ {contactData.availability_text}
                  </span>
                </div>
              )}

              {/* Quick Contact Info */}
              <div className="quick-contact">
                {contactData.whatsapp_number && (
                  <div className="contact-item">
                    <span className="icon">💬</span>
                    <div>
                      <p className="label">WhatsApp</p>
                      <a href={`https://wa.me/${contactData.whatsapp_number.replace(/\D/g, '')}`}>
                        {contactData.whatsapp_number}
                      </a>
                    </div>
                  </div>
                )}

                {contactData.phone_number && (
                  <div className="contact-item">
                    <span className="icon">📞</span>
                    <div>
                      <p className="label">Phone</p>
                      <a href={`tel:${contactData.phone_number}`}>
                        {contactData.phone_number}
                      </a>
                    </div>
                  </div>
                )}

                {contactData.email && (
                  <div className="contact-item">
                    <span className="icon">✉️</span>
                    <div>
                      <p className="label">Email</p>
                      <a href={`mailto:${contactData.email}`}>
                        {contactData.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Multiple Locations Display */}
              {locations.length > 0 && (
                <div className="locations-wrapper">
                  <h3 className="locations-heading">Our Locations</h3>
                  <LocationCard locations={locations} />
                </div>
              )}

              {/* Social Media Links */}
              {(contactData.facebook_url ||
                contactData.instagram_url ||
                contactData.youtube_url ||
                contactData.tiktok_url) && (
                <div className="social-links">
                  <p className="social-label">Follow Us</p>
                  <div className="social-buttons">
                    {contactData.facebook_url && (
                      <a
                        href={contactData.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        title="Facebook"
                      >
                        f
                      </a>
                    )}
                    {contactData.instagram_url && (
                      <a
                        href={contactData.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        title="Instagram"
                      >
                        📷
                      </a>
                    )}
                    {contactData.youtube_url && (
                      <a
                        href={contactData.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        title="YouTube"
                      >
                        ▶️
                      </a>
                    )}
                    {contactData.tiktok_url && (
                      <a
                        href={contactData.tiktok_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        title="TikTok"
                      >
                        🎵
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

## Optional: Custom LocationCard Styling

If you want to customize the LocationCard appearance, you can override the styles:

```css
/* src/styles/Contact.css */

.locations-wrapper {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(73, 99, 72, 0.1);
}

.locations-heading {
  font-family: "Playfair Display", serif;
  font-size: 1.1rem;
  color: #5B5248;
  margin-bottom: 1rem;
}

/* Customize LocationCard appearance */
.location-section .location-card {
  background: linear-gradient(135deg, rgba(73, 99, 72, 0.05), rgba(199, 166, 107, 0.05));
}

.location-section .location-tab.active {
  background: #496348;
  color: white;
}

.location-section .map-button {
  width: 100%;
}
```

## Data Flow Diagram

```
Admin Panel
    ↓
ContactPageSettings.jsx (update locations)
    ↓
PUT /api/admin/contact-page
    ↓
Backend: ContactController::adminUpdateContactPage()
    ↓
Database: contact_page_settings.locations (JSON)
    ↓
Frontend: GET /api/public/contact-page
    ↓
Contact.jsx (receives contactData)
    ↓
LocationCard component (displays locations)
```

## Step-by-Step Integration

### 1. Ensure LocationCard component exists
- File: `src/components/LocationCard.jsx` ✓

### 2. Update your Contact page
```jsx
import LocationCard from "../components/LocationCard";
```

### 3. Add to your JSX
```jsx
{locations.length > 0 && (
  <LocationCard locations={locations} />
)}
```

### 4. Add CSS if needed
- Create `src/styles/Contact.css` with custom styles
- Import it in your Contact page

### 5. Test in admin panel
- Go to Contact Page Settings
- Add a location
- Save changes
- Check frontend to verify display

## Testing Locations

### Test Case 1: Single Location
1. Admin: Add one location
2. Frontend: Should show address and map link
3. No tabs should appear

### Test Case 2: Multiple Locations
1. Admin: Add two locations
2. Frontend: Tabs appear for "Location 1", "Location 2"
3. Clicking tabs switches between locations

### Test Case 3: No Google Maps URL
1. Admin: Add location without Google Maps URL
2. Frontend: Address shows, no map button appears
3. Should not break layout

### Test Case 4: Add Location Dynamically
1. Admin: Start with one location
2. Add second location
3. Save changes
4. Frontend: Should update with two locations

## Common Issues and Solutions

### Issue: Locations not appearing on frontend
**Solution:**
1. Check admin panel - verify locations are saved
2. Check API response - use browser dev tools Network tab
3. Check LocationCard component is imported
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Tabs not appearing with multiple locations
**Solution:**
1. Verify locations array has multiple items
2. Check browser console for JavaScript errors
3. Verify LocationCard component rendered

### Issue: Google Maps URL not working
**Solution:**
1. Verify URL format: `https://maps.google.com/...`
2. Test URL in new tab directly
3. Check for spaces in URL

## Advanced Customization

### Change Location Tab Style
Edit LocationCard.jsx, search for `.location-tab` class

### Add Location Icon/Badge
Add to LocationCard.jsx:
```jsx
{location.label && <span className="location-badge">{location.label}</span>}
```

### Change to Dropdown Instead of Tabs
Replace tabs section with:
```jsx
<select value={selectedIndex} onChange={(e) => setSelectedIndex(parseInt(e.target.value))}>
  {locations.map((loc, idx) => (
    <option key={idx} value={idx}>Location {idx + 1}</option>
  ))}
</select>
```

---

For more help, refer to `MULTIPLE_LOCATIONS_GUIDE.md`
