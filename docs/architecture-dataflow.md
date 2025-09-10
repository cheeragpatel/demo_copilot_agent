# OctoCAT Supply Chain Management: Architecture & Dataflow Documentation

## Purpose

This document provides comprehensive architectural views and dataflow analysis for the OctoCAT Supply Chain Management System, designed to support demo scenarios and security reviews. It captures both current implementation state and target architectural improvements aligned with secure development practices.

## Architectural Assumptions

### Current Implementation
- **Backend**: Express.js API with SQLite persistence using repository pattern
- **Frontend**: React application with Vite build system
- **Data Store**: SQLite database with file-based persistence (configurable location)
- **Authentication**: Currently none implemented (demo-focused)
- **Authorization**: Not implemented (assumes trusted internal network)
- **Session Management**: Stateless API design (no session persistence)

### Inferred Components (Not Yet Implemented)
- **API Gateway**: Would handle rate limiting, authentication, and request routing
- **User Management Service**: For authentication and authorization
- **Audit Logging Service**: For security and compliance tracking
- **Configuration Management**: For secure environment variable handling
- **Load Balancer**: For production deployment scaling
- **Backup Service**: For SQLite database persistence and recovery

## High-Level System Context Diagram

```mermaid
graph TB
    subgraph "External Actors"
        DEV[Developer]
        DEMO[Demo User]
        SEC[Security Reviewer]
        OPS[Operations Team]
    end
    
    subgraph "GitHub Ecosystem"
        GH[GitHub Repository]
        COPILOT[GitHub Copilot]
        ACTIONS[GitHub Actions]
        GHAS[GitHub Advanced Security]
    end
    
    subgraph "OctoCAT System"
        APP[Supply Chain Management App]
    end
    
    subgraph "External Services"
        AZURE[Azure Container Apps]
        ACR[Azure Container Registry]
        PLAYWRIGHT[Playwright MCP Server]
        BROWSER[Browser Instance]
    end
    
    DEV --> |Code, Prompts| COPILOT
    DEMO --> |Interactions| APP
    SEC --> |Reviews| GHAS
    OPS --> |Deploy| ACTIONS
    
    COPILOT --> |Agent Mode, Vision| APP
    COPILOT <--> |MCP Protocol| PLAYWRIGHT
    PLAYWRIGHT --> |Test Automation| BROWSER
    
    GH --> |Source Code| ACTIONS
    ACTIONS --> |Build & Deploy| AZURE
    ACTIONS --> |Push Images| ACR
    GHAS --> |Security Scans| GH
    
    APP --> |Runtime| AZURE
```

## Container / Deployment View Diagram

```mermaid
graph TB
    subgraph "Development Environment"
        DEV_FE[Frontend Container<br/>React + Vite<br/>Port 5137]
        DEV_API[API Container<br/>Express.js<br/>Port 3000]
        DEV_DB[(SQLite DB<br/>api/data/app.db)]
        
        DEV_FE <-->|REST API| DEV_API
        DEV_API <-->|SQL Queries| DEV_DB
    end
    
    subgraph "Azure Production Environment"
        subgraph "Azure Container Apps"
            PROD_FE[Frontend Web App<br/>nginx + React<br/>HTTPS]
            PROD_API[API Web App<br/>Express.js<br/>HTTPS]
        end
        
        subgraph "Azure Storage"
            PROD_DB[(SQLite DB<br/>/home/site/data/app.db)]
        end
        
        subgraph "Azure Container Registry"
            ACR_API[API Image<br/>:latest/:sha]
            ACR_FE[Frontend Image<br/>:latest/:sha]
        end
        
        PROD_FE <-->|CORS-enabled API calls| PROD_API
        PROD_API <-->|File-based queries| PROD_DB
        PROD_FE -.->|Pulls from| ACR_FE
        PROD_API -.->|Pulls from| ACR_API
    end
    
    subgraph "CI/CD Pipeline"
        GHACTIONS[GitHub Actions]
        BUILD[Build & Test]
        PUSH[Push to ACR]
        DEPLOY[Deploy to Azure]
        
        GHACTIONS --> BUILD
        BUILD --> PUSH
        PUSH --> ACR_API
        PUSH --> ACR_FE
        PUSH --> DEPLOY
        DEPLOY --> PROD_FE
        DEPLOY --> PROD_API
    end
```

