import type {
  SectorDefinition,
  SectorKey,
} from "@shared/sector/types";

const commonModules = [
  "rapports",
  "assistant",
  "parametres",
  "utilisateurs",
  "roles-permissions",
  "notifications",
  "documents",
  "statistiques",
  "support",
  "ai-sales-agent",
  "ai-studio",
] as const;

export const sectorDefinitions: Record<SectorKey, SectorDefinition> = {
  general: {
    key: "general",
    name: "Entreprise generale",
    description: "Services, PME classiques et entreprises polyvalentes",
    icon: "🏢",
    modules: [
      "dashboard",
      "clients",
      "crm",
      "ventes",
      "produits",
      "stock",
      "devis",
      "facturation",
      "paiements",
      "fournisseurs",
      "finances",
      "rh",
      ...commonModules,
    ],
    labels: {
      rh: "Employes",
      facturation: "Factures",
    },
  },

  restaurant: {
    key: "restaurant",
    name: "Restauration",
    description: "Restaurants, cafes, fast-food, patisseries et traiteurs",
    icon: "🍽️",
    modules: [
      "dashboard",
      "clients",
      "commandes",
      "reservations",
      "menus",
      "cuisine",
      "recettes",
      "stock",
      "achats",
      "facturation",
      "paiements",
      "finances",
      "rh",
      ...commonModules,
    ],
    labels: {
      stock: "Stock cuisine",
      rh: "Personnel",
      facturation: "Factures",
    },
  },

  commerce: {
    key: "commerce",
    name: "Commerce",
    description: "Boutiques, magasins et supermarches",
    icon: "🛍️",
    modules: [
      "dashboard",
      "clients",
      "produits",
      "ventes",
      "commandes",
      "stock",
      "fournisseurs",
      "paiements",
      "facturation",
      "finances",
      "rh",
      ...commonModules,
    ],
    labels: {
      rh: "Employes",
      facturation: "Factures",
    },
  },

  construction: {
    key: "construction",
    name: "Construction",
    description: "BTP, genie civil et batiment",
    icon: "🏗️",
    modules: [
      "dashboard",
      "clients",
      "chantiers",
      "devis",
      "contrats",
      "materiels",
      "materiaux",
      "fournisseurs",
      "achats",
      "budgets",
      "facturation",
      "rh",
      ...commonModules,
    ],
    labels: {
      clients: "Clients",
      rh: "Employes",
      facturation: "Facturation",
    },
  },

  sante: {
    key: "sante",
    name: "Sante",
    description: "Cliniques, cabinets medicaux et hopitaux",
    icon: "🏥",
    modules: [
      "dashboard",
      "patients",
      "medecins",
      "rendez-vous",
      "consultations",
      "pharmacie",
      "laboratoire",
      "dossiers-medicaux",
      "facturation",
      "paiements",
      "finances",
      "rh",
      ...commonModules,
    ],
    labels: {
      rh: "Personnel",
    },
  },

  education: {
    key: "education",
    name: "Education",
    description: "Ecoles, universites et centres de formation",
    icon: "🎓",
    modules: [
      "dashboard",
      "etudiants",
      "enseignants",
      "classes",
      "emploi-du-temps",
      "examens",
      "cours",
      "presences",
      "frais-scolaires",
      "facturation",
      "rh",
      ...commonModules,
    ],
    labels: {
      rh: "Personnel",
      facturation: "Factures",
    },
  },

  transport: {
    key: "transport",
    name: "Transport",
    description: "Transport routier, logistique et livraison",
    icon: "🚚",
    modules: [
      "dashboard",
      "clients",
      "flotte",
      "conducteurs",
      "expeditions",
      "itineraires",
      "carburant",
      "maintenance",
      "facturation",
      "paiements",
      "finances",
      ...commonModules,
    ],
    labels: {
      facturation: "Facturation",
    },
  },

  industrie: {
    key: "industrie",
    name: "Industrie",
    description: "Usines, production et fabrication",
    icon: "🏭",
    modules: [
      "dashboard",
      "clients",
      "production",
      "matieres-premieres",
      "machines",
      "achats",
      "stock",
      "fournisseurs",
      "ordres-fabrication",
      "facturation",
      "finances",
      "rh",
      ...commonModules,
    ],
    labels: {
      rh: "Employes",
      facturation: "Facturation",
    },
  },

  hotel: {
    key: "hotel",
    name: "Hotellerie",
    description: "Hotels, auberges et residences",
    icon: "🏨",
    modules: [
      "dashboard",
      "reservations",
      "chambres",
      "clients",
      "housekeeping",
      "restaurant-hotel",
      "facturation",
      "paiements",
      "rh",
      "finances",
      ...commonModules,
    ],
    labels: {
      rh: "Personnel",
      "restaurant-hotel": "Restaurant",
      facturation: "Facturation",
    },
  },
};

export const sectorOptions = Object.values(sectorDefinitions);

type SectorFeature = {
  icon: string;
  title: string;
  description: string;
};

type SectorPlan = {
  name: string;
  description: string;
  price: string;
  features: string[];
  featured?: boolean;
};

