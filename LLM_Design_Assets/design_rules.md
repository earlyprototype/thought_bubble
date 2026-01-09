# Design Rules for thought_bubble

**Abrakedabra - your boring documents are now a lovely website with logical flow**

**Comprehensive design guidance for LLMs generating HTML visualizations**

---

## Core Design Philosophy

### 1. Content First
- Visual design should enhance, not distract from content
- Every design choice must serve readability and comprehension
- Form follows function

### 2. Progressive Disclosure
- Show overview → details on demand
- Use navigation to chunk information
- Employ accordions, tabs, and modals for dense content

### 3. Consistency
- Maintain uniform spacing, colors, typography
- Reuse patterns (don't reinvent for each section)
- Establish visual language and stick to it

### 4. Accessibility
- Sufficient color contrast (WCAG AA minimum)
- Semantic HTML with proper heading hierarchy
- Keyboard navigation for all interactive elements
- ARIA labels where appropriate

---

## Visual Hierarchy Rules

### Size Hierarchy
```
h1: 2.5rem (40px)    - Page title only
h2: 2rem (32px)      - Major sections
h3: 1.5rem (24px)    - Subsections
h4: 1.25rem (20px)   - Minor headings
body: 1rem (16px)    - Base text
small: 0.875rem (14px) - Captions, metadata
```

### Weight Hierarchy
```
h1-h3: 700 (bold)
h4: 600 (semi-bold)
body: 400 (regular)
captions: 400 (regular)
```

### Color Hierarchy
```
Primary: Most important actions, key headings
Secondary: Supporting actions, subheadings
Tertiary: Disabled, less important content
Neutral: Backgrounds, borders, body text
```

### Spatial Hierarchy
```
Page margins: 40px (desktop), 20px (mobile)
Section spacing: 30-40px
Card padding: 20-30px
Element margins: 10-20px
Grid gaps: 20px
Line height: 1.6 (body), 1.2 (headings)
```

---

## Color System

### Theme Definitions

#### Professional Theme
```css
Primary: #2c3e50 (dark slate)
Secondary: #3498db (bright blue)
Accent: #e74c3c (red)
Success: #27ae60 (green)
Warning: #f39c12 (orange)
Background: #ffffff (white)
Surface: #f8f9fa (light grey)
Text: #333333 (dark grey)
Text-Secondary: #7f8c8d (medium grey)
Border: #e0e0e0 (light grey)
```

#### Creative Theme
```css
Primary: #667eea (purple)
Secondary: #764ba2 (deep purple)
Accent: #f093fb (pink)
Success: #4facfe (blue)
Warning: #ffd89b (yellow)
Background: #ffffff (white)
Surface: #f5f7fa (off-white)
Text: #2d3748 (charcoal)
Text-Secondary: #718096 (grey)
Border: #e2e8f0 (light grey)
```

#### Technical Theme
```css
Primary: #1a202c (almost black)
Secondary: #00d9ff (cyan)
Accent: #00ff88 (bright green)
Success: #10b981 (green)
Warning: #fbbf24 (amber)
Background: #0f172a (dark blue)
Surface: #1e293b (dark surface)
Text: #f1f5f9 (off-white)
Text-Secondary: #94a3b8 (light grey)
Border: #334155 (dark grey)
```

#### Minimal Theme
```css
Primary: #000000 (black)
Secondary: #4a5568 (grey)
Accent: #3182ce (blue)
Success: #38a169 (green)
Warning: #dd6b20 (orange)
Background: #ffffff (white)
Surface: #fafafa (off-white)
Text: #1a202c (dark)
Text-Secondary: #718096 (grey)
Border: #e2e8f0 (light grey)
```

#### Dark Theme
```css
Primary: #60a5fa (light blue)
Secondary: #818cf8 (indigo)
Accent: #f472b6 (pink)
Success: #34d399 (green)
Warning: #fbbf24 (yellow)
Background: #1a1a1a (near black)
Surface: #2d2d2d (dark grey)
Text: #e5e5e5 (light grey)
Text-Secondary: #a3a3a3 (medium grey)
Border: #404040 (dark border)
```

### Color Usage Rules

1. **Backgrounds**
   - Main background: Use `Background` color
   - Cards/surfaces: Use `Surface` color
   - Alternate rows: 5% darker than surface

2. **Text**
   - Headings: Use `Text` color
   - Body: Use `Text` color
   - Captions/metadata: Use `Text-Secondary` color
   - Links: Use `Secondary` color
   - Links hover: Darken by 10%

3. **Actions**
   - Primary buttons: `Primary` color
   - Secondary buttons: `Secondary` color
   - Danger actions: `Accent` color (red family)
   - Success messages: `Success` color
   - Warnings: `Warning` color

4. **Borders**
   - Default borders: `Border` color
   - Focused elements: `Secondary` color
   - Error states: `Accent` color
   - Dividers: Lighten `Border` by 20%

### Contrast Requirements

**Must pass WCAG AA:**
- Normal text: 4.5:1 minimum contrast ratio
- Large text (18pt+): 3:1 minimum contrast ratio
- Interactive elements: 3:1 minimum contrast ratio

**Test contrast:** Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Typography Rules

### Font Selection

**Primary fonts (in order of preference):**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, Oxygen, Ubuntu, Cantarell, 
             'Helvetica Neue', sans-serif;
```

**Monospace fonts (for code):**
```css
font-family: 'Courier New', Courier, monospace;
```

### Typography Scale

```css
/* Base size: 16px */
--text-xs: 0.75rem;    /* 12px - tiny captions */
--text-sm: 0.875rem;   /* 14px - small text */
--text-base: 1rem;     /* 16px - body text */
--text-lg: 1.125rem;   /* 18px - large body */
--text-xl: 1.25rem;    /* 20px - h4 */
--text-2xl: 1.5rem;    /* 24px - h3 */
--text-3xl: 2rem;      /* 32px - h2 */
--text-4xl: 2.5rem;    /* 40px - h1 */
```

### Line Height

```css
Headings: 1.2
Body text: 1.6
Captions: 1.4
Code blocks: 1.5
```

### Text Formatting Rules

1. **Headings**
   - Use sentence case (not UPPERCASE)
   - Keep concise (under 60 characters)
   - Maintain proper hierarchy (h1 → h2 → h3, no skipping)

2. **Paragraphs**
   - Max width: 65-75 characters per line (optimal readability)
   - Margin bottom: 1em
   - First paragraph after heading: no extra margin top

3. **Lists**
   - Consistent bullet/number styling
   - Indent: 20px
   - Line spacing: 0.5em between items

4. **Code**
   - Inline code: Grey background, slightly smaller font
   - Code blocks: Dark background, syntax highlighting if possible
   - Font size: 0.9em (relative to parent)

---

## Spacing System

### Scale

```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px  - tight spacing */
--space-2: 0.5rem;   /* 8px  - small spacing */
--space-3: 0.75rem;  /* 12px - compact spacing */
--space-4: 1rem;     /* 16px - base spacing */
--space-5: 1.5rem;   /* 24px - comfortable spacing */
--space-6: 2rem;     /* 32px - relaxed spacing */
--space-8: 3rem;     /* 48px - section spacing */
--space-10: 4rem;    /* 64px - large section spacing */
```

### Application Rules

**Page-level:**
```css
Body padding: 40px (desktop), 20px (mobile)
Section margin-bottom: 30-40px
```

**Component-level:**
```css
Card padding: 20-30px
Card margin-bottom: 20px
```

**Element-level:**
```css
Heading margin-bottom: 10-20px
Paragraph margin-bottom: 16px
List item spacing: 8px
Button padding: 10px 20px
```

**Grid systems:**
```css
Grid gap: 20px (standard)
Grid gap: 15px (compact)
Grid gap: 30px (spacious)
```

---

## Component Design Patterns

### Card Anatomy

```
┌─────────────────────────────┐
│  [optional icon/badge]      │ ← Top accent (4px border-top)
│                             │
│  Heading (h3)               │ ← 20px from top
│  ────────────────           │ ← Optional divider
│                             │
│  Body content with proper   │ ← 15px from heading
│  line height and spacing    │
│                             │
│  • List items if needed     │ ← Standard list formatting
│  • Consistent bullets        │
│                             │
│  [optional action button]   │ ← 20px from content
└─────────────────────────────┘

Padding: 20-30px all sides
Border-radius: 8px
Background: Surface color
Shadow: 0 2px 10px rgba(0,0,0,0.1)
Border: 1px solid Border color (optional)
```

### Navigation Sidebar

```
Width: 250-280px
Background: Dark (dark theme sections) or light with border
Padding: 20px
Position: fixed
Height: 100vh
Overflow-y: auto

Navigation items:
- Padding: 10px 15px
- Border-radius: 5px
- Hover: Background change
- Active: Accent background
- Transition: 0.3s ease
```

### Button Styles

```css
/* Primary Button */
background: Primary color
color: White
padding: 10px 20px
border-radius: 5px
border: none
font-weight: 600
transition: all 0.3s ease
hover: Darken by 10%, slight shadow
active: Scale(0.98)

/* Secondary Button */
background: Transparent
color: Secondary color
border: 2px solid Secondary color
padding: 10px 20px
hover: Background Secondary, Color White

/* Text Button */
background: None
color: Secondary color
padding: 8px 12px
hover: Background rgba(Secondary, 0.1)
```

### Status Badges

```css
display: inline-block
padding: 4px 12px
border-radius: 12px (pill shape)
font-size: 0.85rem
font-weight: 600

Success: Green background, white text
Warning: Orange background, white text
Error: Red background, white text
Info: Blue background, white text
Neutral: Grey background, dark text
```

---

## Layout Patterns

### 1. Sidebar Navigation Layout

**Use when:** Content has 5+ sections

```
┌─────────┬──────────────────────────┐
│ Sidebar │ Main Content Area        │
│  Nav    │                          │
│         │  Header Section          │
│ • Link1 │  ─────────────────       │
│ • Link2 │                          │
│ • Link3 │  Content Section 1       │
│ • Link4 │  (cards, text, etc)      │
│ • Link5 │                          │
│         │  ─────────────────       │
│         │                          │
│         │  Content Section 2       │
│         │  (more content)          │
│         │                          │
└─────────┴──────────────────────────┘

Sidebar: 250-280px fixed width
Main: Margin-left = sidebar width
Responsive: Stack on mobile (<768px)
```

### 2. Tab Navigation Layout

**Use when:** Content has 3-5 major categories

```
┌──────────────────────────────────┐
│  [Tab1]  [Tab2]  [Tab3]  [Tab4]  │ ← Tab bar
├──────────────────────────────────┤
│                                  │
│  Active Tab Content              │
│                                  │
│  (Only one tab visible at a time)│
│                                  │
│  Cards, content, etc.            │
│                                  │
└──────────────────────────────────┘

Tabs: Border-bottom, active has accent
Content: Padding 30px
Switch: JavaScript tab switching
```

### 3. Single Column Layout

**Use when:** Simple, linear content

```
┌──────────────────────┐
│  Header              │
├──────────────────────┤
│                      │
│  Content Section 1   │
│                      │
├──────────────────────┤
│                      │
│  Content Section 2   │
│                      │
├──────────────────────┤
│                      │
│  Content Section 3   │
│                      │
└──────────────────────┘

Max-width: 800-1000px
Margin: 0 auto (centered)
Padding: 40px
```

### 4. Grid Layout

**Use when:** Multiple equal-priority items

```
┌──────────┬──────────┬──────────┐
│  Card 1  │  Card 2  │  Card 3  │
├──────────┼──────────┼──────────┤
│  Card 4  │  Card 5  │  Card 6  │
├──────────┼──────────┼──────────┤
│  Card 7  │  Card 8  │  Card 9  │
└──────────┴──────────┴──────────┘

Grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
Gap: 20px
Responsive: Auto-adjusts column count
```

### 5. Timeline Layout

**Use when:** Chronological or sequential content

```
    ○────── Milestone 1
    │       Content for step 1
    │
    ○────── Milestone 2
    │       Content for step 2
    │
    ○────── Milestone 3
    │       Content for step 3
    │
    ○────── Milestone 4
            Content for step 4

Vertical line: 2px, Secondary color
Dots: 12px circle, Primary color
Content: Left-aligned, 40px from line
```

---

## Animation Rules

### Timing Functions

```css
/* Use these standard easings */
ease-out: For elements entering (0.3s)
ease-in: For elements exiting (0.2s)
ease-in-out: For state changes (0.3s)
```

### Animation Types

**1. Hover Effects**
```css
Scale: transform: scale(1.05)
Lift: transform: translateY(-5px) + shadow
Color: Background or border color change
Transition: 0.3s ease
```

**2. Scroll Animations**
```css
Fade in: opacity 0 → 1
Slide up: translateY(20px) → 0
Duration: 0.5s
Delay: Stagger by 0.1s for lists
```

**3. Loading States**
```css
Pulse: opacity 0.6 → 1 (repeat)
Spin: rotate(0) → rotate(360deg)
Shimmer: Gradient movement
Duration: 1-2s infinite
```

**4. State Changes**
```css
Expand/collapse: max-height transition
Show/hide: opacity + display toggle
Slide: translateX or translateY
Duration: 0.3s ease-in-out
```

### Performance Rules

1. **Only animate these properties:**
   - `transform` (scale, translate, rotate)
   - `opacity`
   - Avoid: `width`, `height`, `top`, `left`, `margin`

2. **Use `will-change` sparingly:**
   ```css
   .animated-element {
     will-change: transform;
   }
   ```

3. **Respect user preferences:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

---

## Responsive Design Rules

### Breakpoints

```css
/* Mobile-first approach */
--mobile: 0px       /* Base styles */
--tablet: 768px     /* iPad, small tablets */
--desktop: 1024px   /* Laptop, desktop */
--wide: 1440px      /* Large screens */
```

### Responsive Patterns

**1. Sidebar → Top Nav on Mobile**
```css
@media (max-width: 768px) {
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
  }
  .main-content {
    margin-left: 0;
  }
}
```

**2. Grid Columns Reduce**
```css
/* Desktop: 3 columns */
grid-template-columns: repeat(3, 1fr);

