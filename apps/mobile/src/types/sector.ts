export type SectorKey =
  | "general"
  | "restaurant"
  | "commerce"
  | "construction"
  | "sante"
  | "education"
  | "transport"
  | "industrie"
  | "hotel";

export type ModuleKey =
  | "dashboard"
  | "clients"
  | "crm"
  | "ventes"
  | "produits"
  | "stock"
  | "devis"
  | "facturation"
  | "paiements"
  | "fournisseurs"
  | "finances"
  | "comptabilite"
  | "rh"
  | "rapports"
  | "assistant"
  | "ai-sales-agent"
  | "ai-studio"
  | "support"
  | "gouvernance"
  | "utilisateurs"
  | "roles-permissions"
  | "notifications"
  | "documents"
  | "statistiques"
  | "commandes"
  | "reservations"
  | "menus"
  | "cuisine"
  | "recettes"
  | "achats"
  | "chantiers"
  | "contrats"
  | "materiels"
  | "materiaux"
  | "budgets"
  | "patients"
  | "medecins"
  | "rendez-vous"
  | "consultations"
  | "pharmacie"
  | "laboratoire"
  | "dossiers-medicaux"
  | "etudiants"
  | "enseignants"
  | "classes"
  | "emploi-du-temps"
  | "examens"
  | "cours"
  | "presences"
  | "frais-scolaires"
  | "flotte"
  | "conducteurs"
  | "expeditions"
  | "itineraires"
  | "carburant"
  | "maintenance"
  | "production"
  | "matieres-premieres"
  | "machines"
  | "ordres-fabrication"
  | "chambres"
  | "housekeeping"
  | "restaurant-hotel"
  | "parametres";

export type SectorKpi = {
  key: string;
  labelKey: string;
  value: string;
  trendKey: string;
};

export type SectorDefinition = {
  key: SectorKey;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  accent: string;
  modules: ModuleKey[];
  kpis: SectorKpi[];
  priorityActionKeys: string[];
  recentActivityKeys: string[];
};