export type SectorConfig = {
  slug: string;
  badge: string;
  title: string;
  highlightedTitle: string;
  subtitle: string;
  dashboardTitle: string;
  dashboardDescription: string;
  aiRecommendation: string;
  problemIntro: string;
  problems: SectorFeature[];
  modules: SectorFeature[];
  benefits: SectorFeature[];
  plans: SectorPlan[];
  ctaTitle: string;
  ctaDescription: string;
};

const coreModules: SectorFeature[] = [
  {
    icon: "CRM",
    title: "CRM clients",
    description: "Centralisez clients, prospects, historique commercial et relances.",
  },
  {
    icon: "SALE",
    title: "Ventes et devis",
    description: "Suivez les opportunites, commandes, devis et conversions.",
  },
  {
    icon: "STOCK",
    title: "Stock intelligent",
    description: "Controlez quantites, seuils critiques et reapprovisionnements.",
  },
  {
    icon: "BILL",
    title: "Facturation",
    description: "Creez les factures, suivez paiements et echeances.",
  },
  {
    icon: "AI",
    title: "Assistant IA",
    description: "Recevez des syntheses, alertes et recommandations operationnelles.",
  },
  {
    icon: "MOB",
    title: "Mobile ready",
    description: "Travaillez depuis le cloud avec une base preparee pour le mobile.",
  },
];

const defaultPlans: SectorPlan[] = [
  {
    name: "Starter",
    description: "Pour demarrer avec les fonctions essentielles.",
    price: "14 jours gratuits",
    features: ["CRM", "Stock", "Facturation", "Dashboard"],
  },
  {
    name: "Business",
    description: "Pour une activite en croissance.",
    price: "Sur devis",
    features: ["Tous les modules", "Assistant IA", "Multi-utilisateurs", "Exports"],
    featured: true,
  },
  {
    name: "Enterprise",
    description: "Pour organisations multi-sites et exigences avancees.",
    price: "Sur mesure",
    features: ["API", "Integrations", "Permissions avancees", "Support prioritaire"],
  },
];

function buildSector(
  slug: Exclude<SectorKey, "general">,
  label: string,
  activity: string
): SectorConfig {
  return {
    slug,
    badge: `ERP Cloud pour ${label}`,
    title: `Pilotez votre ${activity} avec EnterpriseERP`,
    highlightedTitle: "Cloud, Mobile et IA.",
    subtitle:
      "Centralisez vos clients, ventes, factures, stock, equipe et indicateurs dans une plateforme SaaS moderne.",
    dashboardTitle: `Dashboard ${label}`,
    dashboardDescription:
      "Visualisez les indicateurs essentiels, les alertes, les performances et les actions prioritaires depuis une seule interface.",
    aiRecommendation:
      "L'IA recommande de prioriser les relances, le suivi du stock et les opportunites commerciales a fort impact.",
    problemIntro:
      "Quand les donnees sont dispersees, les equipes perdent du temps et les decisions deviennent plus lentes.",
    problems: [
      {
        icon: "OPS",
        title: "Donnees dispersees",
        description: "Clients, ventes, stock et factures sont souvent suivis dans plusieurs outils.",
      },
      {
        icon: "TIME",
        title: "Taches manuelles",
        description: "Les doubles saisies et controles repetitifs ralentissent les equipes.",
      },
      {
        icon: "VIEW",
        title: "Manque de visibilite",
        description: "Les dirigeants manquent d'indicateurs fiables pour decider rapidement.",
      },
      {
        icon: "RISK",
        title: "Alertes tardives",
        description: "Les retards de paiement, ruptures et priorites sont identifies trop tard.",
      },
    ],
    modules: coreModules,
    benefits: [
      {
        icon: "1",
        title: "Une vision unique",
        description: "Toutes les informations importantes sont regroupees dans un tableau de bord clair.",
      },
      {
        icon: "2",
        title: "Moins de pertes de temps",
        description: "Les processus courants deviennent plus simples, rapides et faciles a suivre.",
      },
      {
        icon: "3",
        title: "Des decisions plus rapides",
        description: "Les alertes et recommandations aident a prioriser les bonnes actions.",
      },
    ],
    plans: defaultPlans,
    ctaTitle: `Modernisez la gestion de votre ${activity}`,
    ctaDescription:
      "Demandez une demonstration et voyez comment EnterpriseERP Cloud peut simplifier vos operations.",
  };
}

export const sectors: Record<Exclude<SectorKey, "general">, SectorConfig> = {
  restaurant: buildSector("restaurant", "la restauration", "restaurant"),
  commerce: buildSector("commerce", "le commerce", "commerce"),
  construction: buildSector("construction", "la construction", "entreprise de construction"),
  sante: buildSector("sante", "la sante", "organisation de sante"),
  education: buildSector("education", "l'education", "etablissement"),
  transport: buildSector("transport", "le transport", "activite logistique"),
  industrie: buildSector("industrie", "l'industrie", "production"),
  hotel: buildSector("hotel", "l'hotellerie", "hotel"),
};
