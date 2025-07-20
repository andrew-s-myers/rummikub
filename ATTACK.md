# ATTACK.md
## Systematic Domain/Behavioral Driven Development → Test Driven Development Process

This document outlines a systematic approach to rapidly develop fullstack applications by focusing on behavior definition, test-driven development, and automated tooling to minimize boilerplate and maximize creativity time.

## Philosophy

**Goal**: Clone → `make setup` → Define behaviors → Generate tests → Build functionality → Focus on unique value

**Process Flow**: Domain Definition → Behavior Specification → Test Generation → Implementation → Validation

## Phase 1: Project Setup & Tooling Infrastructure

### 1.1 Testing Infrastructure Gaps
- [x] **Playwright E2E Testing Setup**
  - Install Playwright with TypeScript support
  - Configure for Laravel backend + React frontend integration
  - Set up test data seeding/cleanup workflows
  - Add to Makefile with `make test-e2e` command
  - **Status**: 6/6 tests passing (Chromium + Mobile Chrome coverage)
  - **Note**: Firefox/WebKit excluded due to Docker containerization networking limitations

### 1.2 Docker Environment Issues (Technical Debt)
- [ ] **Sanctum Middleware Recursion in Docker + NGINX**
  - Issue: `auth:sanctum` middleware causes infinite recursion in containerized environment
  - Works fine on local machine with same Laravel 12 + Sanctum setup
  - Root cause: Likely NGINX FastCGI parameter handling or Docker request context
  - Current workaround: Manual token validation using `PersonalAccessToken::findToken()`
  - Investigation needed: Compare request headers/context between local vs Docker
  - Impact: Cannot use convenient Laravel auth middleware, must implement auth manually per route

- [ ] **Enhanced Backend Testing**
  - Add API testing with documented request/response examples
  - Set up database factories for complex test scenarios
  - Configure test coverage reporting
  - Add performance/load testing foundation

- [ ] **Frontend Testing Enhancements**
  - Component visual regression testing setup
  - Integration testing for API calls
  - Mock service worker (MSW) for API mocking
  - Accessibility testing automation

### 1.2 Development Experience Tools
- [ ] **API Documentation Generation**
  - OpenAPI spec generation from YAML behaviors (behavior-driven contracts)
  - Laravel API documentation auto-generation (Scribe/L5-Swagger)
  - Interactive API explorer (Swagger UI) with behavior context
  - Client SDK generation from OpenAPI specs

- [ ] **C4 Architecture Visualization with Structurizr**
  - `/docs/system-architecture.md` as single source of truth for C4 model
  - Structurizr DSL generation from behaviors + architecture definitions
  - Auto-sync: behaviors → system-architecture.md → Structurizr diagrams
  - Container relationship mapping based on API endpoints in YAML behaviors
  - Architecture drift detection (behaviors ↔ implementation ↔ C4 model)

- [ ] **Database & System Visualization**
  - ER diagram generation from migrations (integrated with C4 data containers)
  - Database schema documentation
  - Migration dependency visualization
  - System context diagrams showing external dependencies

- [ ] **Code Quality Automation**
  - Pre-commit hooks for code formatting
  - Automated dependency updates
  - Security scanning integration
  - Architecture compliance validation

### 1.3 Future Architecture Preparation
- [ ] **Redis Cache Layer**
  - Redis Docker service configuration
  - Laravel Redis queue/cache integration
  - Session storage configuration
  - Rate limiting implementation

- [ ] **FastAPI Microservice Foundation**
  - Pydantic models for AI agent coordination
  - FastAPI service template with async patterns
  - Inter-service communication patterns
  - Shared authentication/authorization

- [ ] **Mobile Development Setup**
  - React Native project initialization
  - Shared component library structure
  - Cross-platform navigation setup
  - Build/deployment automation

### 1.3 Deployment & Monitoring Infrastructure
- [ ] **Secrets Management**
  - Docker Secrets integration for sensitive configuration
  - Environment-specific secret rotation strategies
  - Database credentials, API keys, and JWT secrets via Docker Secrets
  - Development vs. production secret isolation

