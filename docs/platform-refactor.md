# EnterpriseERP Platform Refactor

## Objectif

Transformer EnterpriseERP Cloud en coeur de plateforme SaaS unique:

- EnterpriseERP Cloud
- EnterpriseERP Retail Suite
- EnterpriseERP Mobile
- Suites sectorielles progressives

Retail Suite doit devenir une suite integree dans la plateforme, pas une application separee.

## Etape actuelle

La branche `platform-refactor` pose les fondations suivantes:

- Modele multi-tenant renforce autour de `Company`.
- Ajout de `Membership`, `Role`, `Permission` et `RolePermission`.
- Ajout de `Company.enabledModules`.
- Isolation stricte par `companyId` pour CRM, Stock et Facturation.
- Ajout d'un decorateur backend `CurrentUser`.
- Ajout d'un moteur de secteurs partage dans `common/platform/sector-engine.ts`.
- Endpoint public `/platform/sectors`.

## Regle de securite tenant

Chaque requete metier doit utiliser le `companyId` du token JWT.

Interdit:

```ts
prisma.company.findFirst()
```

Autorise:

```ts
const companyId = requireTenant(user);
return prisma.client.findMany({ where: { companyId } });
```

## Suites sectorielles definies

- general
- retail
- restaurant
- construction
- transport
- hospitality
- manufacturing
- education
- healthcare

Chaque secteur definit:

- modules
- kpis
- workflows

## Prochaines etapes conseillees

1. Creer une migration Prisma pour les nouveaux modeles.
2. Seed des permissions globales.
3. Connecter `RolePermission` au `PermissionsGuard`.
4. Ajouter DTO validation avec `class-validator`.
5. Ajouter endpoints d'administration roles/permissions.
6. Brancher le frontend sur `/platform/sectors`.
7. Integrer Retail Suite dans `apps/web` comme suite sectorielle `retail`.
8. Ajouter tests tenant isolation.
