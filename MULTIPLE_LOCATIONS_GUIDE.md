# Multiple Locations / Addresses Feature

This guide explains how to use the new multiple locations feature in the admin panel and how it appears on the frontend.

## Overview

The system now supports managing multiple business locations/addresses that can be displayed on the Contact page. Users can add, edit, and delete multiple addresses through the admin panel, and the frontend will display them with an intuitive location selector.

## Admin Panel Usage

### Adding/Managing Locations

1. Navigate to **Contact Page Settings** in the admin panel
2. Scroll down to the **Contact Info Card** section
3. Find the **Locations / Addresses** section
4. Click the **+ Add Location** button to add a new location
5. Fill in the location details:
   - **Address**: The full address (street, city, etc.)
   - **Google Maps URL**: A link to the location on Google Maps (optional)
6. Click **Save Changes** at the bottom of the page

### Editing Locations

1. Click on the location you want to edit
2. Update the address or Google Maps URL
3. Click **Save Changes**

### Deleting Locations

1. Open a location you want to delete
2. Click the **Remove** button (appears only if there are multiple locations)
3. Click **Save Changes**

### Backward Compatibility

If you have an existing single address and Google Maps URL:
- They will be converted to a location automatically
- You can add more locations using the **+ Add Location** button

## Database Setup

### For New Installations
The database is already configured with the `locations` JSON column in the `contact_page_settings` table.

### For Existing Installations
Run the migration file to add the `locations` column:

```bash
mysql organic_food < backend/database/migrations/add_locations_to_contact_settings.sql
```

Or manually run this SQL:
```sql
ALTER TABLE `contact_page_settings` ADD COLUMN `locations` JSON DEFAULT NULL AFTER `google_map_url`;
```

To migrate existing data (optional):
```sql
UPDATE `contact_page_settings`
SET `locations` = JSON_ARRAY(
  JSON_OBJECT('address', `address`, 'google_map_url', `google_map_url`)
)
WHERE (`address` IS NOT NULL OR `google_map_url` IS NOT NULL) AND `locations` IS NULL;
```

## Frontend Usage

### Displaying Locations in Contact Page

The contact page automatically displays locations using the new `LocationCard` component:

```jsx
import LocationCard from "../components/LocationCard";
import { getContactPage } from "../api/apiClient";

export default function ContactPage() {
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    getContactPage().then((data) => {
      setContactData(data);
    });
  }, []);

  if (!contactData) return <div>Loading...</div>;

  const locations = contactData.locations || [];

  return (
    <div className="contact-page">
      {/* ... other content ... */}
      <LocationCard locations={locations} />
    </div>
  );
}
```

### Location Card Features

- **Multiple Location Tabs**: If there are multiple locations, tabs appear at the top to switch between them
- **Address Display**: Shows the full address with a location icon
- **Google Maps Link**: Clicking "View on Google Maps" opens the location in a new tab
- **Responsive Design**: Works on mobile, tablet, and desktop

### Location Data Structure

Each location is stored as a JSON object:

```json
{
  "address": "Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan",
  "google_map_url": "https://maps.google.com/..."
}
```

Full locations array:
```json
[
  {
    "address": "Main Office Address...",
    "google_map_url": "https://maps.google.com/..."
  },
  {
    "address": "Secondary Office Address...",
    "google_map_url": "https://maps.google.com/..."
  }
]
```

## API Response

When fetching contact page settings via the API:

```javascript
GET /api/public/contact-page

Response:
{
  "data": {
    "id": 1,
    "contact_heading": "We'd love to hear from you",
    "contact_description": "...",
    "whatsapp_number": "+92 333 8399480",
    "phone_number": "+92 333 8399480",
    "email": "info@arionorganic.com",
    "locations": [
      {
        "address": "Office 22, 4th Floor...",
        "google_map_url": "https://maps.google.com/..."
      }
    ],
    "facebook_url": "...",
    "instagram_url": "...",
    ...
  }
}
```

## Integration Steps

### 1. Update Contact Page Component

If you have an existing Contact page, update it to use the new `LocationCard` component:

```jsx
import LocationCard from "../components/LocationCard";

export default function Contact() {
  // ... existing code ...

  return (
    <div className="contact-section">
      {/* ... existing content ... */}
      <LocationCard locations={contactData?.locations} />
    </div>
  );
}
```

### 2. Styling

The `LocationCard` component includes its own styling, but you can customize it by:
- Modifying the inline styles in the component
- Creating a separate CSS file and importing it

### 3. Customization Options

You can customize the `LocationCard` component by:
- Changing the button text
- Modifying colors and fonts
- Adding additional information to each location
- Changing the layout (horizontal tabs vs. dropdown selector)

## Features

✅ Add unlimited locations/addresses  
✅ Each location can have address and Google Maps link  
✅ Automatic tab switching for multiple locations  
✅ Backward compatible with existing single address  
✅ Fully responsive design  
✅ Easy admin interface with + Add Location button  
✅ JSON storage for flexibility  

## Troubleshooting

### Locations not showing in frontend
- Check that locations are saved properly in the admin panel
- Verify the API response includes locations data
- Clear browser cache

### Migration issues
- Ensure the migration file is run before using the feature
- Check database permissions for ALTER TABLE command
- Verify the column was added: `SHOW COLUMNS FROM contact_page_settings;`

### Display issues
- Check LocationCard component is imported correctly
- Verify CSS is loading
- Check browser console for errors

## Example Usage

### Admin Panel

1. Go to Contact Page Settings
2. In "Contact Info Card" section, scroll to "Locations / Addresses"
3. Click "+ Add Location"
4. Fill in:
   - Address: "123 Main Street, Islamabad, Pakistan"
   - Google Maps: "https://maps.google.com/..."
5. Click "+ Add Location" again for a second location
6. Fill in the second location details
7. Click "Save Changes"

### Frontend

Locations appear as:
- Tab selector showing "Location 1", "Location 2", etc.
- Address display with location icon
- "View on Google Maps" button linking to the map

## File Changes

### New Files
- `backend/database/migrations/add_locations_to_contact_settings.sql` - Database migration
- `src/components/LocationCard.jsx` - Frontend location display component
- `MULTIPLE_LOCATIONS_GUIDE.md` - This documentation

### Modified Files
- `backend/models/ContactPageSetting.php` - Added 'locations' to fillable array
- `admin/src/pages/contact/ContactPageSettings.jsx` - Multiple location management UI
- `backend/database/organic_food.sql` - Added locations column

## Support

For issues or questions about the multiple locations feature, refer to:
1. This guide
2. Check database migration file for SQL help
3. Review LocationCard component source code
4. Check admin panel Contact Page Settings form

---

**Version**: 1.0  
**Last Updated**: 2026-06-09  
**Compatible With**: Arion Organic Food System v1.0+
