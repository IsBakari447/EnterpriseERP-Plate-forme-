# Operations Readiness Runbook

This runbook tracks the operational checks required before treating EnterpriseERP
Cloud as broadly production-ready.

## Backup And Restore Gate

Run this gate against a disposable staging database before major releases.

Targets:

- Initial RPO: `<= 24h`.
- Initial RTO: `<= 4h`.

Create a backup from the source database:

```bash
BACKUP_DATABASE_URL="postgresql://..." npm run db:backup
```

Restore into a disposable staging database only:

```bash
BACKUP_FILE="backups/enterpriseerp-YYYY-MM-DD.dump" \
RESTORE_DATABASE_URL="postgresql://...staging..." \
RESTORE_CONFIRM=I_UNDERSTAND \
npm run db:restore
```

Validate restored data:

```bash
DATABASE_URL="postgresql://...staging..." npm run db:restore:validate
```

Then start the API against the restored database and verify:

1. `/health`.
2. `/health/ready`.
3. OWNER login.
4. Companies, users, clients, products, invoices, payments, expenses, sessions,
   audit logs, and important sector data.
5. Tenant isolation:

```bash
npm run security:tenant-isolation
```

6. API E2E smoke:

```bash
npm run e2e:api
```

Record:

- backup date;
- backup size;
- restore duration;
- data timestamp;
- RPO;
- RTO;
- result: `PASS` or `FAIL`;
- failed checks, if any.

The gate is not green until login, tenant isolation, invoices, users, audit logs,
and core CRUD all pass on restored data. Never restore into production from
these scripts; they intentionally require `RESTORE_CONFIRM=I_UNDERSTAND` and a
staging/test-like target URL.

## Distributed Rate Limiting Gate

Production must set `REDIS_URL` for shared rate-limit counters across API
instances. Without `REDIS_URL`, the API falls back to in-memory limits for local
development and CI smoke checks.

Protected routes include:

- `/api/auth/login`;
- `/api/auth/register`;
- `/api/auth/forgot-password`;
- `/api/auth/reset-password`;
- `/api/auth/verify-email`;
- `/api/auth/resend-verification`;
- `/api/auth/mfa/*`;
- `/api/auth/refresh`;
- `/api/operations/assistant/*`.

Before release, verify:

```bash
npm --prefix services/api run security:rate-limit
npm run qa:security
```

The gate is green when normal requests pass, excessive attempts return `429`,
and access resumes after the configured window expires.

## Observability Gate

Production monitoring should alert on:

- API 5xx rate;
- web 5xx rate;
- p95 and p99 latency;
- database connection errors;
- failed migrations;
- SMTP failures;
- password reset failures;
- MFA challenge failures and replay attempts;
- repeated login failures;
- backup failures;
- disk, CPU, and memory pressure;
- `/health/ready` failures.

## AI Safety Gate

Before enabling AI actions that write business data, every AI tool must pass this
chain:

```text
LLM output
AI policy
RBAC permission
tenant isolation
DTO validation
human confirmation
ERP service
audit log
```

AI may recommend actions without confirmation. AI must not create invoices,
payments, users, stock movements, e-mails, or destructive changes without an
explicit human approval step.
