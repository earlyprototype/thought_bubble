# thought_bubble Prompt Template

**Abrakedabra - your boring documents are now a lovely website with logical flow**

Copy this prompt and use it with any LLM (Claude, ChatGPT, etc.) to generate interactive HTML visualisations.

---

## PROMPT FOR LLM:

```
You are an expert at creating beautiful, interactive HTML visualisations from documentation and structured content.

# YOUR WORKFLOW (TWO PHASES)

## PHASE 1: ANALYSIS & DISCOVERY
First, analyze the provided content and present to the user:

1. **Identified Workflows** - List key processes, flows, or sequences you found
2. **System Components** - List major systems, services, or architectural elements
3. **Data Models** - List entities, objects, or data structures
4. **Relationships** - List important connections or integrations

For each item, ask: "Would you like a Mermaid diagram for this?"

Present as a numbered list with brief descriptions. Example:
```
I've identified these visualisation opportunities:

WORKFLOWS:
1. User Authentication Flow (login → verification → session)
2. Payment Processing (checkout → payment → confirmation)

SYSTEMS:
3. Microservices Architecture (API Gateway, Auth Service, Payment Service)
4. Data Pipeline (ingestion → processing → storage)

DATA MODELS:
5. User Object (properties: id, email, role, permissions)
6. Order Schema (customer, items, payment, status)

Which would you like me to create Mermaid diagrams for? (respond with numbers, e.g., "1, 3, 5")
```

## PHASE 2: GENERATION
After user selects diagram options, generate a **complete, self-contained HTML file**.

# FRAMEWORK ASSETS

You have access to:
- Essential design rules (ESSENTIAL_DESIGN_RULES.md)
- Component library (cards, timelines, badges, grids)
- Colour themes (professional, dark, technical)
- Navigation patterns (sidebar, tabs)
- Mermaid diagram support
- Responsive layouts

# DESIGN PRINCIPLES

Follow ESSENTIAL_DESIGN_RULES.md. Core principles:

1. **Visual Hierarchy** - Size, colour, spacing guide the eye
2. **Consistency** - Uniform spacing, colours, typography
3. **Progressive Disclosure** - Overview first, details on demand
4. **Accessibility** - WCAG AA contrast (4.5:1), semantic HTML, keyboard navigation
5. **Responsive** - Mobile-first, works on all screen sizes

# OUTPUT REQUIREMENTS

Generate a **complete, self-contained HTML file** that:

1. **Includes everything inline** (CSS in `<style>`, JS in `<script>`)
2. **Uses CDN for Mermaid only** (if diagrams selected)
3. **Works immediately** when opened in a browser
4. **Is fully responsive** (mobile, tablet, desktop)
5. **Includes navigation** for content with 3+ sections
6. **Uses semantic HTML** (proper heading hierarchy, ARIA labels)

# MERMAID DIAGRAM TYPES

Choose appropriate diagram type based on content:

- **Flowchart** (`graph LR/TD`) - Processes, decision trees, workflows
- **Sequence** - Interactions, API calls, communication flows
- **Class** - Data models, object relationships, schemas
- **ER (Entity-Relationship)** - Database schemas, data relationships
- **State** - State machines, status transitions
- **Architecture (C4)** - System architecture, component diagrams

# QUALITY CHECKLIST

Before outputting, verify:
- [ ] All selected diagrams included and rendering
- [ ] Navigation works (smooth scroll)
- [ ] Responsive (320px, 768px, 1024px widths)
- [ ] Colour contrast sufficient (4.5:1 minimum)
- [ ] Keyboard accessible
- [ ] No console errors
- [ ] File is self-contained

# NOW BEGIN

Analyze the content below and present the Phase 1 discovery list.

**CONTENT TO ANALYZE:**

[User will paste their content here]

---

**Additional User Preferences (Optional):**

Theme: [professional/dark/technical - default: professional]
Navigation style: [sidebar/tabs/minimal - default: sidebar if 5+ sections]
Focus: [what to emphasize]

---

Start with Phase 1 analysis.
```

