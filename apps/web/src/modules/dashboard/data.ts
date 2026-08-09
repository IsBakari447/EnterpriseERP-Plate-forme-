import type { SectorKey } from "@shared/sector/types";

export type PeriodKey = "today" | "7d" | "30d" | "quarter" | "year" | "custom";

export const periodOptions: { key: PeriodKey; label: string; factor: number }[] = [
  { key: "today", label: "Aujourd'hui", factor: 0.08 },
  { key: "7d", label: "7 jours", factor: 0.28 },
  { key: "30d", label: "30 jours", factor: 1 },
  { key: "quarter", label: "Trimestre", factor: 2.85 },
  { key: "year", label: "Annee", factor: 10.8 },
  { key: "custom", label: "Personnalise", factor: 1.45 },
];

export const globalFilters = [
  { key: "company", label: "Entreprise", value: "EnterpriseERP" },
  { key: "site", label: "Site / magasin", value: "Tous les sites" },
  { key: "team", label: "Equipe", value: "Toutes les equipes" },
  { key: "salesperson", label: "Commercial", value: "Tous" },
  { key: "currency", label: "Devise", value: "EUR" },
  { key: "sector", label: "Secteur", value: "Actuel" },
];

type KpiFormat = "currency" | "number" | "percent";

export type DecisionKpi = {
  label: string;
  baseValue: number;
  format: KpiFormat;
  change: string;
};

export type PriorityAction = {
  title: string;
  detail: string;
  impact: string;
  action: string;
  tone: "red" | "orange" | "cyan" | "green";
};

export type DashboardGoal = {
  label: string;
  progress: number;
  current: string;
  target: string;
};

export type AiInsightGroup = {
  title: string;
  items: string[];
};

export type SectorDashboard = {
  label: string;
  kpis: DecisionKpi[];
  priorities: PriorityAction[];
  cashflow: {
    balance: string;
    incoming: string;
    outgoing: string;
    projection: string;
  };
  activity: { title: string; detail: string; time: string }[];
  moduleStats: { module: string; metric: string; value: string; trend: string; status: string }[];
  alerts: string[];
  goals: DashboardGoal[];
  ai: AiInsightGroup[];
};

const baseKpis: DecisionKpi[] = [
  { label: "Chiffre d'affaires", baseValue: 482300, format: "currency", change: "+18%" },
  { label: "Clients actifs", baseValue: 1208, format: "number", change: "+12%" },
  { label: "Factures dues", baseValue: 24, format: "number", change: "-6%" },
  { label: "Marge nette", baseValue: 27, format: "percent", change: "+4 pts" },
];

const sharedDashboard = {
  cashflow: {
    balance: "184 600 EUR",
    incoming: "72 400 EUR",
    outgoing: "38 950 EUR",
    projection: "+31 800 EUR a 30 jours",
  },
  activity: [
    { title: "Nouveau client cree", detail: "Compte PME ajoute au CRM", time: "Il y a 12 min" },
    { title: "Facture payee", detail: "FAC-2026-041 encaissee", time: "Il y a 38 min" },
    { title: "Produit en rupture", detail: "Alerte stock critique", time: "Il y a 1 h" },
    { title: "Utilisateur invite", detail: "Role Manager attribue", time: "Il y a 2 h" },
    { title: "Connexion administrateur", detail: "Session securisee validee", time: "Il y a 3 h" },
  ],
  alerts: [
    "12 factures arrivent a echeance cette semaine.",
    "8 produits sont en stock faible.",
    "3 utilisateurs attendent une validation de role.",
    "Le rapport mensuel est pret a generer.",
  ],
  ai: [
    {
      title: "Risques",
      items: [
        "8 clients n'ont pas commande depuis 60 jours.",
        "12 factures arrivent a echeance cette semaine.",
        "Le stock de 5 produits critiques couvre moins de 7 jours.",
      ],
    },
    {
      title: "Opportunites",
      items: [
        "3 produits affichent une marge superieure a 40%.",
        "Le panier moyen progresse sur les clients fideles.",
        "Le segment PME convertit plus vite que les autres.",
      ],
    },
    {
      title: "Actions recommandees",
      items: [
        "Relancer les devis ouverts depuis plus de 10 jours.",
        "Planifier un reapprovisionnement sur les references critiques.",
        "Automatiser les rappels de paiement avant echeance.",
      ],
    },
  ],
};

