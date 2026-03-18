#!/usr/bin/env node
/**
 * Extract individual test documents from test_inputs_for_mcp.md
 * Creates separate markdown files for each test case
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputFile = join(__dirname, '..', '..', 'test_inputs_for_mcp.md');
const outputDir = join(__dirname, '..', '..', 'test_inputs');

// Read the source file
const content = readFileSync(inputFile, 'utf-8');

// Split by test headings (## Test N:)
const testPattern = /^## Test \d+:.*$/gm;
const parts = content.split(testPattern);

// First part is the header/intro, skip it
const tests = parts.slice(1);

// Create output directory
mkdirSync(outputDir, { recursive: true });

// Extract and save each test
tests.forEach((testContent, index) => {
  const testNum = index + 1;
  
  // Trim leading/trailing whitespace and remove any markdown code fence wrappers
  let cleaned = testContent.trim();
  
  // Remove the wrapping ``` if present at start and end
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  
  // Remove any remaining empty lines at start
  cleaned = cleaned.replace(/^\n+/, '');
  
  const filename = `test_${testNum}.md`;
  const filepath = join(outputDir, filename);
  
  writeFileSync(filepath, cleaned);
  console.log(`Created: ${filename} (${cleaned.length} chars)`);
});

console.log(`\nExtracted ${tests.length} test documents to ${outputDir}/`);