---

## HOW TO USE THIS PROMPT

### Step 1: Copy the Prompt
Copy everything from "You are an expert..." to "Start with Phase 1 analysis."

### Step 2: Add Your Content
Replace `[User will paste their content here]` with your actual content (markdown, text, documentation, etc.)

### Step 3: Specify Preferences (Optional)
Fill in the "Additional User Preferences" section if you have specific requirements

### Step 4: Send to LLM
Send the complete prompt to Claude, ChatGPT, or any capable LLM

### Step 5: Review Analysis (Phase 1)
The LLM will present identified workflows, systems, and data models. Review the list.

### Step 6: Select Diagrams
Respond with the numbers of items you want as Mermaid diagrams (e.g., "1, 3, 5, 7")

### Step 7: Get Your Visualisation (Phase 2)
LLM generates the complete HTML file with your selected diagrams

### Step 8: Save and View
Save the output to a .html file and open in your browser

---

## EXAMPLE WORKFLOW

### Your Input:
```
[Paste the prompt template with your documentation about an e-commerce system]
```

### Phase 1 - LLM Response:
```
I've identified these visualisation opportunities:

WORKFLOWS:
1. User Registration Flow (signup → email verification → profile setup)
2. Order Processing (cart → checkout → payment → fulfilment)
3. Return Process (request → approval → shipping → refund)

SYSTEMS:
4. Microservices Architecture (API Gateway, Auth, Inventory, Payment, Notification)
5. Database Schema (Users, Products, Orders, Payments)

DATA MODELS:
6. User Object (id, email, role, preferences, order_history)
7. Product Schema (sku, name, price, inventory, categories)
8. Order Entity (customer, items, payment_status, shipping_status)

Which would you like me to create Mermaid diagrams for?
```

### Your Selection:
```
2, 4, 6
```

### Phase 2 - LLM Generates:
Complete HTML visualisation with:
- Flowchart for Order Processing
- Architecture diagram for Microservices
- Class diagram for User Object
- All other content as formatted cards/sections

---

## TIPS FOR BEST RESULTS

### Content Preparation

**Good Source Content:**
- Clear headings and structure
- Lists of components/systems
- Process descriptions
- API or data model documentation
- Existing Mermaid diagrams (will be included automatically)

**Example:**
```markdown
# Payment Gateway Integration

## System Components
- API Gateway: Routes requests
- Auth Service: Validates tokens
- Payment Processor: Handles transactions
- Notification Service: Sends confirmations

## Payment Flow
1. User submits payment details
2. System validates card information
3. Creates transaction record
4. Processes payment via Stripe
5. Sends confirmation email
```

### Selecting Diagrams

**Choose diagrams that:**
- Clarify complex relationships
- Show process flows
- Illustrate system architecture
- Map data structures

**Skip diagrams for:**
- Simple lists (cards work better)
- Content that's already clear
- When text is sufficient

### After Generation

You can request refinements:
- "Add more spacing between sections"
- "Make the sidebar darker"
- "Change to technical theme"
- "Add an accordion for the API reference section"

---

## TROUBLESHOOTING

**Phase 1 didn't identify key systems?**
- Ensure your content has clear headings
- Add explicit sections: "## System Architecture" or "## Data Models"
- Provide more detail about processes and components

**Diagrams not rendering?**
- Check browser console for errors
- Verify Mermaid CDN is loaded (should be in `<script>` tag)
- Complex diagrams may need syntax adjustments

**Too many/too few options in Phase 1?**
- Tell the LLM: "Focus only on high-level workflows" or "Include more granular systems"

**Output missing content?**
- Check the generated HTML - all content should be included, diagrams or not
- Request: "Include the API reference section that was missed"

---

**Ready to transform your documentation into beautiful, interactive visualisations!**
