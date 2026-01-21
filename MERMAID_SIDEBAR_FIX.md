# Mermaid Sidebar Navigation Fix

## The Problem

When using sidebar navigation with hidden sections (`display: none`), Mermaid fails to render diagrams in hidden sections. Only the first visible diagram renders correctly.

## The Solution

Show all sections during initial render, then hide them after Mermaid completes:

```javascript
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

That's it. All diagrams render correctly with full sidebar navigation.
