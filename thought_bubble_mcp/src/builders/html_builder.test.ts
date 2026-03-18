/**
 * HTML Builder Tests -- Template System Overhaul
 *
 * Covers: section roles, density presets, all 13 layouts, role-based
 * dispatching within layouts, guard rails (backwards compatibility).
 */

import { describe, it, expect } from 'vitest';
import {
  buildHTML,
  type Section,
  type SectionRole,
  type LayoutTemplate,
  type DensityPreset,
  type HTMLBuilderOptions,
} from './html_builder.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSection(overrides: Partial<Section> = {}): Section {
  return {
    id: 'section-1',
    title: 'Test Section',
    content: '<p>Test content</p>',
    ...overrides,
  };
}

function makeSections(count: number, rolePattern?: SectionRole[]): Section[] {
  return Array.from({ length: count }, (_, i) => makeSection({
    id: `section-${i + 1}`,
    title: `Section ${i + 1}`,
    role: rolePattern?.[i] ?? 'default',
    diagram: {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect width="100" height="50" fill="#333"/></svg>`,
      caption: `Chart ${i + 1}`,
    },
  }));
}

function buildWithLayout(layout: LayoutTemplate, sections?: Section[], extra?: Partial<HTMLBuilderOptions>): string {
  return buildHTML({
    title: 'Test Page',
    subtitle: 'Test Subtitle',
    theme: 'tokyo_night',
    navigationStyle: 'minimal',
    layout,
    sections: sections ?? makeSections(3),
    enableThemeSwitcher: true,
    ...extra,
  });
}

// ---------------------------------------------------------------------------
// Stage 1A: Section Role System
// ---------------------------------------------------------------------------

describe('Section Role System', () => {
  it('should accept all valid SectionRole values without error', () => {
    const roles: SectionRole[] = [
      'default', 'metric', 'pull-quote', 'lead',
      'statement', 'full-width', 'supporting',
    ];
    for (const role of roles) {
      const html = buildWithLayout('sidebar', [makeSection({ role })]);
      expect(html).toContain('<!DOCTYPE html>');
    }
  });

  it('should treat undefined role identically to default', () => {
    const withDefault = buildWithLayout('sidebar', [makeSection({ role: 'default' })]);
    const withUndefined = buildWithLayout('sidebar', [makeSection({ role: undefined })]);
    // Both should produce sections without special role-based classes
    expect(withDefault).toContain('class="section"');
    expect(withUndefined).toContain('class="section"');
  });

  it('should produce valid HTML for sections with diagrams and roles', () => {
    const section = makeSection({
      role: 'full-width',
      diagram: { svg: '<svg width="10" height="10"></svg>', caption: 'Test' },
      animation: 'fade',
    });
    const html = buildWithLayout('editorial', [section]);
    expect(html).toContain('data-animation="fade"');
    expect(html).toContain('<svg width="10" height="10"></svg>');
  });
});

// ---------------------------------------------------------------------------
// Stage 1B: Density Config
// ---------------------------------------------------------------------------

describe('Density Config', () => {
  const densities: DensityPreset[] = ['compact', 'comfortable', 'spacious'];

  it('should apply data-density attribute to body', () => {
    for (const density of densities) {
      const html = buildWithLayout('sidebar', undefined, { density });
      expect(html).toContain(`data-density="${density}"`);
    }
  });

  it('should default to comfortable when density is not specified', () => {
    const html = buildHTML({
      title: 'No Density',
      theme: 'tokyo_night',
      navigationStyle: 'minimal',
      sections: makeSections(1),
    });
    expect(html).toContain('data-density="comfortable"');
  });

  it('should include CSS variable definitions for all density presets', () => {
    const html = buildWithLayout('sidebar');
    expect(html).toContain('[data-density="compact"]');
    expect(html).toContain('[data-density="comfortable"]');
    expect(html).toContain('[data-density="spacious"]');
    expect(html).toContain('--layout-gap');
    expect(html).toContain('--section-padding-v');
    expect(html).toContain('--section-padding-h');
  });

  it('should include responsive scaling for density', () => {
    const html = buildWithLayout('sidebar');
    expect(html).toContain('@media (max-width: 768px)');
    expect(html).toContain('[data-density="spacious"]');
  });
});

// ---------------------------------------------------------------------------
// Stage 2A: Dashboard Overhaul
// ---------------------------------------------------------------------------

describe('Dashboard Layout -- Overhaul', () => {
  it('should render metric-role sections as .metric-card in .metric-cards row', () => {
    const sections = [
      makeSection({ id: 's1', title: 'MRR', content: '<p>$847K</p>', role: 'metric' }),
      makeSection({ id: 's2', title: 'Churn', content: '<p>1.8%</p>', role: 'metric' }),
      makeSection({ id: 's3', title: 'Chart', role: 'default', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('dashboard', sections);

    expect(html).toContain('class="metric-cards"');
    expect(html).toContain('class="metric-card"');
    expect(html).toContain('MRR');
    expect(html).toContain('$847K');
  });

  it('should assign span-8 to first chart, span-4 to second, span-6 to rest', () => {
    const sections = [
      makeSection({ id: 's1', title: 'Primary', role: 'default', diagram: { svg: '<svg></svg>' } }),
      makeSection({ id: 's2', title: 'Secondary', role: 'default', diagram: { svg: '<svg></svg>' } }),
      makeSection({ id: 's3', title: 'Tertiary', role: 'default', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('dashboard', sections);

    expect(html).toContain('span-8');
    expect(html).toContain('span-4');
    expect(html).toContain('span-6');
  });

  it('should add primary class to the first non-metric chart card', () => {
    const sections = makeSections(2);
    const html = buildWithLayout('dashboard', sections);
    expect(html).toContain('primary');
  });

  it('should work with no metric sections (backwards compatible)', () => {
    const sections = makeSections(3);
    const html = buildWithLayout('dashboard', sections);
    expect(html).not.toContain('class="metric-cards"');
    expect(html).toContain('dashboard-card');
  });
});

// ---------------------------------------------------------------------------
// Stage 2B: Magazine Enrichment
// ---------------------------------------------------------------------------

describe('Magazine Layout -- Enrichment', () => {
  it('should render pull-quote role as <blockquote class="pull-quote">', () => {
    const sections = [
      makeSection({ id: 's1', role: 'pull-quote', content: '<p>Important quote</p>' }),
      makeSection({ id: 's2', role: 'default', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('magazine', sections);
    expect(html).toContain('<blockquote class="pull-quote">');
    expect(html).toContain('Important quote');
  });

  it('should render lead role as .magazine-lead section', () => {
    const sections = [
      makeSection({ id: 's1', role: 'lead', content: '<p>Opening paragraph</p>' }),
      makeSection({ id: 's2', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('magazine', sections);
    expect(html).toContain('class="magazine-lead"');
  });

  it('should apply full-width class for role full-width instead of every-3rd rule', () => {
    const sections = [
      makeSection({ id: 's1', role: 'default', diagram: { svg: '<svg></svg>' } }),
      makeSection({ id: 's2', role: 'full-width', diagram: { svg: '<svg></svg>' } }),
      makeSection({ id: 's3', role: 'default', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('magazine', sections);
    // full-width should only appear on section 2
    const fullWidthCount = (html.match(/magazine-section full-width/g) || []).length;
    expect(fullWidthCount).toBe(1);
  });

  it('should not apply full-width to every 3rd section when no roles are set', () => {
    const sections = makeSections(6);
    const html = buildWithLayout('magazine', sections);
    // Without explicit full-width role, no sections should get the class
    const fullWidthCount = (html.match(/magazine-section full-width/g) || []).length;
    expect(fullWidthCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Stage 2C: Editorial Breakout
// ---------------------------------------------------------------------------

describe('Editorial Layout -- Breakout', () => {
  it('should add breakout class for full-width role sections', () => {
    const sections = [
      makeSection({ id: 's1', role: 'default' }),
      makeSection({ id: 's2', role: 'full-width', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('editorial', sections);
    expect(html).toContain('editorial-section breakout');
  });

  it('should not add breakout class for default role sections', () => {
    const sections = [makeSection({ id: 's1', role: 'default' })];
    const html = buildWithLayout('editorial', sections);
    expect(html).not.toContain('class="editorial-section breakout"');
  });

  it('should include breakout CSS rules', () => {
    const html = buildWithLayout('editorial');
    expect(html).toContain('.layout-editorial .editorial-section.breakout');
    expect(html).toContain('translateX(-50%)');
  });
});

// ---------------------------------------------------------------------------
// Stage 2D: Minimal Rethink
// ---------------------------------------------------------------------------

describe('Minimal Layout -- Visual-First Hero', () => {
  it('should create a .minimal-hero when a section has a diagram', () => {
    const sections = [makeSection({ diagram: { svg: '<svg></svg>' } })];
    const html = buildWithLayout('minimal', sections);
    expect(html).toContain('minimal-hero');
  });

  it('should fill viewport for single-section pages', () => {
    const sections = [makeSection({ diagram: { svg: '<svg></svg>' } })];
    const html = buildWithLayout('minimal', sections);
    expect(html).toContain('fill-viewport');
  });

  it('should not fill viewport when multiple sections exist', () => {
    const sections = makeSections(3);
    const html = buildWithLayout('minimal', sections);
    expect(html).not.toContain('class="minimal-hero fill-viewport"');
  });

  it('should render remaining sections in .minimal-supporting', () => {
    const sections = [
      makeSection({ id: 's1', diagram: { svg: '<svg></svg>' } }),
      makeSection({ id: 's2', title: 'Supporting' }),
    ];
    const html = buildWithLayout('minimal', sections);
    expect(html).toContain('minimal-supporting');
    expect(html).toContain('Supporting');
  });

  it('should fall back to old layout when no section has a diagram', () => {
    const sections = [makeSection({ id: 's1' }), makeSection({ id: 's2' })];
    const html = buildWithLayout('minimal', sections);
    expect(html).toContain('layout-minimal');
    expect(html).not.toContain('class="minimal-hero');
  });
});

// ---------------------------------------------------------------------------
// Stage 2E: Presentation Slide Types
// ---------------------------------------------------------------------------

describe('Presentation Layout -- Slide Types', () => {
  it('should render statement role as .slide-statement with large centred text', () => {
    const sections = [makeSection({ role: 'statement', content: '<p>Big idea</p>' })];
    const html = buildWithLayout('presentation', sections);
    expect(html).toContain('slide-statement');
    expect(html).toContain('Big idea');
  });

  it('should render metric role as .slide-metric with .metric-display', () => {
    const sections = [makeSection({ role: 'metric', title: '$12.4M', content: '<p>Revenue</p>' })];
    const html = buildWithLayout('presentation', sections);
    expect(html).toContain('slide-metric');
    expect(html).toContain('metric-display');
    expect(html).toContain('$12.4M');
    expect(html).toContain('metric-label');
  });

  it('should render full-width role as .slide-full-width', () => {
    const sections = [makeSection({ role: 'full-width', diagram: { svg: '<svg></svg>' } })];
    const html = buildWithLayout('presentation', sections);
    expect(html).toContain('slide-full-width');
  });

  it('should render default role as standard slide (no special slide class)', () => {
    const sections = [makeSection({ role: 'default', diagram: { svg: '<svg></svg>' } })];
    const html = buildWithLayout('presentation', sections);
    // The HTML body should not have elements with special slide classes
    expect(html).not.toContain('class="presentation-slide slide-statement"');
    expect(html).not.toContain('class="presentation-slide slide-metric"');
    expect(html).not.toContain('class="presentation-slide slide-full-width"');
    // But it should contain the base slide class
    expect(html).toContain('class="presentation-slide"');
  });

  it('should always include a title slide', () => {
    const sections = makeSections(2);
    const html = buildWithLayout('presentation', sections);
    const slideCount = (html.match(/presentation-slide/g) || []).length;
    // 1 title slide + 2 content slides = 3
    expect(slideCount).toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// Stage 3A: Comparison Layout
// ---------------------------------------------------------------------------

describe('Comparison Layout', () => {
  it('should render non-supporting sections as .comparison-column', () => {
    const sections = [
      makeSection({ id: 's1', title: 'Option A' }),
      makeSection({ id: 's2', title: 'Option B' }),
    ];
    const html = buildWithLayout('comparison', sections);
    expect(html).toContain('layout-comparison');
    expect(html).toContain('comparison-columns');
    expect(html).toContain('comparison-column');
    expect(html).toContain('Option A');
    expect(html).toContain('Option B');
  });

  it('should render supporting-role sections as .comparison-shared', () => {
    const sections = [
      makeSection({ id: 's1', title: 'A' }),
      makeSection({ id: 's2', title: 'B' }),
      makeSection({ id: 's3', title: 'Conclusion', role: 'supporting' }),
    ];
    const html = buildWithLayout('comparison', sections);
    expect(html).toContain('comparison-shared');
    expect(html).toContain('Conclusion');
  });

  it('should render full-width-role sections as shared summary too', () => {
    const sections = [
      makeSection({ id: 's1' }),
      makeSection({ id: 's2', title: 'Shared Chart', role: 'full-width', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('comparison', sections);
    expect(html).toContain('comparison-shared');
    expect(html).toContain('Shared Chart');
  });
});

// ---------------------------------------------------------------------------
// Stage 3B: Briefing Layout
// ---------------------------------------------------------------------------

describe('Briefing Layout', () => {
  it('should render metric sections as .stats-strip .metric-card', () => {
    const sections = [
      makeSection({ id: 's1', role: 'metric', title: 'KPI', content: '<p>42</p>' }),
      makeSection({ id: 's2', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('briefing', sections);
    expect(html).toContain('stats-strip');
    expect(html).toContain('metric-card');
  });

  it('should render lead section prominently', () => {
    const sections = [
      makeSection({ id: 's1', role: 'lead', title: 'Headline', diagram: { svg: '<svg></svg>' } }),
      makeSection({ id: 's2', title: 'Detail' }),
    ];
    const html = buildWithLayout('briefing', sections);
    expect(html).toContain('briefing-lead');
    expect(html).toContain('Headline');
  });

  it('should render supporting section as .briefing-actions', () => {
    const sections = [
      makeSection({ id: 's1', diagram: { svg: '<svg></svg>' } }),
      makeSection({ id: 's2', role: 'supporting', title: 'Next Steps' }),
    ];
    const html = buildWithLayout('briefing', sections);
    expect(html).toContain('briefing-actions');
    expect(html).toContain('Next Steps');
  });

  it('should render remaining sections in .briefing-grid', () => {
    const sections = [
      makeSection({ id: 's1', role: 'lead' }),
      makeSection({ id: 's2', title: 'Item A', diagram: { svg: '<svg></svg>' } }),
      makeSection({ id: 's3', title: 'Item B', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('briefing', sections);
    expect(html).toContain('briefing-grid');
    expect(html).toContain('Item A');
    expect(html).toContain('Item B');
  });
});

// ---------------------------------------------------------------------------
// Stage 3C: Tutorial Layout
// ---------------------------------------------------------------------------

describe('Tutorial Layout', () => {
  it('should render each section as a numbered .tutorial-step', () => {
    const sections = makeSections(3);
    const html = buildWithLayout('tutorial', sections);
    expect(html).toContain('tutorial-steps');
    expect(html).toContain('tutorial-step');
    expect(html).toContain('tutorial-step-number');
  });

  it('should include correct step numbers', () => {
    const sections = makeSections(4);
    const html = buildWithLayout('tutorial', sections);
    for (let i = 1; i <= 4; i++) {
      expect(html).toContain(`>${i}<`);
    }
  });

  it('should render statement role as .tutorial-takeaway callout', () => {
    const sections = [
      makeSection({ id: 's1', role: 'statement', content: '<p>Key takeaway here</p>' }),
    ];
    const html = buildWithLayout('tutorial', sections);
    expect(html).toContain('tutorial-takeaway');
    expect(html).toContain('Key takeaway here');
  });

  it('should include a progress bar', () => {
    const sections = makeSections(2);
    const html = buildWithLayout('tutorial', sections);
    expect(html).toContain('tutorial-progress');
    expect(html).toContain('tutorial-progress-fill');
  });

  it('should include the progress spine (vertical line)', () => {
    const html = buildWithLayout('tutorial');
    expect(html).toContain('tutorial-steps');
    // CSS pseudo-element creates the spine via ::before
    expect(html).toContain('.tutorial-steps::before');
  });
});

// ---------------------------------------------------------------------------
// Stage 3D: Scorecard Layout
// ---------------------------------------------------------------------------

describe('Scorecard Layout', () => {
  it('should render metric section as .scorecard-overall with grade', () => {
    const sections = [
      makeSection({ id: 's1', role: 'metric', title: 'A+', content: '<p>Overall Grade</p>' }),
      makeSection({ id: 's2' }),
    ];
    const html = buildWithLayout('scorecard', sections);
    expect(html).toContain('scorecard-overall');
    expect(html).toContain('scorecard-grade');
    expect(html).toContain('A+');
    expect(html).toContain('Overall Grade');
  });

  it('should render default sections as .scorecard-category cards', () => {
    const sections = [
      makeSection({ id: 's1', title: 'Security' }),
      makeSection({ id: 's2', title: 'Performance' }),
    ];
    const html = buildWithLayout('scorecard', sections);
    expect(html).toContain('scorecard-categories');
    expect(html).toContain('scorecard-category');
    expect(html).toContain('Security');
    expect(html).toContain('Performance');
  });

  it('should render full-width section as .scorecard-breakdown', () => {
    const sections = [
      makeSection({ id: 's1', role: 'full-width', title: 'Breakdown', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('scorecard', sections);
    expect(html).toContain('scorecard-breakdown');
  });

  it('should render supporting section as .scorecard-findings', () => {
    const sections = [
      makeSection({ id: 's1' }),
      makeSection({ id: 's2', role: 'supporting', title: 'Recommendations' }),
    ];
    const html = buildWithLayout('scorecard', sections);
    expect(html).toContain('scorecard-findings');
    expect(html).toContain('Recommendations');
  });

  it('should include semantic colour CSS classes', () => {
    const html = buildWithLayout('scorecard');
    expect(html).toContain('.scorecard-category.status-success');
    expect(html).toContain('.scorecard-category.status-warning');
    expect(html).toContain('.scorecard-category.status-error');
  });
});

// ---------------------------------------------------------------------------
// Stage 3E: Report Layout
// ---------------------------------------------------------------------------

describe('Report Layout', () => {
  it('should include a .report-cover with title', () => {
    const html = buildWithLayout('report');
    expect(html).toContain('report-cover');
    expect(html).toContain('Test Page');
  });

  it('should auto-generate a .report-toc with anchor links', () => {
    const sections = makeSections(3);
    const html = buildWithLayout('report', sections);
    expect(html).toContain('report-toc');
    for (const s of sections) {
      expect(html).toContain(`href="#${s.id}"`);
    }
  });

  it('should number sections with .section-number', () => {
    const sections = makeSections(3);
    const html = buildWithLayout('report', sections);
    expect(html).toContain('section-number');
    expect(html).toContain('>1.<');
    expect(html).toContain('>2.<');
    expect(html).toContain('>3.<');
  });

  it('should place supporting-role sections at end with .supporting class', () => {
    const sections = [
      makeSection({ id: 's1', title: 'Main' }),
      makeSection({ id: 's2', title: 'Appendix A', role: 'supporting' }),
    ];
    const html = buildWithLayout('report', sections);
    expect(html).toContain('report-section supporting');
    // Supporting comes after main -- check ordering
    const mainIdx = html.indexOf('Main');
    const appendixIdx = html.indexOf('Appendix A');
    expect(appendixIdx).toBeGreaterThan(mainIdx);
  });

  it('should include @media print styles', () => {
    const html = buildWithLayout('report');
    expect(html).toContain('@media print');
    expect(html).toContain('page-break');
  });
});

// ---------------------------------------------------------------------------
// Stage 3F: Dossier Layout
// ---------------------------------------------------------------------------

describe('Dossier Layout', () => {
  it('should render .dossier-profile header with title', () => {
    const html = buildWithLayout('dossier');
    expect(html).toContain('dossier-profile');
    expect(html).toContain('Test Page');
  });

  it('should render metric sections as .dossier-facts strip', () => {
    const sections = [
      makeSection({ id: 's1', role: 'metric', title: 'Founded', content: '<p>2010</p>' }),
      makeSection({ id: 's2', role: 'metric', title: 'Employees', content: '<p>8000</p>' }),
      makeSection({ id: 's3', diagram: { svg: '<svg></svg>' } }),
    ];
    const html = buildWithLayout('dossier', sections);
    expect(html).toContain('dossier-facts');
    expect(html).toContain('dossier-fact');
    expect(html).toContain('Founded');
    expect(html).toContain('2010');
  });

  it('should render lead section as .dossier-narrative', () => {
    const sections = [
      makeSection({ id: 's1', role: 'lead', title: 'Overview' }),
    ];
    const html = buildWithLayout('dossier', sections);
    expect(html).toContain('dossier-narrative');
    expect(html).toContain('Overview');
  });

  it('should render statement section as .dossier-statement', () => {
    const sections = [
      makeSection({ id: 's1', role: 'statement', content: '<p>So what statement</p>' }),
    ];
    const html = buildWithLayout('dossier', sections);
    expect(html).toContain('dossier-statement');
    expect(html).toContain('So what statement');
  });

  it('should render remaining sections as .dossier-deep-dive cards', () => {
    const sections = makeSections(2);
    const html = buildWithLayout('dossier', sections);
    expect(html).toContain('dossier-deep-dives');
    expect(html).toContain('dossier-deep-dive');
  });

  it('should render hero metric when provided', () => {
    const html = buildWithLayout('dossier', makeSections(1), {
      hero: { title: 'Co.', metric: { value: '$91B', label: 'Valuation' } },
    });
    expect(html).toContain('dossier-headline-metric');
    expect(html).toContain('$91B');
    expect(html).toContain('Valuation');
  });
});

// ---------------------------------------------------------------------------
// Stage 3G: Dialogue Layout
// ---------------------------------------------------------------------------

describe('Dialogue Layout', () => {
  it('should render .dialogue-question with title', () => {
    const html = buildWithLayout('dialogue');
    expect(html).toContain('dialogue-question');
    expect(html).toContain('Test Page');
  });

  it('should render default sections as .dialogue-position columns', () => {
    const sections = [
      makeSection({ id: 's1', title: 'For' }),
      makeSection({ id: 's2', title: 'Against' }),
    ];
    const html = buildWithLayout('dialogue', sections);
    expect(html).toContain('dialogue-positions');
    expect(html).toContain('dialogue-position');
    expect(html).toContain('For');
    expect(html).toContain('Against');
  });

  it('should render full-width section as .dialogue-tradeoffs', () => {
    const sections = [
      makeSection({ id: 's1' }),
      makeSection({ id: 's2', role: 'full-width', title: 'Trade-offs' }),
    ];
    const html = buildWithLayout('dialogue', sections);
    expect(html).toContain('dialogue-tradeoffs');
    expect(html).toContain('Trade-offs');
  });

  it('should render supporting section as .dialogue-conclusion', () => {
    const sections = [
      makeSection({ id: 's1' }),
      makeSection({ id: 's2', role: 'supporting', title: 'Decision' }),
    ];
    const html = buildWithLayout('dialogue', sections);
    expect(html).toContain('dialogue-conclusion');
    expect(html).toContain('Decision');
  });

  it('should render statement section as .dialogue-conclusion too', () => {
    const sections = [
      makeSection({ id: 's1' }),
      makeSection({ id: 's2', role: 'statement', title: 'Verdict' }),
    ];
    const html = buildWithLayout('dialogue', sections);
    expect(html).toContain('dialogue-conclusion');
    expect(html).toContain('Verdict');
  });
});

// ---------------------------------------------------------------------------
// Guard Rails & Backwards Compatibility
// ---------------------------------------------------------------------------

describe('Guard Rails', () => {
  it('should produce valid HTML for all 13 layouts with no sections', () => {
    const layouts: LayoutTemplate[] = [
      'sidebar', 'magazine', 'presentation', 'dashboard',
      'minimal', 'editorial', 'comparison', 'briefing',
      'tutorial', 'scorecard', 'report', 'dossier', 'dialogue',
    ];
    for (const layout of layouts) {
      const html = buildWithLayout(layout, []);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
    }
  });

  it('should produce valid HTML for all 13 layouts with 1 section (no role)', () => {
    const layouts: LayoutTemplate[] = [
      'sidebar', 'magazine', 'presentation', 'dashboard',
      'minimal', 'editorial', 'comparison', 'briefing',
      'tutorial', 'scorecard', 'report', 'dossier', 'dialogue',
    ];
    for (const layout of layouts) {
      const html = buildWithLayout(layout, [makeSection()]);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Test Section');
    }
  });

  it('should not break existing calls that omit role and density', () => {
    const html = buildHTML({
      title: 'Legacy Call',
      theme: 'tokyo_night',
      navigationStyle: 'sidebar',
      sections: [
        {
          id: 'legacy-1',
          title: 'Legacy Section',
          content: '<p>Old-style section without role</p>',
          diagram: { svg: '<svg></svg>' },
        },
      ],
    });
    expect(html).toContain('Legacy Call');
    expect(html).toContain('Legacy Section');
    expect(html).toContain('data-density="comfortable"');
  });

  it('should include theme switcher when enabled', () => {
    const html = buildWithLayout('sidebar', undefined, { enableThemeSwitcher: true });
    expect(html).toContain('theme-switcher');
    expect(html).toContain('id="theme-select"');
  });

  it('should omit theme switcher when disabled', () => {
    const html = buildWithLayout('sidebar', undefined, { enableThemeSwitcher: false });
    expect(html).not.toContain('id="theme-select"');
  });

  it('should include footer for non-presentation layouts', () => {
    const html = buildWithLayout('sidebar');
    expect(html).toContain('class="footer"');
  });

  it('should omit footer for presentation layout', () => {
    const html = buildWithLayout('presentation');
    expect(html).not.toContain('class="footer"');
  });

  it('should respect animation attribute on diagram containers', () => {
    const section = makeSection({
      animation: 'stagger',
      diagram: { svg: '<svg></svg>' },
    });
    const html = buildWithLayout('sidebar', [section]);
    expect(html).toContain('data-animation="stagger"');
  });

  it('should set data-theme on html element', () => {
    const html = buildWithLayout('sidebar', undefined, { theme: 'dracula' } as any);
    expect(html).toContain('data-theme="dracula"');
  });
});

// ---------------------------------------------------------------------------
// Layout Routing
// ---------------------------------------------------------------------------

describe('Layout Routing', () => {
  it('should use layout over navigationStyle when both provided', () => {
    const html = buildHTML({
      title: 'Route Test',
      theme: 'tokyo_night',
      navigationStyle: 'sidebar',
      layout: 'editorial',
      sections: makeSections(1),
    });
    expect(html).toContain('class="layout-editorial"');
    // Body content should not contain the sidebar layout wrapper
    expect(html).not.toContain('class="layout-sidebar"');
  });

  it('should fall back to sidebar layout when navigationStyle is sidebar and no layout', () => {
    const html = buildHTML({
      title: 'Fallback Test',
      theme: 'tokyo_night',
      navigationStyle: 'sidebar',
      sections: makeSections(1),
    });
    expect(html).toContain('layout-sidebar');
  });

  it('should fall back to minimal layout when navigationStyle is minimal and no layout', () => {
    const html = buildHTML({
      title: 'Fallback Test',
      theme: 'tokyo_night',
      navigationStyle: 'minimal',
      sections: makeSections(1),
    });
    expect(html).toContain('layout-minimal');
  });

  it('should render each new layout with its unique wrapper class', () => {
    const layoutClassMap: Record<string, string> = {
      comparison: 'layout-comparison',
      briefing: 'layout-briefing',
      tutorial: 'layout-tutorial',
      scorecard: 'layout-scorecard',
      report: 'layout-report',
      dossier: 'layout-dossier',
      dialogue: 'layout-dialogue',
    };
    for (const [layout, className] of Object.entries(layoutClassMap)) {
      const html = buildWithLayout(layout as LayoutTemplate);
      expect(html).toContain(className);
    }
  });
});

// ---------------------------------------------------------------------------
// CSS Completeness
// ---------------------------------------------------------------------------

describe('CSS Completeness', () => {
  const html = buildWithLayout('sidebar');

  it('should include CSS for all new layout containers', () => {
    const containers = [
      '.layout-comparison', '.layout-briefing', '.layout-tutorial',
      '.layout-scorecard', '.layout-report', '.layout-dossier',
      '.layout-dialogue',
    ];
    for (const selector of containers) {
      expect(html).toContain(selector);
    }
  });

  it('should include CSS for presentation slide types', () => {
    expect(html).toContain('.slide-statement');
    expect(html).toContain('.slide-full-width');
    expect(html).toContain('.slide-metric');
    expect(html).toContain('.metric-display');
  });

  it('should include CSS for magazine enhancements', () => {
    expect(html).toContain('.pull-quote');
    expect(html).toContain('.magazine-lead');
    expect(html).toContain('.magazine-rhythm-break');
  });

  it('should include CSS for editorial breakout', () => {
    expect(html).toContain('.layout-editorial .editorial-section.breakout');
  });

  it('should include CSS for minimal hero', () => {
    expect(html).toContain('.minimal-hero');
    expect(html).toContain('.minimal-hero.fill-viewport');
    expect(html).toContain('.minimal-supporting');
  });

  it('should include responsive rules for dialogue and comparison columns', () => {
    expect(html).toContain('.dialogue-positions');
    expect(html).toContain('.comparison-columns');
  });

  it('should use density CSS variables in cards and grids', () => {
    expect(html).toContain('var(--layout-gap)');
    expect(html).toContain('var(--section-padding-v)');
    expect(html).toContain('var(--section-padding-h)');
  });
});
