# Hex-Style Grid Layout System Guide

This project now includes the Hex design system's layout grid. The grid provides a professional, magazine-style layout with checkered margins and optional cartesian grid effects.

## Quick Start

### Basic Section Structure

```html
<section>
  <div class="layout-subgrid">
    <!-- Left margin with checkered pattern -->
    <div class="checkered-margin"></div>

    <!-- Content area -->
    <div data-content-grid="true" class="layout-subgrid">
      <div class="layout-grid layout-grid-condensed">
        <!-- Your content here -->
      </div>
    </div>

    <!-- Right margin with checkered pattern -->
    <div data-right="true" class="checkered-margin"></div>
  </div>
</section>
```

### React/JSX Pattern

```jsx
<section>
  <div className="layout-subgrid">
    {/* Left checkered margin */}
    <div className="checkered-margin" />

    {/* Content grid */}
    <div data-content-grid className="layout-subgrid">
      <div className="layout-grid layout-grid-condensed">
        {/* Your content */}
        <YourComponent />
      </div>
    </div>

    {/* Right checkered margin */}
    <div data-right className="checkered-margin" />
  </div>
</section>
```

## Grid with Cartesian Background (Hero Style)

For sections like the hero that need the animated grid background:

```jsx
<section>
  <div className="layout-subgrid">
    <div className="checkered-margin" />

    <div data-content-grid className="layout-subgrid">
      <div className="layout-grid layout-grid-condensed">
        {/* Cartesian Grid Background */}
        <div className="unit-grid">
          <div className="unit-grid-mask">
            <div className="radial-gradient" />
          </div>
        </div>

        {/* Content (must have position: relative and z-index) */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Your Hero Title</h1>
          <p>Hero content...</p>
        </div>
      </div>
    </div>

    <div data-right className="checkered-margin" />
  </div>
</section>
```

## CSS Classes Reference

### Layout Grid Classes
- `.layout-grid` - Main grid container with 12-column system
- `.layout-subgrid` - Subgrid that inherits from parent grid
- `.layout-grid-condensed` - Narrower content width for better readability

### Margin & Border Classes
- `.checkered-margin` - Left margin with checkered pattern
- `.checkered-margin[data-right]` - Right margin variant
- `.grid-line` - Vertical grid line separator

### Cartesian Grid Classes (Background Effects)
- `.unit-grid` - Grid pattern overlay
- `.unit-grid-mask` - Gradient mask for smooth fade
- `.radial-gradient` - Radial gradient effect

### Data Attributes
- `data-content-grid` - Marks element as content grid container
- `data-right` - Positions checkered margin on right side
- `data-pile` - Allows elements to stack (grid-row: 1/-1)

## CSS Variables

The grid system uses these CSS variables (defined in :root):

```css
--columns: 12;                           /* Number of grid columns */
--content-width: min(96%, 1840px);       /* Max content width */
--content: repeat(var(--columns), ...);  /* Grid template */

/* Grid Colors */
--grid300: #24242f;  /* Light grid lines */
--grid500: #44445a;  /* Medium borders */
--grid700: #5d5d7a;  /* Stronger borders */
```

## Examples

### Simple Content Section
```jsx
const ContentSection = () => (
  <section className="py-20">
    <div className="layout-subgrid">
      <div className="checkered-margin" />
      <div data-content-grid className="layout-subgrid">
        <div className="layout-grid layout-grid-condensed">
          <h2>Section Title</h2>
          <p>Content goes here...</p>
        </div>
      </div>
      <div data-right className="checkered-margin" />
    </div>
  </section>
);
```

### Hero Section with Grid
```jsx
const Hero = () => (
  <section className="min-h-screen relative">
    <div className="layout-subgrid">
      <div className="checkered-margin" />
      <div data-content-grid className="layout-subgrid">
        <div className="layout-grid layout-grid-condensed">
          {/* Background grid */}
          <div className="unit-grid">
            <div className="unit-grid-mask">
              <div className="radial-gradient" />
            </div>
          </div>

          {/* Hero content */}
          <div className="relative z-10 py-32 text-center">
            <h1 className="text-6xl font-bold mb-6">
              Your Hero Title
            </h1>
            <p className="text-xl mb-8">
              Hero description text
            </p>
          </div>
        </div>
      </div>
      <div data-right className="checkered-margin" />
    </div>
  </section>
);
```

## Browser Support

The grid layout uses modern CSS features:
- CSS Grid with `subgrid` support
- CSS Custom Properties
- CSS `mask-image` for gradient effects

Supported in:
- Chrome 117+
- Firefox 71+
- Safari 16+
- Edge 117+

## Tips

1. **Always wrap content in `position: relative; z-index: 1`** when using the cartesian grid background
2. **Use `layout-grid-condensed`** for better text readability (max-width: 1536px)
3. **Checkered margins are optional** - omit them for full-width sections
4. **Grid colors can be customized** via CSS variables for different themes

## See Also

- `grid-layout-example.html` - Live HTML examples
- `apps/web/style-ref/motherduck.html` - Full Hex design reference
- `apps/web/style-ref/index.html` - Original Hex homepage reference
