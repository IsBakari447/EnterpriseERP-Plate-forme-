# EnterpriseERP Cloud

EnterpriseERP Cloud is the SaaS version of EnterpriseERP: a modern ERP platform for managing a business from the cloud, web and mobile.

Project path:

```text
C:\ERP_Project\enterpriseerp-cloud
```

## Positioning

**Run your business everywhere, with a professional cloud ERP.**

EnterpriseERP Cloud is designed for SMEs that need a clear command center for CRM, sales, invoices, stock, HR, reporting and future AI automation.

## What Makes It Competitive

- Professional executive dashboard with KPIs, charts, alerts and AI recommendations.
- API-first architecture for web, mobile and integrations.
- SaaS-ready offer structure: free trial, Business plan and Enterprise plan.
- PostgreSQL and Prisma migrations for a serious cloud database foundation.
- NestJS API with health, readiness, modules, pricing and roadmap endpoints.
- Market-ready pages for solutions, pricing, trust center, integrations and onboarding.
- Responsive Next.js interface aligned with the EnterpriseERP visual identity.
- Prepared roadmap for multi-tenant, audit logs, SSO, workflows and mobile sync.

## MVP Scope

- Authentication foundation
- Executive dashboard
- CRM clients
- Products and stock
- Sales and invoicing
- Multi-company preparation
- AI and mobile preparation
- QA and deployment readiness endpoints

## Tech Stack

### Web

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts

### API

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT-ready architecture

### Infrastructure

- Docker
- PostgreSQL
- Redis

## Project Structure

```text
enterpriseerp-cloud/
├── apps/
│   ├── web/              Next.js SaaS frontend
│   └── api/              Legacy/experimental API workspace
├── services/
│   └── api/              Active NestJS API service
├── docs/                 Product and strategy documentation
├── docker/               Docker assets
├── packages/             Future shared packages
└── scripts/              Setup scripts
```

## Quick Start

Start infrastructure:

```bash
cp .env.example .env
docker compose up -d
```

Run the active API:

```bash
cd services/api
npm install
npm run prisma:generate
npm run prisma:deploy
npm run dev
```

Run the web app:

```bash
cd apps/web
npm install
npm run dev
```

You can also run common commands from the project root:

```bash
npm run dev        # starts the web app
npm run dev:web    # starts the web app
npm run dev:api    # starts the API
npm run build      # builds web and API
npm run qa         # builds and validates Prisma
```

Default URLs:

```text
Web: http://localhost:3000
API: http://localhost:4000
```

## Cloud API Endpoints

```http
GET /health
GET /health/ready
GET /modules
GET /pricing
GET /roadmap
GET /security
GET /integrations
GET /onboarding
GET /competitive-position
GET /demo-script
GET /roi-model
GET /faq
GET /platform-status
GET /clients
GET /products
GET /invoices
```

`/health/ready` verifies that the API can connect to the database.

## Web Product Highlights

The web dashboard includes:

- Market-ready SaaS hero panel
- Business KPIs
- Revenue and module activity charts
- Module performance table
- Global alerts
- Competitive module roadmap
- AI executive summary
- Pricing cards
- Trust and deployment readiness signals

Additional market pages:

```text
/cloud
/dashboard
/solutions
/pricing
/demo
/roi
/customers
/security
/integrations
/onboarding
/status
/faq
```

## Quality Commands

Web build:

```bash
cd apps/web
npm run build
```

API build:

```bash
cd services/api
npm run build
```

Prisma validation:

```bash
cd services/api
npx prisma validate
```

## Visual Identity

- Night blue: `#1E2A38`
- Turquoise: `#00C2A9`
- White: `#FFFFFF`
- Action orange: `#FF7A00`
- Typography: Inter or Poppins

## Next Market Priorities

- Complete authentication and role-based access.
- Add tenant isolation for multiple companies.
- Add audit logs and security events.
- Add onboarding checklist and demo data reset.
- Connect EnterpriseERP.Mobile.
- Add automated billing and subscription management.
