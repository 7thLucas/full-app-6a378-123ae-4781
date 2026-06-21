# Design Guidelines — Lumora

## Brand Identity

**Name**: Lumora
**Personality**: Premium, modern, aspirational, clean, trustworthy
**Tone**: Confident yet approachable. Minimal noise, maximum clarity.

---

## Color Palette

### Primary
- **Lumora Violet**: `#7C3AED` — primary brand accent, CTAs, active states
- **Lumora Indigo**: `#4F46E5` — secondary accent, gradients

### Gradient
- **Brand Gradient**: `linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)` — story rings, verified badges, featured elements

### Neutrals (Light Mode)
- Background: `#FFFFFF`
- Surface: `#F9FAFB`
- Border: `#E5E7EB`
- Text Primary: `#111827`
- Text Secondary: `#6B7280`
- Text Tertiary: `#9CA3AF`

### Neutrals (Dark Mode)
- Background: `#0A0A0B`
- Surface: `#111113`
- Surface Elevated: `#1C1C1F`
- Border: `#27272A`
- Text Primary: `#F9FAFB`
- Text Secondary: `#A1A1AA`
- Text Tertiary: `#71717A`

### Semantic
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`
- Info / Online indicator: `#06B6D4`

---

## Typography

**Primary Font**: Inter (Google Fonts)
**Display / Logo**: Outfit (Google Fonts) — used for the Lumora wordmark and hero headings

| Role | Size | Weight | Line Height |
|---|---|---|---|
| Display | 32px | 700 | 1.2 |
| Heading 1 | 24px | 700 | 1.3 |
| Heading 2 | 20px | 600 | 1.35 |
| Body | 15px | 400 | 1.5 |
| Body Strong | 15px | 600 | 1.5 |
| Caption | 12px | 400 | 1.4 |
| Caption Strong | 12px | 600 | 1.4 |

---

## Elevation & Shadows

- **Level 0**: No shadow — flat surfaces (cards on dark mode)
- **Level 1**: `0 1px 3px rgba(0,0,0,0.08)` — cards, input fields
- **Level 2**: `0 4px 16px rgba(0,0,0,0.12)` — modals, dropdowns
- **Level 3**: `0 12px 40px rgba(0,0,0,0.20)` — overlays, drawers, bottom sheets

---

## Spacing & Layout

- **Base unit**: 4px
- **Component padding**: 16px (mobile), 24px (desktop)
- **Card radius**: 16px
- **Button radius**: 12px
- **Avatar radius**: 50% (circle)
- **Input radius**: 12px
- **Bottom nav height**: 60px
- **Story ring gap**: 3px border + 2px gap

---

## Iconography

- **Library**: Lucide React (outline style, consistent stroke width 1.5)
- **Size**: 24px default, 20px compact, 28px emphasis
- **Active state**: filled variant or brand violet color

---

## Components

### Bottom Navigation
- 5 tabs: Home, Explore, Create (+), Reels, Profile
- Active tab: Lumora Violet icon + label
- Inactive: gray icon, no label on mobile
- Floating create button style for the center tab

### Story Ring
- Unseen: brand gradient border
- Seen: gray border
- Avatar size: 64px with 3px ring

### Feed Card
- Full-width image/video
- Author row (avatar, username, verified badge, follow button, options)
- Action row: heart, comment, share, bookmark
- Like count, caption, hashtag links, comment preview

### Reel Player
- Full-screen vertical scroll (TikTok-style)
- Overlay: author info, caption, action buttons on right rail
- Mute toggle, progress bar at top

### Verified Badge
- Blue checkmark icon (brand gradient fill)
- Inline with username, 16px

### Button Styles
- **Primary**: brand violet fill, white text, 12px radius, 44px height
- **Secondary**: transparent, violet border + text
- **Ghost**: no border, violet text
- **Destructive**: red fill or red text

### Input Fields
- 48px height, 12px radius, subtle border
- Focus: violet border glow `box-shadow: 0 0 0 3px rgba(124,58,237,0.15)`

### Avatar
- Circle crop, sizes: 32px, 48px, 64px, 96px, 128px
- Placeholder: gradient background + initials

### Notification Badge
- Red dot or count pill, top-right of icon

---

## Animation Principles

- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (material ease)
- **Duration**: 150ms micro, 250ms standard, 400ms layout
- **Story transitions**: horizontal slide
- **Reel transitions**: vertical swipe snap
- **Feed load**: skeleton shimmer before image loads
- **Like animation**: heart pop scale (1 → 1.3 → 1) + red fill
- **Tab switch**: fade + slight Y translate

---

## Dark / Light Mode

- System-aware default with manual toggle in settings
- All surfaces, borders, and text adapt per the palette above
- Images and media remain unaffected
- Mode transition: 200ms cross-fade

---

## Anti-References

- Do NOT copy Instagram's exact purple/orange gradient
- Do NOT use Facebook/Meta's blue as a primary
- Do NOT use TikTok's red/black aesthetic
- Keep the UI original — inspired by social conventions, not cloned from any single app
