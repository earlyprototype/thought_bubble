/**
 * Font Infrastructure for thought_bubble
 * 
 * Supports both Google Fonts (via <link>) and self-hosted fonts
 * (via @font-face with CDN URLs from Fontshare, GitHub, etc.)
 */

export interface FontFaceSource {
  /** URL to the font file (woff2 preferred) */
  url: string;
  /** Font weight (e.g., '400', '300 900' for variable) */
  weight: string;
  /** Font style - 'normal' or 'italic' */
  style?: string;
  /** Format hint (woff2, woff, truetype) */
  format?: string;
}

export interface FontSource {
  type: 'google' | 'fontface';
  /** For type 'google': the full Google Fonts URL */
  googleUrl?: string;
  /** For type 'fontface': inline @font-face declarations */
  fontFaces?: Array<{
    family: string;
    sources: FontFaceSource[];
    display?: string;
  }>;
}

/**
 * Fontshare CDN base URL.
 * Fontshare serves variable fonts via their API at api.fontshare.com.
 * Format: https://api.fontshare.com/v2/css?f[]=<font-slug>@<weights>&display=swap
 */
const FONTSHARE_BASE = 'https://api.fontshare.com/v2/css';

/**
 * Pre-configured font sources for all fonts used across themes.
 * Keyed by the font family name as used in CSS.
 */
export const fontRegistry: Record<string, FontSource> = {
  // -- Fontshare fonts --
  'Satoshi': {
    type: 'fontface',
    fontFaces: [{
      family: 'Satoshi',
      sources: [{
        url: `${FONTSHARE_BASE}?f[]=satoshi@300,400,500,700&display=swap`,
        weight: '300 700',
        format: 'woff2',
      }],
      display: 'swap',
    }],
  },
  'General Sans': {
    type: 'fontface',
    fontFaces: [{
      family: 'General Sans',
      sources: [{
        url: `${FONTSHARE_BASE}?f[]=general-sans@200,300,400,500,600,700&display=swap`,
        weight: '200 700',
        format: 'woff2',
      }],
      display: 'swap',
    }],
  },
  'Clash Display': {
    type: 'fontface',
    fontFaces: [{
      family: 'Clash Display',
      sources: [{
        url: `${FONTSHARE_BASE}?f[]=clash-display@200,300,400,500,600,700&display=swap`,
        weight: '200 700',
        format: 'woff2',
      }],
      display: 'swap',
    }],
  },
  'Switzer': {
    type: 'fontface',
    fontFaces: [{
      family: 'Switzer',
      sources: [{
        url: `${FONTSHARE_BASE}?f[]=switzer@100,200,300,400,500,600,700,800,900&display=swap`,
        weight: '100 900',
        format: 'woff2',
      }],
      display: 'swap',
    }],
  },

  // -- Google Fonts (existing) --
  'Instrument Serif': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap',
  },
  'Inter': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
  },
  'JetBrains Mono': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap',
  },
  'Space Grotesk': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap',
  },
  'IBM Plex Sans': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500&display=swap',
  },
  'IBM Plex Mono': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap',
  },
  'Fraunces': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;600;800&display=swap',
  },
  'Source Sans 3': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500&display=swap',
  },
  'Source Code Pro': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap',
  },
  'Newsreader': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Newsreader:wght@300;400;500;700&display=swap',
  },
  'Literata': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Literata:wght@400;500&display=swap',
  },
  'Fira Code': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap',
  },
  'Atkinson Hyperlegible Next': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&display=swap',
  },
  'Plus Jakarta Sans': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  },
  'Source Serif 4': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500&display=swap',
  },
  'Outfit': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap',
  },
  'Azeret Mono': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;500;700&display=swap',
  },
  'Cormorant': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;500;700&display=swap',
  },
  'Lora': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500&display=swap',
  },
  'Courier Prime': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap',
  },
  'DM Sans': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
  },
  'Victor Mono': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Victor+Mono:wght@400;500&display=swap',
  },
  'Vollkorn': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Vollkorn:wght@400;500;600;700&display=swap',
  },
  'Commit Mono': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Commit+Mono:wght@400;700&display=swap',
  },
  'Martian Mono': {
    type: 'google',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Martian+Mono:wght@400;500;700&display=swap',
  },
};

/**
 * Collect all unique font families used by a set of themes, then generate
 * the appropriate HTML to load them (mix of <link> and <style> blocks).
 */
export function generateFontHTML(fontFamilies: string[]): string {
  const uniqueFamilies = [...new Set(fontFamilies)];
  const googleUrls = new Set<string>();
  const fontFaceBlocks: string[] = [];

  for (const family of uniqueFamilies) {
    const source = fontRegistry[family];
    if (!source) continue;

    if (source.type === 'google' && source.googleUrl) {
      googleUrls.add(source.googleUrl);
    } else if (source.type === 'fontface' && source.fontFaces) {
      for (const face of source.fontFaces) {
        // Fontshare serves CSS directly via their API endpoint,
        // so we treat it the same as Google Fonts -- just a <link> tag.
        for (const s of face.sources) {
          if (s.url.startsWith(FONTSHARE_BASE)) {
            googleUrls.add(s.url);
          }
        }
      }
    }
  }

  let html = '';

  // Preconnect hints
  if (googleUrls.size > 0) {
    html += '  <link rel="preconnect" href="https://fonts.googleapis.com">\n';
    html += '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n';

    const hasFontshare = [...googleUrls].some(u => u.includes('fontshare'));
    if (hasFontshare) {
      html += '  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>\n';
    }
  }

  // Stylesheet links
  for (const url of googleUrls) {
    html += `  <link rel="stylesheet" href="${url}">\n`;
  }

  // Inline @font-face blocks (for non-CDN sources)
  if (fontFaceBlocks.length > 0) {
    html += `  <style>\n${fontFaceBlocks.join('\n')}\n  </style>\n`;
  }

  return html;
}

/**
 * Extract all font families from a theme's typography definition.
 */
export function getThemeFontFamilies(typography: {
  display: { family: string };
  body: { family: string };
  mono: { family: string };
}): string[] {
  return [
    typography.display.family,
    typography.body.family,
    typography.mono.family,
  ];
}