- [ ] **Self-Managed VPS Deployment**
  - Monorepo Docker image deployment via Docker Compose
  - Cloudflare CDN integration for static assets and caching
  - SSL/TLS termination and domain management
  - Automated backup and disaster recovery procedures

- [ ] **Error Tracking & Analytics**
  - Sentry integration for both Laravel backend and React frontend
  - PostHog for product analytics, feature flags, and user behavior tracking
  - Real user monitoring (RUM) and performance insights
  - Error alerting with contextual debugging information
  - Release tracking and deployment impact analysis

- [ ] **Future Scaling Architecture**
  - Service separation strategy for fastapi-ms reflexive scaling
  - Multi-VPS High Availability deployment patterns
  - Backend for Frontend (BFF) layer design for API consolidation
  - Load balancing and service discovery configuration
  - Container orchestration migration path (Docker Swarm → Kubernetes)

## Phase 2: YAML-Based Behavior Definition System

### 2.1 Custom YAML Templates (Cucumber-like without Gherkin)

**Enhanced Template with C4 Integration**:
```yaml
# behaviors/user-authentication.yml
schema_version: "1.0"
domain: user_management
feature: authentication
description: Users can register, login, and manage their accounts securely

# C4 Architecture Context (feeds into system-architecture.md)
architecture:
  primary_container: web_application  # Maps to C4 container in system-architecture.md
  container_dependencies: [database, email_service]  # Container relationships
  external_systems: [smtp_provider]  # External dependencies for C4 context
  data_flows:
    - "web_application -> database: user data"
    - "web_application -> email_service: confirmation emails"
    - "email_service -> smtp_provider: SMTP relay"

behaviors:
  - name: user_registration
    scenario: New user creates account
    containers_involved: [web_application, database, email_service]  # For C4 component diagrams
    given:
      - system: clean state
      - user: does not exist with email "test@example.com"
    when:
      - user: submits registration with valid data
    then:
      - user: receives confirmation email
      - user: account is created with pending status
      - database: contains new user record
    
  - name: user_login
    scenario: Existing user authenticates
    containers_involved: [web_application, database]
    given:
      - user: exists with verified email "test@example.com"
    when:
      - user: submits login with correct credentials
    then:
      - user: receives authentication token
      - user: is redirected to dashboard
      - session: is established

validation_rules:
  email: must be valid format
  password: minimum 8 characters, one uppercase, one number
  rate_limiting: max 5 login attempts per minute

api_endpoints:  # Used for OpenAPI generation AND C4 interface mapping
  - POST /api/register
  - POST /api/login
  - POST /api/logout
  - GET /api/user

ui_components:
  - RegisterForm:
      tailwind_template: form-container
      design_tokens: [primary-button, input-field, error-text]
  - LoginForm:
      tailwind_template: form-container
      design_tokens: [primary-button, input-field, success-text]
  - UserProfile:
      tailwind_template: profile-card
      design_tokens: [avatar, info-text, secondary-button]
```

### 2.2 Formal YAML Schema Definition

**Versioned Schema Contract (v1.0)**:
```yaml
# schema/behavior-schema-v1.0.yml
schema_version: "1.0"
required_fields:
  - domain
  - feature
  - description
  - behaviors

behavior_structure:
  name: string (required)
  scenario: string (required)
  given: array of actor:condition pairs (required)
  when: array of actor:action pairs (required)
  then: array of actor:expectation pairs (required)
  tags: array of strings (optional)
  priority: enum [high, medium, low] (optional)

actor_types:
  - system
  - user
  - database
  - api
  - ui

validation_rules:
  format: object with validation constraints (optional)
  
api_endpoints:
  format: array of "METHOD /path" strings (optional)
  
ui_components:
  format: array of component names (optional)
```

### 2.3 Multi-Layer Reconciliation Strategy

**Problem**: Manual changes can diverge across YAML behaviors, C4 architecture, OpenAPI specs, and implementation code.

