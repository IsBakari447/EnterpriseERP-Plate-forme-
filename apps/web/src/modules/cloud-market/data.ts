export const solutionCards = [
  {
    title: "ERP complet dans le cloud",
    tag: "Core",
    description: "Centralisez clients, ventes, factures et stock pour gagner du temps et reduire les erreurs.",
    points: ["Operations centralisees", "Moins de doubles saisies", "Donnees exploitables"],
  },
  {
    title: "Pilotage dirigeant",
    tag: "CEO",
    description: "Suivez tresorerie, priorites, risques et activite recente depuis un centre de decision.",
    points: ["A faire aujourd'hui", "Risques et opportunites", "Actions directes"],
  },
  {
    title: "Croissance commerciale",
    tag: "Sales",
    description: "Transformez prospects, devis et relances en ventes suivies avec un pipeline clair.",
    points: ["Pipeline", "Relances", "Conversion"],
  },
  {
    title: "Operations et stock",
    tag: "Ops",
    description: "Anticipez les ruptures, suivez les seuils critiques et declenchez les reapprovisionnements.",
    points: ["SKU", "Alertes stock", "Valeur inventaire"],
  },
  {
    title: "Cloud API-first",
    tag: "API",
    description: "Connectez web, mobile et integrations autour d'une API Cloud verifiee par health checks.",
    points: ["Health checks", "Readiness", "Migrations"],
  },
  {
    title: "Agents IA et mobile",
    tag: "Beta",
    description: "Automatisez progressivement recommandations, emails, suivi commercial et usages mobiles.",
    points: ["Assistant IA", "Mobile", "Workflows"],
  },
];

export const solutionStatuses = ["available", "available", "available", "available", "available", "beta"];

export const pricingPlans = [
  {
    name: "Starter Trial",
    price: "14 jours gratuits",
    highlight: "Pour valider le produit sans risque.",
    features: ["3 utilisateurs", "20 factures", "50 produits", "Admin complet", "Lecture seule apres essai"],
  },
  {
    name: "Business Cloud",
    price: "A partir de 49 EUR/mois",
    highlight: "Pour PME qui veulent centraliser leurs operations.",
    features: ["5 utilisateurs inclus", "CRM, stock, ventes, factures", "Dashboard dirigeant", "Exports et API"],
  },
  {
    name: "Enterprise Cloud",
    price: "Sur mesure",
    highlight: "Pour multi-sites, integrations et exigences avancees.",
    features: ["Multi-tenant", "Roles avances", "Audit securite", "Integrations dediees"],
  },
];

export const securityItems = [
  {
    title: "Acces et roles",
    description: "Controle d'acces par role, permissions granulaires et isolation par entreprise.",
  },
  {
    title: "Cloud readiness",
    description: "Endpoints health/readiness, configuration par environnement et base PostgreSQL.",
  },
  {
    title: "Audit et tracabilite",
    description: "Journal d'audit pour suivre les actions sensibles, connexions et changements de donnees.",
  },
  {
    title: "Protection donnees",
    description: "Variables d'environnement, secrets hors Git, migrations versionnees et politique de retention documentee.",
  },
];

export const integrationItems = [
  "EnterpriseERP.Mobile",
  "API REST clients",
  "API REST produits",
  "API REST factures",
  "Exports BI",
  "Webhooks",
  "Paiements",
  "Email et calendrier",
  "Connecteurs comptables",
];

export const integrationStatuses = ["beta", "available", "available", "available", "available", "planned", "planned", "planned", "planned"];

export const onboardingSteps = [
  {
    title: "1. Creer l'espace entreprise",
    description: "Configurer societe, utilisateurs, roles et limites de l'essai gratuit.",
  },
  {
    title: "2. Importer les donnees essentielles",
    description: "Ajouter clients, produits, stock initial et factures ouvertes.",
  },
  {
    title: "3. Activer le pilotage",
    description: "Suivre KPIs, alertes, echeances et recommandations IA depuis le dashboard.",
  },
  {
    title: "4. Connecter mobile et API",
    description: "Brancher les apps terrain, integrations et automatisations prioritaires.",
  },
];

export const competitorSignals = [
  "Moins de fichiers disperses entre ventes, stock et factures",
  "Tresorerie plus lisible avec les encaissements prioritaires",
  "Relances, validations et ruptures visibles chaque jour",
  "API prete pour connecter mobile, BI et automatisations",
  "Assistant IA integre aux actions commerciales et operations",
  "Securite, roles et audit exposes avec des statuts clairs",
];

export const demoHighlights = [
  "Choix du secteur et donnees fictives prechargees",
  "Walkthrough dashboard, CRM, stock et facturation",
  "Actions prioritaires: relancer, reapprovisionner, valider",
  "Controle API readiness, latence et dependances",
  "Reset automatique de la demo apres exploration",
];

export const roiCards = [
  {
    metric: "Temps administratif",
    before: "8 h/semaine",
    after: "4 h/semaine",
    gain: "-50%",
  },
  {
    metric: "Relance factures",
    before: "Manuelle",
    after: "Priorisee",
    gain: "+Cash-flow",
  },
  {
    metric: "Vision dirigeant",
    before: "Fichiers disperses",
    after: "Dashboard unique",
    gain: "Temps reel",
  },
];

export const faqs = [
  {
    question: "EnterpriseERP Cloud est-il different de EnterpriseERP classique EUR",
    answer: "Oui. EnterpriseERP Cloud est la version SaaS API-first, pensee pour web, mobile, integrations, multi-entreprise et deploiement cloud.",
  },
  {
    question: "L'essai gratuit demande-t-il une carte bancaire EUR",
    answer: "La proposition produit recommande un essai de 14 jours sans friction, avec limites claires et lecture seule en fin d'essai.",
  },
  {
    question: "Peut-on connecter l'application mobile EUR",
    answer: "Oui, l'architecture Cloud expose une API REST. L'experience mobile avancee sera livree progressivement autour de cette API.",
  },
  {
    question: "Le produit est-il pret pour les integrations EUR",
    answer: "La base API-first existe deja. Les connecteurs externes sont presentes avec un statut clair: disponible, beta ou prevu.",
  },
];

export const customerSegments = [
  {
    name: "PME commerciales",
    need: "Centraliser clients, devis, factures et relances.",
    value: "Cycle vente-facturation plus lisible.",
  },
  {
    name: "Entreprises avec stock",
    need: "Voir produits critiques, valeur stock et ruptures.",
    value: "Moins de ruptures et meilleures decisions d'achat.",
  },
  {
    name: "Dirigeants multi-activites",
    need: "Un dashboard clair pour suivre finance, operations et priorites.",
    value: "Pilotage plus rapide et moins de fichiers disperses.",
  },
];

export const platformStatus = [
  { service: "Web app", status: "Operational", detail: "Next.js frontend build OK" },
  { service: "Cloud API", status: "Operational", detail: "NestJS API build OK" },
  { service: "Database", status: "Ready", detail: "Prisma schema valid" },
  { service: "Mobile API", status: "Beta", detail: "EnterpriseERP.Mobile consumes the Cloud API progressively" },
];
