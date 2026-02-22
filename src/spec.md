# Hotel Highway King Restaurant - Professional Layout Enhancement

## Current State

The website has a functional online food ordering system with:
- 70+ menu items across 9 categories with AI-generated dish photos
- Working cart, checkout, and order management system
- Tab-based category navigation (all categories in horizontal tabs)
- Simple hero section with restaurant info
- Basic search functionality
- Uploaded hotel photos available at:
  - `/assets/uploads/Screenshot_20260222-135159-1.png` (night view)
  - `/assets/uploads/Screenshot_20260222-135146-2.png` (day view)

## Requested Changes (Diff)

### Add
- Hero section with actual hotel photos (night/day views)
- Category-based sectioned layout (replace horizontal tabs)
- AI-generated banner images for each food category section
- Google Maps integration with exact location (Bypass Road, Datia)
- Visual separation between different food varieties (Junk Food, Sweets, Indian, Chinese, Tandoori, Beverages sections)
- Professional restaurant website aesthetic

### Modify
- Menu layout: Change from single grid with category tabs to multiple category sections with dedicated banners
- Hero section: Replace generic gradient with actual hotel photos
- Navigation: Keep category quick-links but make them scroll to sections
- Location info: Add embedded Google Map with restaurant's exact coordinates

### Remove
- Horizontal category tabs (TabsList)
- Single unified menu grid

## Implementation Plan

### 1. Hero Section Enhancement
- Create hero banner carousel/slideshow with both uploaded hotel photos
- Overlay restaurant name and tagline
- Keep existing info cards (hours, phone, location) below hero

### 2. Generate Category Banner Images
Generate AI banner images for each category:
- Fast Food & Junk Food banner (burgers, fries, pizza)
- Sweets & Desserts banner (gulab jamun, jalebi, rasgulla)
- Indian Main Course banner (curries, paneer dishes)
- Chinese Food banner (noodles, fried rice, manchurian)
- Tandoori & Biryani banner (tandoori items, biryani)
- Rice & Biryani banner
- Thali banner (traditional thali presentation)
- Beverages banner (chai, lassi, cold drinks)
- Soya Chaap banner

### 3. Sectioned Menu Layout
- Replace tabs with vertical sections
- Each category gets:
  - Large banner image at section top
  - Section heading with category name
  - Grid of menu items for that category
- Add floating "Quick Jump" navigation for easy category access

### 4. Location Integration
- Add "Find Us" section after menu
- Embed Google Maps iframe with location: https://maps.app.goo.gl/heER6s3eRvZxkmGb9
- Display full address: Bypass Road, Datia, MP
- Add directions link

### 5. Professional Styling
- Use warm, inviting color scheme (existing saffron/red/terracotta preserved)
- Add subtle animations and transitions
- Enhance typography hierarchy
- Improve spacing and visual breathing room
- Shadow and depth effects for section separation

## UX Notes

- Users will scroll through category sections instead of switching tabs
- Quick-jump nav allows fast category access
- Hotel photos build brand trust and recognition
- Category banners provide visual context and appetite appeal
- Embedded map makes location finding effortless
- Layout feels more like a professional restaurant website than an app