**Solution - Enhanced Tracking System**:
- [ ] **Multi-Layer Lockfile System**
  - Generate `.behavior-lock.jsonl` from YAML definitions
  - Track architecture changes in `.architecture-sync.json`
  - OpenAPI spec versioning aligned with behavior versions
  - C4 diagram generation timestamps and source tracking
  - Detect drift across: Behaviors ↔ Architecture ↔ OpenAPI ↔ Implementation

- [ ] **Code Drift Detection**
  - `make check-drift` command to identify YAML/code inconsistencies
  - Report showing: generated vs. manual changes, missing implementations
  - Option to regenerate code or update YAML to match manual changes

- [ ] **Manual Override Patterns**
  - Special comment blocks to mark "manual zones" in generated code
  - Preserve custom logic during regeneration
  - Explicit override files that extend generated base classes

**Alternative: JSONL-Based Tracking**:
Consider `.jsonlines` format for simpler drift reconciliation:
```jsonl
{"timestamp": "2025-01-18T10:00:00Z", "file": "UserController.php", "hash": "abc123", "source": "generated", "behavior": "user-auth.yml"}
{"timestamp": "2025-01-18T10:05:00Z", "file": "UserController.php", "hash": "def456", "source": "manual", "behavior": "user-auth.yml"}
```
Benefits: Append-only, easier parsing, better conflict resolution

**Reconciliation Workflow**:
```bash
# Check for drift between YAML and implementation
make check-drift

# Resolve conflicts by choosing YAML as source of truth
make reconcile --prefer-yaml

# Resolve conflicts by updating YAML to match manual changes
make reconcile --prefer-code

# Interactive merge resolution
make reconcile --interactive
```

### 2.4 YAML Schema Migration System
- [ ] **Schema Migration Tools**
  - Automated migration scripts for schema version upgrades
  - `make migrate-schema` command for applying migrations
  - Migration validation and rollback capabilities
  - Migration examples:
    ```bash
    # Migrate behaviors from v1.0 to v1.1
    make migrate-schema FROM=1.0 TO=1.1
    
    # Validate migration without applying
    make migrate-schema FROM=1.0 TO=1.1 --dry-run
    
    # Rollback to previous schema version
    make migrate-schema ROLLBACK=1.0
    ```

### 2.5 System Architecture Documentation

- [ ] **`/docs/system-architecture.md` Specification**
  - C4 Level 2 (Container) architecture definitions
  - Container descriptions, technologies, and responsibilities  
  - External system dependencies and interfaces
  - Data flow documentation between containers
  - Integration points with behavior definitions

**Example Structure**:
```markdown
# System Architecture

## Containers

### Web Application (Laravel)
- Technology: PHP 8.3, Laravel 12, Sanctum
- Responsibility: API endpoints, authentication, business logic
- Dependencies: Database, Email Service
- Behavior Domains: user_management, content_management

### Database (SQLite/PostgreSQL)  
- Technology: SQLite (dev), PostgreSQL (prod)
- Responsibility: Data persistence, user data, content storage
- Accessed By: Web Application, FastAPI MS

### Email Service (Internal)
- Technology: Laravel Mail, Queue
- Responsibility: User notifications, confirmations
- External Dependencies: SMTP Provider

## External Systems
- SMTP Provider: Email delivery
- CDN: Static asset delivery (future)
```

### 2.6 YAML Processing Tools
- [ ] **YAML Parser & Validator**
  - Custom YAML schema validation against versioned contract
  - Behavior definition linting
  - Cross-reference validation (APIs, components, etc.)
  - Schema migration tools for version upgrades

- [ ] **Test Generation Engine**
  - Convert YAML behaviors to PHPUnit tests
  - Convert YAML behaviors to Vitest component tests
  - Convert YAML behaviors to Playwright E2E tests
  - Generate API endpoint tests from behavior definitions
  - Maintain generated code fingerprints in lockfile

- [ ] **Code Scaffolding Generator**
  - Laravel controller/model generation from YAML
  - React component scaffolding from UI component lists with Tailwind class templates
  - Route generation from API endpoint definitions
  - Database migration suggestions from data requirements
  - Generate with manual override zones pre-marked
  - **Tailwind Integration**: Pre-built class templates and design token injection
  - Component generation includes responsive design patterns and accessibility classes