## Request Sequence: Add to Cart (Current + Target State)

### Current State (Demo Implementation)
```mermaid
sequenceDiagram
    participant User
    participant React as React Frontend
    participant State as Local State
    participant UI as UI Components
    
    User->>React: Click "Add to Cart"
    React->>State: Update cart state (useState)
    State->>UI: Trigger re-render
    UI->>User: Show "Added to Cart" message
    UI->>User: Update cart icon badge count
    
    Note over User,UI: No persistence - data lost on page refresh
    Note over React,State: Cart data stored only in browser memory
```

### Target State (Production-Ready)
```mermaid
sequenceDiagram
    participant User
    participant React as React Frontend
    participant API as Express API
    participant DB as SQLite Database
    participant Auth as Auth Service
    participant Audit as Audit Logger
    
    User->>React: Click "Add to Cart"
    React->>Auth: Validate session token
    Auth-->>React: Return user context
    
    React->>API: POST /api/cart/items<br/>{productId, quantity}
    API->>API: Validate request payload
    API->>Auth: Verify user permissions
    Auth-->>API: Authorized user data
    
    API->>DB: INSERT cart_item<br/>WHERE user_id = ?
    DB-->>API: Return item_id
    
    API->>Audit: Log cart addition<br/>{user, product, timestamp}
    API-->>React: {itemId, cartTotal, itemCount}
    
    React->>React: Update cart state
    React->>User: Show success notification
    React->>User: Update cart icon badge
    
    Note over API,Audit: Security: Input validation, authorization, audit trail
    Note over DB: Persistence: Survives session/browser restart
```

## CI/CD & Security Data Flow

```mermaid
graph TB
    subgraph "Source Control"
        DEV_CODE[Developer Code]
        PR[Pull Request]
        MAIN[Main Branch]
    end
    
    subgraph "CI Pipeline"
        LINT[ESLint + Prettier]
        BUILD[TypeScript Build]
        TEST[Unit Tests]
        SECURITY[Security Scans]
        
        subgraph "Security Checks"
            GHAS_CODE[CodeQL Analysis]
            GHAS_SECRET[Secret Scanning]
            GHAS_DEP[Dependency Review]
            VULN[Vulnerability Assessment]
        end
    end
    
    subgraph "CD Pipeline"
        DOCKER[Docker Build]
        PUSH_ACR[Push to ACR]
        DEPLOY_STAGE[Deploy to Staging]
        MANUAL_APPROVE[Manual Approval]
        DEPLOY_PROD[Deploy to Production]
    end
    
    subgraph "Security Monitoring"
        RUNTIME_MONITOR[Runtime Monitoring]
        AUDIT_LOGS[Audit Logs]
        ALERT[Security Alerts]
    end
    
    DEV_CODE --> PR
    PR --> LINT
    LINT --> BUILD
    BUILD --> TEST
    TEST --> SECURITY
    
    SECURITY --> GHAS_CODE
    SECURITY --> GHAS_SECRET
    SECURITY --> GHAS_DEP
    GHAS_CODE --> VULN
    
    VULN --> DOCKER
    DOCKER --> PUSH_ACR
    PUSH_ACR --> DEPLOY_STAGE
    DEPLOY_STAGE --> MANUAL_APPROVE
    MANUAL_APPROVE --> DEPLOY_PROD
    
    DEPLOY_PROD --> RUNTIME_MONITOR
    RUNTIME_MONITOR --> AUDIT_LOGS
    AUDIT_LOGS --> ALERT
    
    style SECURITY fill:#ff9999
    style GHAS_CODE fill:#ff9999
    style VULN fill:#ff9999
    style RUNTIME_MONITOR fill:#99ff99
```

## MCP & Prompt Workflow Data Flow

