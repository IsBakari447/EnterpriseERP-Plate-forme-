export const globalKpis = [
  { label: "Chiffre d'affaires global", value: "482 300 EUR", change: "+18%" },
  { label: "Clients actifs", value: "1 208", change: "+12%" },
  { label: "Commandes", value: "342", change: "+9%" },
  { label: "Factures dues", value: "24", change: "-6%" },
  { label: "Valeur stock", value: "318 900 EUR", change: "+7%" },
  { label: "Employes", value: "48", change: "+3%" },
  { label: "Resultat net", value: "355 450 EUR", change: "+21%" },
  { label: "Alertes IA", value: "18", change: "+32%" },
];

export const moduleStats = [
  { module: "CRM", metric: "Nouveaux prospects", value: "186", trend: "+14%" },
  { module: "Ventes", metric: "Ventes du mois", value: "86 450 EUR", trend: "+16%" },
  { module: "Stock", metric: "Produits critiques", value: "8", trend: "-5%" },
  { module: "Facturation", metric: "A encaisser", value: "48 200 EUR", trend: "+11%" },
  { module: "Comptabilite", metric: "TVA a declarer", value: "24 600 EUR", trend: "+4%" },
  { module: "RH", metric: "Presences", value: "42/48", trend: "Stable" },
];

export const alerts = [
  "8 produits sont en stock faible.",
  "12 factures arrivent a echeance cette semaine.",
  "6 factures sont en retard de paiement.",
  "Le rapport mensuel est pret a generer.",
  "L'IA recommande de relancer les prospects chauds.",
];

export const marketModules = [
  {
    title: "Pilotage dirigeant",
    description: "Dashboard CEO, score de sante, priorites IA et vision claire des revenus, couts et risques.",
    status: "Pret MVP",
  },
  {
    title: "CRM et ventes",
    description: "Pipeline commercial, clients, commandes, devis, factures et relances depuis une seule interface.",
    status: "Actif",
  },
  {
    title: "Stock intelligent",
    description: "Seuils critiques, valeur de stock, SKU et alertes de reapprovisionnement.",
    status: "Actif",
  },
  {
    title: "API cloud",
    description: "Base NestJS, Prisma et PostgreSQL pour connecter web, mobile, integrations et automatisations.",
    status: "Actif",
  },
  {
    title: "Assistant IA",
    description: "Syntheses, recommandations et preparation des workflows intelligents.",
    status: "En cours",
  },
  {
    title: "Mobile ready",
    description: "Architecture preparee pour EnterpriseERP.Mobile et usages terrain.",
    status: "Roadmap",
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "14 jours gratuits",
    audience: "Pour tester l'ERP cloud sans risque.",
    features: ["3 utilisateurs", "20 factures", "50 produits", "Lecture seule apres essai"],
  },
  {
    name: "Business",
    price: "Sur devis",
    audience: "Pour PME qui veulent centraliser operations et finance.",
    features: ["Utilisateurs illimites", "Factures illimitees", "Exports pro", "Support prioritaire"],
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    audience: "Pour organisations multi-sites et exigences avancees.",
    features: ["Multi-tenant", "SSO ready", "SLA et audit", "Integrations API"],
  },
];

export const trustItems = [
  "Architecture API-first pour web, mobile et integrations",
  "Permissions par role et preparation multi-entreprise",
  "Health checks et readiness pour deploiement cloud",
  "Prisma ORM avec migrations versionnees",
  "Design coherent avec EnterpriseERP web",
];
