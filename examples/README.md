# thought_bubble Examples

**Abrakedabra - your boring documents are now a lovely website with logical flow**

This folder contains example HTML visualizations demonstrating different use cases for the thought_bubble framework.

## Live Diagram Examples

These are actual Mermaid diagrams extracted from our example visualisations, rendered natively in GitHub:

### Flowchart: User Registration Flow
```mermaid
flowchart TD
    Start([User Visits Registration]) --> Submit[Submit Email & Password]
    Submit --> Validate{Validate Credentials}
    Validate -->|Valid| SendEmail[Send Verification Email]
    Validate -->|Invalid| Error[Show Error Message]
    Error --> Submit
    SendEmail --> WaitClick[Wait for User Action]
    WaitClick --> Click[User Clicks Activation Link]
    Click --> Activate[Activate Account]
    Activate --> Success([Registration Complete])
    
    style Start fill:#e1f5ff
    style Success fill:#d4edda
    style Error fill:#f8d7da
    style Activate fill:#d4edda
```

### Graph: Microservices Architecture
```mermaid
graph TB
    subgraph Frontend
        UI[Web Application]
        Mobile[Mobile App]
    end
    
    subgraph API_Gateway
        Gateway[API Gateway<br/>Kong]
    end
    
    subgraph Services
        Auth[Auth Service]
        Product[Product Service]
        Order[Order Service]
        Payment[Payment Service]
        Notification[Notification Service]
    end
    
    subgraph DataLayer
        AuthDB[(Auth DB)]
        ProductDB[(Product DB)]
        OrderDB[(Order DB)]
        Cache[(Redis Cache)]
    end
    
    subgraph MessageBus
        Queue[RabbitMQ]
    end
    
    UI --> Gateway
    Mobile --> Gateway
    Gateway --> Auth
    Gateway --> Product
    Gateway --> Order
    Gateway --> Payment
    
    Auth --> AuthDB
    Product --> ProductDB
    Order --> OrderDB
    
    Product --> Cache
    
    Order --> Queue
    Payment --> Queue
    Queue --> Notification
```

### Flowchart: Service Integration Points
```mermaid
flowchart LR
    User[User Request] --> UserService[User Service]
    UserService -->|JWT Token| OrderService[Order Service]
    
    OrderService -->|Check Stock| ProductCatalog[Product Catalog]
    ProductCatalog -->|Stock Available| OrderService
    
    OrderService -->|Process Payment| PaymentGateway[Payment Gateway]
    PaymentGateway -->|Charge Card| Stripe[Stripe API]
    Stripe -->|Success/Failure| PaymentGateway
    
    PaymentGateway -->|Payment Confirmed| OrderService
    OrderService -->|Order Complete| UserService
    UserService -->|Send Confirmation| Email[Email Service]
    
    style UserService fill:#dae8fc
    style OrderService fill:#fff2cc
    style PaymentGateway fill:#f8cecc
    style ProductCatalog fill:#d5e8d4
```

### Sequence Diagram: Order Processing
```mermaid
sequenceDiagram
    participant User
    participant UserService as User Service
    participant ProductCatalog as Product Catalog
    participant OrderService as Order Service
    participant PaymentGateway as Payment Gateway
    participant Stripe
    
    User->>UserService: Login Request
    UserService-->>User: JWT Token
    
    User->>ProductCatalog: Browse Products
    ProductCatalog-->>User: Product List
    
    User->>OrderService: Add to Cart
    OrderService->>ProductCatalog: Check Stock
    ProductCatalog-->>OrderService: Stock Available
    OrderService-->>User: Item Added
    
    User->>OrderService: Checkout
    OrderService->>UserService: Verify User
    UserService-->>OrderService: User Verified
    
    OrderService->>PaymentGateway: Process Payment
    PaymentGateway->>Stripe: Charge Card
    Stripe-->>PaymentGateway: Payment Success
    PaymentGateway-->>OrderService: Payment Confirmed
    
    OrderService->>ProductCatalog: Update Stock
    OrderService-->>User: Order Confirmation
```

### ER Diagram: Database Schema
```mermaid
erDiagram
    Users ||--o{ Orders : places
    Products ||--o{ Orders : "included in"
    
    Users {
        int id PK
        string email
        string password_hash
        datetime created_at
    }
    
    Products {
        int id PK
        string name
        decimal price
        int stock
    }
    
    Orders {
        int id PK
        int user_id FK
        decimal total
        string status
    }
```

