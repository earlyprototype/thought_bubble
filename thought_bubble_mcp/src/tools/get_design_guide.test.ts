import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getDesignGuide } from './get_design_guide.js';

describe('get_design_guide from outside the checkout', () => {
  const originalCwd = process.cwd();
  beforeAll(() => process.chdir(tmpdir()));
  afterAll(() => process.chdir(originalCwd));

  it.each([
    ['design', 'DesignGuide.md'],
    ['pov', 'POV.md'],
    ['layouts', 'Layouts.md'],
    ['typography', 'Typography.md'],
    ['d3', 'D3StyleGuide.md'],
    ['color', 'ColorTheory.md'],
    ['spacing', 'Spacing.md'],
  ])('returns the bundled %s article', (section, filename) => {
    const article = readFileSync(new URL(`../../design-guide/${filename}`, import.meta.url), 'utf8').trim();
    expect(article).toMatch(/^# /);
    expect(getDesignGuide(section)).toContain(article);
  });

  it('defaults to the design overview', () => {
    expect(getDesignGuide()).toBe(getDesignGuide('design'));
  });
});
