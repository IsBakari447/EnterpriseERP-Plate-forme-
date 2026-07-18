# EnterpriseERP Cloud API

API NestJS pour EnterpriseERP Cloud. Elle expose les modules MVP CRM, stock et facturation avec Prisma ORM et PostgreSQL.

## Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL

## Configuration

Copier l'exemple d'environnement :

```bash
cp .env.example .env
```

Variables principales :

```env
DATABASE_URL="postgresql://enterpriseerp:enterpriseerp@localhost:5432/enterpriseerp_cloud?schema=public"
JWT_SECRET="change-me-in-production"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

`CORS_ORIGIN` accepte plusieurs origines separees par des virgules.

## Installation

```bash
npm install
npm run prisma:generate
```

## Base de donnees

Avec le `docker-compose.yml` du dossier `enterpriseerp-cloud` :

```bash
docker compose up -d postgres
```

Appliquer les migrations :

```bash
npm run prisma:deploy
```

En developpement, pour creer une nouvelle migration :

```bash
npm run prisma:migrate
```

## Demarrage

Developpement :

```bash
npm run dev
```

Production locale :

```bash
npm run build
npm start
```

## Routes MVP

- `GET /health`
- `GET /health/ready`
- `GET /modules`
- `GET /pricing`
- `GET /roadmap`
- `GET /clients`
- `POST /clients`
- `GET /products`
- `POST /products`
- `GET /invoices`
- `POST /invoices`

Chaque ressource supporte aussi `GET /:id`, `PUT /:id` et `DELETE /:id`.

## Verification

```bash
npx prisma validate
npm run build
```

L'API ecoute par defaut sur `http://localhost:4000`.
