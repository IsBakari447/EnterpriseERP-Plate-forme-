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
- Official SaaS professional roadmap documented and visible on the `/roadmap` page.

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
+-- apps/
¦   +-- web/              Next.js SaaS frontend
+-- services/
¦   +-- api/              Active NestJS API service
+-- docs/                 Product and strategy documentation
+-- docker/               Docker assets
+-- packages/             Future shared packages
+-- scripts/              Setup scripts
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
API: http://localhost:4000/api
```

The web app reads `NEXT_PUBLIC_API_URL`. You can set it with or without `/api`; the shared API client normalizes it automatically.

## Cloud API Endpoints

```http
GET /api/health
GET /api/health/ready
GET /api/modules
GET /api/pricing
GET /api/roadmap
GET /api/security
GET /api/integrations
GET /api/onboarding
GET /api/competitive-position
GET /api/demo/script
POST /api/demo/requests
GET /api/roi-model
GET /api/faq
GET /api/platform-status
GET /api/platform/foundation
GET /api/platform/modules
GET /api/platform/roles
GET /api/platform/permissions
GET /api/platform/workflows
GET /api/platform/roadmap
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/me
GET /api/users
GET /api/users/roles
GET /api/users/:id
POST /api/users
POST /api/users/invite
PUT /api/users/:id
DELETE /api/users/:id
GET /api/clients
GET /api/products
GET /api/invoices
```

`/health/ready` verifies that the API can connect to the database.

## Demo Corrections

Recent demo-focused fixes:

- The `/demo` web page now submits requests to the NestJS API.
- Added API demo endpoints on the active `services/api` service with `GET /api/demo/script` and `POST /api/demo/requests`.
- The shared web API client now normalizes `NEXT_PUBLIC_API_URL` to include `/api`.
- CORS accepts `CORS_ORIGIN` with comma-separated origins and supports credentials.
- The API logs the final local URL on startup for easier demo checks.

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
/roadmap
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

## User Manual and Video Tutorials

The complete suite user manual and the EnterpriseERP Cloud video tutorial script are available in this repository:

```text
docs/MANUEL_UTILISATION_SUITE_ENTERPRISEERP.md
docs/tutoriels-video/03_ENTERPRISEERP_CLOUD.md
docs/ROADMAP_SAAS_PROFESSIONNEL.md
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

## SaaS Foundation Added

The active API in `services/api` now includes the foundation for the professional SaaS roadmap:

- `companyId` added to business tables for tenant isolation.
- User, session, invitation and audit models prepared in Prisma.
- Role and permission catalog for ERP modules.
- Platform endpoints exposing modules, workflows, roles, permissions and roadmap phases.
- User governance endpoints for users, invitations and role matrix.
- Real authentication flow with register, login, access JWT, refresh JWT, sessions and logout.
- Protected business routes with role-based permissions.
- Central API exception filter for cleaner production responses.
- CRM, stock and invoice services start scoping records by the current company.

## Authentication

The active API uses Bearer tokens:

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/me
```

Successful login/register returns:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "expiresIn": "15m"
}
```

Use the access token on protected routes:

```http
Authorization: Bearer <accessToken>
```

Required environment variables:

```bash
JWT_SECRET="change-me-in-production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```
