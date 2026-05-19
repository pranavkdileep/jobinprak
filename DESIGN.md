---
name: JobGrid Portal
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#424655'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#727786'
  outline-variant: '#c2c6d8'
  surface-tint: '#0057cd'
  primary: '#0055c8'
  on-primary: '#ffffff'
  primary-container: '#0b6cf8'
  on-primary-container: '#fefcff'
  inverse-primary: '#b1c5ff'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#5a5c5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#737575'
  on-tertiary-container: '#fcfcfc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001946'
  on-primary-fixed-variant: '#00419d'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  headline-xl:
    fontFamily: JetBrains Mono
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: JetBrains Mono
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style

The design system embodies a cinematic, technical aesthetic that bridges the gap between high-end consumer minimalism and the raw utility of a developer environment. It evokes a sense of "digital precision"—a world where every pixel is intentional, and the interface feels like a sophisticated blueprint for a career.

The style is a fusion of **Apple-inspired Minimalism** and **Technical Futurism**. It utilizes expansive white space, a structured technical grid, and high-contrast typography to create an environment that feels both professional and cutting-edge. The emotional response should be one of clarity, ambition, and technological mastery.

## Colors

The palette is anchored by **Electric Blue**, used sparingly for primary actions and technical highlights to maintain a high-energy Web3 vibe without sacrificing the professional "clean" look. 

- **Primary**: Electric Blue (#1E73FF) for interactivity and data visualization.
- **Surface**: The soft-white background (#F9FAFB) provides a non-glare canvas that feels more premium than pure white.
- **Contrast**: Pure Black (#000000) is used for typography and high-priority structural elements to ensure a grounded, authoritative feel.
- **The Grid**: A faint technical grid (#E5E7EB at 15-20% opacity) should be visible as a background layer, reinforcing the "portal" and "blueprint" metaphor.

## Typography

Typography is the primary differentiator of this design system. It utilizes a high-contrast pairing:

1.  **Headlines (JetBrains Mono)**: Monospaced and oversized. This font choice screams "technical precision" and "code." For XL and LG sizes, apply a tight letter-spacing to give it a modern, compressed editorial feel.
2.  **Body & UI (Geist)**: A sophisticated, humanist-influenced sans-serif that ensures maximum readability. Geist's technical yet approachable nature balances the rigidity of the monospaced headlines.

Always use `mono-label` for small technical metadata, such as timestamps, status codes, or grid coordinates.

## Layout & Spacing

This design system uses a **12-column Fluid Grid** built on a strictly enforced 8px base unit. 

- **The Blueprint Model**: Layouts should feel constructed. Use thin 1px dividers to separate sections rather than relying solely on whitespace. 
- **Margins**: Large, cinematic margins (64px+) on desktop focus the user's attention on the central "portal" content.
- **Vertical Rhythm**: Use large gaps (80px, 120px) between major sections to maintain a sense of "breathable" minimalism.
- **Responsive Behavior**: On tablet and mobile, the 12-column grid collapses to 8 and 4 columns respectively, with margins tightening to 20px to prioritize content density.

## Elevation & Depth

Visual hierarchy is established through a combination of flat technical layers and high-end glassmorphism.

1.  **Glassmorphism**: Use for overlays, navigation bars, and "dark mode" component blocks. Apply a 20px backdrop blur with a semi-transparent black stroke (1px, 10% opacity) to create a "floating lens" effect.
2.  **Subtle Shadows**: Avoid heavy, muddy shadows. Use "Ambient Shadows"—multi-layered, ultra-soft blurs (e.g., `0px 4px 24px rgba(0,0,0,0.04)`)—to make white cards pop against the grid background.
3.  **Tonal Layers**: Use Light Gray (#F3F4F6) for secondary surface containers to distinguish from the primary background without needing elevation.

## Shapes

The design system employs a "Soft Tech" shape language. While the grid and typography are rigid and geometric, the containers use significant rounding to feel approachable and "Apple-like."

- **Cards & Containers**: Use `rounded-2xl` (1.5rem / 24px) for all primary cards.
- **Buttons & Inputs**: Use `rounded-lg` (0.5rem / 8px) to maintain a slightly more disciplined look for interactive elements.
- **Status Pills**: Use fully rounded (9999px) shapes.

## Components

### Buttons
Primary buttons are solid Black (#000000) with White text for maximum impact. Secondary buttons use a 1px Electric Blue stroke with no fill. For a "web3" accent, use an Electric Blue glow effect on hover.

### Cards
White background with `rounded-2xl` corners. Cards must feature a subtle 1px border (#E5E7EB). Inside the card, content should follow the 8px spacing rule. Headers within cards should use `mono-label` for a "system-info" vibe.

### Input Fields
Inputs should have a minimal, high-tech look: a light gray background (#F3F4F6) and a 1px border that turns Electric Blue on focus. Use JetBrains Mono for placeholder text to maintain the technical aesthetic.

### Blueprint Dividers
Dividers are 1px thick, colored #E5E7EB. In some instances, dividers may include "crosshair" icons or small mono-text coordinates at the intersections to lean into the technical grid theme.

### Glass Sections
For "Dark Sections" (e.g., footer or featured widgets), use a dark-tinted glassmorphic container: `rgba(0, 0, 0, 0.8)` background with a `backdrop-filter: blur(12px)`. Text inside these sections must be White or Electric Blue.