/* Tablet: 2 columns */
@media (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Mobile: 1 column */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

**3. Font Sizes Scale**
```css
h1 {
  font-size: 2.5rem;  /* 40px */
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;  /* 32px */
  }
}
```

**4. Padding Reduces**
```css
.section {
  padding: 40px;
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
  }
}
```

### Touch Targets

**Mobile considerations:**
- Minimum tap target: 44x44px
- Spacing between tappable elements: 8px minimum
- Larger buttons on mobile
- No hover states (use focus instead)

---

## Interactive Element Rules

### Accordions

**Use when:** Long content that benefits from progressive disclosure

```html
<div class="accordion-item">
  <div class="accordion-header">
    <h3>Section Title</h3>
    <span class="icon">▼</span>
  </div>
  <div class="accordion-content">
    Content here...
  </div>
</div>
```

**Behavior:**
- Click header to expand/collapse
- Icon rotates on state change
- Smooth height transition (0.3s)
- Only one open at a time (optional)

### Tooltips

**Use when:** Additional context without cluttering UI

```html
<span class="tooltip">
  Term
  <span class="tooltip-text">Definition here</span>
</span>
```

**Styling:**
- Background: Dark (rgba(0,0,0,0.9))
- Text: White
- Padding: 8px 12px
- Border-radius: 4px
- Position: Above element
- Arrow: CSS triangle pointing down

### Modals

**Use when:** Detailed information or actions that need focus

```
┌────────────────────────────────┐
│  Overlay (semi-transparent)    │
│                                │
│   ┌──────────────────────┐    │
│   │  Modal Header    [X] │    │
│   ├──────────────────────┤    │
│   │                      │    │
│   │  Modal Content       │    │
│   │                      │    │
│   │                      │    │
│   ├──────────────────────┤    │
│   │  [Cancel] [Confirm]  │    │
│   └──────────────────────┘    │
│                                │
└────────────────────────────────┘
```

**Behavior:**
- Click overlay to close
- ESC key to close
- Prevent body scroll when open
- Fade in/out animation

### Tabs

**Use when:** Organizing content into categories

```html
<div class="tabs">
  <div class="tab-buttons">
    <button class="tab-button active">Tab 1</button>
    <button class="tab-button">Tab 2</button>
    <button class="tab-button">Tab 3</button>
  </div>
  <div class="tab-content">
    <div class="tab-panel active">Content 1</div>
    <div class="tab-panel">Content 2</div>
    <div class="tab-panel">Content 3</div>
  </div>
</div>
```

**Styling:**
- Border-bottom on tab bar
- Active tab: accent color bottom border
- Inactive tabs: grey text
- Smooth content fade in

---

## Mermaid Diagram Integration

### Supported Diagram Types

1. **Flowchart** - Process flows, decision trees
2. **Sequence** - Interactions, API calls
3. **Class** - Data models, object relationships
4. **State** - State machines, transitions
5. **Gantt** - Timelines, project schedules
6. **ER** - Database schemas
7. **Pie** - Data distributions

### Styling Mermaid

```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: '#e1f5ff',
    primaryTextColor: '#333',
    primaryBorderColor: '#0066cc',
    lineColor: '#666',
    secondaryColor: '#fff4e1',
    tertiaryColor: '#e8f5e9',
    fontSize: '16px'
  }
});
```

### Container Styling

```css
.diagram-container {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  overflow-x: auto;
}

.mermaid {
  display: flex;
  justify-content: center;
}
```

---

## Code Block Styling

### Inline Code

```css
code {
  background: #f4f4f4;
  color: #333;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Courier New', monospace;
}
```

### Code Blocks

```css
.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 20px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Optional syntax highlighting */
.keyword { color: #c678dd; }
.string { color: #98c379; }
.comment { color: #5c6370; }
.function { color: #61afef; }
```

---

## Accessibility Guidelines

### Semantic HTML

**Always use:**
```html
<header> for page headers
<nav> for navigation
<main> for main content
<article> for self-contained content
<section> for thematic grouping
<aside> for sidebars
<footer> for page footers
```

### ARIA Labels

**Add when needed:**
```html
<button aria-label="Close modal">×</button>
<nav aria-label="Main navigation">...</nav>
<div role="tablist">...</div>
<div role="tabpanel" aria-labelledby="tab-1">...</div>
```

### Keyboard Navigation

**Ensure:**
- All interactive elements reachable by Tab
- Logical tab order (follows visual flow)
- Focus visible (outline or custom style)
- Enter/Space activate buttons
- ESC closes modals/dropdowns

### Focus Styles

```css
:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* Custom focus for specific elements */
button:focus {
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}
```

---

## Performance Optimization

### CSS Optimization

1. **Minimize reflows/repaints:**
   - Use `transform` and `opacity` for animations
   - Avoid animating `width`, `height`, `margin`

2. **Reduce selector complexity:**
   - Use classes, not deep nesting
   - Max 3 levels: `.card .header .title`

3. **Use CSS custom properties:**
   ```css
   :root {
     --primary-color: #3498db;
   }
   .button {
     background: var(--primary-color);
   }
   ```

### JavaScript Optimization

1. **Event delegation:**
   ```javascript
   // Good: One listener on parent
   document.querySelector('.nav').addEventListener('click', (e) => {
     if (e.target.matches('a')) { /* handle */ }
   });
   
   // Bad: Listener on each link
   document.querySelectorAll('.nav a').forEach(link => {
     link.addEventListener('click', handler);
   });
   ```

2. **Debounce scroll events:**
   ```javascript
   let timeout;
   window.addEventListener('scroll', () => {
     clearTimeout(timeout);
     timeout = setTimeout(handleScroll, 100);
   });
   ```

3. **Use requestAnimationFrame for animations:**
   ```javascript
   function animate() {
     element.style.transform = `translateX(${x}px)`;
     requestAnimationFrame(animate);
   }
   ```

### Asset Optimization

1. **Use CDNs for libraries** (Mermaid, etc.)
2. **Inline critical CSS** (above-the-fold styles)
3. **Defer non-critical JavaScript**
4. **Use SVG for icons** (not icon fonts)

---

## Quality Checklist

Before considering a visualization complete, verify:

### Visual Quality
- [ ] Clear visual hierarchy (size, color, spacing)
- [ ] Consistent spacing throughout
- [ ] Proper color contrast (WCAG AA)
- [ ] No overlapping elements
- [ ] Aligned elements (grid-based)
- [ ] Appropriate whitespace
- [ ] Professional appearance

### Functional Quality
- [ ] All navigation works
- [ ] Smooth scroll to sections
- [ ] Interactive elements respond
- [ ] Accordions expand/collapse
- [ ] Tabs switch correctly
- [ ] Tooltips appear on hover
- [ ] No console errors
- [ ] Mermaid diagrams render

### Content Quality
- [ ] All source content included
- [ ] Headings properly nested (h1→h2→h3)
- [ ] Code blocks formatted correctly
- [ ] Links working (if external)
- [ ] No typos or formatting errors
- [ ] Proper capitalization
- [ ] Consistent terminology

### Responsive Quality
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Sidebar collapses on mobile
- [ ] Grid adjusts column count
- [ ] Font sizes scale appropriately
- [ ] Touch targets 44px+ on mobile

### Performance Quality
- [ ] Page loads quickly
- [ ] Smooth animations (60fps)
- [ ] No layout shifts
- [ ] Efficient event handlers
- [ ] Minimal reflows
- [ ] No memory leaks

### Accessibility Quality
- [ ] Semantic HTML used
- [ ] Proper heading hierarchy
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] Color not sole information method
- [ ] Sufficient contrast ratios

