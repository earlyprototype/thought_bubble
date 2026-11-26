#!/usr/bin/env node

/**
 * thought_bubble MCP Server
 * 
 * Transforms documentation into beautiful interactive HTML visualizations
 * using AI-powered analysis and server-side rendered Mermaid/D3 diagrams.
 * 
 * Features:
 * - 12 curated themes (7 new + 5 original)
 * - Server-side SVG rendering with beautiful-mermaid
 * - D3 chart support (bar, pie, line, gantt, etc.)
 * - Self-contained HTML output (no CDN dependencies)
 * - Live theme switching
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server, getWorkspaceConfig } from './server.js';

/**
 * Graceful shutdown -- ensures server.close() is called when
 * Cursor kills the MCP process or an unrecoverable error occurs.
 */
const cleanup = () => {
  console.error('thought_bubble MCP Server shutting down...');
  server.close();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

process.on('exit', () => {
  console.error('thought_bubble MCP Server exited');
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  cleanup();
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  const config = getWorkspaceConfig();
  
  // Log to stderr (stdout is reserved for MCP protocol messages)
  console.error('thought_bubble MCP Server v0.2.0 running on stdio');
  console.error('Features: beautiful-mermaid + D3 | 12 themes | Server-side SVG');
  console.error('Workspace:', config.workspace);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
