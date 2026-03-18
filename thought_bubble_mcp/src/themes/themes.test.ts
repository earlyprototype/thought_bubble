/**
 * Theme System Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  themes, 
  getTheme, 
  getThemeNames, 
  getThemesByCategory, 
  getThemesByMode,
  themeToCSSVariables,
  themeToCSS,
  type ThemeName 
} from './index.js';

describe('Theme System', () => {
  describe('Theme Registry', () => {
    it('should have exactly 12 themes', () => {
      const themeNames = getThemeNames();
      expect(themeNames).toHaveLength(12);
    });

    it('should have 7 new themes', () => {
      const newThemes = getThemesByCategory('new');
      expect(newThemes).toHaveLength(7);
    });

    it('should have 5 original themes', () => {
      const originalThemes = getThemesByCategory('original');
      expect(originalThemes).toHaveLength(5);
    });

    it('should include expected theme names', () => {
      const themeNames = getThemeNames();
      expect(themeNames).toContain('tokyo_night');
      expect(themeNames).toContain('dracula');
      expect(themeNames).toContain('professional');
    });
  });

  describe('Theme Structure', () => {
    it('each theme should have required core colors', () => {
      for (const [id, theme] of Object.entries(themes)) {
        expect(theme.core).toBeDefined();
        expect(theme.core.bg).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.core.fg).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.core.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.core.muted).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });

    it('each theme should have required scales', () => {
      for (const [id, theme] of Object.entries(themes)) {
        expect(theme.scales).toBeDefined();
        expect(theme.scales.primary).toHaveLength(5);
        expect(theme.scales.sequential).toHaveLength(9);
        expect(theme.scales.diverging).toHaveLength(11);
      }
    });

    it('each theme should have semantic colors', () => {
      for (const [id, theme] of Object.entries(themes)) {
        expect(theme.semantic).toBeDefined();
        expect(theme.semantic.success).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.semantic.warning).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.semantic.error).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.semantic.info).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });

    it('each theme should have UI colors', () => {
      for (const [id, theme] of Object.entries(themes)) {
        expect(theme.ui).toBeDefined();
        expect(theme.ui.surface).toBeDefined();
        expect(theme.ui.border).toBeDefined();
        expect(theme.ui.shadow).toBeDefined();
        expect(theme.ui.textSecondary).toBeDefined();
      }
    });

    it('each theme should have valid metadata', () => {
      for (const [id, theme] of Object.entries(themes)) {
        expect(theme.id).toBe(id);
        expect(theme.name).toBeTruthy();
        expect(['new', 'original']).toContain(theme.category);
        expect(['dark', 'light']).toContain(theme.mode);
      }
    });
  });

  describe('Theme Access', () => {
    it('getTheme should return correct theme', () => {
      const theme = getTheme('tokyo_night');
      expect(theme.id).toBe('tokyo_night');
      expect(theme.name).toBe('Tokyo Night');
    });

    it('getTheme should throw for unknown theme', () => {
      expect(() => getTheme('nonexistent' as ThemeName)).toThrow('Unknown theme');
    });

    it('getThemesByMode should filter correctly', () => {
      const darkThemes = getThemesByMode('dark');
      const lightThemes = getThemesByMode('light');
      
      expect(darkThemes.length).toBeGreaterThan(0);
      expect(lightThemes.length).toBeGreaterThan(0);
      expect(darkThemes.every(t => t.mode === 'dark')).toBe(true);
      expect(lightThemes.every(t => t.mode === 'light')).toBe(true);
    });
  });

  describe('Theme Conversion', () => {
    it('themeToCSSVariables should generate valid CSS variables', () => {
      const theme = getTheme('tokyo_night');
      const cssVars = themeToCSSVariables(theme);
      
      expect(cssVars['--bg']).toBe(theme.core.bg);
      expect(cssVars['--fg']).toBe(theme.core.fg);
      expect(cssVars['--accent']).toBe(theme.core.accent);
      expect(cssVars['--success']).toBe(theme.semantic.success);
      expect(cssVars['--scale-1']).toBe(theme.scales.primary[0]);
    });

    it('themeToCSS should generate valid CSS string', () => {
      const theme = getTheme('tokyo_night');
      const css = themeToCSS(theme);
      
      expect(css).toContain(':root {');
      expect(css).toContain('--bg:');
      expect(css).toContain('--fg:');
      expect(css).toContain('}');
    });
  });
});
