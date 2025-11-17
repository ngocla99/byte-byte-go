# MotherDuck Style Guide

A comprehensive design system and style guide for the MotherDuck project.

## Table of Contents
1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Styles](#component-styles)
6. [Shadows & Elevation](#shadows--elevation)
7. [Animations & Transitions](#animations--transitions)
8. [Border Radius](#border-radius)
9. [Opacity & Transparency](#opacity--transparency)
10. [Grid System](#grid-system)
11. [Textures & Effects](#textures--effects)
12. [Common Tailwind CSS Usage](#common-tailwind-css-usage)
13. [Example Component Reference](#example-component-reference)

---

## Overview

This project uses a sophisticated design system built on CSS-in-JS (styled-components), CSS custom properties (CSS variables), and modern CSS features. The design emphasizes:

- **Dark theme aesthetic** with subtle gradients and glows
- **Technical/data visualization** styling with monospace fonts
- **Layered depth** through multiple shadow levels
- **Smooth animations** with custom easing functions
- **Responsive design** using clamp() and fluid typography
- **Theme variants** supporting multiple color schemes (default dark, pink, light)

---

## Color Palette

### CSS Custom Properties

The project uses an extensive CSS variable system organized by semantic naming:

#### Foreground Colors (Text & UI Elements)
```css
/* Foreground scale (100-1200, lighter to darker) */
--fg100: rgba(245, 192, 192, 0.077);     /* Lightest accent */
--fg200: rgba(245, 192, 192, 0.103);
--fg300: rgba(245, 192, 192, 0.129);
--fg400: rgba(245, 192, 192, 0.172);
--fg500: rgba(245, 192, 192, 0.258);
--fg600: rgba(245, 192, 192, 0.386);
--fg700: rgba(245, 192, 192, 0.592);
--fg800: rgba(245, 192, 192, 0.801);
--fg900: rgba(245, 192, 192, 0.868);
--fg1000: rgba(245, 192, 192, 0.901);
--fg1100: rgba(245, 192, 192, 0.923);
--fg1200: #f5c0c0;                       /* Primary text color */

/* Alpha variants for overlays */
--fgA100: rgba(245, 192, 192, 0.056);
--fgA500: rgba(245, 192, 192, 0.103);
--fgA700: rgba(245, 192, 192, 0.172);
--fgA900: rgba(245, 192, 192, 0.258);
--fgA1100: rgba(245, 192, 192, 0.386);

/* Special foreground colors */
--fgLoud: #ffffff;                       /* High-emphasis text */
```

#### Background Colors
```css
--bg100: #14141C;                        /* Primary background */
--bg200: #0f0f15;                        /* Secondary background */
--bg300: #0d0d13;                        /* Tertiary background */
```

#### Grid & Border Colors
```css
--grid100: rgba(1, 1, 27, 0.05);
--grid200: rgba(1, 1, 27, 0.075);
--grid300: rgba(1, 1, 27, 0.1);
--grid500: rgba(245, 192, 192, 0.15);    /* Primary grid lines */
--grid600: rgba(245, 192, 192, 0.2);
--grid1200: rgba(245, 192, 192, 0.592);
```

#### Accent Colors
```css
/* Specific use case colors */
#e3b2b3                                  /* Primary accent (rose) */
#99797d                                  /* Muted text */
#786065                                  /* Subtle accents */
#6a565b                                  /* Borders */
#3a3138                                  /* Darker borders */
#2f2f41                                  /* Card borders */
```

#### Workflow/Feature Colors
```css
--notebooks-color: #5CB198;              /* Teal/Jade */
--apps-color: #CDA849;                   /* Gold/Amber */
--self-serve-color: #A477B2;             /* Purple */
--trusted-context-color: #CDA849;        /* Gold/Amber */
```

### Pink Theme Variant
```css
[data-theme='pink'] {
  /* Adjusted color values for pink theme */
  --fg100: adjusted values...
  --grid200: #27262f;
  --grid300: #2e2e40;
  /* ... additional pink theme overrides */
}
```

### Color Usage Guidelines

1. **Text Hierarchy**:
   - `--fgLoud` (#ffffff): Headings (h1-h4)
   - `--fg1200` (#f5c0c0): Body text, primary content
   - `--fg1100`: Secondary text
   - `#99797d`: Muted/disabled text

2. **Backgrounds**:
   - `#14141C`: Main page background
   - `#0f0f15`: Card/component background
   - `#0d0d13`: Nested/inset backgrounds

3. **Borders & Dividers**:
   - `--grid500`: Primary dividers
   - `#2f2f41`: Card borders
   - `#3a3138`: Subtle borders
   - Dashed borders use `rgba(245, 192, 192, 0.15)`

4. **Interactive States**:
   - Hover: `--fgA500` background
   - Active: `--fgA700` background
   - Focus: 2px solid `--fgA900` outline

---

## Typography

### Font Families

The project uses three primary font families:

```css
/* Sans-serif for headings */
--font-heading: PP Formula SemiExtended, PP Formula, ui-sans-serif,
                system-ui, sans-serif;

/* Sans-serif for body text */
--font-body: Cinetype, ui-sans-serif, system-ui, sans-serif,
             "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
             "Noto Color Emoji";

/* Monospace for code/technical content */
--font-mono: Cinetype Mono, IBM Plex Mono, ui-monospace, SFMono-Regular,
             Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
             monospace;
```

### Type Scale & Hierarchy

#### Headings

```css
/* Heading 0 - Hero/Display */
.heading-0 {
  font-family: PP Formula SemiExtended;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.025em;
  font-size: clamp(2.625rem, 1.5rem + 4vw, 4.625rem); /* 42px - 74px */
}

/* Heading 1 - Page Title */
.heading-1 {
  font-family: PP Formula SemiExtended;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.0308em;
  font-size: clamp(2.625rem, 1.9922rem + 2.25vw, 3.75rem); /* 42px - 60px */
}

/* Heading 2 - Section Title */
.heading-2 {
  font-family: PP Formula;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.025em;
  font-size: clamp(1.875rem, 1.5234rem + 1.25vw, 2.5rem); /* 30px - 40px */
}

/* Heading 3 - Subsection */
.heading-3 {
  font-family: PP Formula;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.025em;
  font-size: clamp(1.25rem, 0.9688rem + 1vw, 1.75rem); /* 20px - 28px */
}

/* Heading 4 - Component Title */
.heading-4 {
  font-family: PP Formula;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.025em;
  font-size: calc(20rem / 16); /* 20px */
}

/* Heading 5 - Small Title */
.heading-5 {
  font-family: Cinetype;
  font-weight: 600;
  line-height: 1.571;
  letter-spacing: -0.025em;
  font-size: calc(14rem / 16); /* 14px */
}

/* Heading 6 - Eyebrow/Label */
.heading-6 {
  font-family: IBM Plex Mono;
  font-weight: 700;
  line-height: 1.571;
  letter-spacing: 0.214em;
  font-size: clamp(0.75rem, 0.9453rem + -0.25vw, 0.875rem); /* 12px - 14px */
  text-transform: uppercase;
}
```

#### Body Text

```css
/* Extra Large */
.text-xl {
  font-size: clamp(1.25rem, 1.1094rem + 0.5vw, 1.5rem); /* 20px - 24px */
  line-height: 1.5;
  font-weight: 300;
}

/* Large */
.text-l {
  font-size: calc(20rem / 16); /* 20px */
  line-height: 1.5;
  font-weight: 300;
}

/* Medium */
.text-m {
  font-size: 1rem; /* 16px */
  line-height: 1.5;
  font-weight: 400;
}

/* Base (default body) */
.text-base {
  font-size: calc(14rem / 16); /* 14px */
  line-height: 1.571;
  font-weight: 400;
}

/* Small */
.text-s {
  font-size: calc(12rem / 16); /* 12px */
  line-height: 1.5;
  font-weight: 400;
}
```

#### Monospace/Technical Text

```css
/* Monospace body */
.mono {
  font-family: Cinetype Mono;
  font-weight: 400;
}

/* Annotation/Label */
.annotation {
  font-family: Cinetype Mono;
  font-weight: 400;
  font-size: calc(12rem / 16); /* 12px */
  letter-spacing: 0.0833em;
  line-height: 1.571;
  text-transform: uppercase;
}
```

### Font Weight Scale

- **300**: Light - Used for large display text and subheadings
- **400**: Regular - Default body text weight
- **600**: Semi-bold - Used for emphasis and smaller headings (h4, h5)
- **700**: Bold - Used for primary headings and emphasis
- **800**: Extra-bold - Used for major section headings (h2, h3)

### Typography Usage Guidelines

1. **Heading Colors**:
   ```css
   h1, h2, h3, h4 { color: var(--fgLoud); }  /* White */
   h5, h6 { color: var(--fg1100); }           /* Slightly muted */
   ```

2. **Body Text**:
   ```css
   body {
     color: var(--fg1200);                    /* Primary text color */
     font-family: Cinetype;
   }
   ```

3. **Text Selection**:
   ```css
   *::selection {
     background: var(--fgA700);
   }
   ```

4. **Link Styling**:
   ```css
   a {
     color: var(--fg1200);
     text-decoration: none;
     border-bottom: 1px solid var(--fg1200);
     background-color: transparent;
     transition: background-color linear 0.1s;
   }

   a:hover {
     background-color: var(--fgA500);
   }

   a:active {
     background-color: var(--fgA700);
   }
   ```

5. **Fluid Typography**:
   - All text sizes use `clamp()` for smooth responsive scaling
   - Minimum size prevents text from becoming too small
   - Maximum size prevents text from becoming too large
   - Formula: `clamp(min, preferred, max)`

---

## Spacing System

### Core Spacing Values

The project uses a flexible spacing system based on `clamp()` for responsive design:

```css
/* Common spacing patterns */
--spacing-xs: clamp(8px, 4.625px + 0.75vw, 14px);
--spacing-sm: clamp(12px, 0.75px + 2.5vw, 32px);
--spacing-md: clamp(24px, 10.5px + 3vw, 48px);
--spacing-lg: clamp(56px, 42.5px + 3vw, 80px);

/* Fixed spacing (use sparingly) */
--spacing-4: 4px;
--spacing-8: 8px;
--spacing-12: 12px;
--spacing-16: 16px;
--spacing-20: 20px;
--spacing-24: 24px;
--spacing-32: 32px;
--spacing-40: 40px;
--spacing-48: 48px;
--spacing-64: 64px;
--spacing-80: 80px;
--spacing-128: 128px;
```

### Padding Patterns

```css
/* Component padding (cards, sections) */
padding: clamp(12px, 0.75px + 2.5vw, 32px);

/* Compact padding */
padding: clamp(8px, 4.625px + 0.75vw, 14px);

/* Generous padding */
padding: clamp(24px, 10.5px + 3vw, 48px);

/* Hero/Section vertical padding */
padding-top: 128px;
padding-bottom: clamp(56px, 42.5px + 3vw, 80px);

/* Button padding */
padding: clamp(8px, 4.625px + 0.75vw, 14px)
         clamp(18px, 15.75px + 0.5vw, 22px);
```

### Margin Patterns

```css
/* Vertical rhythm */
margin-bottom: 8px;   /* Tight spacing */
margin-bottom: 12px;  /* Default spacing */
margin-bottom: 16px;  /* Medium spacing */
margin-bottom: 24px;  /* Loose spacing */

/* Section margins */
margin-top: 128px;    /* Large section spacing */
margin-bottom: 80px;  /* Section bottom */
```

### Gap (Flexbox/Grid)

```css
gap: 8px;    /* Tight grid */
gap: 14px;   /* Default grid */
gap: 16px;   /* Comfortable spacing */
gap: 20px;   /* Loose spacing */
gap: 24px;   /* Section spacing */
gap: 64px;   /* Hero spacing */
```

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 450px) { }

/* Tablet */
@media (max-width: 600px) { }
@media (max-width: 800px) { }

/* Desktop */
@media (max-width: 1000px) { }
@media (max-width: 1250px) { }
```

### Spacing Usage Guidelines

1. **Consistent Rhythm**: Use multiples of 4px for fixed spacing (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 128)

2. **Responsive Padding**: Use `clamp()` for all component padding that needs to scale

3. **Vertical Spacing**:
   - Small components: 8-16px
   - Medium components: 24-32px
   - Large sections: 64-128px

4. **Gap over Margin**: Prefer `gap` property in flex/grid layouts for cleaner spacing

---

## Component Styles

### Buttons

#### Primary Button (CTA)
```css
.primary-button {
  position: relative;
  display: flex;
  align-items: center;
  padding: clamp(8px, 4.625px + 0.75vw, 14px)
           clamp(18px, 15.75px + 0.5vw, 22px);
  gap: 16px;

  /* Typography */
  font-size: clamp(1rem, 0.7797rem + 0.4405vw, 1.25rem);
  font-weight: 400;
  font-family: inherit;
  letter-spacing: 0.25px;
  color: #e3b2b3;
  white-space: nowrap;

  /* Styling */
  border: 0;
  border-radius: 1px;
  background: linear-gradient(to right, #14141C, #14141C),
              linear-gradient(45deg, #f5c0c0, #ad8eb6);
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  border: 1px solid transparent;

  /* Effects */
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16);
  box-shadow: 0 4px 8px -1px rgba(0 0 0 / 0.64);
  user-select: none;
  cursor: pointer;

  /* Transitions */
  transition: opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.primary-button::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 1;
  border: 1px solid transparent;
  opacity: 0.2;
  background: linear-gradient(45deg,
              rgba(245, 192, 192, 0.85),
              rgba(173, 142, 182, 0.5));
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  transition: opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.primary-button:hover::after {
  opacity: 0.3;
}

.primary-button:active::after {
  opacity: 0.6;
}
```

#### Secondary Button
```css
.secondary-button {
  position: relative;
  display: flex;
  align-items: center;
  padding: clamp(8px, 4.625px + 0.75vw, 14px)
           clamp(18px, 15.75px + 0.5vw, 22px);
  gap: 16px;

  /* Typography */
  font-size: clamp(1rem, 0.7797rem + 0.4405vw, 1.25rem);
  font-weight: 400;
  font-family: inherit;
  letter-spacing: 0.25px;
  color: #e3b2b3;
  white-space: nowrap;

  /* Styling */
  border: 1px dashed #99797d;
  border-radius: 1px;
  background: #0f0f15;

  /* Effects */
  box-shadow: 0 4px 8px -1px rgba(0 0 0 / 0.64),
              0 1px 4px 0 rgba(245, 192, 192, 0.056);
  user-select: none;
  cursor: pointer;

  /* Transitions */
  transition: filter 0.3s;
}

.secondary-button::after {
  content: '';
  position: absolute;
  border-radius: inherit;
  inset: 0;
  pointer-events: none;
  background-image: url('/images/bkg-noise.webp');
  background-size: 200px 200px;
  mix-blend-mode: normal;
  opacity: 0.0625;
}

.secondary-button:hover {
  filter: brightness(1.13);
}
```

### Cards

#### Basic Card
```css
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #0f0f15;
  border: 1px solid rgba(92, 177, 152, 0.2);
  padding: clamp(24px, 10.5px + 3vw, 48px);

  /* Shadow */
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2),
              4px 6px 8px rgba(0, 0, 0, 0.17),
              10px 14px 10px rgba(0, 0, 0, 0.1),
              18px 25px 12px rgba(0, 0, 0, 0.03),
              28px 39px 13px rgba(0, 0, 0, 0);

  /* Hover effects */
  transition: transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1),
              border 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url('/images/bkg-noise.webp');
  background-size: 200px 200px;
  mix-blend-mode: normal;
  opacity: 0.0625;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-4px);
  border: 1px solid rgba(92, 177, 152, 0.32);
}
```

#### Glass/Gradient Card
```css
.glass-card {
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 8px;

  /* Glass effect background */
  --gradient-x: 66.66%;
  --gradient-y: 50%;
  background-image: radial-gradient(
    circle at var(--gradient-x) var(--gradient-y),
    rgba(26, 26, 37, 0.5) 0%,
    rgba(15, 15, 21, 0.5) 80%
  );

  /* Shadow stack */
  box-shadow: 0 0 24px 0px #111118 inset,
              0 0.5px 0px 0.75px #2f2f41,
              6px 37px 10px 0px rgba(0, 0, 0, 0.01),
              4px 24px 10px 0px rgba(0, 0, 0, 0.04),
              2px 13px 8px 0px rgba(0, 0, 0, 0.14),
              1px 6px 6px 0px rgba(0, 0, 0, 0.24),
              0px 1px 3px 0px rgba(0, 0, 0, 0.27);
}
```

### Navigation

#### Desktop Nav
```css
.nav-item {
  position: relative;
  border: 0;
  background: none;
  color: var(--fgLoud);
  font-size: calc(14rem / 16);
  line-height: 1;
  font-weight: 400;
  display: flex;
  align-items: center;
  white-space: nowrap;
  border-radius: calc(1rem / 16);
  padding: 0.6rem 0.85rem;
  transition: background-color 0.2s ease;
  font-family: Cinetype;
}

.nav-item:hover,
.nav-item:focus-visible {
  background-color: var(--fgA500);
}
```

#### Mobile Hamburger
```css
.hamburger-button {
  --y: 0.175rem;
  --r: 0deg;
  position: relative;
  display: grid;
  width: 2.5rem;
  aspect-ratio: 1/1;
  margin: auto 0.5rem auto auto;
  background: transparent;
  border: none;
  border-radius: 999px;
  place-items: center;
  padding: 0;
}

.hamburger-button::after,
.hamburger-button::before {
  content: '';
  height: 1px;
  width: 50%;
  background-color: #e3b2b3;
  grid-area: 1/-1;
  transform-origin: 50% 50%;
}

.hamburger-button::before {
  transform: translateY(var(--y)) rotate(var(--r));
}

.hamburger-button::after {
  transform: translateY(calc(-1 * var(--y))) rotate(calc(-1 * var(--r)));
}
```

### Forms & Inputs

```css
.input-field {
  padding: 14px 20px;
  background-color: #0f0f15;
  color: #ffffff;
  border: 1px dashed #99797d;
  border-radius: 1px;
  font-family: inherit;
  font-size: calc(14rem / 16);
}

.input-field::placeholder {
  color: #99797d;
}

.input-field:focus {
  outline: var(--app-focus-outline);
  outline-offset: var(--app-focus-outline-offset);
  border-color: #e3b2b3;
}
```

### Tooltips

```css
.tooltip {
  pointer-events: all !important;
  background: #14141C !important;
  padding: 8px 10px !important;
  box-shadow: none !important;
  border-radius: 3px !important;
  z-index: 99999999999 !important;
  max-width: 215px !important;
  color: #ffffff !important;
  font-size: 14px !important;
  line-height: 20px !important;
  border: 1px solid rgba(245, 192, 192, 0.3) !important;
  box-shadow: 0 4px 4px rgba(1, 1, 27, 0.25),
              0 0 54px #01011b,
              0 0 50px rgba(245, 192, 192, 0.25) !important;
}
```

---

## Shadows & Elevation

The project uses a sophisticated shadow system to create depth and hierarchy.

### Shadow Levels

#### Level 1 - Subtle Lift
```css
box-shadow: 0 2px 3px 0px rgba(0 0 0 / 0.12),
            0 4px 12px -2px rgba(0 0 0 / 0.8);
```

#### Level 2 - Card Default
```css
box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2),
            4px 6px 8px rgba(0, 0, 0, 0.17),
            10px 14px 10px rgba(0, 0, 0, 0.1),
            18px 25px 12px rgba(0, 0, 0, 0.03),
            28px 39px 13px rgba(0, 0, 0, 0);
```

#### Level 3 - Elevated Component
```css
box-shadow: 0 0 24px 0px #111118 inset,
            0 0.5px 0px 0.75px #2f2f41,
            6px 37px 10px 0px rgba(0, 0, 0, 0.01),
            4px 24px 10px 0px rgba(0, 0, 0, 0.04),
            2px 13px 8px 0px rgba(0, 0, 0, 0.14),
            1px 6px 6px 0px rgba(0, 0, 0, 0.24),
            0px 1px 3px 0px rgba(0, 0, 0, 0.27);
```

#### Level 4 - Modal/Overlay
```css
box-shadow: 0px 0.5px 0 0.75px #2f2f41,
            4px 16px 32px -12px hsla(0 0% 0% / 0.72);
```

#### Level 5 - Dramatic (Hero Elements)
```css
box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.64),
            0px 1px 1px rgba(0, 0, 0, 0.56),
            0px 2px 1px rgba(0, 0, 0, 0.48),
            0px 4px 2px rgba(0, 0, 0, 0.32),
            0px 6px 2px rgba(0, 0, 0, 0.16);
```

### Inset Shadows

```css
/* Subtle inset */
box-shadow: inset 0 0 0 1px hsla(0 0% 100% / 0.05),
            inset 0 1px 1px -1px hsla(0 0% 100% / 0.05);

/* Deep inset */
box-shadow: 0 0 24px 0px #111118 inset;
```

### Border + Shadow Combo

```css
/* Card with border glow */
box-shadow: 0 0 0 1px rgba(245, 192, 192, 0.3),
            0px 4px 50px 0px rgba(0, 0, 0, 0.52);
```

### Text Shadows

```css
text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16);
```

### Glow Effects

```css
/* Pink theme glow */
[data-theme='pink'] {
  box-shadow: 0 0 54px #01011b,
              0 0 50px rgba(245, 192, 192, 0.25);
}
```

### Usage Guidelines

1. **Hierarchy**: Higher elevation = more shadow layers
2. **Consistency**: Use predefined shadow levels, don't create custom shadows
3. **Context**:
   - Cards: Level 2
   - Modals/Dropdowns: Level 4
   - Hero elements: Level 5
4. **Performance**: Avoid excessive shadow blur radius
5. **Dark Theme**: Use darker, more subtle shadows than light themes would require

---

## Animations & Transitions

### Custom Timing Functions

```css
/* Standard easing */
--ease-in-out: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);

/* Spring animation */
--spring-easing: linear(
  0, 0.0007 0.36%, 0.0058 1.08%, 0.0217, 0.0454 3.23%,
  /* ... full spring curve ... */
  0.9997 100%
);
--spring-duration: 0.747s;

/* Hover transitions */
--hover-transition-duration: 529.33ms;
--hover-transition-timing-function: linear(
  0 0%, 0.005892 1%, 0.022227 2%, /* ... */ 0.999989 80%
);
```

### Keyframe Animations

#### Hero Fade In
```css
@keyframes hero-fade-in {
  from {
    opacity: 0.0001;
    transform: translateY(var(--y, 32px));
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.hero-fade-in {
  animation: var(--spring-duration) var(--spring-easing) 0.2s hero-fade-in;
  animation-fill-mode: both;
}
```

#### Ticker/Marquee
```css
@keyframes ticker {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(calc(-100% / 5));
  }
}

.ticker-animation {
  animation: 42s ticker linear infinite;
}

.ticker-animation:has(a:hover, a:focus-visible) {
  animation-play-state: paused;
}
```

#### Rotate
```css
@keyframes rotate {
  from {
    transform: rotate(-360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.rotating-element {
  animation: rotate 7s linear infinite;
}
```

#### Noise Texture Animation
```css
@keyframes noise {
  from {
    background-position: -512px -512px;
  }
  to {
    background-position: 0px 0px;
  }
}

.animated-noise {
  background-image: url(/images/home-2025/textures/noise-rose-128x128.png);
  background-size: 512px 512px;
  animation: noise 8s linear infinite;
  animation-play-state: paused;
}

.card:hover .animated-noise {
  animation-play-state: running;
  opacity: 0.24;
}
```

#### Translate Noise (Vertical)
```css
@keyframes translate-noise {
  from {
    background-position: 50% 0px;
  }
  to {
    background-position: 50% 256px;
  }
}
```

### Common Transitions

```css
/* Default transition */
transition: all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);

/* Background color */
transition: background-color 0.2s ease;

/* Transform + opacity */
transition: transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1),
            opacity 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);

/* Multi-property */
transition: transform 529.33ms var(--hover-transition-timing-function),
            border 529.33ms var(--hover-transition-timing-function);
```

### Hover Effects

#### Card Lift
```css
.card {
  transition: transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.card:hover {
  transform: translateY(-4px);
}
```

#### Scale
```css
.scalable {
  transition: transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.scalable:hover {
  transform: scale(1.02);
}
```

#### Opacity Fade
```css
.fade-element {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.container:hover .fade-element {
  opacity: 1;
}
```

### Animation Guidelines

1. **Performance**: Prefer `transform` and `opacity` for animations
2. **Smooth Motion**: Use cubic-bezier or spring easing for natural feel
3. **Duration**:
   - Quick interactions: 150-250ms
   - Standard: 250-400ms
   - Dramatic: 400-750ms
4. **Pause on Interaction**: Pause animations when user hovers (accessibility)
5. **Reduced Motion**: Consider users with motion sensitivity

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Border Radius

### Radius Scale

```css
/* Subtle (almost sharp) */
border-radius: 1px;         /* Buttons, inputs */

/* Small */
border-radius: 3px;         /* Small cards, tooltips */

/* Medium */
border-radius: 4px;         /* Default cards, images */
border-radius: 6px;         /* Inner card elements */

/* Large */
border-radius: 8px;         /* Major components */
border-radius: 12px;        /* Hero cards */

/* Pill/Circular */
border-radius: 999px;       /* Badges, avatars, pills */
```

### Usage Examples

```css
/* Primary button - subtle rounding */
.primary-button {
  border-radius: 1px;
}

/* Card - medium rounding */
.card {
  border-radius: 8px;
}

/* Avatar - fully circular */
.avatar {
  border-radius: 999px;
  aspect-ratio: 1/1;
}

/* Dropdown menu - small rounding */
.dropdown-menu {
  border-radius: calc(5rem / 16); /* ~5px */
}

/* Video container - matched corners */
.video-wrapper {
  border-radius: 8px;
}

.video-wrapper video {
  border-radius: 8px; /* Match parent */
}
```

### Compound Radius (Specific Corners)

```css
/* Top corners only */
border-top-left-radius: 4px;
border-top-right-radius: 4px;

/* Bottom corners only */
border-bottom-left-radius: 4px;
border-bottom-right-radius: 4px;

/* Single corner */
.tab {
  border-top-left-radius: 4px;
}

.tab:last-child {
  border-top-right-radius: 4px;
}
```

### Guidelines

1. **Consistency**: Use the predefined scale
2. **Nested Elements**: Inner radius should be slightly less than outer
3. **Sharp UI**: Very subtle radii (1-3px) create technical aesthetic
4. **Smooth UI**: Larger radii (8-12px) feel more friendly
5. **Circular Elements**: Always use `999px` or `50%` for perfect circles

---

## Opacity & Transparency

### Alpha/Opacity Scale

```css
/* Ultra subtle */
opacity: 0.0625;       /* 1/16 - Texture overlays */

/* Very subtle */
opacity: 0.1;          /* Background effects */
opacity: 0.15;         /* Grid lines */
opacity: 0.2;          /* Disabled state */

/* Subtle */
opacity: 0.24;         /* Animated noise on hover */
opacity: 0.3;          /* Secondary borders */

/* Moderate */
opacity: 0.4;          /* Muted icons */
opacity: 0.5;          /* Disabled text */

/* Visible */
opacity: 0.6;
opacity: 0.7;          /* Secondary content */

/* Prominent */
opacity: 0.8;
opacity: 0.9;          /* Near-full opacity */
opacity: 0.98;         /* Radial gradient backgrounds */

/* Full */
opacity: 1;            /* Default state */
```

### RGBA Usage

```css
/* Text colors with alpha */
color: rgba(245, 192, 192, 0.923);    /* Body text */
color: rgba(245, 192, 192, 0.8);      /* Muted text */
color: rgba(245, 192, 192, 0.592);    /* Very muted */

/* Background overlays */
background: rgba(26, 26, 35, 0.7);    /* Glass effect */
background: rgba(15, 15, 21, 0.5);    /* Subtle overlay */
background: rgba(245, 192, 192, 0.056); /* Tint */

/* Border transparency */
border: 1px solid rgba(245, 192, 192, 0.15);  /* Grid lines */
border: 1px solid rgba(245, 192, 192, 0.3);   /* Prominent borders */
border: 1px solid rgba(92, 177, 152, 0.2);    /* Jade accent */
```

### Transparency Patterns

#### Gradient Overlays
```css
/* Radial fade */
background-image: radial-gradient(
  circle at 50% 50%,
  rgba(245, 192, 192, 0.077) 50%,
  rgba(245, 192, 192, 0.172)
);

/* Linear fade */
background-image: linear-gradient(
  to right,
  rgba(245, 192, 192, 0),
  rgba(245, 192, 192, 0.592) calc(50% - 3px),
  rgba(245, 192, 192, 0.592) calc(50% + 3px),
  rgba(245, 192, 192, 0)
);
```

#### Glass Morphism
```css
.glass-card {
  background: rgba(26, 26, 35, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(245, 192, 192, 0.1);
}
```

#### Texture Overlays
```css
.textured-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/bkg-noise.webp');
  background-size: 200px 200px;
  mix-blend-mode: normal;
  opacity: 0.0625;
  pointer-events: none;
}
```

### Hover State Opacity

```css
/* Icon/Element fade in */
.hidden-icon {
  opacity: 0;
  transition: opacity 0.25s;
}

.card:hover .hidden-icon {
  opacity: 1;
}

/* Noise texture reveal */
.noise-texture {
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover .noise-texture {
  opacity: 0.24;
}
```

### Guidelines

1. **Texture Overlays**: Always use `0.0625` for noise textures
2. **Glass Effects**: Combine `rgba()` backgrounds with subtle opacity
3. **Hover States**: Reveal hidden elements by transitioning from `0` to `1`
4. **Disabled States**: Use `0.4-0.5` opacity for disabled elements
5. **Layering**: Use transparency to create depth without heavy shadows

---

## Grid System

### Base Grid Structure

The project uses a sophisticated 12-column grid system with CSS Grid:

```css
/* Main grid container */
.grid-container {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    repeat(12, minmax(0, calc((1240px - 48px) / 12)))
    minmax(0, 1fr);
  column-gap: 4px;
}
```

### Column Spans

```css
/* Full width (including gutters) */
grid-column: 1 / -1;

/* Content width (exclude gutters) */
grid-column: 2 / -2;

/* Half width */
grid-column: span 6;

/* Third width */
grid-column: span 4;

/* Two-thirds */
grid-column: span 8;
```

### Subgrid Pattern

```css
.subgrid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
}
```

### Responsive Grid

```css
/* Desktop (12 columns) */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 32px;
}

/* Tablet (6 columns) */
@media (max-width: 1000px) {
  .responsive-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 24px;
  }
}

/* Mobile (1 column) */
@media (max-width: 600px) {
  .responsive-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

### Visual Grid Lines

```css
/* Cartesian grid pattern */
.grid-background {
  background-image:
    linear-gradient(to right, rgba(245, 192, 192, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(245, 192, 192, 0.15) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* Dot grid pattern */
.dot-grid {
  mask-image: radial-gradient(
    white,
    white 1px,
    transparent 1px,
    transparent
  );
  mask-size: 6px 6px;
}
```

### Grid Usage Patterns

#### Two Column Layout
```css
.two-column {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(8px, 4.625px + 0.75vw, 14px);
}

@media (max-width: 1000px) {
  .two-column {
    grid-template-columns: 1fr;
  }
}
```

#### Asymmetric Layout
```css
.asymmetric-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 64px;
}

@media (max-width: 800px) {
  .asymmetric-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Bento Box Layout
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 14px;
}
```

### Grid Accents

```css
/* Corner accents */
.grid-accent-tl {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 11px;
  height: 11px;
  border-top: 1px solid #f5c0c0;
  border-left: 1px solid #f5c0c0;
}

/* Vertical grid line */
.vertical-grid-line {
  width: 0;
  border-left: 1px dashed rgba(245, 192, 192, 0.15);
}
```

### Guidelines

1. **Consistent Gutters**: Use 4px for tight layouts, 32px for spacious
2. **Subgrid**: Use for nested grids that need to align with parent
3. **Max Width**: Content max-width of 1240px
4. **Responsive**: Always provide mobile breakpoints
5. **Visual Grids**: Use for decorative purposes only, not layout

---

## Textures & Effects

### Noise Textures

#### Standard Noise Overlay
```css
.noise-overlay {
  position: relative;
}

.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/bkg-noise.webp');
  background-size: 200px 200px;
  mix-blend-mode: normal;
  opacity: 0.0625;
  pointer-events: none;
}
```

#### Colored Noise (Rose)
```css
.rose-noise {
  background-image: url(/images/home-2025/textures/noise-rose-128x128.png);
  background-size: 512px 512px;
  opacity: 0.24;
}
```

#### Colored Noise (Jade)
```css
.jade-noise {
  background-image: url(/images/home-2025/textures/noise-jade-128x128.png);
  background-size: 512px 512px;
  opacity: 0.24;
}
```

### Paper Texture

```css
.paper-texture {
  --texture-paper-img: url('/images/textures/paper-texture.png');
  --texture-paper-size: 128px;
  --texture-paper-opacity: 0.08;
  --texture-paper-mixBlendMode: multiply;
}

.paper-texture::after {
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  background-image: var(--texture-paper-img);
  background-repeat: repeat;
  background-size: var(--texture-paper-size);
  mix-blend-mode: var(--texture-paper-mixBlendMode);
  opacity: var(--texture-paper-opacity);
  pointer-events: none;
}
```

### Hatched Pattern

```css
.hatched-pattern {
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0px,
    transparent calc(var(--hatch-size, 6px) - 1px),
    var(--hatch-color, rgba(236, 74, 74, 0.077)) calc(var(--hatch-size, 6px) - 1px),
    var(--hatch-color, rgba(236, 74, 74, 0.077)) var(--hatch-size, 6px)
  );
}
```

### Gradient Effects

#### Radial Spotlight
```css
.radial-spotlight {
  background-image: radial-gradient(
    circle at 66.66% 50%,
    rgba(26, 26, 37, 0.5) 0%,
    rgba(15, 15, 21, 0.5) 80%
  );
}
```

#### Linear Gradient Background
```css
.gradient-bg {
  background-image: linear-gradient(
    55deg,
    #ffffff 20%,
    rgba(245, 192, 192, 0.8) 100%
  );
}
```

#### Border Gradient
```css
.gradient-border {
  border: 1px solid transparent;
  background:
    linear-gradient(to right, #14141C, #14141C),
    linear-gradient(45deg, #f5c0c0, #ad8eb6);
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
}
```

### Mask Effects

#### Feather Edge Mask
```css
.feather-edge {
  mask-image: linear-gradient(
    to bottom,
    rgba(255 255 255 / 0) 10%,
    white var(--fall-off, 16px),
    white calc(100% - var(--fall-off)),
    rgba(255 255 255 / 0)
  );
}
```

#### Radial Fade Mask
```css
.radial-fade {
  mask-image: radial-gradient(
    white,
    white 1px,
    transparent 1px,
    transparent
  );
  mask-size: 6px 6px;
}
```

### Blend Modes

```css
/* Multiply for darkening */
mix-blend-mode: multiply;

/* Screen for lightening */
mix-blend-mode: screen;

/* Overlay for combined effect */
mix-blend-mode: overlay;

/* Normal (default) */
mix-blend-mode: normal;
```

### Guidelines

1. **Noise Opacity**: Always use `0.0625` for subtle texture
2. **Performance**: Use CSS backgrounds when possible, images sparingly
3. **Layering**: Apply textures as pseudo-elements (::after)
4. **Pointer Events**: Set `pointer-events: none` on overlay textures
5. **Consistency**: Use the same noise texture across similar components

---

## Common Tailwind CSS Usage

While this project primarily uses CSS-in-JS, here are Tailwind-equivalent patterns:

### Utility Classes Defined

```css
/* Text sizes */
.text-s { /* 12px */ }
.text-base { /* 14px */ }
.text-m { /* 16px */ }
.text-l { /* 20px */ }
.text-xl { /* 20-24px fluid */ }

/* Text styles */
.mono { font-family: Cinetype Mono; }
.annotation { /* uppercase mono 12px */ }

/* Headings */
.heading-0 { /* Display heading */ }
.heading-1 { /* Page title */ }
.heading-2 { /* Section title */ }
.heading-3 { /* Subsection */ }
.heading-4 { /* Component title */ }
.heading-5 { /* Small title */ }
.heading-6 { /* Label */ }

/* Animation */
.hero-fade-in { /* Spring fade-in animation */ }
```

### CSS Variable Patterns

```css
/* Using CSS variables like Tailwind utilities */

/* Colors */
color: var(--fg1200);         /* Primary text */
color: var(--fgLoud);          /* High emphasis */
background: var(--bg100);      /* Primary bg */

/* Spacing */
padding: var(--spacing-sm);
margin: var(--spacing-md);
gap: var(--spacing-xs);

/* Layout */
grid-column: 2/-2;             /* Content width */
grid-column: span 6;           /* Half width */

/* Effects */
border-radius: var(--radius-sm);
box-shadow: var(--shadow-card);
```

### Responsive Patterns

```css
/* Mobile-first approach */
.responsive-component {
  padding: 16px;
}

@media (min-width: 600px) {
  .responsive-component {
    padding: 32px;
  }
}

@media (min-width: 1000px) {
  .responsive-component {
    padding: 48px;
  }
}
```

### Component Composition

```css
/* Button base + variant pattern */
.btn-base {
  padding: clamp(8px, 4.625px + 0.75vw, 14px)
           clamp(18px, 15.75px + 0.5vw, 22px);
  border-radius: 1px;
  font-weight: 400;
  transition: all 0.25s ease;
}

.btn-primary {
  /* extends btn-base */
  background: linear-gradient(45deg, #f5c0c0, #ad8eb6);
  color: #e3b2b3;
}

.btn-secondary {
  /* extends btn-base */
  border: 1px dashed #99797d;
  background: #0f0f15;
}
```

---

## Example Component Reference

### Complete Hero Section

```html
<section class="hero-section">
  <div class="hero-content">
    <div class="hero-text">
      <h1 class="heading-0 hero-fade-in">
        Build the data platform your team deserves
      </h1>
      <p class="text-xl hero-fade-in" style="animation-delay: 0.1s;">
        Fast, collaborative analytics with the simplicity of DuckDB
        and the scalability of the cloud.
      </p>
    </div>

    <div class="hero-actions hero-fade-in" style="animation-delay: 0.2s;">
      <button class="primary-button">
        Get Started
        <div class="button-icon-wrapper">
          <svg><!-- arrow icon --></svg>
        </div>
      </button>

      <button class="secondary-button">
        View Documentation
      </button>
    </div>
  </div>

  <div class="hero-visual">
    <div class="video-card">
      <video autoplay loop muted playsinline>
        <source src="hero-demo.mp4" type="video/mp4">
      </video>
      <div class="noise-overlay"></div>
    </div>
  </div>
</section>
```

```css
.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: 0 clamp(12px, 0.75px + 2.5vw, 32px);
  padding-top: 224px;
  padding-bottom: 128px;
  overflow-x: clip;
}

@media (max-width: 1000px) {
  .hero-section {
    flex-direction: column;
    padding-top: 240px;
    padding-bottom: 80px;
  }
}

.hero-content {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.hero-text {
  grid-row: 1;
  grid-column: 1;
  align-self: center;
  padding: 0 0 40px 0;
}

.hero-text h1 {
  font-size: clamp(2.375rem, 1.6149rem + 2.7027vw, 4.5rem);
  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(
    55deg,
    #ffffff 20%,
    rgba(245, 192, 192, 0.8) 100%
  );
}

.hero-text p {
  text-wrap: balance;
  font-size: clamp(1rem, 0.5595rem + 0.8811vw, 1.5rem);
  max-width: 43ch;
  margin-top: 16px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  height: min-content;
}

.video-card {
  position: relative;
  padding: 16px;
  background-color: #14141c;
  border: 1px solid #2f2f41;
  border-radius: 8px;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2),
              4px 6px 8px rgba(0, 0, 0, 0.17),
              10px 14px 10px rgba(0, 0, 0, 0.1);
  transition: transform 529.33ms var(--hover-transition-timing-function),
              border 529.33ms var(--hover-transition-timing-function);
}

.video-card:hover {
  transform: translateY(-4px);
  border: 1px solid rgba(245, 192, 192, 0.386);
}

.video-card video {
  display: block;
  width: 100%;
  border-radius: 8px;
}
```

### Feature Card Component

```html
<div class="feature-card" data-category="notebooks">
  <div class="feature-card-content">
    <div class="feature-icon">
      <svg><!-- icon --></svg>
    </div>

    <h3 class="heading-3">Interactive Notebooks</h3>

    <p class="text-base">
      Write SQL, Python, and R in collaborative notebooks
      with rich visualizations.
    </p>

    <div class="feature-image">
      <img src="feature-screenshot.png" alt="Notebook interface">
    </div>
  </div>

  <a href="/notebooks" class="feature-link">
    <span>Learn more</span>
    <svg><!-- arrow --></svg>
  </a>

  <div class="animated-noise"></div>
</div>
```

```css
.feature-card {
  --hover-transition-duration: 529.33ms;
  --hover-transition-timing-function: linear(/* ... */);

  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #0f0f15;
  border: 1px solid rgba(92, 177, 152, 0.2);
  padding: clamp(24px, 10.5px + 3vw, 48px);

  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2),
              4px 6px 8px rgba(0, 0, 0, 0.17),
              10px 14px 10px rgba(0, 0, 0, 0.1),
              18px 25px 12px rgba(0, 0, 0, 0.03),
              28px 39px 13px rgba(0, 0, 0, 0);

  transition: transform, border;
  transition-duration: var(--hover-transition-duration);
  transition-timing-function: var(--hover-transition-timing-function);
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url('/images/bkg-noise.webp');
  background-size: 200px 200px;
  mix-blend-mode: normal;
  opacity: 0.0625;
  pointer-events: none;
}

.feature-card[data-category="notebooks"] {
  border-color: #5CB198;
}

.feature-card[data-category="notebooks"] .feature-icon {
  color: #5CB198;
}

.feature-card:hover {
  transform: translateY(-4px);
  border: 1px solid rgba(92, 177, 152, 0.32);
}

.feature-card:hover .animated-noise {
  opacity: 0.24;
  animation-play-state: running;
}

.feature-icon {
  margin-bottom: 16px;
  color: var(--category-color);
}

.feature-card h3 {
  margin-bottom: 12px;
  text-wrap: balance;
}

.feature-image {
  position: relative;
  margin-top: 24px;
  border: 1px solid #2e2e40;
  border-radius: 6px;
  overflow: hidden;
}

.feature-link {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
  color: var(--fg1200);
  font-size: calc(14rem / 16);
  border-bottom: none;
  transition: color 0.2s ease;
}

.feature-link:hover {
  color: var(--fgLoud);
  background: transparent;
}

.animated-noise {
  position: absolute;
  inset: 0;
  background-image: url(/images/home-2025/textures/noise-jade-128x128.png);
  background-size: 512px 512px;
  animation: noise 8s linear infinite;
  animation-play-state: paused;
  opacity: 0;
  transition: opacity;
  transition-duration: var(--hover-transition-duration);
  transition-timing-function: var(--hover-transition-timing-function);
}
```

### Navigation Component

```html
<nav class="main-nav">
  <div class="nav-container">
    <div class="nav-left">
      <a href="/" class="logo-link">
        <svg class="logo"><!-- logo --></svg>
      </a>
    </div>

    <div class="nav-center">
      <ul class="nav-menu">
        <li>
          <button class="nav-item" data-dropdown="products">
            Products
            <svg class="chevron"><!-- chevron --></svg>
          </button>
        </li>
        <li>
          <a href="/docs" class="nav-item">Documentation</a>
        </li>
        <li>
          <a href="/pricing" class="nav-item">Pricing</a>
        </li>
      </ul>
    </div>

    <div class="nav-right">
      <a href="/login" class="nav-link">Log In</a>
      <button class="primary-button">Sign Up</button>
    </div>

    <button class="mobile-menu-button">
      <span class="sr-only">Menu</span>
    </button>
  </div>

  <div class="nav-border"></div>
</nav>
```

```css
.main-nav {
  position: relative;
  isolation: isolate;
}

.nav-container {
  position: relative;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr max-content 1fr;
  padding: 0.75rem 0;
}

.nav-left {
  grid-column: 1/span 1;
  display: flex;
  justify-content: flex-end;
  padding-right: 2.25rem;
}

.nav-center {
  grid-column: 2/span 1;
}

.nav-right {
  grid-column: 3/span 1;
  display: flex;
  justify-content: flex-start;
  padding-left: 1.75rem;
  align-items: center;
}

.logo {
  display: block;
  width: 4.25rem;
  will-change: transform;
  color: var(--fgLoud);
}

.nav-menu {
  display: flex;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
  border: 0;
  background: none;
  color: var(--fgLoud);
  font-size: calc(14rem / 16);
  line-height: 1;
  font-weight: 400;
  display: flex;
  align-items: center;
  white-space: nowrap;
  border-radius: calc(1rem / 16);
  padding: 0.6rem 0.85rem;
  transition: background-color 0.2s ease;
  font-family: Cinetype;
  cursor: pointer;
}

.nav-item:hover,
.nav-item:focus-visible {
  background-color: var(--fgA500);
}

.chevron {
  margin-left: 0.35rem;
  color: var(--fg1200);
}

.nav-link {
  position: relative;
  padding: 0.6rem 0.75rem;
  border-bottom: 0;
  font-size: calc(14rem / 16);
  line-height: 1;
  border-radius: calc(1rem / 16);
  font-weight: 400;
  color: var(--fg1200);
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.nav-link:hover,
.nav-link:focus-visible {
  color: var(--fg1200);
  background-color: var(--fgA500);
}

.mobile-menu-button {
  display: none;
  grid-column: 3/span 1;
  width: 2.5rem;
  aspect-ratio: 1/1;
  margin-left: auto;
  margin-right: 0.5rem;
}

@media (max-width: 1000px) {
  .nav-left,
  .nav-right {
    display: none;
  }

  .mobile-menu-button {
    display: grid;
    place-items: center;
  }
}

.nav-border {
  position: absolute;
  inset: auto 0 0 0;
  height: 1px;
  background-color: var(--grid500);
}
```

---

## Best Practices Summary

### Color
- Use CSS variables for all colors
- Maintain contrast ratios for accessibility
- Theme variations should be consistent

### Typography
- Use fluid typography with `clamp()`
- Maintain typographic hierarchy
- Prefer system fonts for performance

### Spacing
- Use consistent spacing scale (multiples of 4px)
- Prefer `gap` over margin in flex/grid
- Use responsive spacing with `clamp()`

### Components
- Build reusable component patterns
- Use pseudo-elements for decorative effects
- Apply noise textures consistently

### Shadows
- Use predefined shadow levels
- Stack shadows for depth
- Combine with borders for definition

### Animations
- Prefer `transform` and `opacity`
- Use custom easing functions
- Consider reduced motion preference

### Borders
- Use subtle border radius (1-8px)
- Combine with shadows for depth
- Use dashed borders for secondary elements

### Performance
- Use `will-change` sparingly
- Avoid animating expensive properties
- Use CSS transforms over position changes
- Optimize images and textures

### Accessibility
- Maintain WCAG contrast ratios
- Provide focus states
- Support reduced motion
- Use semantic HTML

---

## File Structure Reference

```
project/
├── apps/web/
│   ├── motherduck.html          # Main HTML template
│   └── extracted-styles.css     # Complete CSS styles
└── STYLE_GUIDE.md              # This document
```

## Additional Resources

- **CSS Variables**: Defined in `:root` and theme-specific selectors
- **Styled Components**: Prefixed with `sc-` in class names
- **Font Files**: PP Formula, Cinetype, IBM Plex Mono (loaded via @font-face)
- **Image Assets**: `/images/home-2025/textures/` for noise textures

---

*Last Updated: 2025*

*This style guide is a living document. Update it as the design system evolves.*
