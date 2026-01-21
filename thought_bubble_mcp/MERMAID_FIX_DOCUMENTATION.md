# Mermaid Rendering Fix for Hidden Sections

## Critical Issue Discovered

When using sidebar navigation with hidden sections (`display: none`), Mermaid fails to render diagrams in hidden sections. Only the first visible diagram renders correctly.

## Root Cause

Mermaid requires DOM elements to be visible (not `display: none`) when it calculates dimensions and renders SVG diagrams. Hidden elements have zero dimensions, causing Mermaid to skip or fail rendering.

## The Solution

**Show all sections during initial render, then hide them after Mermaid completes.**

### Implementation Pattern

```javascript
// Initialize Mermaid with startOnLoad: false
mermaid.initialize({ 
    startOnLoad: false,
    theme: 'dark',
    logLevel: 'error',
    securityLevel: 'loose'
});

// Make all sections visible for rendering
document.querySelectorAll('.section').forEach(s => s.style.display = 'block');

// Render all diagrams
mermaid.run().then(() => {
    // After rendering, hide non-active sections
    document.querySelectorAll('.section').forEach(s => {
        if (!s.classList.contains('active')) {
            s.style.display = 'none';
        }
    });
});

// Sidebar navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-section');
        
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.section').forEach(s => {
            if (s.id === target) {
                s.classList.add('active');
                s.style.display = 'block';
            } else {
                s.classList.remove('active');
                s.style.display = 'none';
            }
        });
    });
});
```

## Key Changes from Old Pattern

### Before (Broken)
```javascript
mermaid.initialize({ startOnLoad: true });

navItems.forEach(item => {
    item.addEventListener('click', () => {
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(targetSection).classList.add('active');
    });
});
```

### After (Fixed)
```javascript
mermaid.initialize({ startOnLoad: false });

// Temporarily show all sections
document.querySelectorAll('.section').forEach(s => s.style.display = 'block');

// Render then hide
mermaid.run().then(() => {
    document.querySelectorAll('.section').forEach(s => {
        if (!s.classList.contains('active')) {
            s.style.display = 'none';
        }
    });
});

// Update navigation to use style.display
navItems.forEach(item => {
    item.addEventListener('click', () => {
        sections.forEach(s => {
            if (s.id === target) {
                s.classList.add('active');
                s.style.display = 'block';  // Explicitly show
            } else {
                s.classList.remove('active');
                s.style.display = 'none';   // Explicitly hide
            }
        });
    });
});
```

## Files Updated

1. **payment_gateway_visualization.html** - Applied fix to main visualization file
2. **thought_bubble_mcp/src/prompts/templates.ts** - Updated HTML generation prompt with fix pattern
3. **base_template.html** - Added warning comment for developers

## When to Apply This Fix

Apply this pattern when:
- Using sidebar navigation with tab-like behaviour
- Sections are hidden with `display: none` or `.section { display: none; }`
- Multiple Mermaid diagrams exist across different sections
- Only the active section should be visible at a time

## When NOT to Apply

Don't use this pattern when:
- Using smooth scrolling with all sections visible (standard documentation layout)
- No hidden sections in your design
- Not using Mermaid diagrams

## Testing

To verify the fix works:
1. Open the HTML file in a browser
2. Check that all sections have rendered Mermaid diagrams (inspect SVG elements)
3. Navigate between sections using sidebar navigation
4. Verify all diagrams display correctly when their section is shown
5. Check browser console for any Mermaid errors

## References

- Original issue documented in: `MERMAID_SIDEBAR_FIX.md`
- Implementation in: `payment_gateway_visualization.html`
- Template prompt updated in: `thought_bubble_mcp/src/prompts/templates.ts`