```mermaid
graph TB
    subgraph "Developer Workflow"
        DEV[Developer]
        VSCODE[VS Code]
        COPILOT_CHAT[Copilot Chat]
    end
    
    subgraph "Custom Prompt System"
        PROMPT_FILES[.github/prompts/*.md]
        CHAT_MODES[.github/chatmodes/*.md]
        CUSTOM_INSTR[.github/copilot-instructions.md]
    end
    
    subgraph "Copilot Agent Mode"
        AGENT[Copilot Agent]
        PLAN[Planning Mode]
        VISION[Vision Analysis]
        CODE_GEN[Code Generation]
    end
    
    subgraph "MCP Server Integration"
        MCP_PLAYWRIGHT[Playwright MCP Server]
        MCP_GITHUB[GitHub MCP Server]
        BROWSER_AUTO[Browser Automation]
        GH_API[GitHub API Integration]
    end
    
    subgraph "Feedback & Iteration"
        EXEC[Command Execution]
        TEST_RUN[Test Execution]
        BUILD_CHECK[Build Validation]
        SELF_HEAL[Self-Healing]
    end
    
    DEV --> |Prompts, Images| COPILOT_CHAT
    COPILOT_CHAT --> |Load Context| PROMPT_FILES
    COPILOT_CHAT --> |Mode Selection| CHAT_MODES
    COPILOT_CHAT --> |Configuration| CUSTOM_INSTR
    
    COPILOT_CHAT --> AGENT
    AGENT --> PLAN
    AGENT --> VISION
    AGENT --> CODE_GEN
    
    AGENT <--> |MCP Protocol| MCP_PLAYWRIGHT
    AGENT <--> |MCP Protocol| MCP_GITHUB
    
    MCP_PLAYWRIGHT --> BROWSER_AUTO
    MCP_GITHUB --> GH_API
    
    CODE_GEN --> EXEC
    EXEC --> TEST_RUN
    TEST_RUN --> BUILD_CHECK
    BUILD_CHECK --> |Feedback| SELF_HEAL
    SELF_HEAL --> |Iterate| CODE_GEN
    
    EXEC --> |Results| DEV
    
    style AGENT fill:#99ccff
    style MCP_PLAYWRIGHT fill:#ffcc99
    style MCP_GITHUB fill:#ffcc99
    style SELF_HEAL fill:#99ff99
```

## Security Data Classification & Trust Boundaries

### Data Classification
- **Public**: Product catalog, pricing information
- **Internal**: System configuration, build artifacts
- **Confidential**: User cart contents, session data
- **Restricted**: Database credentials, API keys, deployment secrets

### Trust Boundaries

```mermaid
graph TB
    subgraph "Untrusted Zone"
        INTERNET[Internet]
        USER_BROWSER[User Browser]
    end
    
    subgraph "DMZ / Edge"
        LB[Load Balancer]
        WAF[Web Application Firewall]
    end
    
    subgraph "Application Zone"
        FRONTEND[Frontend Container]
        API[API Container]
    end
    
    subgraph "Data Zone"
        DATABASE[(SQLite Database)]
        CONFIG[Configuration Store]
    end
    
    subgraph "Management Zone"
        CICD[CI/CD Pipeline]
        SECRETS[Secret Management]
        MONITORING[Security Monitoring]
    end
    
    INTERNET -.->|HTTPS Only| LB
    USER_BROWSER -.->|HTTPS Only| LB
    LB --> WAF
    WAF --> FRONTEND
    FRONTEND -->|Internal Network| API
    API -->|File System| DATABASE
    API -->|Environment Variables| CONFIG
    
    CICD -->|Secure Deployment| API
    CICD -->|Secure Deployment| FRONTEND
    SECRETS -->|Runtime Injection| API
    MONITORING -->|Audit Collection| API
    
    style INTERNET fill:#ff9999
    style USER_BROWSER fill:#ff9999
    style DATABASE fill:#99ff99
    style SECRETS fill:#99ff99
```

## Security Recommendations (OWASP-Mapped)

### A01 - Broken Access Control
- **Current Gap**: No authentication or authorization implemented
- **Recommendation**: Implement JWT-based authentication with role-based access control
- **Implementation**: Add Express middleware for token validation and route protection

### A02 - Cryptographic Failures
- **Current Gap**: No encryption for sensitive data at rest
- **Recommendation**: Encrypt SQLite database and use HTTPS everywhere
- **Implementation**: SQLCipher for database encryption, TLS 1.3 minimum

