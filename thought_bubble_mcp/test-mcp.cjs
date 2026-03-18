#!/usr/bin/env node

/**
 * Test MCP Server - Lists available tools
 */

const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'dist', 'index.js');

console.log('Testing MCP Server:', serverPath);
console.log('---');

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let buffer = '';

server.stdout.on('data', (data) => {
  buffer += data.toString();
  
  // Try to parse JSON-RPC messages
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  lines.forEach(line => {
    if (line.trim()) {
      try {
        const msg = JSON.parse(line);
        console.log('Received:', JSON.stringify(msg, null, 2));
      } catch (e) {
        console.log('Raw:', line);
      }
    }
  });
});

server.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

// Send list tools request
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

setTimeout(() => {
  console.log('\nSending tools/list request...\n');
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 500);

// Send get_design_guide test
const testRequest = {
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: {
    name: 'get_design_guide',
    arguments: { section: 'd3' }
  }
};

setTimeout(() => {
  console.log('\nSending get_design_guide test...\n');
  server.stdin.write(JSON.stringify(testRequest) + '\n');
}, 2000);

setTimeout(() => {
  server.kill();
  process.exit(0);
}, 4000);
