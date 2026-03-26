---
name: brand-guidelines
description: Applies Fetemi's official brand colors and typography to any sort of artifact that may benefit from having Fetemi's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.
license: Complete terms in LICENSE.txt
---

# Fetemi Brand Styling

## Overview

To access Fetemi's official brand identity and style resources, use this skill. 

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, typography, Fetemi brand, visual formatting, visual design, glassmorphism

## Brand Guidelines

### Aesthetics
- **Core Aesthetic**: Soft Glassmorphism / Luxury Refined
- **Key Traits**: Premium, soft glows, heavily rounded corners (`rounded-[2.5rem]`), elegant floating elements. No harsh borders or high-contrast brutalism.

### Colors

**Main Colors:**

- Dark: `#0f172a` (Slate 900) - Primary text (on light), dark backgrounds
- Light: `#fafafa` (Zinc 50) - Light backgrounds and text (on dark)
- Mid Gray: `#94a3b8` (Slate 400) - Secondary elements
- Light Gray: `#e2e8f0` (Slate 200) - Subtle borders/backgrounds

**Accent Colors:**

- Primary Violet: `#8b5cf6` (Violet 500)
- Secondary Light Violet: `#a78bfa` (Violet 400)
- Gradients: Soft meshed gradients fading between white/transparent and soft violet/indigo.

### Typography

- **Headings**: Outfit (sans-serif)
- **Body Text**: Manrope (sans-serif)
- **Weights**: Focus heavily on `font-medium` and `font-normal`. Avoid aggressive heavy fonts like `font-black` or `font-bold`.

## Features

### Smart Font Application

- Applies Outfit font to headings
- Applies Manrope font to body text
- Maintains an airy, highly legible typographical hierarchy using medium/regular weights.

### Text Styling

- Headings: Outfit font, medium weight.
- Body text: Manrope font, regular weight.
- Smart color selection based on background to maintain premium legibility.

### UI Components & Shapes

- **Glass Cards**: `.glass-card` (`bg-white/60`, `backdrop-blur-xl`, `border border-white/40`, soft shadows).
- **Rounding**: Massive border radii (e.g., `rounded-[2.5rem]`, `rounded-2xl`).
- **Layouts**: Floating elements with generous margins (e.g., floating sidebars, pill headers).

## Technical Details

### Framework Context

- Built on top of Tailwind CSS.
- Heavily uses CSS variables and Tailwind utility extensions (like `.glass-card`).
- Employs smooth animations (`animate-fade-in-up`, slow duration `500ms` transitions) rather than immediate snaps.
