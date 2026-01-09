# Testing Guide

How to test your thought_bubble MCP server.

## Quick Test

After building (`npm run build`), verify the server starts:

```bash
cd thought_bubble_mcp
node dist/index.js
```

Expected output (to stderr):
```
thought_bubble MCP Server running on stdio
```

The server is now waiting for JSON-RPC messages on stdin. Press `Ctrl+C` to exit.

## Manual JSON-RPC Testing

### Test 1: List Tools

**Send** (paste this and press Enter):
```json
{"jsonrpc":"2.0","id":1,"method":"tools/list"}
```

**Expected Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "analyze_content",
        "description": "Analyze documentation content...",
        "inputSchema": {...}
      },
      {
        "name": "generate_visualization",
        "description": "Generate an interactive HTML...",
        "inputSchema": {...}
      }
    ]
  }
}
```

### Test 2: Call analyze_content

**Send**:
```json
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"analyze_content","arguments":{"content":"# Payment System\n\n## Components\n- API Gateway\n- Auth Service\n- Payment Processor\n\n## Flow\n1. User submits payment\n2. Gateway validates\n3. Processor charges card"}}}
```

**Expected Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "ANALYSIS PROMPT FOR LLM:\n\nAnalyze the following content..."
      }
    ]
  }
}
```

### Test 3: Call generate_visualization

**Send**:
```json
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"generate_visualization","arguments":{"content":"# Payment System","selectedSystems":[{"id":1,"title":"Payment Flow","description":"User payment process","diagramType":"flowchart"}],"theme":"professional","navigationStyle":"sidebar"}}}
```

**Expected Response**:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "STEP 1: GENERATE MERMAID DIAGRAMS..."
      }
    ]
  }
}
```

## Testing with AI Clients

### Claude Desktop

1. Add configuration to `claude_desktop_config.json`
2. Restart Claude Desktop
3. Start new conversation
4. Type: "What tools do you have available?"
5. Verify `analyze_content` and `generate_visualization` appear

### Test Conversation Script

```
You: Can you list the MCP tools available?

Claude: I have access to:
- analyze_content - Analyze documentation...
- generate_visualization - Generate interactive HTML...

You: Great! Use analyze_content on this:

# E-commerce Platform

## Services
- User Service: Authentication and profiles
- Product Service: Catalog management  
- Order Service: Shopping cart and checkout
- Payment Service: Stripe integration

## User Registration Flow
1. Submit email/password
2. Validate credentials
3. Send verification email
4. User activates account

Claude: [Uses analyze_content tool]
I've analyzed your content and identified:

WORKFLOWS:
1. User Registration Flow - Email submission through account activation

SYSTEMS:
2. Microservices Architecture - User, Product, Order, and Payment services

Which would you like me to visualize?

You: Let's visualize both with flowchart and c4 diagrams

Claude: [Uses generate_visualization tool]
[Generates Mermaid diagrams]
[Generates final HTML]
Here's your interactive visualization!
```

## Validation Checklist

### Server Health
- [ ] Server starts without errors
- [ ] Responds to `tools/list` request
- [ ] Responds to `tools/call` requests
- [ ] Returns properly formatted JSON-RPC responses
- [ ] Handles invalid tool names gracefully
- [ ] Handles invalid parameters gracefully

### Tool: analyze_content
- [ ] Accepts content parameter
- [ ] Rejects missing content parameter
- [ ] Returns analysis prompt
- [ ] Prompt includes content
- [ ] Prompt has clear instructions

### Tool: generate_visualization
- [ ] Accepts all required parameters
- [ ] Rejects missing required parameters
- [ ] Validates selectedSystems array structure
- [ ] Validates diagramType enum values
- [ ] Applies theme correctly
- [ ] Applies navigationStyle correctly
- [ ] Returns two-step prompt structure

### Integration
- [ ] AI client recognizes server
- [ ] AI client can list tools
- [ ] AI client can call tools
- [ ] Prompts generate valid LLM responses
- [ ] Mermaid diagrams render correctly
- [ ] Final HTML is valid and renders

## Common Issues

### Issue: Server not found by AI client

**Symptoms**: Tools don't appear in AI assistant

**Solutions**:
1. Check config file path is correct
2. Use absolute paths in config
3. Verify server builds: `npm run build`
4. Restart AI client completely

**Test**:
```bash
# Verify dist/index.js exists
ls -la thought_bubble_mcp/dist/index.js

# Try running manually
node thought_bubble_mcp/dist/index.js
# Should print: "thought_bubble MCP Server running on stdio"
```

### Issue: Invalid JSON-RPC responses

**Symptoms**: AI client shows errors

**Solutions**:
1. Check for syntax errors: `npm run build`
2. Verify TypeScript types are correct
3. Test with manual JSON-RPC messages

**Test**:
```bash
# Check build errors
npm run build

# Run with sample input
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

### Issue: Tool parameters validation fails

**Symptoms**: "Invalid parameters" errors

**Solutions**:
1. Check Zod schema definitions
2. Verify input matches schema exactly
3. Check for required vs optional fields

**Test**:
```typescript
// In src/tools/analyze_content.ts
console.error('Received input:', JSON.stringify(input, null, 2));
```

### Issue: Prompts not generating expected output

**Symptoms**: LLM returns unexpected results

**Solutions**:
1. Review prompt templates in `src/prompts/templates.ts`
2. Test prompts directly with LLM
3. Adjust template wording
4. Add more specific instructions

**Test**:
```bash
# Check prompt output
node dist/index.js
# Send analyze_content call
# Copy prompt from response
# Test directly with ChatGPT/Claude
```

## Debug Mode

Add debug logging to `src/index.ts`:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error('[DEBUG] Tool call:', request.params.name);
  console.error('[DEBUG] Arguments:', JSON.stringify(request.params.arguments, null, 2));
  
  // ... rest of handler
  
  console.error('[DEBUG] Response:', JSON.stringify(response, null, 2));
  return response;
});
```

Rebuild and check stderr output:
```bash
npm run build
node dist/index.js 2> debug.log
# In another terminal, send test requests
# Check debug.log for detailed traces
```

## Performance Testing

### Latency Test

```bash
# Time a tool call
time echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
# Should be < 200ms
```

### Memory Test

```bash
# Check memory usage
node --trace-gc dist/index.js
# Monitor RSS memory, should stay < 100MB
```

### Stress Test

```bash
# Multiple rapid calls
for i in {1..10}; do
  echo '{"jsonrpc":"2.0","id":'$i',"method":"tools/list"}' | node dist/index.js &
done
wait
# All should complete successfully
```

## Test Coverage Goals

- ✅ Unit tests: Tool functions
- ✅ Integration tests: Full JSON-RPC flow
- ✅ E2E tests: With real AI client
- ✅ Validation tests: Schema enforcement
- ✅ Error handling: Edge cases

## Automated Testing (Future)

Create `src/test/` directory with:

```typescript
// src/test/tools.test.ts
import { analyzeContent } from '../tools/analyze_content';

test('analyzeContent generates prompt', () => {
  const result = analyzeContent({ content: 'Test content' });
  expect(result).toContain('ANALYSIS PROMPT FOR LLM');
  expect(result).toContain('Test content');
});
```

Run with:
```bash
npm install --save-dev jest @types/jest ts-jest
npm test
```

---

## Testing Best Practices

1. **Start simple**: Test server startup first
2. **Isolate**: Test each tool independently  
3. **Document**: Note expected vs actual behaviour
4. **Automate**: Write tests for regressions
5. **Iterate**: Refine prompts based on real usage

**Happy testing!**
