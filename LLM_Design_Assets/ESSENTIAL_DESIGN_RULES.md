# Essential Design Rules - thought_bubble

**Streamlined guidance for LLMs generating HTML visualisations**

---

## Core Principles

1. **Content First** - Visual design enhances, doesn't distract
2. **Progressive Disclosure** - Overview first, details on demand
3. **Consistency** - Uniform spacing, colours, typography
4. **Accessibility** - WCAG AA contrast (4.5:1), semantic HTML, keyboard navigation

---

## Visual Hierarchy

### Typography Scale
```
h1: 2.5rem (40px)  - Page title
h2: 2rem (32px)    - Major sections
h3: 1.5rem (24px)  - Subsections
body: 1rem (16px)  - Base text
small: 0.875rem    - Captions

Line height: 1.6 (body), 1.2 (headings)
Font: system-ui stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
```

### Spacing System
```
--space-2: 0.5rem   (8px)   - tight
--space-4: 1rem     (16px)  - base
--space-5: 1.5rem   (24px)  - comfortable
--space-6: 2rem     (32px)  - section spacing

Page padding: 40px (desktop), 20px (mobile)
Card padding: 20-30px
Element margins: 10-20px
Grid gap: 20px
```

---

## Colour Themes

### Professional (Default)
```css
Primary: #2c3e50 (dark slate)
Secondary: #3498db (blue)
Accent: #e74c3c (red)
Success: #27ae60 (green)
Warning: #f39c12 (orange)
Background: #ffffff
Surface: #f8f9fa (light grey)
Text: #333333
Text-Secondary: #7f8c8d
Border: #e0e0e0
```

### Dark Theme
```css
Primary: #60a5fa (light blue)
Secondary: #818cf8 (indigo)
Accent: #f472b6 (pink)
Success: #34d399 (green)
Background: #1a1a1a
Surface: #2d2d2d
Text: #e5e5e5
Text-Secondary: #a3a3a3
Border: #404040
```

### Technical Theme
```css
Primary: #1a202c (near black)
Secondary: #00d9ff (cyan)
Accent: #00ff88 (bright green)
Background: #0f172a (dark blue)
Surface: #1e293b
Text: #f1f5f9
Text-Secondary: #94a3b8
Border: #334155
```

**Colour Usage:**
- Backgrounds: Use Background (main) and Surface (cards)
- Headings/Body: Use Text colour
- Links: Use Secondary colour
- Actions: Primary (main), Secondary (supporting), Accent (danger)
- Borders: Use Border colour

---

## Essential Components

### 1. Basic Card
```html
<div class="card">
    <h3>Title</h3>
    <p>Content</p>
</div>

<style>
.card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #3498db;
    margin-bottom: 20px;
    transition: transform 0.3s;
}
.card:hover { transform: translateY(-5px); }
</style>
```

### 2. Grid Layout
```html
<div class="grid">
    <div class="card">...</div>
    <div class="card">...</div>
</div>

<style>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
</style>
```

### 3. Sidebar Navigation
```html
<nav class="sidebar">
    <a href="#section1">Section 1</a>
    <a href="#section2">Section 2</a>
</nav>
<main class="content">...</main>

<style>
.sidebar {
    position: fixed;
    width: 250px;
    height: 100vh;
    padding: 20px;
    background: #2c3e50;
}
.sidebar a {
    display: block;
    padding: 10px 15px;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background 0.3s;
}
.sidebar a:hover { background: rgba(255,255,255,0.1); }
.content { margin-left: 280px; padding: 40px; }

@media (max-width: 768px) {
    .sidebar { position: relative; width: 100%; height: auto; }
    .content { margin-left: 0; }
}
</style>
```

### 4. Status Badge
```html
<span class="badge success">Active</span>
<span class="badge warning">Pending</span>

<style>
.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
}
.badge.success { background: #27ae60; color: white; }
.badge.warning { background: #f39c12; color: white; }
.badge.error { background: #e74c3c; color: white; }
</style>
```

### 5. Timeline
```html
<div class="timeline-item">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
        <h4>Milestone</h4>
        <p>Description</p>
    </div>
</div>

<style>
.timeline-item {
    display: flex;
    margin-bottom: 30px;
    position: relative;
}
.timeline-item::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 30px;
    bottom: -30px;
    width: 2px;
    background: #3498db;
}
.timeline-marker {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #3498db;
    border: 4px solid white;
    flex-shrink: 0;
    z-index: 1;
}
.timeline-content {
    margin-left: 20px;
    background: #f8f9fa;
    padding: 15px 20px;
    border-radius: 8px;
    flex: 1;
}
</style>
```

---

## Layout Patterns

**Choose based on content:**
- **Sidebar Navigation**: 5+ sections (system docs, APIs)
- **Single Column**: Simple, linear content (guides, articles)
- **Grid Layout**: Multiple equal items (features, team members)
- **Timeline**: Chronological content (milestones, history)

---

## Interactive Elements

### Smooth Scroll
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
```

### Accordion
```html
<div class="accordion">
    <div class="accordion-header">Click to expand</div>
    <div class="accordion-content">Hidden content</div>
</div>

<style>
.accordion-content { 
    max-height: 0; 
    overflow: hidden; 
    transition: max-height 0.3s; 
}
.accordion.active .accordion-content { 
    max-height: 500px; 
}
</style>

<script>
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        header.parentElement.classList.toggle('active');
    });
});
</script>
```

---

## Responsive Breakpoints

```css
/* Mobile-first approach */
--mobile: 0px       /* Base styles */
--tablet: 768px     /* Stack layouts, adjust nav */
--desktop: 1024px   /* Full features */

@media (max-width: 768px) {
    /* Stack sidebars, single column grids, reduce padding */
    h1 { font-size: 2rem; }
    .sidebar { position: relative; width: 100%; }
    .content { margin-left: 0; padding: 20px; }
    .grid { grid-template-columns: 1fr; }
}
```

---

## Animation Rules

**Keep it subtle:**
```css
/* Hover effects */
.card:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
}

/* Transitions */
transition: all 0.3s ease;

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## Mermaid Diagrams

```html
<div class="diagram-container">
    <div class="mermaid">
        graph LR
            A[Start] --> B[Process]
            B --> C[End]
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        primaryColor: '#e1f5ff',
        primaryBorderColor: '#0066cc',
        lineColor: '#666'
    }
});
</script>

<style>
.diagram-container {
    margin: 20px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    overflow-x: auto;
}
</style>
```

---

## Accessibility Checklist

- [ ] Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`)
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skipping)
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Visible focus states (`:focus { outline: 2px solid #3498db; }`)
- [ ] Colour contrast minimum 4.5:1 (test at webaim.org/resources/contrastchecker/)
- [ ] Touch targets 44x44px minimum on mobile

---

## Quality Checklist

**Before completion, verify:**
- [ ] All content included
- [ ] Navigation works (smooth scroll)
- [ ] Responsive (test at 320px, 768px, 1024px widths)
- [ ] Mermaid diagrams render
- [ ] No console errors
- [ ] Proper contrast ratios
- [ ] Keyboard accessible

---

## Common Mistakes to Avoid

1. **Inconsistent spacing** - Use CSS variables
2. **Poor contrast** - Test with contrast checker
3. **Tiny touch targets** - Minimum 44x44px on mobile
4. **Deep nesting** - Keep CSS selectors shallow
5. **Missing mobile styles** - Always include responsive breakpoints
6. **Skipping heading levels** - h1 → h2 → h3 (don't skip)

---

**Remember: Simplicity wins. When in doubt, remove rather than add.**
