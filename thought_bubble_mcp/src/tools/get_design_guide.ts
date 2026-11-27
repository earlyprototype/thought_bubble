import { readFileSync } from 'node:fs';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

const guideFiles: Record<string, string> = {
  design: 'DesignGuide.md',
  layouts: 'Layouts.md',
  typography: 'Typography.md',
  d3: 'D3StyleGuide.md',
  spacing: 'Spacing.md',
  color: 'ColorTheory.md',
  pov: 'POV.md',
};

export function getDesignGuide(section: unknown = 'design'): string {
  if (typeof section !== 'string' || !Object.hasOwn(guideFiles, section)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      `Unknown section: ${section}. Valid sections: ${Object.keys(guideFiles).join(', ')}`
    );
  }

  const source = `design-guide/${guideFiles[section]}`;
  try {
    const article = readFileSync(new URL(`../../${source}`, import.meta.url), 'utf8');
    return `# Design Guide: ${section}\n\n${article}\n\n---\n\nSource: ${source}`;
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to read design guide: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
