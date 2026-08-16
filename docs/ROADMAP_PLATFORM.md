# EnterpriseERP Platform Roadmap

## Final Objective

EnterpriseERP must become a secure, multi-company, multi-industry, AI-assisted SaaS ERP platform.

The goal is not to create many generic ERP pages. The goal is to build one professional platform where modules, data, workflows, permissions, dashboards and AI agents adapt automatically to each company and sector.

```text
EnterpriseERP Platform
  -> EnterpriseERP Cloud
     -> General Business
     -> Retail
     -> Restaurant
     -> Construction
     -> Transport
     -> Hospitality
     -> Industry
     -> Education
     -> Healthcare
  -> EnterpriseERP Retail Suite
  -> EnterpriseERP Mobile
  -> EnterpriseERP AI
     -> AI Sales Agent
     -> AI Finance Agent
     -> AI Inventory Agent
     -> AI Purchasing Agent
     -> AI HR Agent
     -> AI Executive Agent
  -> EnterpriseERP API & Integrations
```

## Block A - Foundation

### Phase 0 - Stabilization

Do not add major functionality until the base is clean and reproducible.

- Keep a stable `main` branch.
- Use an integration branch such as `develop` or `platform-refactor`.
- Use `feature/...` branches for new work.
- Verify every `package.json`.
- Remove dead code and obsolete APIs.
- Centralize environment variables.
- Keep `.env.example` files updated.
- Ensure no secrets are committed to Git.
- Verify Prisma migrations.
- Verify TypeScript builds.
- Make the web app and API run locally.
- Test PostgreSQL and CORS.
- Document development commands.
- Keep README current.

Expected result:

```text
GitHub -> Build -> Tests -> Render -> Web + API + PostgreSQL
```

### Phase 1 - Multi-Tenant SaaS Architecture

EnterpriseERP must isolate every company.

Core models:

- `Company`
- `User`
- `CompanyMember`
- `Invitation`
- `Role`
- `Permission`
- `Session`
- `AuditLog`

Rule:

```text
Company A must never access Company B data.
```

Every business table must include `companyId`, including clients, invoices, products, employees, projects, orders and documents.

### Phase 2 - Professional Authentication

Core endpoints:

- `POST /register`
- `POST /login`
- `POST /logout`
- `POST /refresh`
- `GET /me`

Next requirements:

- Email verification
- Password reset
- Password change
- Password policy
- Active sessions
- Session revocation
- Logout all devices
- Login history
- MFA/2FA
- Brute-force protection
- Rate limiting

### Phase 3 - User Profile

Create a real `/profile` experience:

- Profile photo
- First name
- Last name
- Email
- Phone
- Job title
- Department
- Language
- Timezone
- Date format
- Preferred currency
- Light/dark/system theme
- Notification preferences
- Password and MFA
- Sessions and login history

### Phase 4 - RBAC And Permissions

Do not limit the system to `Admin`, `Manager`, `Employee`.

Use granular permissions:

```text
clients.read
clients.create
clients.update
clients.delete
invoices.read
invoices.create
invoices.validate
stock.read
stock.adjust
employees.read
employees.manage
audit.read
settings.manage
```

Permissions must be enforced by the API.

### Phase 5 - Professional Audit

Create `/audit`.

Every important operation should produce an event:

- User
- Company
- Action
- Module
- Entity type
- Entity ID
- Before value
- After value
- IP address
- User agent
- Result
- Timestamp

### Phase 6 - Security Center

Create `/security-center`.

Display:

- Security score
- MFA status
- Audit status
- HTTPS status
- Company isolation status
- Users without MFA
- Old sessions
- Expired invitations
- Suspicious logins
- Failed logins
- Sensitive permissions
- Administrative activities

## Block B - User Experience

### Phase 7 - Dynamic Navigation

Navigation must be generated dynamically from sector and permission definitions.

Concept:

```text
SectorDefinition
  -> navigation
  -> modules
  -> terminology
  -> kpis
  -> workflows
  -> permissions
  -> features
```

