# Changelog

All notable changes to EnterpriseERP Platform will be documented in this file.

The format follows a simple human-readable changelog style.

## Unreleased

### Added

- Platform refactor branch for EnterpriseERP Platform.
- Multi-tenant foundation with `Company`, `Membership`, `Role`, `Permission` and `RolePermission`.
- `Company.enabledModules` for sector and module configuration.
- Tenant-aware access for CRM, Stock and Facturation modules.
- Database-backed permissions in `PermissionsGuard`.
- Global permission and system role seed.
- Sector engine for general, retail, restaurant, construction, transport, hospitality, manufacturing, education and healthcare.
- Platform documentation in `docs/platform-refactor.md`.
- Project governance files: contributing guide, code of conduct, security policy, changelog, license and GitHub templates.

### Changed

- Business module queries now use authenticated tenant context instead of selecting the first company.
- Registration now creates the first company owner membership.

### Security

- Permission checks now combine legacy role permissions, token permissions and database role permissions.
- Tenant isolation rules are documented for contributors.
