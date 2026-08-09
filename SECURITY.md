# Security Policy

EnterpriseERP Platform is a multi-tenant ERP system. Security issues are treated seriously because the platform handles business, financial and user data.

## Supported Versions

Security work currently targets the active development branch:

| Version | Supported |
| --- | --- |
| platform-refactor | Yes |
| older experimental branches | No |

## Reporting a Vulnerability

Do not open a public issue for sensitive security reports.

Send the report privately to the project maintainer with:

- A clear description of the issue.
- Steps to reproduce.
- Impact and affected modules.
- Logs or screenshots with secrets removed.
- Suggested mitigation if available.

## Security Requirements

All contributions must preserve:

- Tenant isolation by `companyId`.
- Server-side permission checks.
- JWT and refresh token safety.
- No tokens or secrets in logs.
- No credentials committed to Git.
- Validation before processing API inputs.

## High Priority Areas

- Authentication and session management.
- Role and permission enforcement.
- Invoice, payment and finance workflows.
- Stock adjustment and transfer workflows.
- Audit logs and administrative actions.
- Public API, API keys and webhooks.

## Secret Handling

Never commit:

- `.env` files with real values.
- JWT secrets.
- SMTP credentials.
- Database URLs.
- API keys.
- Customer exports.

Use environment variables and deployment secrets instead.
