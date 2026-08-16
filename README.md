# EnterpriseERP Cloud

> EnterpriseERP Cloud is the web and API foundation of the EnterpriseERP Platform: a multi-tenant, multi-industry, AI-assisted SaaS ERP for small and medium businesses.

## Product Goal

EnterpriseERP must not become a collection of disconnected ERP pages. The target is a secure SaaS platform that adapts modules, navigation, dashboards, workflows, permissions and AI assistance to each company's sector.

```text
EnterpriseERP Platform
  -> EnterpriseERP Cloud
  -> EnterpriseERP Retail Suite
  -> EnterpriseERP Mobile
  -> EnterpriseERP AI
  -> EnterpriseERP API & Integrations
```

## Current Scope

The current repository contains:

- `apps/web`: Next.js web application
- `services/api`: NestJS API with Prisma and PostgreSQL
- `docs`: product, roadmap and usage documentation
- `docker-compose.yml`: local PostgreSQL and infrastructure foundation

Active application modules include dashboard, CRM, products, stock, invoices, roles, permissions, profile, audit, security center, AI assistant, AI Sales Agent, AI Studio and sector pages.

## Priority Roadmap

Development should follow this order:

1. Stabilization: clean build, reproducible setup, no secrets in Git, documented commands.
2. Multi-tenant foundation: `Company`, `User`, `CompanyMember`, `Role`, `Permission`, `Session`, `AuditLog`.
3. Professional authentication: register, login, refresh, logout, password reset, sessions, brute-force protection.
4. Profile and account security.
5. RBAC enforced by the API.
6. Audit and Security Center.
7. Sector Engine and business templates.
8. Dashboard 2.0, search, command palette, notifications and tasks.
9. Workflow engine, approvals, documents, imports, reporting and finance.
10. Integrations, public API, workers, AI agents, onboarding, subscriptions, monitoring and tests.

See [docs/ROADMAP_PLATFORM.md](docs/ROADMAP_PLATFORM.md) for the full platform roadmap.

## Requirements

- Node.js 22
- npm
- Docker Desktop or a local PostgreSQL instance
- PostgreSQL database available through `DATABASE_URL`

## Environment

Copy examples before running locally:

```bash
cp .env.example .env
cp services/api/.env.example services/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

If `apps/web/.env.local.example` does not exist yet, create `apps/web/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Never commit real secrets. Use long random values for `JWT_SECRET` in production and configure Render environment variables outside Git.

## Install

Install dependencies from the repository root:

```bash
npm install
npm --prefix apps/web install
npm --prefix services/api install
```

## Local Infrastructure

Start PostgreSQL:

```bash
docker compose up -d
```

Generate Prisma client and apply migrations:

```bash
npm run prisma:generate
npm run prisma:deploy
```

For local development migrations:

```bash
npm --prefix services/api run prisma:migrate
```

## Run Locally

Use two terminals.

Terminal 1, API:

```bash
npm run dev:api
```

API default URL:

```text
http://localhost:4000
```

Terminal 2, web:

```bash
npm run dev:web
```

Web default URL:

```text
http://localhost:3000
```

## Build And QA

Build everything:

```bash
npm run build
```

Run the current QA gate:

```bash
npm run qa
```

The QA command currently runs:

- Next.js production build
- NestJS TypeScript build
- Prisma schema validation

## API

Health:

```text
GET /health
GET /health/ready
```

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

Platform:

```text
GET /api/platform/sectors
GET /api/platform/modules
GET /api/platform/workflows
GET /api/platform/roles
GET /api/platform/permissions
GET /api/platform/roadmap
```

Business examples:

```text
GET /api/clients
GET /api/products
GET /api/invoices
```

## Security Rules

Core product rules:

- Every business record must belong to a company through `companyId`.
- A user from Company A must never read or mutate Company B data.
- Permissions must be enforced by the API, not only by React.
- Important operations must be audit logged.
- Secrets must remain in environment variables, never in Git.

## Git Workflow

Recommended workflow:

```text
main        -> stable production-ready branch
develop     -> integration branch
feature/... -> new work
```

Current active refactor branch:

```text
platform-refactor
```

## Deployment

Render services should configure environment variables in the Render dashboard:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `CORS_ORIGIN`
- `NEXT_PUBLIC_API_URL`
- SMTP variables if password reset email is enabled

Run production database migrations with:

```bash
npm --prefix services/api run prisma:deploy
```

## Documentation

Important files:

- [docs/ROADMAP_PLATFORM.md](docs/ROADMAP_PLATFORM.md)
- [docs/ROADMAP_SAAS_PROFESSIONNEL.md](docs/ROADMAP_SAAS_PROFESSIONNEL.md)
- [docs/i18n.md](docs/i18n.md)
- [docs/MANUEL_UTILISATION_SUITE_ENTERPRISEERP.md](docs/MANUEL_UTILISATION_SUITE_ENTERPRISEERP.md)

## Current Validation

Last verified local command:

```bash
npm run qa
```

Result: web build, API build and Prisma validation pass.
