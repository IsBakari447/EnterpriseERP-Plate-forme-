#!/usr/bin/env bash
set -e

echo "EnterpriseERP Cloud - initialisation"
cp .env.example .env || true
docker compose up -d

echo "Installation API"
cd apps/api
npm install
cd ../..

echo "Installation Web"
cd apps/web
npm install
cd ../..

echo "Projet prêt. Lancez l'API et le Web avec npm run start:dev / npm run dev."
