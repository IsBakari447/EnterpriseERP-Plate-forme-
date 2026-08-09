# Contributing to EnterpriseERP Platform

Thank you for helping improve EnterpriseERP Platform.

EnterpriseERP is a multi-tenant ERP platform. Contributions must protect tenant isolation, security, data integrity and product quality.

## Development Workflow

1. Create a branch from the latest protected branch.
2. Keep changes small and focused.
3. Run validation before opening a pull request.
4. Document behavior changes in `CHANGELOG.md`.
5. Never commit secrets, tokens, credentials or private customer data.

## Local Setup

```bash
npm install
npm run prisma:generate
npm run build
```

API:

```bash
cd services/api
npm install
npm run prisma:seed
npm run dev
```

Web:

```bash
cd apps/web
npm install
npm run dev
```

## Code Standards

- Use TypeScript for application code.
- Keep tenant access filtered by `companyId`.
- Reuse shared UI and platform utilities before adding new local patterns.
- Keep API inputs validated before they reach business logic.
- Add audit logs for security-sensitive, financial or destructive actions.

## Multi-Tenant Rule

Every business query must use the authenticated company context.

Allowed:

```ts
const companyId = requireTenant(user);
return prisma.client.findMany({ where: { companyId } });
```

Avoid:

```ts
return prisma.client.findMany();
```

## Pull Request Checklist

- Build passes.
- Prisma schema validates.
- Tenant isolation is preserved.
- Permissions are checked on protected actions.
- No secrets or sensitive logs are included.
- Documentation is updated when behavior changes.

## Commit Messages

Use clear commit messages:

```text
Add tenant-aware invoice queries
Seed system permissions
Improve sector engine configuration
```