### Graph: Pattern Integration System
```mermaid
graph TB
    subgraph PatternSystem[Pattern Extraction System]
        Pattern[Pattern Node]
        Requirement[Requirement Node]
        Technology[Technology Node]
        Constraint[Constraint Node]
        
        Pattern -->|SOLVED_BY| Requirement
        Pattern -->|USES| Technology
        Pattern -->|REQUIRES| Constraint
    end
    
    subgraph IDERuleSystem[IDE Rule Library System]
        IDERule[IDERule Node]
    end
    
    subgraph SharedRepo[Shared Repository Context]
        GitHubRepo[GitHub Repository<br/>source_repo URL]
    end
    
    GitHubRepo -.->|source_repo| Pattern
    GitHubRepo -.->|source_repo| IDERule
    
    Pattern -->|HAS_IDE_RULES| IDERule
    
    classDef patternStyle fill:#e1f5ff,stroke:#0066cc
    classDef ruleStyle fill:#fff4e1,stroke:#ff9900
    classDef repoStyle fill:#e8f5e9,stroke:#2e7d32
    
    class Pattern,Requirement,Technology,Constraint patternStyle
    class IDERule ruleStyle
    class GitHubRepo repoStyle
```

### Class Diagram: Data Models
```mermaid
classDiagram
    class Pattern {
        +string source_repo
        +string name
        +int stars
        +float quality_score
        +float freshness_score
        +float maintenance_score
        +float validation_score
        +float judge_score
        +string confidence
        +string reasoning
        +boolean needs_review
        +datetime extracted_at
    }
    
    class IDERule {
        +string id
        +string source_repo
        +string file_path
        +string file_format
        +string content
        +string purpose
        +list~string~ categories
        +list~string~ key_practices
        +list~string~ technologies
        +list~string~ project_types
        +list~string~ ide_types
        +float quality_score
        +int confidence_level
    }
    
    Pattern "1" --> "*" IDERule : has
```

### Graph: Team Current State Analysis
```mermaid
graph TB
    subgraph CurrentState[Current State - Unclear Boundaries]
        OM[Operations Manager<br/>3 years tenure]
        TM[Technical Manager<br/>2.5 years tenure]
        BD[Development Manager<br/>1 year tenure]
        
        OM -.->|unclear boundaries| TM
        TM -.->|unclear boundaries| BD
        BD -.->|unclear boundaries| OM
        
        OM -.->|ad-hoc decisions| Decision{Decision Making?}
        TM -.->|ad-hoc decisions| Decision
        BD -.->|ad-hoc decisions| Decision
    end
    
    Decision -.->|unclear authority| Confusion[Confusion & Stress]
    
    classDef person fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef problem fill:#ffebee,stroke:#c62828,stroke-width:2px
    
    class OM,TM,BD person
    class Decision,Confusion problem
```

### Graph: Proposed Framework Structure
```mermaid
graph TB
    subgraph ProposedState[Proposed State - Clear Structure]
        TC[Team Charter<br/>Living Document]
        
        TC --> RC[Role Clarity<br/>RACI Framework]
        TC --> DF[Decision Framework<br/>Authority Matrix]
        TC --> CP[Communication Protocols<br/>Clear Channels]
        TC --> SS[Support Structures<br/>Mutual Aid]
        TC --> WW[Ways of Working<br/>Boundaries]
        
        RC --> Clarity[Clarity & Sustainability]
        DF --> Clarity
        CP --> Clarity
        SS --> Clarity
        WW --> Clarity
    end
    
    classDef charter fill:#e8f5e9,stroke:#2e7d32,stroke-width:3px
    classDef component fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef outcome fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class TC charter
    class RC,DF,CP,SS,WW component
    class Clarity outcome
```

### Sequence Diagram: API Gateway Flow
```mermaid
sequenceDiagram
    participant User
    participant Gateway
    participant Auth
    participant Order
    participant Payment
    participant Queue
    participant Notification
    
    User->>Gateway: POST /orders
    Gateway->>Auth: Verify Token
    Auth-->>Gateway: Token Valid
    Gateway->>Order: Create Order
    Order->>Payment: Process Payment
    Payment-->>Order: Payment Success
    Order->>Queue: Publish OrderCreated Event
    Order-->>Gateway: Order Confirmation
    Gateway-->>User: 201 Created
    Queue->>Notification: OrderCreated Event
    Notification->>User: Send Email Confirmation
```

