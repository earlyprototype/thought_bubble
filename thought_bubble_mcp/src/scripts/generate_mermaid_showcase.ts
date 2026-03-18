/**
 * Mermaid Diagram Showcase
 * 
 * Demonstrates the FULL range of SUPPORTED Mermaid diagram capabilities:
 * - Flowcharts (decision trees, processes, architecture)
 * - Sequence diagrams (API calls, interactions)
 * - Class diagrams (data models, schemas)
 * - Entity-Relationship diagrams (database design)
 * - State diagrams (state machines, workflows)
 * 
 * NOTE: C4 diagrams are NOT supported by beautiful-mermaid.
 * Architecture diagrams use flowcharts with subgraphs instead.
 * 
 * Combined with strategic D3 charts where data visualisation adds value.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { renderMermaidDiagram } from '../renderers/mermaid_renderer.js';
import { 
  renderBarChart, 
  renderPieChart, 
  renderLineChart, 
  renderGanttChart, 
  renderTimelineChart,
  type BarChartData, 
  type PieChartData, 
  type LineChartData,
  type GanttChartData,
  type TimelineData,
} from '../renderers/d3_renderer.js';
import { buildHTML, type Section } from '../builders/html_builder.js';
import { getTheme } from '../themes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// EXAMPLE 1: System Architecture Documentation
// Showcases: Architecture Flowcharts, Sequence diagrams
// ============================================================================

async function generateSystemArchitecture() {
  console.log('\n1. Generating System Architecture Documentation...');
  const theme = getTheme('github_dark');

  // System Context Diagram (using flowchart - C4 not supported by beautiful-mermaid)
  const systemContext = `flowchart TB
    subgraph Users
        customer[Customer]
        admin[Admin Staff]
    end
    
    subgraph Platform["E-Commerce Platform"]
        ecommerce[Core Platform]
    end
    
    subgraph External["External Services"]
        payment[Payment Gateway]
        shipping[Shipping Provider]
        email[Email Service]
        analytics[Analytics]
    end
    
    customer -->|Browse & Purchase| ecommerce
    admin -->|Manage Products| ecommerce
    ecommerce -->|Process Payments| payment
    ecommerce -->|Ship Orders| shipping
    ecommerce -->|Send Notifications| email
    ecommerce -->|Track Events| analytics
    
    style customer fill:#4ade80,stroke:#22c55e
    style admin fill:#60a5fa,stroke:#3b82f6
    style ecommerce fill:#a78bfa,stroke:#8b5cf6
    style payment fill:#fbbf24,stroke:#f59e0b
    style shipping fill:#fbbf24,stroke:#f59e0b
    style email fill:#fbbf24,stroke:#f59e0b
    style analytics fill:#fbbf24,stroke:#f59e0b`;

  // Container/Architecture Diagram (using flowchart with subgraphs)
  const containerDiagram = `flowchart LR
    customer[Customer Browser]
    
    subgraph Platform["E-Commerce Platform"]
        subgraph Frontend
            web[Web App<br/>React/Next.js]
        end
        
        subgraph Services["Microservices"]
            api[API Gateway<br/>Node.js]
            catalog[Catalog Service<br/>Go]
            cart[Cart Service<br/>Node.js]
            order[Order Service<br/>Java/Spring]
            inventory[Inventory Service<br/>Go]
        end
        
        subgraph Data["Data Stores"]
            postgres[(PostgreSQL)]
            elastic[(Elasticsearch)]
            redis[(Redis Cache)]
        end
    end
    
    customer -->|HTTPS| web
    web -->|REST| api
    api -->|gRPC| catalog
    api -->|gRPC| cart
    api -->|gRPC| order
    catalog --> elastic
    cart --> redis
    order --> postgres
    inventory --> postgres
    
    style web fill:#61dafb,stroke:#21a1c9
    style api fill:#68a063,stroke:#3c873a
    style catalog fill:#00add8,stroke:#007d9c
    style cart fill:#68a063,stroke:#3c873a
    style order fill:#f89820,stroke:#b07219
    style inventory fill:#00add8,stroke:#007d9c
    style postgres fill:#336791,stroke:#1d4e6c,color:#fff
    style elastic fill:#fed10a,stroke:#d4a900
    style redis fill:#dc382d,stroke:#a6281e,color:#fff`;

  // Checkout Flow (Flowchart)
  const checkoutFlow = `flowchart TD
    Start([Customer clicks Checkout]) --> Auth{Authenticated?}
    Auth -->|No| Login[Show Login/Register]
    Auth -->|Yes| Address[Enter Shipping Address]
    Login --> Address
    
    Address --> Validate{Address Valid?}
    Validate -->|No| AddressError[Show Error]
    AddressError --> Address
    Validate -->|Yes| Shipping[Select Shipping Method]
    
    Shipping --> Payment[Enter Payment Details]
    Payment --> Process{Process Payment}
    
    Process -->|Declined| PaymentError[Show Error]
    PaymentError --> Payment
    Process -->|Success| Confirm[Create Order]
    
    Confirm --> Inventory[Reserve Inventory]
    Inventory --> Email[Send Confirmation]
    Email --> Complete([Order Complete])
    
    style Start fill:#238636,color:#fff
    style Complete fill:#238636,color:#fff
    style PaymentError fill:#da3633,color:#fff
    style AddressError fill:#da3633,color:#fff`;

  // Order Processing Sequence
  const orderSequence = `sequenceDiagram
    autonumber
    participant C as Customer
    participant W as Web App
    participant A as API Gateway
    participant O as Order Service
    participant I as Inventory Service
    participant P as Payment Gateway
    participant E as Email Service
    
    C->>W: Submit Order
    W->>A: POST /orders
    A->>A: Validate JWT
    A->>O: CreateOrder(cart, address)
    
    O->>I: ReserveItems(items)
    alt Items Available
        I-->>O: Reserved
        O->>P: ProcessPayment(amount)
        alt Payment Success
            P-->>O: Confirmed
            O->>I: CommitReservation()
            O->>E: SendConfirmation(order)
            E-->>C: Order Confirmation Email
            O-->>A: Order Created
            A-->>W: 201 Created
            W-->>C: Show Success Page
        else Payment Failed
            P-->>O: Declined
            O->>I: ReleaseReservation()
            O-->>A: Payment Failed
            A-->>W: 402 Payment Required
            W-->>C: Show Error
        end
    else Items Unavailable
        I-->>O: Insufficient Stock
        O-->>A: Stock Error
        A-->>W: 409 Conflict
        W-->>C: Show Stock Error
    end`;

  // Service Health (D3 Bar)
  const serviceHealth: BarChartData[] = [
    { label: 'Web App', value: 99.9 },
    { label: 'API Gateway', value: 99.8 },
    { label: 'Catalog', value: 99.7 },
    { label: 'Cart', value: 99.9 },
    { label: 'Order', value: 99.6 },
    { label: 'Inventory', value: 99.8 },
  ];

  // Request Volume (D3 Line)
  const requestVolume: LineChartData[] = [
    { x: '00:00', y: 1200 },
    { x: '04:00', y: 800 },
    { x: '08:00', y: 3500 },
    { x: '12:00', y: 8200 },
    { x: '16:00', y: 9500 },
    { x: '20:00', y: 6800 },
    { x: '23:59', y: 2400 },
  ];

  const systemContextSvg = await renderMermaidDiagram(systemContext, theme);
  const containerSvg = await renderMermaidDiagram(containerDiagram, theme);
  const flowSvg = await renderMermaidDiagram(checkoutFlow, theme);
  const sequenceSvg = await renderMermaidDiagram(orderSequence, theme);
  const healthSvg = renderBarChart(serviceHealth, theme, { title: 'Service Uptime (% Last 30 Days)' });
  const volumeSvg = renderLineChart(requestVolume, theme, { title: 'Requests per Minute (Today)' });

  const sections: Section[] = [
    {
      id: 'context',
      title: 'System Context',
      content: `<p>The e-commerce platform sits at the centre of our ecosystem, interfacing with customers, 
      administrators, and four external systems. This context diagram shows the high-level boundaries and data flows.</p>`,
      diagram: { svg: systemContextSvg.svg, caption: 'System Context: Platform and external dependencies' },
    },
    {
      id: 'containers',
      title: 'Container Architecture',
      content: `<p>Inside the platform boundary, we run six services plus three data stores. The API Gateway 
      handles authentication and routing. Services communicate via gRPC for performance.</p>`,
      diagram: { svg: containerSvg.svg, caption: 'Architecture: Services and data stores' },
    },
    {
      id: 'checkout',
      title: 'Checkout Flow',
      content: `<p>The checkout process handles authentication, address validation, shipping selection, 
      payment processing, and inventory reservation. Each failure state returns the user to the appropriate step.</p>`,
      diagram: { svg: flowSvg.svg, caption: 'Flowchart: Complete checkout decision tree' },
    },
    {
      id: 'sequence',
      title: 'Order Processing Sequence',
      content: `<p>This sequence diagram shows the happy path and two failure modes (payment declined, 
      stock unavailable). Note the inventory reservation pattern: reserve before payment, release on failure.</p>`,
      diagram: { svg: sequenceSvg.svg, caption: 'Sequence: Order creation with failure handling' },
    },
    {
      id: 'health',
      title: 'Service Health',
      content: `<p>All services maintaining 99.6%+ uptime. Order service had a brief incident last week 
      (database failover) but recovered within SLA.</p>`,
      diagram: { svg: healthSvg.svg, caption: '30-day uptime by service' },
    },
    {
      id: 'traffic',
      title: 'Traffic Patterns',
      content: `<p>Peak traffic at 16:00 (9,500 RPM). Night-time baseline around 1,000 RPM. 
      Auto-scaling triggers at 7,500 RPM to handle afternoon surge.</p>`,
      diagram: { svg: volumeSvg.svg, caption: 'Request volume throughout the day' },
    },
  ];

  return buildHTML({
    title: 'E-Commerce Platform Architecture',
    subtitle: 'System Design Documentation',
    theme: 'github_dark',
    navigationStyle: 'sidebar',
    layout: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Platform Engineering Team - Architecture Docs v2.4',
  });
}

// ============================================================================
// EXAMPLE 2: Database Schema Documentation
// Showcases: ER diagrams, Class diagrams
// ============================================================================

async function generateDatabaseSchema() {
  console.log('\n2. Generating Database Schema Documentation...');
  const theme = getTheme('solarized_dark');

  // Main ER Diagram
  const erDiagram = `erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ ADDRESS : has
    USER ||--o{ CART : owns
    USER {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        timestamp created_at
        timestamp last_login
        enum status
    }
    
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER ||--|| ADDRESS : "ships to"
    ORDER ||--o| PAYMENT : "paid by"
    ORDER {
        uuid id PK
        uuid user_id FK
        uuid shipping_address_id FK
        decimal total_amount
        enum status
        timestamp created_at
        timestamp shipped_at
    }
    
    ORDER_ITEM }|--|| PRODUCT : references
    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price
        decimal discount
    }
    
    PRODUCT ||--o{ PRODUCT_IMAGE : has
    PRODUCT }|--|| CATEGORY : "belongs to"
    PRODUCT ||--o{ INVENTORY : tracks
    PRODUCT {
        uuid id PK
        uuid category_id FK
        string sku UK
        string name
        text description
        decimal price
        boolean active
    }
    
    CATEGORY ||--o{ CATEGORY : "parent of"
    CATEGORY {
        uuid id PK
        uuid parent_id FK
        string name
        string slug UK
        int sort_order
    }
    
    ADDRESS {
        uuid id PK
        uuid user_id FK
        string line1
        string line2
        string city
        string state
        string postal_code
        string country
        boolean is_default
    }
    
    CART ||--|{ CART_ITEM : contains
    CART_ITEM }|--|| PRODUCT : references
    CART {
        uuid id PK
        uuid user_id FK
        timestamp updated_at
    }
    
    INVENTORY {
        uuid id PK
        uuid product_id FK
        uuid warehouse_id FK
        int quantity
        int reserved
    }
    
    PAYMENT {
        uuid id PK
        uuid order_id FK
        string provider
        string transaction_id
        decimal amount
        enum status
        timestamp processed_at
    }`;

  // User Model Class Diagram
  const userClassDiagram = `classDiagram
    class User {
        +UUID id
        +String email
        +String passwordHash
        +String firstName
        +String lastName
        +DateTime createdAt
        +DateTime lastLogin
        +UserStatus status
        +authenticate(password) bool
        +updateProfile(data) void
        +resetPassword(token) void
    }
    
    class UserStatus {
        <<enumeration>>
        PENDING
        ACTIVE
        SUSPENDED
        DELETED
    }
    
    class Address {
        +UUID id
        +UUID userId
        +String line1
        +String line2
        +String city
        +String state
        +String postalCode
        +String country
        +bool isDefault
        +validate() bool
        +format() String
    }
    
    class Order {
        +UUID id
        +UUID userId
        +UUID shippingAddressId
        +Decimal totalAmount
        +OrderStatus status
        +DateTime createdAt
        +DateTime shippedAt
        +addItem(product, qty) void
        +removeItem(itemId) void
        +calculateTotal() Decimal
        +ship() void
        +cancel() void
    }
    
    class OrderStatus {
        <<enumeration>>
        PENDING
        PAID
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
        REFUNDED
    }
    
    User "1" --> "*" Address : has
    User "1" --> "*" Order : places
    User --> UserStatus
    Order --> OrderStatus
    Order "*" --> "1" Address : ships to`;

  // Table Sizes (D3 Bar)
  const tableSizes: BarChartData[] = [
    { label: 'order_items', value: 48.2 },
    { label: 'products', value: 12.8 },
    { label: 'orders', value: 8.4 },
    { label: 'users', value: 2.1 },
    { label: 'inventory', value: 1.8 },
    { label: 'categories', value: 0.02 },
  ];

  // Query Performance (D3 Bar)
  const queryPerf: BarChartData[] = [
    { label: 'Product Search', value: 45 },
    { label: 'Order History', value: 120 },
    { label: 'Cart Load', value: 12 },
    { label: 'Checkout', value: 85 },
    { label: 'Inventory Check', value: 8 },
  ];

  // Growth Trend (D3 Line)
  const growthTrend: LineChartData[] = [
    { x: 'Jan', y: 2.1 },
    { x: 'Feb', y: 2.4 },
    { x: 'Mar', y: 2.8 },
    { x: 'Apr', y: 3.2 },
    { x: 'May', y: 3.8 },
    { x: 'Jun', y: 4.5 },
  ];

  const erSvg = await renderMermaidDiagram(erDiagram, theme);
  const classSvg = await renderMermaidDiagram(userClassDiagram, theme);
  const sizeSvg = renderBarChart(tableSizes, theme, { title: 'Table Size (GB)' });
  const perfSvg = renderBarChart(queryPerf, theme, { title: 'P95 Query Latency (ms)' });
  const growthSvg = renderLineChart(growthTrend, theme, { title: 'Database Size Growth (TB)', area: true });

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Schema Overview',
      content: `<p>The e-commerce database consists of 12 core tables organised around four domains: 
      Users, Products, Orders, and Inventory. All tables use UUIDs as primary keys for distributed 
      system compatibility.</p>`,
      diagram: { svg: erSvg.svg, caption: 'Entity-Relationship diagram showing all tables and relationships' },
    },
    {
      id: 'domain',
      title: 'User Domain Model',
      content: `<p>The User aggregate includes authentication, profile management, and addresses. 
      Status transitions are enforced at the application layer. Password hashing uses bcrypt with 
      cost factor 12.</p>`,
      diagram: { svg: classSvg.svg, caption: 'Class diagram showing User domain with methods' },
    },
    {
      id: 'sizes',
      title: 'Storage Analysis',
      content: `<p>order_items dominates storage at 48GB (denormalised for query performance). 
      Products table includes full-text search vectors. Total database size: 73GB.</p>`,
      diagram: { svg: sizeSvg.svg, caption: 'Table sizes as of June 2025' },
    },
    {
      id: 'performance',
      title: 'Query Performance',
      content: `<p>All critical paths under 150ms P95. Product search uses Elasticsearch, not direct 
      PostgreSQL queries. Cart operations are Redis-backed with async persistence.</p>`,
      diagram: { svg: perfSvg.svg, caption: 'P95 latency for key query patterns' },
    },
    {
      id: 'growth',
      title: 'Growth Projection',
      content: `<p>Database growing at 0.4TB/month. Current retention: 3 years order history, 
      1 year deleted user data. Archive strategy: move orders older than 2 years to cold storage.</p>`,
      diagram: { svg: growthSvg.svg, caption: 'Monthly database size trend' },
    },
  ];

  return buildHTML({
    title: 'Database Schema Documentation',
    subtitle: 'E-Commerce Platform Data Model',
    theme: 'solarized_dark',
    navigationStyle: 'sidebar',
    layout: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Data Engineering Team - Schema Version 3.2.1',
  });
}

// ============================================================================
// EXAMPLE 3: State Machine Documentation
// Showcases: State diagrams, flowcharts
// ============================================================================

async function generateStateMachine() {
  console.log('\n3. Generating State Machine Documentation...');
  const theme = getTheme('dracula');

  // Order State Machine
  const orderStateMachine = `stateDiagram-v2
    [*] --> Pending: Order Created
    
    Pending --> PaymentProcessing: Customer submits payment
    PaymentProcessing --> Paid: Payment successful
    PaymentProcessing --> PaymentFailed: Payment declined
    PaymentFailed --> Pending: Customer retries
    PaymentFailed --> Cancelled: Timeout (30 min)
    
    Paid --> Processing: Warehouse notified
    Processing --> ReadyToShip: Items picked and packed
    ReadyToShip --> Shipped: Carrier collected
    
    Shipped --> InTransit: Tracking updated
    InTransit --> OutForDelivery: Last mile
    OutForDelivery --> Delivered: POD received
    
    Delivered --> [*]
    
    Paid --> Cancelled: Customer request
    Processing --> Cancelled: Stock issue
    Cancelled --> Refunded: Refund processed
    Refunded --> [*]
    
    Delivered --> ReturnRequested: Customer initiates
    ReturnRequested --> ReturnApproved: Within policy
    ReturnRequested --> ReturnDenied: Outside policy
    ReturnApproved --> ReturnReceived: Item returned
    ReturnReceived --> Refunded: Inspection passed
    ReturnDenied --> [*]
    
    note right of Pending: TTL: 30 minutes
    note right of Processing: SLA: 24 hours
    note right of Shipped: Tracking required`;

  // Subscription State Machine
  const subscriptionStateMachine = `stateDiagram-v2
    [*] --> Trial: User signs up
    
    Trial --> Active: Payment method added
    Trial --> Expired: 14-day trial ends
    Expired --> Active: User converts
    Expired --> [*]: No conversion
    
    Active --> PastDue: Payment failed
    PastDue --> Active: Payment recovered
    PastDue --> Cancelled: 3 failed attempts
    
    Active --> Paused: User request
    Paused --> Active: User resumes
    Paused --> Cancelled: 90-day limit
    
    Active --> Cancelled: User cancels
    Cancelled --> Active: User resubscribes
    
    note right of Trial: Free features only
    note right of PastDue: Grace period: 7 days
    note right of Paused: Max 90 days`;

  // Payment Flow (Flowchart)
  const paymentFlow = `flowchart TD
    subgraph Initiate
        A[Receive Payment Request] --> B{Valid Cart?}
        B -->|No| C[Return Error]
        B -->|Yes| D[Create Payment Intent]
    end
    
    subgraph Process
        D --> E{Payment Method}
        E -->|Card| F[Stripe Charge]
        E -->|PayPal| G[PayPal Capture]
        E -->|Wallet| H[Apple/Google Pay]
        
        F --> I{3DS Required?}
        I -->|Yes| J[3DS Challenge]
        I -->|No| K[Direct Charge]
        J --> K
        
        G --> K
        H --> K
    end
    
    subgraph Result
        K --> L{Success?}
        L -->|Yes| M[Update Order]
        L -->|No| N{Retryable?}
        N -->|Yes| O[Queue Retry]
        N -->|No| P[Mark Failed]
        M --> Q[Send Receipt]
    end
    
    style C fill:#ff5555
    style P fill:#ff5555
    style M fill:#50fa7b
    style Q fill:#50fa7b`;

  // State Transition Counts (D3 Bar)
  const transitionCounts: BarChartData[] = [
    { label: 'Pending → Paid', value: 8420 },
    { label: 'Paid → Processing', value: 8350 },
    { label: 'Processing → Shipped', value: 8280 },
    { label: 'Shipped → Delivered', value: 8150 },
    { label: 'Any → Cancelled', value: 620 },
    { label: 'Any → Refunded', value: 180 },
  ];

  // Time in State (D3 Bar)
  const timeInState: BarChartData[] = [
    { label: 'Pending', value: 8 },
    { label: 'Processing', value: 18 },
    { label: 'ReadyToShip', value: 4 },
    { label: 'Shipped', value: 2 },
    { label: 'InTransit', value: 72 },
  ];

  const orderStateSvg = await renderMermaidDiagram(orderStateMachine, theme);
  const subStateSvg = await renderMermaidDiagram(subscriptionStateMachine, theme);
  const paymentSvg = await renderMermaidDiagram(paymentFlow, theme);
  const transitionSvg = renderBarChart(transitionCounts, theme, { title: 'State Transitions (Last 30 Days)' });
  const timeSvg = renderBarChart(timeInState, theme, { title: 'Avg. Time in State (Hours)' });

  const sections: Section[] = [
    {
      id: 'order',
      title: 'Order State Machine',
      content: `<p>Orders progress through 12 possible states from creation to completion. The happy path 
      is Pending → Paid → Processing → Shipped → Delivered. Cancellations and returns branch off at 
      various points.</p>`,
      diagram: { svg: orderStateSvg.svg, caption: 'Complete order lifecycle with all transitions' },
    },
    {
      id: 'subscription',
      title: 'Subscription Lifecycle',
      content: `<p>SaaS subscription state machine with trial, active, paused, and cancelled states. 
      Payment failures trigger the PastDue state with a 7-day grace period before cancellation.</p>`,
      diagram: { svg: subStateSvg.svg, caption: 'Subscription state transitions' },
    },
    {
      id: 'payment',
      title: 'Payment Processing Flow',
      content: `<p>Payment flow handles multiple payment methods (Card, PayPal, Wallets), 3D Secure 
      challenges, and retry logic. Failed payments are queued for retry up to 3 times.</p>`,
      diagram: { svg: paymentSvg.svg, caption: 'Payment processing decision tree' },
    },
    {
      id: 'transitions',
      title: 'Transition Analysis',
      content: `<p>8,420 orders entered Paid state last month. 620 cancellations (7.4% rate, within 
      target). 180 refunds (2.1% of completed orders).</p>`,
      diagram: { svg: transitionSvg.svg, caption: 'Most common state transitions' },
    },
    {
      id: 'timing',
      title: 'State Duration',
      content: `<p>InTransit is the longest state (72 hours average, carrier-dependent). Processing 
      averages 18 hours (target: 24 hours SLA). Pending should never exceed 30 minutes (abandoned cart).</p>`,
      diagram: { svg: timeSvg.svg, caption: 'Average duration in each state' },
    },
  ];

  return buildHTML({
    title: 'State Machine Documentation',
    subtitle: 'Order and Subscription Lifecycles',
    theme: 'dracula',
    navigationStyle: 'sidebar',
    layout: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Engineering Team - State Machines v1.4',
  });
}

// ============================================================================
// EXAMPLE 4: API Integration Guide
// Showcases: Sequence diagrams, flowcharts
// ============================================================================

async function generateAPIGuide() {
  console.log('\n4. Generating API Integration Guide...');
  const theme = getTheme('tokyo_night');

  // OAuth Flow
  const oauthFlow = `sequenceDiagram
    autonumber
    participant App as Your App
    participant Auth as Auth Server
    participant API as Resource API
    participant User as User Browser
    
    App->>User: Redirect to /authorize
    User->>Auth: GET /authorize?client_id=...
    Auth->>User: Show login form
    User->>Auth: Submit credentials
    Auth->>Auth: Validate user
    Auth->>User: Redirect to callback
    User->>App: GET /callback?code=xyz
    
    App->>Auth: POST /token (code + secret)
    Auth->>Auth: Validate code
    Auth-->>App: access_token + refresh_token
    
    App->>API: GET /resource (Bearer token)
    API->>API: Validate JWT
    API-->>App: Resource data
    
    Note over App,API: Token expires after 1 hour
    
    App->>Auth: POST /token (refresh_token)
    Auth-->>App: New access_token`;

  // Webhook Flow
  const webhookFlow = `sequenceDiagram
    participant Platform as Our Platform
    participant Queue as Message Queue
    participant Worker as Webhook Worker
    participant Client as Your Server
    
    Platform->>Queue: Event occurs
    Queue->>Worker: Dequeue event
    Worker->>Worker: Sign payload (HMAC-SHA256)
    Worker->>Client: POST /webhook (signed)
    
    alt Success (2xx)
        Client-->>Worker: 200 OK
        Worker->>Worker: Mark delivered
    else Failure (4xx/5xx)
        Client-->>Worker: Error
        Worker->>Queue: Schedule retry
        Note over Queue,Worker: Exponential backoff: 1m, 5m, 30m, 2h, 24h
    else Timeout
        Worker->>Queue: Schedule retry
    end
    
    Note over Client: Verify signature before processing
    Note over Client: Respond within 30 seconds`;

  // Error Handling (Flowchart)
  const errorHandling = `flowchart TD
    A[API Request] --> B{Response Code}
    
    B -->|2xx| C[Success - Process Response]
    
    B -->|400| D[Bad Request]
    D --> D1[Check request body]
    D1 --> D2[Validate required fields]
    
    B -->|401| E[Unauthorized]
    E --> E1{Token expired?}
    E1 -->|Yes| E2[Refresh token]
    E2 --> A
    E1 -->|No| E3[Re-authenticate]
    
    B -->|403| F[Forbidden]
    F --> F1[Check permissions]
    
    B -->|404| G[Not Found]
    G --> G1[Verify resource ID]
    
    B -->|429| H[Rate Limited]
    H --> H1[Read Retry-After header]
    H1 --> H2[Wait and retry]
    H2 --> A
    
    B -->|5xx| I[Server Error]
    I --> I1[Retry with backoff]
    I1 --> I2{Max retries?}
    I2 -->|No| A
    I2 -->|Yes| I3[Alert + fail]
    
    style C fill:#9ece6a
    style I3 fill:#f7768e`;

  // Rate Limits (D3 Bar)
  const rateLimits: BarChartData[] = [
    { label: 'Free Tier', value: 100 },
    { label: 'Starter', value: 1000 },
    { label: 'Professional', value: 5000 },
    { label: 'Enterprise', value: 20000 },
  ];

  // Response Times (D3 Line)
  const responseTimes: LineChartData[] = [
    { x: 'P50', y: 45 },
    { x: 'P75', y: 78 },
    { x: 'P90', y: 124 },
    { x: 'P95', y: 186 },
    { x: 'P99', y: 342 },
  ];

  // Endpoint Usage (D3 Pie)
  const endpointUsage: PieChartData[] = [
    { label: 'GET /products', value: 45 },
    { label: 'POST /orders', value: 22 },
    { label: 'GET /users', value: 18 },
    { label: 'PUT /cart', value: 10 },
    { label: 'Other', value: 5 },
  ];

  const oauthSvg = await renderMermaidDiagram(oauthFlow, theme);
  const webhookSvg = await renderMermaidDiagram(webhookFlow, theme);
  const errorSvg = await renderMermaidDiagram(errorHandling, theme);
  const rateSvg = renderBarChart(rateLimits, theme, { title: 'Rate Limits (requests/minute)' });
  const respSvg = renderLineChart(responseTimes, theme, { title: 'Response Time Percentiles (ms)' });
  const usageSvg = renderPieChart(endpointUsage, theme, { title: 'API Traffic by Endpoint', donut: true });

  const sections: Section[] = [
    {
      id: 'oauth',
      title: 'OAuth 2.0 Authentication',
      content: `<p>We use the Authorization Code flow with PKCE for web and mobile apps. Access tokens 
      are JWTs valid for 1 hour. Refresh tokens are valid for 30 days and rotate on use.</p>`,
      diagram: { svg: oauthSvg.svg, caption: 'Complete OAuth flow with token refresh' },
    },
    {
      id: 'webhooks',
      title: 'Webhook Integration',
      content: `<p>Webhooks are signed with HMAC-SHA256. Your endpoint must respond within 30 seconds. 
      Failed deliveries retry with exponential backoff over 24 hours. Always verify signatures.</p>`,
      diagram: { svg: webhookSvg.svg, caption: 'Webhook delivery and retry flow' },
    },
    {
      id: 'errors',
      title: 'Error Handling',
      content: `<p>Handle each error code appropriately. 429 (rate limited) includes a Retry-After header. 
      5xx errors should retry with exponential backoff. 401 errors often just need a token refresh.</p>`,
      diagram: { svg: errorSvg.svg, caption: 'Error handling decision tree' },
    },
    {
      id: 'limits',
      title: 'Rate Limits',
      content: `<p>Rate limits are per API key, measured in requests per minute. The X-RateLimit-Remaining 
      header shows your current quota. Enterprise customers can request limit increases.</p>`,
      diagram: { svg: rateSvg.svg, caption: 'Rate limits by pricing tier' },
    },
    {
      id: 'performance',
      title: 'Performance SLAs',
      content: `<p>P50 latency is 45ms, P99 is 342ms. We target 99.9% uptime. Current month: 99.97%. 
      Status page: status.example.com</p>`,
      diagram: { svg: respSvg.svg, caption: 'Response time distribution' },
    },
    {
      id: 'usage',
      title: 'Traffic Patterns',
      content: `<p>Product reads dominate (45% of traffic). Order creation is 22% but generates 
      most webhook events. Cart operations are Redis-backed for speed.</p>`,
      diagram: { svg: usageSvg.svg, caption: 'Request distribution by endpoint' },
    },
  ];

  return buildHTML({
    title: 'API Integration Guide',
    subtitle: 'Developer Documentation',
    theme: 'tokyo_night',
    navigationStyle: 'sidebar',
    layout: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'Developer Relations - API Version 2.0',
  });
}

// ============================================================================
// EXAMPLE 5: Incident Response Playbook
// Showcases: Flowcharts, sequence diagrams, timelines
// ============================================================================

async function generateIncidentPlaybook() {
  console.log('\n5. Generating Incident Response Playbook...');
  const theme = getTheme('gruvbox');

  // Incident Response Flow
  const incidentFlow = `flowchart TD
    A[Alert Triggered] --> B{Severity?}
    
    B -->|P1 Critical| C1[Page On-Call Immediately]
    B -->|P2 High| C2[Page within 15 min]
    B -->|P3 Medium| C3[Notify Slack channel]
    B -->|P4 Low| C4[Create ticket]
    
    C1 --> D[Acknowledge in PagerDuty]
    C2 --> D
    
    D --> E{Customer Impact?}
    E -->|Yes| F[Post Status Page Update]
    E -->|No| G[Internal Comms Only]
    
    F --> H[Begin Investigation]
    G --> H
    
    H --> I{Root Cause Found?}
    I -->|Yes| J[Apply Fix]
    I -->|No| K[Escalate to SME]
    K --> H
    
    J --> L{Fix Successful?}
    L -->|Yes| M[Monitor for 30 min]
    L -->|No| N[Rollback]
    N --> H
    
    M --> O[Resolve Incident]
    O --> P[Schedule Post-Mortem]
    
    style C1 fill:#cc241d,color:#fff
    style C2 fill:#d79921
    style F fill:#cc241d,color:#fff
    style O fill:#98971a`;

  // Escalation Sequence
  const escalationSequence = `sequenceDiagram
    participant Alert as Alert System
    participant PD as PagerDuty
    participant OnCall as On-Call Engineer
    participant TL as Tech Lead
    participant EM as Engineering Manager
    participant Exec as VP Engineering
    
    Alert->>PD: Trigger alert
    PD->>OnCall: Page (T+0)
    
    alt Acknowledged within 5 min
        OnCall-->>PD: Acknowledge
    else No response
        PD->>TL: Escalate (T+5min)
        alt Acknowledged
            TL-->>PD: Acknowledge
        else No response
            PD->>EM: Escalate (T+15min)
        end
    end
    
    Note over OnCall: P1 auto-escalates after 30 min unresolved
    
    OnCall->>TL: Request help (optional)
    TL->>EM: Update on severity
    
    alt P1 > 1 hour
        EM->>Exec: Executive briefing
        Exec->>Exec: Customer comms decision
    end`;

  // Communication Flow
  const commFlow = `flowchart LR
    subgraph Internal
        A[Incident Channel] --> B[Slack: #incidents]
        A --> C[Incident Doc]
        C --> D[Timeline Updates]
    end
    
    subgraph External
        E[Status Page] --> F[Twitter @status]
        E --> G[Email to Affected]
        E --> H[In-App Banner]
    end
    
    subgraph Stakeholders
        I[Sales] --> J[Customer Talking Points]
        I --> K[Account Outreach List]
    end
    
    A --> E
    A --> I`;

  // Incident Timeline (D3 Timeline)
  const incidentTimeline: TimelineData[] = [
    { event: 'Alert fired', date: '2026-01-15T14:32:00', description: 'Error rate > 5%' },
    { event: 'On-call paged', date: '2026-01-15T14:33:00', description: 'Auto-escalation' },
    { event: 'Acknowledged', date: '2026-01-15T14:35:00', description: 'Engineer responds' },
    { event: 'Status page updated', date: '2026-01-15T14:40:00', description: 'Investigating' },
    { event: 'Root cause found', date: '2026-01-15T15:05:00', description: 'Database connection' },
    { event: 'Fix deployed', date: '2026-01-15T15:18:00', description: 'Pool size increased' },
    { event: 'Monitoring', date: '2026-01-15T15:20:00', description: '30 min observation' },
    { event: 'Resolved', date: '2026-01-15T15:50:00', description: 'All clear' },
  ];

  // Incident Stats (D3 Bar)
  const incidentStats: BarChartData[] = [
    { label: 'P1 Count', value: 2 },
    { label: 'P2 Count', value: 8 },
    { label: 'P3 Count', value: 24 },
    { label: 'P4 Count', value: 45 },
  ];

  // MTTR Trend (D3 Line)
  const mttrTrend: LineChartData[] = [
    { x: 'Jul', y: 85 },
    { x: 'Aug', y: 72 },
    { x: 'Sep', y: 68 },
    { x: 'Oct', y: 55 },
    { x: 'Nov', y: 48 },
    { x: 'Dec', y: 42 },
  ];

  const flowSvg = await renderMermaidDiagram(incidentFlow, theme);
  const escalationSvg = await renderMermaidDiagram(escalationSequence, theme);
  const commSvg = await renderMermaidDiagram(commFlow, theme);
  const timelineSvg = renderTimelineChart(incidentTimeline, theme, { title: 'Example Incident Timeline' });
  const statsSvg = renderBarChart(incidentStats, theme, { title: 'Incidents by Severity (Q4)' });
  const mttrSvg = renderLineChart(mttrTrend, theme, { title: 'Mean Time to Resolve (minutes)', area: true });

  const sections: Section[] = [
    {
      id: 'response',
      title: 'Response Procedure',
      content: `<p>This flowchart defines the standard incident response procedure. All P1 and P2 
      incidents require acknowledgment within 5 and 15 minutes respectively. Customer-impacting 
      incidents always update the status page.</p>`,
      diagram: { svg: flowSvg.svg, caption: 'Complete incident response decision tree' },
    },
    {
      id: 'escalation',
      title: 'Escalation Policy',
      content: `<p>PagerDuty manages escalation automatically. If on-call doesn't acknowledge within 
      5 minutes, it escalates to the Tech Lead. P1 incidents lasting over 1 hour trigger executive 
      notification.</p>`,
      diagram: { svg: escalationSvg.svg, caption: 'Escalation sequence with timeouts' },
    },
    {
      id: 'comms',
      title: 'Communication Channels',
      content: `<p>Internal comms go to #incidents Slack channel and the incident document. External 
      comms flow through the status page to Twitter, email, and in-app banners. Sales gets talking 
      points for customer outreach.</p>`,
      diagram: { svg: commSvg.svg, caption: 'Communication flow for incidents' },
    },
    {
      id: 'example',
      title: 'Example Timeline',
      content: `<p>This timeline shows a recent P2 incident. Total duration: 78 minutes from alert to 
      resolution. Time to acknowledge: 3 minutes. Time to identify root cause: 30 minutes.</p>`,
      diagram: { svg: timelineSvg.svg, caption: 'Real incident timeline from January 15th' },
    },
    {
      id: 'stats',
      title: 'Q4 Incident Summary',
      content: `<p>79 total incidents in Q4. Only 2 P1s (both resolved within SLA). P2 incidents 
      down 25% from Q3. Most P3/P4s are automated alerts that self-resolve.</p>`,
      diagram: { svg: statsSvg.svg, caption: 'Incident count by severity' },
    },
    {
      id: 'mttr',
      title: 'MTTR Improvement',
      content: `<p>Mean Time to Resolve improved from 85 minutes (July) to 42 minutes (December). 
      Key factors: better runbooks, faster rollback procedures, improved monitoring coverage.</p>`,
      diagram: { svg: mttrSvg.svg, caption: 'MTTR trend showing 50% improvement' },
    },
  ];

  return buildHTML({
    title: 'Incident Response Playbook',
    subtitle: 'SRE Team Procedures',
    theme: 'gruvbox',
    navigationStyle: 'sidebar',
    layout: 'sidebar',
    sections,
    enableThemeSwitcher: true,
    footer: 'SRE Team - Playbook Version 2.1 - Last Updated January 2026',
  });
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('='.repeat(70));
  console.log('  MERMAID DIAGRAM SHOWCASE');
  console.log('  Demonstrating the full range of diagram capabilities');
  console.log('='.repeat(70));

  const outputDir = path.resolve(__dirname, '../../../examples');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const examples = [
    { name: 'mermaid_system_architecture.html', fn: generateSystemArchitecture },
    { name: 'mermaid_database_schema.html', fn: generateDatabaseSchema },
    { name: 'mermaid_state_machines.html', fn: generateStateMachine },
    { name: 'mermaid_api_guide.html', fn: generateAPIGuide },
    { name: 'mermaid_incident_playbook.html', fn: generateIncidentPlaybook },
  ];

  const results: { name: string; size: number }[] = [];

  for (const example of examples) {
    const html = await example.fn();
    const filePath = path.join(outputDir, example.name);
    fs.writeFileSync(filePath, html, 'utf-8');
    const stats = fs.statSync(filePath);
    results.push({ name: example.name, size: stats.size / 1024 });
  }

  console.log('\n' + '='.repeat(70));
  console.log('  FILES GENERATED');
  console.log('='.repeat(70) + '\n');

  for (const result of results) {
    console.log(`  - ${result.name.padEnd(45)} ${result.size.toFixed(1)} KB`);
  }

  console.log(`\n  Output: ${outputDir}\n`);

  console.log('='.repeat(70));
  console.log('  MERMAID DIAGRAM TYPES DEMONSTRATED');
  console.log('='.repeat(70));
  console.log(`
  1. Flowchart Architectures - High-level system boundaries (using subgraphs)
  2. Container Diagrams      - Services and data stores (using flowcharts)
  3. Flowcharts             - Decision trees, processes
  4. Sequence Diagrams      - API calls, interactions
  5. Class Diagrams         - Domain models, schemas
  6. ER Diagrams            - Database relationships
  7. State Diagrams         - State machines, lifecycles

  Combined with D3 charts where appropriate:
  - Bar charts for comparisons
  - Line charts for trends
  - Pie charts for composition
  - Timeline charts for events
`);
  console.log('='.repeat(70));
}

main().catch(console.error);
