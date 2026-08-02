import type { ModuleKey } from "@shared/sector/types";

export type NavigationItem = {
  key: ModuleKey;
  name: string;
  href: string;
  icon: string;
};

const moduleHref = (key: ModuleKey) => `/modules/${key}`;

export const navigationItems: NavigationItem[] = [
  { key: "dashboard", name: "Tableau de bord", href: "/dashboard", icon: "🏠" },
  { key: "clients", name: "Clients", href: moduleHref("clients"), icon: "👥" },
  { key: "crm", name: "CRM", href: "/crm", icon: "💼" },
  { key: "ventes", name: "Ventes", href: "/ventes", icon: "🛒" },
  { key: "produits", name: "Produits", href: moduleHref("produits"), icon: "📦" },
  { key: "stock", name: "Stock", href: "/stock", icon: "🏬" },
  { key: "devis", name: "Devis", href: moduleHref("devis"), icon: "🧾" },
  { key: "facturation", name: "Factures", href: "/facturation", icon: "📄" },
  { key: "paiements", name: "Paiements", href: moduleHref("paiements"), icon: "💳" },
  { key: "fournisseurs", name: "Fournisseurs", href: moduleHref("fournisseurs"), icon: "🚚" },
  { key: "finances", name: "Finances", href: moduleHref("finances"), icon: "💰" },
  { key: "comptabilite", name: "Comptabilite", href: "/comptabilite", icon: "💰" },
  { key: "rh", name: "Employes", href: "/rh", icon: "👨‍💼" },
  { key: "rapports", name: "Rapports", href: moduleHref("rapports"), icon: "📊" },
  { key: "assistant", name: "Assistant IA", href: "/assistant", icon: "🤖" },
  { key: "gouvernance", name: "Gouvernance", href: "/gouvernance", icon: "🔒" },
  { key: "utilisateurs", name: "Utilisateurs", href: moduleHref("utilisateurs"), icon: "👨‍💼" },
  { key: "roles-permissions", name: "Roles & permissions", href: moduleHref("roles-permissions"), icon: "🔒" },
  { key: "notifications", name: "Notifications", href: moduleHref("notifications"), icon: "🔔" },
  { key: "documents", name: "Documents", href: moduleHref("documents"), icon: "📁" },
  { key: "statistiques", name: "Statistiques", href: moduleHref("statistiques"), icon: "📈" },
  { key: "commandes", name: "Commandes", href: moduleHref("commandes"), icon: "🍽️" },
  { key: "reservations", name: "Reservations", href: moduleHref("reservations"), icon: "🪑" },
  { key: "menus", name: "Menus", href: moduleHref("menus"), icon: "📋" },
  { key: "cuisine", name: "Cuisine", href: moduleHref("cuisine"), icon: "👨‍🍳" },
  { key: "recettes", name: "Recettes", href: moduleHref("recettes"), icon: "🥩" },
  { key: "achats", name: "Achats", href: moduleHref("achats"), icon: "🛒" },
  { key: "chantiers", name: "Chantiers", href: moduleHref("chantiers"), icon: "🏗️" },
  { key: "contrats", name: "Contrats", href: moduleHref("contrats"), icon: "📑" },
  { key: "materiels", name: "Materiels", href: moduleHref("materiels"), icon: "🚜" },
  { key: "materiaux", name: "Materiaux", href: moduleHref("materiaux"), icon: "🧱" },
  { key: "budgets", name: "Budgets", href: moduleHref("budgets"), icon: "💰" },
  { key: "patients", name: "Patients", href: moduleHref("patients"), icon: "🩺" },
  { key: "medecins", name: "Medecins", href: moduleHref("medecins"), icon: "👨‍⚕️" },
  { key: "rendez-vous", name: "Rendez-vous", href: moduleHref("rendez-vous"), icon: "📅" },
  { key: "consultations", name: "Consultations", href: moduleHref("consultations"), icon: "🩻" },
  { key: "pharmacie", name: "Pharmacie", href: moduleHref("pharmacie"), icon: "💊" },
  { key: "laboratoire", name: "Laboratoire", href: moduleHref("laboratoire"), icon: "🧪" },
  { key: "dossiers-medicaux", name: "Dossiers medicaux", href: moduleHref("dossiers-medicaux"), icon: "📁" },
  { key: "etudiants", name: "Etudiants", href: moduleHref("etudiants"), icon: "🎓" },
  { key: "enseignants", name: "Enseignants", href: moduleHref("enseignants"), icon: "👨‍🏫" },
  { key: "classes", name: "Classes", href: moduleHref("classes"), icon: "🏫" },
  { key: "emploi-du-temps", name: "Emploi du temps", href: moduleHref("emploi-du-temps"), icon: "📅" },
  { key: "examens", name: "Examens", href: moduleHref("examens"), icon: "📝" },
  { key: "cours", name: "Cours", href: moduleHref("cours"), icon: "📚" },
  { key: "frais-scolaires", name: "Frais scolaires", href: moduleHref("frais-scolaires"), icon: "💳" },
  { key: "flotte", name: "Flotte", href: moduleHref("flotte"), icon: "🚚" },
  { key: "conducteurs", name: "Conducteurs", href: moduleHref("conducteurs"), icon: "👨‍✈️" },
  { key: "expeditions", name: "Expeditions", href: moduleHref("expeditions"), icon: "📦" },
  { key: "itineraires", name: "Itineraires", href: moduleHref("itineraires"), icon: "🗺️" },
  { key: "carburant", name: "Carburant", href: moduleHref("carburant"), icon: "⛽" },
  { key: "maintenance", name: "Maintenance", href: moduleHref("maintenance"), icon: "🔧" },
  { key: "production", name: "Production", href: moduleHref("production"), icon: "🏭" },
  { key: "matieres-premieres", name: "Matieres premieres", href: moduleHref("matieres-premieres"), icon: "📦" },
  { key: "machines", name: "Machines", href: moduleHref("machines"), icon: "⚙️" },
  { key: "ordres-fabrication", name: "Ordres de fabrication", href: moduleHref("ordres-fabrication"), icon: "📋" },
  { key: "chambres", name: "Chambres", href: moduleHref("chambres"), icon: "🛏️" },
  { key: "housekeeping", name: "Housekeeping", href: moduleHref("housekeeping"), icon: "🧹" },
  { key: "restaurant-hotel", name: "Restaurant", href: moduleHref("restaurant-hotel"), icon: "🍽️" },
  { key: "parametres", name: "Parametres", href: "/parametres", icon: "⚙️" },
];

export const navigationByKey = Object.fromEntries(
  navigationItems.map((item) => [item.key, item])
) as Record<ModuleKey, NavigationItem>;