### State Diagram: Order Lifecycle
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: Submit Order
    Pending --> Processing: Payment Approved
    Pending --> Cancelled: Payment Failed
    Processing --> Shipped: Order Dispatched
    Processing --> Cancelled: Out of Stock
    Shipped --> Delivered: Delivery Confirmed
    Delivered --> Returned: Return Requested
    Returned --> Refunded: Return Processed
    Cancelled --> [*]
    Refunded --> [*]
    Delivered --> [*]
```

### Gantt Chart: Project Timeline
```mermaid
gantt
    title Project Development Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements Gathering    :done,    req, 2026-01-01, 2026-01-14
    Design & Wireframes       :done,    des, 2026-01-15, 2026-01-28
    section Development
    Backend API               :active,  dev1, 2026-01-29, 30d
    Frontend Components       :         dev2, after dev1, 25d
    Integration               :         dev3, after dev2, 15d
    section Testing
    QA Testing                :         test, after dev3, 20d
    Bug Fixes                 :         fix, after test, 10d
    section Deployment
    Production Release        :         rel, after fix, 5d
```

### Journey: User Onboarding Experience
```mermaid
journey
    title New User Onboarding Journey
    section Discovery
      Visit Homepage: 5: User
      Read Features: 4: User
      View Examples: 5: User
    section Registration
      Sign Up: 3: User
      Verify Email: 2: User
      Complete Profile: 4: User
    section First Use
      Watch Tutorial: 4: User
      Create First Project: 3: User
      Invite Team Member: 5: User
    section Adoption
      Daily Usage: 5: User
      Explore Features: 4: User
      Upgrade Plan: 5: User
```

### Git Graph: Development Workflow
```mermaid
gitgraph
    commit id: "Initial commit"
    commit id: "Add base template"
    branch feature/auth
    checkout feature/auth
    commit id: "Add login page"
    commit id: "Add authentication"
    checkout main
    branch feature/dashboard
    checkout feature/dashboard
    commit id: "Create dashboard layout"
    commit id: "Add widgets"
    checkout main
    merge feature/auth
    commit id: "Update dependencies"
    checkout feature/dashboard
    commit id: "Polish dashboard"
    checkout main
    merge feature/dashboard tag: "v1.0.0"
    commit id: "Production release"
```

### Pie Chart: Technology Stack Distribution
```mermaid
pie title Technology Usage in Project
    "JavaScript/TypeScript" : 42
    "Python" : 28
    "CSS/HTML" : 15
    "Configuration" : 10
    "Documentation" : 5
```

### Quadrant Chart: Feature Priority Matrix
```mermaid
quadrantChart
    title Feature Prioritisation
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Do Later
    quadrant-2 Quick Wins
    quadrant-3 Fill Ins
    quadrant-4 Major Projects
    User Authentication: [0.8, 0.9]
    Dark Mode: [0.2, 0.6]
    Export PDF: [0.4, 0.8]
    Social Login: [0.6, 0.5]
    Mobile App: [0.9, 0.8]
    Email Notifications: [0.3, 0.7]
    Analytics Dashboard: [0.7, 0.6]
    API Documentation: [0.2, 0.4]
