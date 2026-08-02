# Tutoriel video 03 - EnterpriseERP Cloud

Duree cible : 4 a 6 minutes  
Projet : `C:\ERP_Project\enterpriseerp-cloud`

## Objectif de la video

Presenter EnterpriseERP Cloud comme une version SaaS moderne : dashboard web, pages marketing, formulaire de demo et API NestJS.

## Preparation

Lancer le front :

```bash
cd C:\ERP_Project\enterpriseerp-cloud
npm --prefix apps\web run dev
```

Lancer l'API de demo :

```bash
cd C:\ERP_Project\enterpriseerp-cloud
npm --prefix apps\api run start:dev
```

URLs :

```text
Web : http://localhost:3000
API : http://localhost:4000/api
```

## Script voix-off

### 0:00 - Intro

Voici EnterpriseERP Cloud, la vision SaaS de la suite EnterpriseERP.  
Cette version montre comment le produit peut devenir une plateforme cloud moderne pour PME.

### 0:30 - Accueil et positionnement

La page d'accueil presente la promesse : gerer son entreprise depuis le cloud, avec une interface claire et professionnelle.

Action ecran :

- ouvrir le site ;
- montrer l'accueil ;
- montrer navigation.

### 1:10 - Dashboard SaaS

Le dashboard Cloud met en avant les indicateurs business : revenus, activite, alertes, performance des modules et synthese executive.

Action ecran :

- ouvrir `/dashboard` ;
- montrer les KPI ;
- montrer les cartes et graphiques.

### 2:00 - Pages produit

Les pages Solutions, Pricing, Security, Integrations et Onboarding expliquent la valeur produit.  
Elles sont importantes pour une presentation commerciale ou portfolio.

Action ecran :

- ouvrir `/solutions` ;
- ouvrir `/pricing` ;
- ouvrir `/security` ;
- ouvrir `/integrations`.

### 3:00 - Formulaire demo connecte API

La page `/demo` contient un formulaire connecte a l'API NestJS.  
Je saisis un nom, un email professionnel et un besoin, puis j'envoie la demande.

Action ecran :

- ouvrir `/demo` ;
- remplir le formulaire ;
- envoyer ;
- montrer le message de confirmation.

### 4:00 - API Cloud

L'API expose des endpoints utiles comme health, modules, pricing, demo script, clients, products et invoices.  
Cela montre une architecture API-first, prete pour une evolution SaaS.

Action ecran :

- ouvrir `http://localhost:4000/api/health` ;
- ouvrir `http://localhost:4000/api/demo/script`.

### 5:00 - Conclusion

EnterpriseERP Cloud montre la direction produit : une plateforme SaaS moderne, connectee par API, avec onboarding, pricing, securite et experience web professionnelle.

## Points a montrer absolument

- Dashboard Cloud.
- Pricing.
- Security.
- Demo form.
- API health.
- API demo script.

## Depannage a mentionner

Si le formulaire demo echoue :

- verifier que `services/api` tourne ;
- verifier `NEXT_PUBLIC_API_URL` ;
- verifier que l'URL API finit correctement vers `/api` ;
- relancer le build si necessaire.