## Phase 3: Systematic Development Workflow

### 3.1 Docker-Containerized Development Process

**All development occurs within Docker containers** as defined in `docker-compose.yml`:

- **Backend Development**: `docker compose exec back-end <command>`
- **Frontend Development**: `docker compose exec front-end-web <command>`
- **Testing**: `docker compose run --rm vitest` or `docker compose exec back-end php artisan test`
- **Tool Execution**: All YAML processing, test generation, and scaffolding runs inside containers

**Docker-Aware Commands**:
```bash
# All make commands work with Docker containers
make dev                    # docker compose up -d
make test-phpunit          # docker compose exec back-end php artisan test
make test-vitest           # docker compose run --rm --service-ports vitest
make generate-tests        # docker compose run --rm yaml-processor generate-tests
make scaffold-code         # docker compose run --rm code-scaffolder
```

**Container Volume Strategy**:
- Source code mounted as volumes for live development
- Generated code written to mounted volumes
- Tool containers share behavior definitions via mounted `behaviors/` directory
- Lockfiles and generated artifacts persist in mounted `generated/` directory

### 3.2 Behavior-First Development Process

**Step 1: Domain Analysis**
1. Identify core business domains (User Management, Content, Payments, etc.)
2. Break domains into features
3. Define feature behaviors in YAML

**Step 2: Behavior Definition**
1. Create YAML behavior files in `behaviors/` directory
2. Define Given-When-Then scenarios
3. Specify API contracts and UI components
4. Validate YAML against schema

**Step 3: Test Generation**
1. Run `make generate-tests` to create test suites from YAML
2. Review generated tests for completeness
3. Add custom test data and edge cases
4. Ensure tests fail (Red phase of TDD)

**Step 4: Implementation**
1. Run failing tests to understand requirements
2. Implement minimum viable functionality
3. Make tests pass (Green phase of TDD)
4. Refactor for quality (Refactor phase of TDD)

**Step 5: Validation & Integration**
1. Run full test suite (unit, integration, E2E)
2. Validate behavior implementation against YAML
3. Update documentation automatically
4. Deploy to staging for acceptance testing

### 3.3 Enhanced Development Commands

```bash
# Behavior-driven development with full integration
make new-feature BEHAVIOR=behaviors/user-management.yml  # Updates: Tests + OpenAPI + C4
make generate-tests                                       # From behaviors
make generate-openapi                                     # From behaviors + architecture
make scaffold-code DOMAIN=user_management               # With architecture context

# Architecture & Documentation
make c4-sync                                             # Sync behaviors → system-architecture.md → Structurizr
make docs-generate                                       # OpenAPI + C4 + behavior docs
make architecture-validate                              # Multi-layer consistency check

# Comprehensive validation
make validate-behaviors                                  # YAML schema validation
make validate-openapi                                   # API contract validation
make validate-architecture                              # C4 model consistency
make check-drift                                        # All layers: behaviors ↔ OpenAPI ↔ C4 ↔ code

# Unified development workflow
make develop FEATURE=user-authentication               # Full cycle: behaviors → tests → OpenAPI → C4 → implementation
```

### 3.4 Integrated Architecture & Behavior Organization

```
project-root/
├── behaviors/                  # YAML behavior definitions
│   ├── user-management/
│   ├── content-management/
│   ├── shared/
│   └── schema/                # YAML schema definitions
│       └── behavior-schema-v1.0.yml
├── docs/                      # Architecture documentation
│   ├── system-architecture.md # C4 model source of truth
│   └── c4-diagrams/           # Generated Structurizr artifacts
│       ├── workspace.dsl      # Structurizr DSL
│       ├── context.puml       # System context diagram
│       ├── containers.puml    # Container diagram
│       └── components/        # Component diagrams per container
├── generated/                  # Auto-generated artifacts
│   ├── tests/                 # Behavior-driven tests
│   ├── scaffolds/             # Code scaffolding
│   ├── api-docs/              # OpenAPI specs + Swagger UI
│   ├── .behavior-lock.jsonl   # Multi-layer tracking
│   └── .architecture-sync.json # C4 sync metadata
├── back-end/                   # Laravel API (Docker: back-end service)
├── front-end-web/             # React TypeScript (Docker: front-end-web service)
├── front-end-mobile/          # React Native (future)
├── fastapi-ms/                # AI coordination service (Docker: fastapi-ms service)
└── tools/                     # Enhanced development tools
    ├── behavior-engine/       # YAML processing + OpenAPI generation
    ├── c4-sync/              # Structurizr integration
    └── reconciler/            # Multi-layer drift detection
```

