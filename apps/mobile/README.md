# EnterpriseERP Cloud Mobile

Application mobile Expo/React Native adaptable par secteur et concue pour l'API NestJS d'EnterpriseERP Cloud.

Cette version mobile n'est pas une copie reduite du web. Elle privilegie les usages terrain : connexion securisee, secteur actif, KPI rapides, actions prioritaires, modules accessibles au toucher, et etats API clairs.

## Installation

```bash
cd apps/mobile
npm install
npm start
```

L'application est configuree avec l'API Render :

```text
https://enterpriseerp-api.onrender.com
```

Pour le developpement local sur telephone reel, remplacez temporairement `extra.apiUrl` dans `app.json` par l'adresse reseau de votre PC, par exemple :

```text
http://192.168.1.25:4000
```

N'utilisez pas `localhost` depuis un telephone physique : cela pointerait vers le telephone, pas vers votre ordinateur.

## Fonctionnalites finalisees

- Connexion via `/api/auth/login`.
- Creation de compte via `/api/auth/register`.
- Stockage securise access token + refresh token avec `expo-secure-store`.
- Rafraichissement automatique du token via `/api/auth/refresh`.
- Chargement de l'utilisateur via `/api/auth/me`.
- Choix et persistance du secteur actif.
- Support multilingue mobile FR / EN / SV.
- Secteurs alignes avec EnterpriseERP Cloud : entreprise generale, restauration, commerce, construction, sante, education, transport, industrie et hotellerie.
- Dashboard mobile avec KPI, actions prioritaires, modules, activite recente et etat API.
- CRM mobile connecte a `/api/clients`.
- Ecrans modules generiques prets pour les flux terrain.

## Ajouter un secteur

1. Ajoutez sa cle dans `src/types/sector.ts`.
2. Ajoutez sa configuration dans `src/config/sectors.ts`.
3. Reutilisez les modules existants ou ajoutez-en un dans `src/config/modules.ts`.

Les ecrans lisent automatiquement les KPI, couleurs et modules du secteur actif.

## Commandes utiles

```bash
npm run typecheck
npm run android
npm run web
```
