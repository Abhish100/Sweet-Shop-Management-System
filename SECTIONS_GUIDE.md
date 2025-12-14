# Sweet Shop Sections Guide

## Overview
The sweet shop now has three main sections with proper filtering, images, and admin controls.

## Sections

### 1. Shop India 🇮🇳
- **Shows**: All Indian sweets
- **Features**: 
  - Complete collection of traditional Indian sweets
  - Images for each sweet
  - Add to cart functionality
  - Buy option through cart
- **Categories Included**: All categories (Syrup Based, Dairy, Fried, Halwa, Burfi, Flaky, Laddu, Dry Fruit, Ghee Based)

### 2. Shop International 🌍
- **Status**: Coming Soon in Your Location
- **Message**: Shows a beautiful message about upcoming international desserts
- **Upcoming Items**:
  - French Macarons & Éclairs
  - Italian Tiramisu & Cannoli
  - American Cheesecakes & Brownies
  - Turkish Baklava & Lokum
  - Japanese Mochi & Dorayaki
- **Action**: Users can navigate to Shop India or Festive Gifting

### 3. Festive Gifting 🎁
- **Shows**: Festival-centric sweets
- **Categories Included**:
  - **Laddu**: Motichoor Laddu, Besan Laddu, Coconut Laddu, Rava Laddu
  - **Dry Fruit**: Kaju Katli, Badam Katli, Pista Katli, Dry Fruit Mix
  - **Ghee Based**: Mysore Pak, Ghee Mysore Pak, Ghee Burfi, Gulab Jamun (Ghee)
- **Perfect For**: Diwali, Holi, Raksha Bandhan, Weddings, Corporate Gifting
- **Features**: Images, add to cart, buy option

## Admin Features

When an admin logs in, they can:

### Add New Sweet
1. Click on "Add New Sweet" in the admin panel
2. Fill in the form:
   - **Name**: Sweet name (e.g., "Gulab Jamun")
   - **Category**: Select from dropdown
     - Syrup Based
     - Dry Fruit
     - Dairy
     - Laddu
     - Fried
     - Ghee Based
     - Halwa
     - Burfi
     - Flaky
     - Other
   - **Price (₹)**: Enter price (e.g., 60.00)
   - **Initial Quantity**: Enter stock number (e.g., 50)
   - **Product Image**: 
     - Enter image URL directly, OR
     - Upload image from device (converts to base64)
   - **Description**: Detailed description of the sweet
3. Click "Add to Inventory"

### Edit Existing Sweet
1. Click the edit icon (✏️) on any sweet card
2. Modify any fields (name, category, price, quantity, image, description)
3. Click "Update Inventory"

### Manage Stock
- Admin can update the quantity (stock) of any sweet
- Use the restock button (➕) on sweet cards to add more stock
- Or edit the sweet and change the quantity field

### Customize Sections
- Admin can add sweets to any section by selecting the appropriate category:
  - **Shop India**: Any category
  - **Festive Gifting**: Use categories "Laddu", "Dry Fruit", or "Ghee Based"
  - **International**: Coming soon (will have new categories)

## Database Seeding

The seed file (`backend/prisma/seed.ts`) includes:
- **25+ Indian sweets** with images
- **Festive sweets** properly categorized
- **Image URLs** from Unsplash (with fallback support)

### To Reset and Reseed Database:
```bash
cd backend
npx prisma migrate reset --force
npm run seed
```

## User Features

### Shopping Experience
1. **Browse by Section**: Click navigation links (Shop India, Shop International, Festive Gifting)
2. **View Sweets**: See all sweets with images, prices, and descriptions
3. **Add to Cart**: Click "Add to Cart" on any sweet
4. **Buy**: Open cart drawer, select address, proceed to payment
5. **Filter & Search**: Use filters to find specific sweets

### Sweet Cards
Each sweet card shows:
- **Image**: High-quality image (from URL or generated)
- **Name**: Sweet name
- **Category**: Category badge
- **Price**: ₹ price
- **Description**: Detailed description
- **Stock**: Available quantity
- **Add to Cart**: Button to add to cart
- **Admin Controls**: Edit, Restock, Delete (admin only)

## Image Handling

### Image Sources (Priority Order):
1. **Database Image URL**: If sweet has `imageUrl` field set
2. **Gemini Generation**: Auto-generates image if URL fails
3. **Placeholder**: Branded placeholder as final fallback

### Admin Image Options:
- **URL Input**: Paste any image URL
- **File Upload**: Upload from device (converts to base64)
- **Preview**: See image preview before saving

## Technical Details

### Filtering Logic
- **Shop India**: Shows all sweets (`matchesSection = true`)
- **International**: Shows none (`matchesSection = false`) - coming soon
- **Festive**: Filters by categories: `['Laddu', 'Dry Fruit', 'Ghee Based']`

### Categories for Festive Section
- **Laddu**: All types of laddus (Motichoor, Besan, Coconut, Rava)
- **Dry Fruit**: Premium dry fruit sweets (Kaju Katli, Badam Katli, Pista Katli)
- **Ghee Based**: Traditional ghee sweets (Mysore Pak, Ghee Burfi)

## Next Steps

1. **Add More Sweets**: Admin can add more sweets through the admin panel
2. **International Section**: When ready, add international sweets with new categories
3. **Custom Images**: Upload custom images for each sweet
4. **Stock Management**: Keep track of inventory through admin panel

## Notes

- All sweets are currently Indian sweets
- International section is placeholder for future expansion
- Festive section automatically filters by category
- Admin can customize all aspects of sweets (price, image, quantity, category)

