# thought_bubble Workflow Diagram

Working file to iterate on the "How It Works" diagram for the README.

## Process Description
- Thought_bubble MCP server loaded upon session start
- User adds documentation to LLM context 
- User asks "Use thought-bubble to analyse and visualise this documentation"
- LLM calls MCP analyse_content tool
- MCP analyses content and identifies systems, workflows, data models
- LLM presents options to user
- User selects which items to visualise
- LLM calls MCP generate_visualisation tool with selected items
- MCP generates Mermaid diagrams and complete HTML visualisation
- User opens HTML file in browser

## Elements:
- Document(s)
- LLM code-assistant
- MCP (thought_bubble)
- User (optional)


## Draft Flowchart:

```mermaid
flowchart TD
    Doc[📄 Documentation] --> Assistant[🤖 LLM Code Assistant]
    Assistant --> MCP1[🔧 MCP: analyse_content]
    MCP1 --> Analysis[Systems & workflows identified]
    Analysis --> Assistant2[🤖 Assistant presents options]
    Assistant2 --> MCP2[🔧 MCP: generate_visualisation]
    MCP2 --> HTML[📊 Interactive HTML + Mermaid diagrams]
    
    style Doc fill:#e1f5ff
    style HTML fill:#d4edda
    style MCP1 fill:#fff4e1
    style MCP2 fill:#fff4e1
```

## Notes:
- Shows the flow without user interactions
- Focuses on the technical components
- Simple and clean
- Can be refined
