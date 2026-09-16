# Operations Readiness Runbook

This runbook tracks the operational checks required before treating EnterpriseERP
Cloud as broadly production-ready.

## Backup And Restore Gate

Run this gate against a disposable staging database before major releases.

1. Create a database backup from the active environment.
2. Restore the backup into a clean staging database.
3. Run Prisma migrations against the restored database.
4. Start the API against the restored database.
5. Verify `/health` and `/health/ready`.
6. Sign in with a restored OWNER account.
7. Verify tenant isolation with:

```bash
npm run security:tenant-isolation
```

8. Verify invoices, users, audit logs, products, clients, payments, and sessions.
9. Run:

```bash
npm run e2e:api
```

10. Record restore duration, data timestamp, and any failed checks.

The gate is not green until login, tenant isolation, invoices, users, audit logs,
and core CRUD all pass on restored data.

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