export const sectorDashboards: Record<SectorKey, SectorDashboard> = {
  general: {
    label: "Entreprise generale",
    kpis: baseKpis,
    priorities: [
      { title: "Factures en retard", detail: "6 factures depassent l'echeance", impact: "48 200 EUR a encaisser", action: "Relancer", tone: "red" },
      { title: "Devis a relancer", detail: "14 propositions sans reponse", impact: "92 000 EUR potentiel", action: "Voir", tone: "orange" },
      { title: "Stock critique", detail: "8 produits sous le seuil", impact: "Risque de rupture", action: "Reapprovisionner", tone: "cyan" },
      { title: "Utilisateurs bloques", detail: "3 invitations en attente", impact: "Onboarding ralenti", action: "Debloquer", tone: "green" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "CRM", metric: "Nouveaux prospects", value: "186", trend: "+14%", status: "Actif" },
      { module: "Ventes", metric: "Ventes du mois", value: "86 450 EUR", trend: "+16%", status: "Actif" },
      { module: "Stock", metric: "Produits critiques", value: "8", trend: "-5%", status: "Stock faible" },
      { module: "Facturation", metric: "A encaisser", value: "48 200 EUR", trend: "+11%", status: "En retard" },
    ],
    alerts: sharedDashboard.alerts,
    goals: [
      { label: "CA mensuel", progress: 72, current: "86 450 EUR", target: "120 000 EUR" },
      { label: "Nouveaux clients", progress: 64, current: "32", target: "50" },
      { label: "Paiements encaisses", progress: 81, current: "97 200 EUR", target: "120 000 EUR" },
      { label: "Ventes par commercial", progress: 58, current: "4/7 objectifs", target: "7/7" },
    ],
    ai: sharedDashboard.ai,
  },
  restaurant: {
    label: "Restauration",
    kpis: [
      { label: "Ventes du jour", baseValue: 18450, format: "currency", change: "+9%" },
      { label: "Commandes", baseValue: 286, format: "number", change: "+14%" },
      { label: "Reservations", baseValue: 42, format: "number", change: "+6%" },
      { label: "Food cost", baseValue: 31, format: "percent", change: "-2 pts" },
    ],
    priorities: [
      { title: "Reservations a confirmer", detail: "11 tables sans confirmation", impact: "Service du soir", action: "Confirmer", tone: "orange" },
      { title: "Pertes cuisine", detail: "4 ingredients au-dessus du seuil", impact: "Food cost a surveiller", action: "Voir", tone: "red" },
      { title: "Stock cuisine", detail: "5 produits critiques", impact: "Menu impacte", action: "Commander", tone: "cyan" },
      { title: "Factures fournisseurs", detail: "3 echeances proches", impact: "Tresorerie", action: "Payer", tone: "green" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "Commandes", metric: "Tickets servis", value: "286", trend: "+14%", status: "Actif" },
      { module: "Reservations", metric: "Taux occupation", value: "78%", trend: "+5%", status: "Actif" },
      { module: "Menus", metric: "Plats rentables", value: "12", trend: "+3", status: "Actif" },
      { module: "Stock cuisine", metric: "Ruptures", value: "5", trend: "-2", status: "Stock faible" },
    ],
    alerts: ["5 produits cuisine sont sous le seuil.", "11 reservations doivent etre confirmees.", "Food cost proche de la limite.", "Planning personnel incomplet pour samedi."],
    goals: [
      { label: "Ventes mensuelles", progress: 69, current: "64 300 EUR", target: "93 000 EUR" },
      { label: "Reservations", progress: 76, current: "312", target: "410" },
      { label: "Marge menu", progress: 61, current: "34%", target: "42%" },
      { label: "Pertes reduites", progress: 58, current: "-8%", target: "-14%" },
    ],
    ai: sharedDashboard.ai,
  },
  commerce: {
    label: "Commerce",
    kpis: [
      { label: "Ventes", baseValue: 124800, format: "currency", change: "+21%" },
      { label: "Transactions", baseValue: 1842, format: "number", change: "+13%" },
      { label: "Panier moyen", baseValue: 68, format: "currency", change: "+7%" },
      { label: "Retours", baseValue: 3.8, format: "percent", change: "-1 pt" },
    ],
    priorities: [
      { title: "Stock critique", detail: "17 SKU sous seuil", impact: "Ventes bloquees", action: "Reapprovisionner", tone: "red" },
      { title: "Commandes en attente", detail: "23 commandes a preparer", impact: "SLA livraison", action: "Voir", tone: "orange" },
      { title: "Produits forte marge", detail: "9 references > 40%", impact: "Opportunite promo", action: "Promouvoir", tone: "green" },
      { title: "Retours a traiter", detail: "6 demandes ouvertes", impact: "Satisfaction client", action: "Traiter", tone: "cyan" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "Produits", metric: "SKU actifs", value: "1 842", trend: "+4%", status: "Actif" },
      { module: "Ventes", metric: "Transactions", value: "1 842", trend: "+13%", status: "Actif" },
      { module: "Stock", metric: "Ruptures", value: "17", trend: "-5", status: "Critique" },
      { module: "Paiements", metric: "Encaissement", value: "98%", trend: "+2%", status: "Actif" },
    ],
    alerts: ["17 SKU sont sous le seuil.", "23 commandes attendent preparation.", "6 retours clients sont ouverts.", "2 caisses doivent etre rapprochees."],
    goals: [
      { label: "CA mensuel", progress: 74, current: "124 800 EUR", target: "168 000 EUR" },
      { label: "Transactions", progress: 68, current: "1 842", target: "2 700" },
      { label: "Panier moyen", progress: 82, current: "68 EUR", target: "83 EUR" },
      { label: "Stock disponible", progress: 71, current: "89%", target: "96%" },
    ],
    ai: sharedDashboard.ai,
  },
  construction: {
    label: "Construction",
    kpis: [
      { label: "Projets actifs", baseValue: 18, format: "number", change: "+3" },
      { label: "Budget engage", baseValue: 940000, format: "currency", change: "+11%" },
      { label: "Couts reels", baseValue: 712000, format: "currency", change: "+8%" },
      { label: "Marge projet", baseValue: 24, format: "percent", change: "+2 pts" },
    ],
    priorities: [
      { title: "Retards chantier", detail: "4 jalons depasses", impact: "Penalites possibles", action: "Voir", tone: "red" },
      { title: "Budgets a valider", detail: "3 avenants en attente", impact: "228 000 EUR", action: "Valider", tone: "orange" },
      { title: "Materiaux critiques", detail: "Beton et acier a reapprovisionner", impact: "Planning bloque", action: "Commander", tone: "cyan" },
      { title: "Contrats a signer", detail: "2 signatures attendues", impact: "Demarrage projet", action: "Signer", tone: "green" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "Chantiers", metric: "Projets actifs", value: "18", trend: "+3", status: "Actif" },
      { module: "Budgets", metric: "Ecart budget", value: "6%", trend: "-1 pt", status: "Actif" },
      { module: "Materiaux", metric: "Critiques", value: "7", trend: "+2", status: "Critique" },
      { module: "Contrats", metric: "A signer", value: "2", trend: "Stable", status: "En attente" },
    ],
    alerts: ["4 jalons chantier sont en retard.", "7 materiaux sont critiques.", "3 avenants budget attendent validation.", "2 contrats restent a signer."],
    goals: [
      { label: "Avancement projets", progress: 66, current: "66%", target: "100%" },
      { label: "Marge moyenne", progress: 73, current: "24%", target: "33%" },
      { label: "Retards reduits", progress: 52, current: "4", target: "0" },
      { label: "Budget maitrise", progress: 79, current: "6% ecart", target: "< 4%" },
    ],
    ai: sharedDashboard.ai,
  },
  sante: {
    label: "Sante",
    kpis: [
      { label: "Patients", baseValue: 642, format: "number", change: "+8%" },
      { label: "Rendez-vous", baseValue: 186, format: "number", change: "+12%" },
      { label: "Consultations", baseValue: 154, format: "number", change: "+9%" },
      { label: "Facturation", baseValue: 68400, format: "currency", change: "+10%" },
    ],
    priorities: [
      { title: "Rendez-vous non confirmes", detail: "18 confirmations attendues", impact: "Planning medecins", action: "Relancer", tone: "orange" },
      { title: "Dossiers incomplets", detail: "9 dossiers patients", impact: "Qualite suivi", action: "Completer", tone: "red" },
      { title: "Stock pharmacie", detail: "6 references critiques", impact: "Rupture possible", action: "Commander", tone: "cyan" },
      { title: "Factures mutuelles", detail: "12 dossiers a transmettre", impact: "Encaissement", action: "Envoyer", tone: "green" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "Patients", metric: "Patients actifs", value: "642", trend: "+8%", status: "Actif" },
      { module: "Rendez-vous", metric: "Confirmes", value: "168/186", trend: "+5%", status: "En attente" },
      { module: "Pharmacie", metric: "Stock critique", value: "6", trend: "-2", status: "Stock faible" },
      { module: "Facturation", metric: "A encaisser", value: "18 200 EUR", trend: "+7%", status: "Actif" },
    ],
    alerts: ["18 rendez-vous restent a confirmer.", "9 dossiers patients sont incomplets.", "6 references pharmacie sont critiques.", "12 factures mutuelles attendent envoi."],
    goals: [
      { label: "Consultations", progress: 78, current: "154", target: "198" },
      { label: "Taux confirmation", progress: 84, current: "90%", target: "97%" },
      { label: "Encaissements", progress: 69, current: "68 400 EUR", target: "99 000 EUR" },
      { label: "Dossiers complets", progress: 88, current: "91%", target: "98%" },
    ],
    ai: sharedDashboard.ai,
  },
  education: {
    label: "Education",
    kpis: [
      { label: "Etudiants actifs", baseValue: 840, format: "number", change: "+6%" },
      { label: "Cours planifies", baseValue: 126, format: "number", change: "+10%" },
      { label: "Frais encaisses", baseValue: 91400, format: "currency", change: "+14%" },
      { label: "Examens", baseValue: 18, format: "number", change: "+4" },
    ],
    priorities: [
      { title: "Frais scolaires dus", detail: "27 dossiers en retard", impact: "31 700 EUR", action: "Relancer", tone: "red" },
      { title: "Emploi du temps", detail: "5 classes sans salle", impact: "Planning", action: "Corriger", tone: "orange" },
      { title: "Examens a valider", detail: "8 evaluations en attente", impact: "Publication notes", action: "Valider", tone: "cyan" },
      { title: "Documents RH", detail: "4 contrats enseignants", impact: "Conformite", action: "Signer", tone: "green" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "Etudiants", metric: "Actifs", value: "840", trend: "+6%", status: "Actif" },
      { module: "Classes", metric: "Sans salle", value: "5", trend: "-2", status: "En attente" },
      { module: "Examens", metric: "A valider", value: "8", trend: "+1", status: "En attente" },
      { module: "Factures", metric: "Frais dus", value: "31 700 EUR", trend: "+6%", status: "En retard" },
    ],
    alerts: ["27 frais scolaires sont en retard.", "5 classes n'ont pas encore de salle.", "8 examens attendent validation.", "4 contrats enseignants restent a signer."],
    goals: [
      { label: "Frais encaisses", progress: 71, current: "91 400 EUR", target: "128 000 EUR" },
      { label: "Inscriptions", progress: 67, current: "84", target: "125" },
      { label: "Cours planifies", progress: 82, current: "126", target: "154" },
      { label: "Dossiers complets", progress: 76, current: "76%", target: "100%" },
    ],
    ai: sharedDashboard.ai,
  },
  transport: {
    label: "Transport",
    kpis: [
      { label: "Expeditions", baseValue: 438, format: "number", change: "+15%" },
      { label: "Vehicules actifs", baseValue: 34, format: "number", change: "+2" },
      { label: "Carburant", baseValue: 28400, format: "currency", change: "+5%" },
      { label: "Retards", baseValue: 7, format: "number", change: "-3" },
    ],
    priorities: [
      { title: "Livraisons en retard", detail: "7 expeditions depassent le SLA", impact: "Satisfaction client", action: "Voir", tone: "red" },
      { title: "Maintenance flotte", detail: "5 vehicules a planifier", impact: "Disponibilite", action: "Planifier", tone: "orange" },
      { title: "Carburant a surveiller", detail: "2 lignes au-dessus du budget", impact: "Marge transport", action: "Analyser", tone: "cyan" },
      { title: "Itineraires optimisables", detail: "12 tournees avec economie possible", impact: "-8% cout", action: "Optimiser", tone: "green" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "Expeditions", metric: "Livrees", value: "431/438", trend: "+15%", status: "Actif" },
      { module: "Flotte", metric: "Vehicules actifs", value: "34", trend: "+2", status: "Actif" },
      { module: "Maintenance", metric: "A planifier", value: "5", trend: "+1", status: "En attente" },
      { module: "Carburant", metric: "Budget", value: "28 400 EUR", trend: "+5%", status: "Actif" },
    ],
    alerts: ["7 expeditions sont en retard.", "5 maintenances doivent etre planifiees.", "2 lignes carburant depassent le budget.", "12 itineraires peuvent etre optimises."],
    goals: [
      { label: "Expeditions livrees", progress: 86, current: "431", target: "500" },
      { label: "Retards reduits", progress: 63, current: "7", target: "0" },
      { label: "Cout carburant", progress: 74, current: "28 400 EUR", target: "24 000 EUR" },
      { label: "Disponibilite flotte", progress: 88, current: "92%", target: "98%" },
    ],
    ai: sharedDashboard.ai,
  },
  industrie: {
    label: "Industrie",
    kpis: [
      { label: "Production", baseValue: 12400, format: "number", change: "+11%" },
      { label: "Ordres fabrication", baseValue: 86, format: "number", change: "+8%" },
      { label: "Machines actives", baseValue: 42, format: "number", change: "+1" },
      { label: "Stock matieres", baseValue: 214000, format: "currency", change: "+6%" },
    ],
    priorities: [
      { title: "Ordres en retard", detail: "9 OF depassent la date", impact: "Production", action: "Voir", tone: "red" },
      { title: "Machines a maintenir", detail: "4 maintenances preventives", impact: "Risque arret", action: "Planifier", tone: "orange" },
      { title: "Matieres premieres", detail: "6 references critiques", impact: "Rupture ligne", action: "Commander", tone: "cyan" },
      { title: "Lots a controler", detail: "12 controles qualite", impact: "Expedition", action: "Controler", tone: "green" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "Production", metric: "Unites", value: "12 400", trend: "+11%", status: "Actif" },
      { module: "Machines", metric: "Disponibilite", value: "91%", trend: "+2%", status: "Actif" },
      { module: "Matieres", metric: "Critiques", value: "6", trend: "-1", status: "Stock faible" },
      { module: "Ordres", metric: "En retard", value: "9", trend: "+2", status: "En retard" },
    ],
    alerts: ["9 ordres de fabrication sont en retard.", "4 machines ont une maintenance proche.", "6 matieres premieres sont critiques.", "12 lots attendent controle qualite."],
    goals: [
      { label: "Production mensuelle", progress: 77, current: "12 400", target: "16 000" },
      { label: "Disponibilite machines", progress: 83, current: "91%", target: "98%" },
      { label: "Retards OF", progress: 55, current: "9", target: "0" },
      { label: "Controle qualite", progress: 69, current: "88%", target: "99%" },
    ],
    ai: sharedDashboard.ai,
  },
  hotel: {
    label: "Hotellerie",
    kpis: [
      { label: "Reservations", baseValue: 224, format: "number", change: "+12%" },
      { label: "Taux occupation", baseValue: 81, format: "percent", change: "+5 pts" },
      { label: "RevPAR", baseValue: 92, format: "currency", change: "+8%" },
      { label: "Paiements", baseValue: 76400, format: "currency", change: "+10%" },
    ],
    priorities: [
      { title: "Arrivees du jour", detail: "18 check-ins a preparer", impact: "Reception", action: "Voir", tone: "orange" },
      { title: "Chambres a nettoyer", detail: "12 chambres en attente", impact: "Disponibilite", action: "Assigner", tone: "red" },
      { title: "Paiements a encaisser", detail: "9 sejours non soldes", impact: "Tresorerie", action: "Encaisser", tone: "cyan" },
      { title: "Restaurant hotel", detail: "6 reservations groupe", impact: "Coordination", action: "Planifier", tone: "green" },
    ],
    cashflow: sharedDashboard.cashflow,
    activity: sharedDashboard.activity,
    moduleStats: [
      { module: "Reservations", metric: "Confirmees", value: "224", trend: "+12%", status: "Actif" },
      { module: "Chambres", metric: "Occupation", value: "81%", trend: "+5 pts", status: "Actif" },
      { module: "Housekeeping", metric: "A nettoyer", value: "12", trend: "-4", status: "En attente" },
      { module: "Paiements", metric: "A encaisser", value: "11 300 EUR", trend: "+6%", status: "Actif" },
    ],
    alerts: ["12 chambres attendent housekeeping.", "18 arrivees doivent etre preparees.", "9 sejours ne sont pas soldes.", "6 reservations restaurant concernent des groupes."],
    goals: [
      { label: "Occupation", progress: 81, current: "81%", target: "92%" },
      { label: "RevPAR", progress: 74, current: "92 EUR", target: "124 EUR" },
      { label: "Paiements soldes", progress: 78, current: "91%", target: "100%" },
      { label: "Satisfaction", progress: 86, current: "4.3/5", target: "4.8/5" },
    ],
    ai: sharedDashboard.ai,
  },
};

export const planUsage = [
  { label: "Utilisateurs", value: "8 / 15", progress: 53 },
  { label: "Stockage", value: "2,4 / 10 GB", progress: 24 },
  { label: "Automatisations", value: "63 / 100", progress: 63 },
  { label: "API calls", value: "12 450 / 50 000", progress: 25 },
];

export const trustItems = [
  "Permissions par role",
  "Sessions JWT securisees",
  "Logs sans tokens sensibles",
  "Statut API operationnel",
  "Architecture multi-tenant",
];