### Phase 8 - Sector Engine

Each sector should define:

- Modules
- Navigation
- Dashboard
- KPIs
- Terminology
- Workflows
- Permissions
- Forms
- Reports
- AI prompts

### Phase 9 - Business Templates

Avoid making every module look like the same CRUD screen.

Create reusable business templates:

- Data template
- Pipeline template
- Calendar template
- Finance template
- Inventory template
- Projects template
- Sector-specific template

Examples:

- CRM should show pipeline, client 360, activities, emails, notes and IA.
- Restaurant orders should show tables, kitchen, tickets, service time and payment.
- Transport should show map, routes, fleet, drivers and deliveries.
- Retail should show POS, barcode, returns and stock.

### Phase 10 - Dashboard 2.0

The dashboard should become the EnterpriseERP Command Center.

Required blocks:

- Header with global search, create button, notifications, AI assistant and profile
- Sector-specific KPIs
- Priority actions
- Recent activity
- AI recommendations
- Cash-flow forecast
- Module performance
- Monthly goals
- Plan usage
- Trust, security and system status

### Phases 11-14 - Productivity Layer

Add:

- Global search
- Command palette
- Notification center
- Task center

## Block C - Business Processes

### Phases 15-20

Build:

- Workflow Engine
- Approval Center
- Document Center
- Import Center
- Reporting and BI
- Professional Finance

## Block D - Ecosystem

### Phases 21-23

Build:

- Integrations Center
- Public `/api/v1`
- API keys and scopes
- Webhooks
- Redis queues
- Workers for email, notifications, imports, exports, PDF, AI and reports

## Block E - Intelligence

### Phases 24-28

AI modules:

- AI Studio
- AI Sales Agent
- AI Finance Agent
- AI Inventory Agent
- AI Executive Agent

Mandatory AI rule:

```text
Proposed -> Human approved -> Executed -> Audited
```

AI must never bypass permissions.

## Block F - Sectors

Develop verticals only after the core is strong.

Recommended order:

1. General Business
2. Retail
3. Restaurant
4. Construction
5. Transport
6. Hospitality
7. Manufacturing
8. Education
9. Healthcare

Healthcare should come late because it requires stricter confidentiality, security and compliance.

## Block G - Commercialization

Build:

- SaaS onboarding
- Subscriptions
- Separate marketing, app, API, docs and status domains
- Stronger public marketing message
- Demo environment
- Documentation for users, admins and developers

Recommended public positioning:

```text
EnterpriseERP - Run your entire business from an intelligent platform.
```

## Block H - Production

Build:

- Monitoring
- Backups and disaster recovery
- CI/CD with staging
- Automated tests
- Performance monitoring
- Internationalization for languages, dates, numbers, VAT and timezones
- Privacy, terms, cookies, DPA and incident processes
- Enterprise readiness: SSO, SAML/OIDC, SCIM, MFA enforcement, IP restrictions, advanced audit

## Ten Absolute Priorities

1. Secure multi-tenant architecture
2. Complete authentication
3. RBAC and permissions
4. Audit
5. Sector Engine
6. Differentiated business interfaces
7. Workflow and approvals
8. Notifications and global search
9. Onboarding
10. Tests, monitoring and backups

AI comes immediately after these foundations are reliable.

## Do Not Do

- Do not restart EnterpriseERP from scratch.
- Do not create nine independent projects for nine sectors.
- Do not create hundreds of generic pages.
- Do not enforce permissions only in React.
- Do not leave business data without `companyId`.
- Do not store secrets in Git.
- Do not develop AI before securing data access.
- Do not rely only on manual testing.
- Do not announce roadmap features as already available.

## Decision Questions For Every Feature

Before adding a feature, answer:

1. What business problem does it solve?
2. What data does it use?
3. Who is allowed to use it?
4. How is the action audited?
5. Can it be automated or assisted by AI?

If these points are clear, the feature belongs in a professional ERP platform.