```

---

## Examples

### 1. Pattern-Rule Integration Example (The Original)
**File:** `pattern_rule_integration_example.html`

**Use Case:** The visualization that started it all! Technical knowledge graph integration documentation

**Features Demonstrated:**
- Technical architecture diagrams (Mermaid)
- Class diagrams for data models
- Sidebar navigation
- Property lists for API specifications
- Code blocks with syntax highlighting (Neo4j Cypher)
- Gradient use case cards
- Quality scoring comparison tables
- Integration point documentation
- System independence documentation

**Best For:**
- Technical system integration specs
- API documentation
- Database schema visualization
- Knowledge graph documentation
- Architecture decision records
- System design documents

---

### 2. System Architecture Example
**File:** `system_architecture_example.html`

**Use Case:** Visualizing technical system architecture and microservices

**Features Demonstrated:**
- Sidebar navigation
- Mermaid diagrams (architecture, sequence)
- Component cards with colour categorization
- Property list cards for specifications
- Responsive grid layout
- Professional theme

**Best For:**
- Technical documentation
- System design documents
- Architecture decision records
- Integration guides

---

### 3. AI-Powered Learning Path
**File:** `learning_path_example.html`

**Use Case:** Educational journey and skill development tracking

**Features Demonstrated:**
- Hero section with statistics
- Timeline layout (4-week progression)
- Progress bars for skill tracking
- Accordion FAQs (common pitfalls)
- Code blocks with copy buttons
- Resource cards with links
- Colour-coded timeline markers

**Best For:**
- Course curricula
- Onboarding guides
- Training programs
- Skill development paths
- Tutorial series

---

### 4. Travel Itinerary Planner
**File:** `travel_itinerary_example.html`

**Use Case:** Complete travel guide with day-by-day planning

**Features Demonstrated:**
- Sticky top navigation
- Day-by-day timeline cards
- Budget breakdown with gradient cards
- Comparison table (accommodations)
- Packing list with categories
- Tips and emergency information
- Non-technical, universal appeal

**Best For:**
- Trip planning guides
- Event schedules
- Conference agendas
- Workshop timetables
- Personal planning

---

## How to Use These Examples

### 1. Open Directly
Simply open any HTML file in your web browser:
```bash
# Windows
start examples/system_architecture_example.html

# macOS
open examples/system_architecture_example.html

# Linux
xdg-open examples/system_architecture_example.html
```

### 2. As Templates
Copy an example and modify it for your needs:
```bash
cp examples/system_architecture_example.html my-documentation.html
# Edit my-documentation.html with your content
```

### 3. As Learning Material
Study the examples to understand:
- How components are structured
- How themes are applied
- How Mermaid diagrams are integrated
- How responsive layouts work
- How navigation is implemented

---

## Customization Tips

### Change Theme
Replace the CSS variables in the `:root` selector:
```css
:root {
    --primary: #your-color;
    --secondary: #your-color;
    /* etc. */
}
```

### Remove Sidebar
1. Delete the `<aside class="sidebar">` section
2. Change `.main-content { margin-left: 280px; }` to `margin-left: 0;`

### Add Components
Copy component styles from `LLM_Design_Assets/components/` and paste into the `<style>` section.

### Modify Layout
Change the grid columns:
```css
.grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    /* Adjust minmax values for different card sizes */
}
```

---

## Creating Your Own

### Option 1: Use the Prompt Template
1. Open `prompt_template.md`
2. Add your content
3. Send to an LLM (Claude, ChatGPT)
4. Receive custom HTML visualization

### Option 2: Use Base Template
1. Copy `base_template.html`
2. Replace placeholder content
3. Add components from the component library
4. Customize styles as needed

### Option 3: Modify Examples
1. Copy an example that matches your needs
2. Replace content sections
3. Adjust colors/styling
4. Remove/add sections as needed

---

## Component Reference

All examples use components from:
- `LLM_Design_Assets/components/cards.html`
- `LLM_Design_Assets/components/navigation.html`
- `LLM_Design_Assets/components/diagrams.html`
- `LLM_Design_Assets/components/layouts.html`

Refer to these files for:
- Available component styles
- Usage examples
- Customization options

---

## Browser Compatibility

All examples work in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS, Android)

**Note:** Mermaid diagrams require JavaScript enabled.

---

## Tips for Best Results

### Performance
- Keep diagrams reasonably sized
- Use CSS animations sparingly
- Test on mobile devices

### Accessibility
- Maintain heading hierarchy (h1 → h2 → h3)
- Ensure color contrast meets WCAG AA
- Test keyboard navigation
- Add alt text to images

### Content
- Break long sections into cards
- Use diagrams for complex relationships
- Add navigation for documents with 5+ sections
- Include table of contents for long pages

---

## Need Help?

Refer to:
- `README.md` - Main documentation
- `prompt_template.md` - LLM prompts
- `LLM_Design_Assets/design_rules.md` - Design guidance
- Component library files for specific components

---

**These examples demonstrate the versatility of the Doc Visualizer framework. Use them as inspiration for your own documentation!**