---

## Common Mistakes to Avoid

### Visual Mistakes

1. **Inconsistent spacing** - Use CSS variables for spacing values
2. **Too many colors** - Limit to 5-6 colors max
3. **Poor contrast** - Always test with contrast checker
4. **Tiny touch targets** - Minimum 44x44px on mobile
5. **Cluttered layout** - Embrace whitespace
6. **Mixing styles** - Choose one theme and stick to it

### Technical Mistakes

1. **Deep nesting** - Keep CSS selectors shallow
2. **Inline styles** - Use classes, not `style=""`
3. **Missing alt text** - Every image needs description
4. **No semantic HTML** - Don't use `<div>` for everything
5. **Forgetting mobile** - Always test responsive behavior
6. **Inaccessible interactions** - Test keyboard navigation

### Content Mistakes

1. **Skipping hierarchy** - h1 → h3 (missing h2)
2. **Long line lengths** - Max 75 characters
3. **Walls of text** - Break into paragraphs and lists
4. **Generic headings** - "Section 1" vs "System Architecture"
5. **Missing context** - Explain acronyms and jargon

---

## Final Notes

### When in Doubt

1. **Simplify** - Remove, don't add
2. **Test** - Open in different browsers/sizes
3. **Ask** - Would this confuse the user?
4. **Iterate** - First version doesn't have to be perfect

### Resources

**Color contrast:**
- https://webaim.org/resources/contrastchecker/

**Responsive testing:**
- Browser DevTools device emulation

**Accessibility:**
- https://www.w3.org/WAI/WCAG21/quickref/

---

**Remember: Good design is invisible. Users should focus on content, not marvel at the design.**