## Phase 4: Advanced Features & Optimizations

### 4.1 AI Agent Coordination (FastAPI-MS)
- [ ] **Behavior-to-Agent Mapping**
  - Map YAML behaviors to AI agent capabilities
  - Define agent interaction patterns
  - Implement behavior validation through agents

- [ ] **Pydantic Integration**
  - Generate Pydantic models from YAML schemas
  - Type-safe agent communication
  - Validation pipeline integration

### 4.2 Cross-Platform Considerations
- [ ] **Shared Component Library**
  - Design system tokens
  - Cross-platform component abstractions
  - Shared business logic hooks

- [ ] **Universal State Management**
  - Redux/Zustand setup for complex state
  - Offline-first considerations
  - Sync strategies between platforms

### 4.3 Production Readiness
- [ ] **Monitoring & Observability**
  - Behavior-driven metrics definition
  - Error tracking with behavior context
  - Performance monitoring setup

- [ ] **Deployment Automation**
  - CI/CD pipeline with behavior validation
  - Environment-specific configuration
  - Rollback strategies based on behavior tests

### 4.4 Efficient Toolchain Validation

**Consolidated Meta-Testing** (Eliminating Tool Bloat):
- [ ] **Unified Behavior Engine Testing**
  - Combined validation: YAML + OpenAPI + C4 + code generation
  - Architecture consistency testing: behaviors ↔ C4 ↔ implementation  
  - Performance benchmarks for integrated workflow
  - **REMOVED**: Separate testing for individual tools (unified approach)
  - **FOCUS**: End-to-end developer workflow validation

**Essential Tools Only**:
- ✅ **Keep**: YAML behaviors, OpenAPI generation, C4/Structurizr, lockfile reconciliation
- ✅ **Keep**: Playwright E2E, Vitest/PHPUnit, Tailwind integration
- ❌ **Remove**: Separate API doc tools (use OpenAPI), separate ER diagrams (use C4)
- ❌ **Remove**: Automated dependency updates (manual control preferred)

## Implementation Priority

**Phase 1** (Foundation): Complete project setup, testing infrastructure, and development tools
**Phase 2** (Core System): Implement YAML behavior system and test generation
**Phase 3** (Workflow): Establish systematic development process and commands
**Phase 4** (Advanced): Add AI coordination, cross-platform features, and production readiness

## Success Metrics

- **Time to First Feature**: From clone to working feature in under 30 minutes
- **Behavior Coverage**: 100% of defined behaviors have corresponding tests
- **Test Confidence**: All tests generated from behaviors pass consistently
- **Developer Experience**: New features can be defined in YAML and implemented rapidly
- **Code Quality**: Automated tools maintain consistent standards across all generated code

## Next Steps

1. Begin with Phase 1.1 - Set up missing testing infrastructure
2. Create formal YAML schema definition and validation
3. Implement lockfile-based reconciliation system
4. Build Docker-containerized YAML processing tools
5. Create first YAML behavior template and parser
6. Build test generation proof of concept
7. Iterate on workflow based on real usage patterns
8. Expand to multi-platform considerations once core system is solid
9. **Create DEPLOYMENT.md** - Document production deployment strategies with CI/CD pipeline design that requires ATTACK.md test validation for production deploy approval:
   - Behavior test validation gates in CI/CD
   - Automated deployment blocking on test failures
   - Production rollback triggers based on behavior test regressions
   - Environment promotion workflow (dev → staging → prod) with behavior validation at each stage