### A03 - Injection
- **Current State**: Parameterized queries used in repository layer
- **Recommendation**: Add input validation middleware and output encoding
- **Implementation**: Use joi/zod for request validation, helmet.js for security headers

### A04 - Insecure Design
- **Current Gap**: No security requirements in design phase
- **Recommendation**: Implement threat modeling and security by design principles
- **Implementation**: Add security requirements to custom prompts and templates

### A05 - Security Misconfiguration
- **Current Gap**: Default configurations, exposed error details
- **Recommendation**: Harden configurations, implement proper error handling
- **Implementation**: Environment-specific configs, sanitized error responses

### A06 - Vulnerable and Outdated Components
- **Current State**: Dependency scanning in place
- **Recommendation**: Automated dependency updates and security monitoring
- **Implementation**: Dependabot, GitHub Advisory Database integration

### A08 - Software and Data Integrity Failures
- **Current Gap**: No code signing or artifact verification
- **Recommendation**: Implement supply chain security controls
- **Implementation**: Signed commits, container image signing, SLSA compliance

### A09 - Security Logging and Monitoring Failures
- **Current Gap**: Basic logging only
- **Recommendation**: Comprehensive audit logging and real-time monitoring
- **Implementation**: Structured logging, security event correlation

### A10 - Server-Side Request Forgery (SSRF)
- **Current State**: No external HTTP requests made
- **Recommendation**: If external requests added, implement allow-listing
- **Implementation**: URL validation, network segmentation

## Minimal Secure Express Middleware Pattern

```javascript
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Disable Express fingerprinting
app.disable('x-powered-by');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Request validation middleware
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: process.env.NODE_ENV === 'development' ? error.details : undefined
        }
      });
    }
  };
};

// Authentication middleware
const requireAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: { code: 'MISSING_TOKEN', message: 'Authentication required' }
      });
    }
    
    // Token validation logic here
    // req.user = await validateToken(token);
    next();
  } catch (error) {
    return res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Authentication failed' }
    });
  }
};

// Global error handler
app.use((error, req, res, next) => {
  // Log error for monitoring
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
  
  // Security: Never expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return res.status(error.statusCode || 500).json({
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: isDevelopment ? error.message : 'An unexpected error occurred',
      ...(isDevelopment && { stack: error.stack })
    }
  });
});

export { app, validateRequest, requireAuth };
```

## Next Steps / Open Questions

### Implementation Priorities
1. **Authentication & Authorization**: Implement user management and session handling
2. **Data Encryption**: Add SQLite encryption for sensitive data protection
3. **Audit Logging**: Implement comprehensive security event logging
4. **API Gateway**: Add rate limiting, request validation, and monitoring
5. **Backup Strategy**: Implement automated database backup and recovery

### Architecture Decisions Needed
1. **Session Management**: JWT vs server-side sessions vs OAuth delegation
2. **Database Strategy**: Continue with SQLite vs migrate to PostgreSQL/MySQL
3. **Container Orchestration**: Azure Container Apps vs AKS vs App Service
4. **Monitoring Solution**: Application Insights vs Prometheus/Grafana vs third-party
5. **Secret Management**: Azure Key Vault vs environment variables vs external service

### Security Review Questions
1. **Threat Model**: What are the primary attack vectors for this demo environment?
2. **Compliance Requirements**: Are there specific regulatory requirements to address?
3. **Data Retention**: How long should cart and user data be retained?
4. **Incident Response**: What is the escalation path for security incidents?
5. **Penetration Testing**: When should security testing be conducted?

### Demo Enhancement Opportunities
1. **MCP Server Extensions**: Additional protocol servers for enhanced capabilities
2. **Custom Prompt Libraries**: Domain-specific prompts for supply chain scenarios
3. **Security Automation**: Automated vulnerability remediation workflows
4. **Performance Testing**: Load testing scenarios for production readiness
5. **Disaster Recovery**: Backup and recovery demonstration scenarios

---

*Document Version: 1.0 | Last Updated: 2024 | Target Audience: Demo Users, Security Reviewers, Development Teams*