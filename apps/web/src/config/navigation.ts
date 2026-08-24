import type { ModuleKey } from "@shared/sector/types";

export type NavigationItem = {
  key: ModuleKey;
  name: string;
  href: string;
  icon: string;
};

const moduleHref = (key: ModuleKey) => `/modules/${key}`;

export const navigationItems: NavigationItem[] = [
  { key: "dashboard", name: "Tableau de bord", href: "/dashboard", icon: "DB" },
  { key: "clients", name: "Clients", href: moduleHref("clients"), icon: "CL" },
  { key: "crm", name: "CRM", href: "/crm", icon: "CRM" },
  { key: "ventes", name: "Ventes", href: "/ventes", icon: "SA" },
  { key: "produits", name: "Produits", href: moduleHref("produits"), icon: "PR" },
  { key: "stock", name: "Stock", href: "/stock", icon: "ST" },
  { key: "devis", name: "Devis", href: moduleHref("devis"), icon: "QT" },
  { key: "facturation", name: "Factures", href: "/facturation", icon: "IN" },
  { key: "paiements", name: "Paiements", href: moduleHref("paiements"), icon: "PY" },
  { key: "fournisseurs", name: "Fournisseurs", href: moduleHref("fournisseurs"), icon: "SU" },
  { key: "finances", name: "Finances", href: moduleHref("finances"), icon: "FI" },
  { key: "comptabilite", name: "Comptabilite", href: "/comptabilite", icon: "AC" },
  { key: "rh", name: "Employes", href: "/rh", icon: "HR" },
  { key: "rapports", name: "Rapports", href: moduleHref("rapports"), icon: "RP" },
  { key: "assistant", name: "Assistant IA", href: "/assistant", icon: "AI" },
  { key: "ai-sales-agent", name: "AI Sales Agent", href: "/ai-sales-agent", icon: "AS" },
  { key: "ai-studio", name: "AI Studio", href: "/ai-studio", icon: "STU" },
  { key: "support", name: "Support", href: "/support", icon: "SUP" },
  { key: "gouvernance", name: "Gouvernance", href: "/gouvernance", icon: "GV" },
  { key: "utilisateurs", name: "Utilisateurs", href: moduleHref("utilisateurs"), icon: "US" },
  { key: "roles-permissions", name: "Roles & permissions", href: moduleHref("roles-permissions"), icon: "RB" },
  { key: "notifications", name: "Notifications", href: moduleHref("notifications"), icon: "NO" },
  { key: "documents", name: "Documents", href: moduleHref("documents"), icon: "DO" },
  { key: "statistiques", name: "Statistiques", href: moduleHref("statistiques"), icon: "CH" },
  { key: "commandes", name: "Commandes", href: moduleHref("commandes"), icon: "OR" },
  { key: "reservations", name: "Reservations", href: moduleHref("reservations"), icon: "RS" },
  { key: "menus", name: "Menus", href: moduleHref("menus"), icon: "ME" },
  { key: "cuisine", name: "Cuisine", href: moduleHref("cuisine"), icon: "KI" },
  { key: "recettes", name: "Recettes", href: moduleHref("recettes"), icon: "RC" },
  { key: "achats", name: "Achats", href: moduleHref("achats"), icon: "PO" },
  { key: "chantiers", name: "Chantiers", href: moduleHref("chantiers"), icon: "PJ" },
  { key: "contrats", name: "Contrats", href: moduleHref("contrats"), icon: "CT" },
  { key: "materiels", name: "Materiels", href: moduleHref("materiels"), icon: "EQ" },
  { key: "materiaux", name: "Materiaux", href: moduleHref("materiaux"), icon: "MT" },
  { key: "budgets", name: "Budgets", href: moduleHref("budgets"), icon: "BU" },
  { key: "patients", name: "Patients", href: moduleHref("patients"), icon: "PA" },
  { key: "medecins", name: "Medecins", href: moduleHref("medecins"), icon: "DR" },
  { key: "rendez-vous", name: "Rendez-vous", href: moduleHref("rendez-vous"), icon: "RDV" },
  { key: "consultations", name: "Consultations", href: moduleHref("consultations"), icon: "CO" },
  { key: "pharmacie", name: "Pharmacie", href: moduleHref("pharmacie"), icon: "PH" },
  { key: "laboratoire", name: "Laboratoire", href: moduleHref("laboratoire"), icon: "LAB" },
  { key: "dossiers-medicaux", name: "Dossiers medicaux", href: moduleHref("dossiers-medicaux"), icon: "DM" },
  { key: "etudiants", name: "Etudiants", href: moduleHref("etudiants"), icon: "ET" },
  { key: "enseignants", name: "Enseignants", href: moduleHref("enseignants"), icon: "TE" },
  { key: "classes", name: "Classes", href: moduleHref("classes"), icon: "CS" },
  { key: "emploi-du-temps", name: "Emploi du temps", href: moduleHref("emploi-du-temps"), icon: "PL" },
  { key: "examens", name: "Examens", href: moduleHref("examens"), icon: "EX" },
  { key: "cours", name: "Cours", href: moduleHref("cours"), icon: "CR" },
  { key: "presences", name: "Presences", href: moduleHref("presences"), icon: "AT" },
  { key: "frais-scolaires", name: "Frais scolaires", href: moduleHref("frais-scolaires"), icon: "FS" },
  { key: "flotte", name: "Flotte", href: moduleHref("flotte"), icon: "FL" },
  { key: "conducteurs", name: "Conducteurs", href: moduleHref("conducteurs"), icon: "CD" },
  { key: "expeditions", name: "Expeditions", href: moduleHref("expeditions"), icon: "SH" },
  { key: "itineraires", name: "Itineraires", href: moduleHref("itineraires"), icon: "RO" },
  { key: "carburant", name: "Carburant", href: moduleHref("carburant"), icon: "FU" },
  { key: "maintenance", name: "Maintenance", href: moduleHref("maintenance"), icon: "MA" },
  { key: "production", name: "Production", href: moduleHref("production"), icon: "MF" },
  { key: "matieres-premieres", name: "Matieres premieres", href: moduleHref("matieres-premieres"), icon: "RM" },
  { key: "machines", name: "Machines", href: moduleHref("machines"), icon: "MC" },
  { key: "ordres-fabrication", name: "Ordres de fabrication", href: moduleHref("ordres-fabrication"), icon: "OF" },
  { key: "chambres", name: "Chambres", href: moduleHref("chambres"), icon: "RM" },
  { key: "housekeeping", name: "Housekeeping", href: moduleHref("housekeeping"), icon: "HK" },
  { key: "restaurant-hotel", name: "Restaurant", href: moduleHref("restaurant-hotel"), icon: "RE" },
  { key: "parametres", name: "Parametres", href: "/parametres", icon: "SE" },
];

export const navigationByKey = Object.fromEntries(
  navigationItems.map((item) => [item.key, item])
) as Record<ModuleKey, NavigationItem>;
