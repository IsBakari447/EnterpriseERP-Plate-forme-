export type SectorKey =
  | "general"
  | "retail"
  | "restaurant"
  | "construction"
  | "transport"
  | "hospitality"
  | "manufacturing"
  | "education"
  | "healthcare";

export type SectorNavigationItem = {
  key: string;
  label: string;
  route: string;
  icon?: string;
  permission?: string;
};

export type SectorNavigationSection = {
  key: string;
  label: string;
  items: SectorNavigationItem[];
};

export type SectorDefinition = {
  key: SectorKey;
  label: string;
  dashboardLabel: string;
  modules: string[];
  kpis: string[];
  workflows: string[];
  navigation: SectorNavigationSection[];
};

function item(key: string, label: string, section: string, permission?: string, icon?: string): SectorNavigationItem {
  return {
    key,
    label,
    route: `/modules/${section}/${key}`,
    permission,
    icon,
  };
}

const adminSection: SectorNavigationSection = {
  key: "administration",
  label: "ADMINISTRATION",
  items: [
    item("admin-center", "Centre admin", "administration", "settings.manage"),
    item("users", "Utilisateurs", "administration", "users.read"),
    item("roles-permissions", "Roles & Permissions", "administration", "roles.manage"),
    item("security-center", "Security Center", "administration", "settings.manage"),
    item("audit", "Audit", "administration", "audit.read"),
    item("backup-center", "Sauvegarde", "administration", "settings.manage"),
    item("settings", "Parametres", "administration", "settings.manage"),
  ],
};

export const sectorDefinitions: Record<SectorKey, SectorDefinition> = {
  general: {
    key: "general",
    label: "Entreprise generale",
    dashboardLabel: "Tableau de bord",
    modules: ["dashboard", "crm", "sales", "products", "inventory", "invoices", "payments", "finance", "hr", "projects", "ecommerce", "social", "ai", "administration"],
    kpis: ["revenue", "customers", "invoices", "cashflow"],
    workflows: ["crm-to-cash", "invoice-to-payment", "stock-control"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("dashboard", "Tableau de bord", "dashboard")] },
      { key: "crm", label: "CRM", items: [item("crm", "CRM", "crm", "crm.read"), item("clients", "Clients", "crm", "crm.read"), item("suppliers", "Fournisseurs", "crm", "crm.read")] },
      { key: "sales", label: "VENTES", items: [item("sales", "Ventes", "sales", "sales.read"), item("quotes", "Devis", "sales", "invoice.read"), item("orders", "Commandes", "sales", "sales.read"), item("invoices", "Factures", "sales", "invoice.read"), item("payments", "Paiements", "sales", "finance.read"), item("ai-sales-agent", "AI Sales Agent", "sales", "ai.use")] },
      { key: "stock", label: "STOCK", items: [item("products", "Produits", "stock", "stock.read"), item("stock", "Stock", "stock", "stock.read"), item("movements", "Mouvements", "stock", "stock.read"), item("inventory-counts", "Inventaires", "stock", "stock.read")] },
      { key: "finance", label: "FINANCE", items: [item("finance", "Finance", "finance", "finance.read"), item("expenses", "Depenses", "finance", "finance.read"), item("cashflow", "Tresorerie", "finance", "finance.read"), item("excel-exports", "Exports Excel", "finance", "finance.export")] },
      { key: "hr", label: "RH", items: [item("employees", "Employes", "hr", "hr.read"), item("attendance", "Presences", "hr", "hr.read"), item("leave", "Conges", "hr", "hr.read"), item("advanced-hr", "RH avancee", "hr", "hr.manage")] },
      { key: "projects", label: "PROJETS", items: [item("projects", "Projets", "projects", "projects.read"), item("tasks", "Taches", "projects", "projects.read")] },
      { key: "ecommerce", label: "E-COMMERCE", items: [item("ecommerce", "E-commerce", "ecommerce")] },
      { key: "social", label: "SOCIAL", items: [item("social", "Social", "social")] },
      { key: "ai", label: "IA", items: [item("ai-assistant", "Assistant IA", "ai", "ai.use"), item("ai-studio", "IA Studio", "ai", "ai.use")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration", "settings.manage"), item("users", "Utilisateurs", "administration", "users.read"), item("roles-permissions", "Roles & Permissions", "administration", "roles.manage"), item("security-center", "Security Center", "administration", "settings.manage"), item("advanced-finance", "Finance avancee", "administration", "finance.read"), item("audit", "Audit", "administration", "audit.read"), item("backup-center", "Centre de sauvegarde", "administration", "settings.manage"), item("settings", "Parametres", "administration", "settings.manage")] },
    ],
  },
  retail: {
    key: "retail",
    label: "Retail / Commerce",
    dashboardLabel: "Dashboard Retail",
    modules: ["dashboard", "clients", "loyalty", "pos", "sales", "returns", "promotions", "catalog", "barcode", "inventory", "purchases", "finance", "hr", "ecommerce", "social", "ai", "administration"],
    kpis: ["sales", "transactions", "average-basket", "returns", "stock"],
    workflows: ["pos-sale", "stock-replenishment", "return-to-refund"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("retail-dashboard", "Dashboard Retail", "dashboard")] },
      { key: "clients", label: "CLIENTS", items: [item("clients", "Clients", "clients", "crm.read"), item("loyalty", "Fidelite", "clients"), item("customer-segments", "Segments clients", "clients"), item("suppliers", "Fournisseurs", "clients", "crm.read")] },
      { key: "sales", label: "VENTES", items: [item("pos", "Point de vente (POS)", "sales", "sales.create"), item("sales", "Ventes", "sales", "sales.read"), item("orders", "Commandes", "sales", "sales.read"), item("returns", "Retours", "sales"), item("refunds", "Remboursements", "sales"), item("promotions", "Promotions", "sales"), item("coupons", "Coupons", "sales"), item("invoices", "Factures", "sales", "invoice.read"), item("payments", "Paiements", "sales", "finance.read"), item("ai-retail-agent", "AI Retail Agent", "sales", "ai.use")] },
      { key: "catalog", label: "CATALOGUE", items: [item("products", "Produits", "catalog", "stock.read"), item("categories", "Categories", "catalog"), item("variants", "Variantes", "catalog"), item("prices", "Prix", "catalog"), item("barcodes", "Codes-barres", "catalog")] },
      { key: "stock", label: "STOCK", items: [item("stock", "Stock", "stock", "stock.read"), item("warehouses", "Entrepots", "stock"), item("stores", "Magasins", "stock"), item("transfers", "Transferts", "stock", "stock.transfer"), item("inventory-counts", "Inventaires", "stock", "stock.read"), item("replenishment", "Reapprovisionnement", "stock", "stock.adjust")] },
      { key: "purchases", label: "ACHATS", items: [item("suppliers", "Fournisseurs", "purchases", "crm.read"), item("supplier-orders", "Commandes fournisseurs", "purchases"), item("receipts", "Receptions", "purchases")] },
      { key: "finance", label: "FINANCE", items: [item("finance", "Finance", "finance", "finance.read"), item("cash-register", "Caisse", "finance"), item("expenses", "Depenses", "finance"), item("margins", "Marges", "finance"), item("excel-exports", "Exports Excel", "finance", "finance.export")] },
      { key: "hr", label: "RH", items: [item("employees", "Employes", "hr", "hr.read"), item("cashiers", "Caissiers", "hr"), item("attendance", "Presences", "hr", "hr.read"), item("schedule", "Planning", "hr"), item("advanced-hr", "RH avancee", "hr", "hr.manage")] },
      { key: "ecommerce", label: "E-COMMERCE", items: [item("online-store", "Boutique en ligne", "ecommerce"), item("web-orders", "Commandes web", "ecommerce"), item("web-catalog", "Catalogue web", "ecommerce"), item("stock-sync", "Synchronisation stock", "ecommerce")] },
      { key: "social", label: "SOCIAL", items: [item("social-commerce", "Social Commerce", "social"), item("campaigns", "Campagnes", "social")] },
      { key: "ai", label: "IA", items: [item("ai-retail-assistant", "Assistant Retail IA", "ai", "ai.use"), item("sales-forecast", "Previsions ventes", "ai", "ai.use"), item("stock-forecast", "Previsions stock", "ai", "ai.use"), item("ai-studio", "IA Studio", "ai", "ai.use")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration", "settings.manage"), item("multi-store", "Multi-magasins", "administration"), ...adminSection.items.slice(1)] },
    ],
  },
  restaurant: {
    key: "restaurant",
    label: "Restauration",
    dashboardLabel: "Dashboard Restaurant",
    modules: ["dashboard", "clients", "reservations", "restaurant-pos", "orders", "tables", "delivery", "menu", "kitchen", "recipes", "inventory", "purchases", "finance", "hr", "marketing", "ai", "administration"],
    kpis: ["daily-sales", "orders", "reservations", "food-cost", "low-stock"],
    workflows: ["reservation-to-table", "order-to-kitchen", "purchase-to-stock"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("restaurant-dashboard", "Dashboard Restaurant", "dashboard")] },
      { key: "clients", label: "CLIENTS", items: [item("clients", "Clients", "clients", "crm.read"), item("loyalty", "Fidelite", "clients"), item("reservations", "Reservations", "clients"), item("suppliers", "Fournisseurs", "clients", "crm.read")] },
      { key: "sales", label: "VENTES", items: [item("restaurant-pos", "POS Restaurant", "sales", "sales.create"), item("orders", "Commandes", "sales"), item("tables", "Tables", "sales"), item("delivery", "Livraison", "sales"), item("click-collect", "Click & Collect", "sales"), item("invoices", "Factures", "sales", "invoice.read"), item("payments", "Paiements", "sales"), item("ai-restaurant-sales-agent", "AI Restaurant Sales Agent", "sales", "ai.use")] },
      { key: "menu", label: "MENU", items: [item("menus", "Menus", "menu"), item("dishes", "Plats", "menu"), item("drinks", "Boissons", "menu"), item("combos", "Formules", "menu"), item("supplements", "Supplements", "menu"), item("pricing", "Tarification", "menu")] },
      { key: "kitchen", label: "CUISINE", items: [item("kitchen-screen", "Ecran cuisine", "kitchen"), item("kitchen-orders", "Commandes cuisine", "kitchen"), item("prep-times", "Temps de preparation", "kitchen"), item("priorities", "Priorites", "kitchen")] },
      { key: "recipes", label: "RECETTES", items: [item("recipes", "Recettes", "recipes"), item("ingredients", "Ingredients", "recipes"), item("portion-cost", "Cout par portion", "recipes"), item("allergens", "Allergenes", "recipes")] },
      { key: "stock", label: "STOCK", items: [item("kitchen-stock", "Stock cuisine", "stock", "stock.read"), item("raw-materials", "Matieres premieres", "stock"), item("losses", "Pertes", "stock"), item("expirations", "Peremptions", "stock"), item("inventory-counts", "Inventaires", "stock"), item("replenishment", "Reapprovisionnement", "stock")] },
      { key: "purchases", label: "ACHATS", items: [item("suppliers", "Fournisseurs", "purchases"), item("supplier-orders", "Commandes fournisseurs", "purchases"), item("receipts", "Receptions", "purchases")] },
      { key: "finance", label: "FINANCE", items: [item("finance", "Finance", "finance", "finance.read"), item("cash-register", "Caisse", "finance"), item("expenses", "Depenses", "finance"), item("food-cost", "Food Cost", "finance"), item("margins", "Marges", "finance"), item("excel-exports", "Exports Excel", "finance")] },
      { key: "hr", label: "RH", items: [item("staff", "Personnel", "hr", "hr.read"), item("waiters", "Serveurs", "hr"), item("kitchen-team", "Cuisine", "hr"), item("attendance", "Presences", "hr"), item("schedule", "Planning", "hr"), item("advanced-hr", "RH avancee", "hr")] },
      { key: "marketing", label: "MARKETING", items: [item("promotions", "Promotions", "marketing"), item("loyalty", "Fidelite", "marketing"), item("social", "Social", "marketing")] },
      { key: "ai", label: "IA", items: [item("ai-restaurant-assistant", "Assistant Restaurant IA", "ai", "ai.use"), item("sales-forecast", "Prevision ventes", "ai"), item("stock-forecast", "Prevision stock", "ai"), item("waste-analysis", "Analyse gaspillage", "ai"), item("ai-studio", "IA Studio", "ai")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration"), item("restaurants", "Restaurants / etablissements", "administration"), ...adminSection.items.slice(1)] },
    ],
  },
  construction: {
    key: "construction",
    label: "Construction / BTP",
    dashboardLabel: "Dashboard Construction",
    modules: ["dashboard", "crm", "commercial", "worksites", "materials", "equipment", "purchases", "finance", "hr", "projects", "ai", "administration"],
    kpis: ["active-projects", "budget", "costs", "margins", "delays"],
    workflows: ["quote-to-contract", "project-budget-control", "material-requisition"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("construction-dashboard", "Dashboard Construction", "dashboard")] },
      { key: "crm", label: "CRM", items: [item("prospects", "Prospects", "crm"), item("clients", "Clients", "crm"), item("architects", "Architectes", "crm"), item("partners", "Partenaires", "crm"), item("subcontractors", "Sous-traitants", "crm")] },
      { key: "commercial", label: "COMMERCIAL", items: [item("opportunities", "Opportunites", "commercial"), item("quotes", "Devis", "commercial"), item("tenders", "Appels d'offres", "commercial"), item("contracts", "Contrats", "commercial"), item("invoices", "Factures", "commercial"), item("progress-billing", "Situations de travaux", "commercial"), item("payments", "Paiements", "commercial"), item("ai-construction-sales-agent", "AI Construction Sales Agent", "commercial", "ai.use")] },
      { key: "worksites", label: "CHANTIERS", items: [item("worksites", "Chantiers", "worksites"), item("schedule", "Planning", "worksites"), item("tasks", "Taches", "worksites"), item("progress", "Avancement", "worksites"), item("incidents", "Incidents", "worksites"), item("photos", "Photos", "worksites"), item("documents", "Documents", "worksites")] },
      { key: "materials", label: "MATERIAUX", items: [item("materials", "Materiaux", "materials"), item("site-stock", "Stock chantier", "materials"), item("material-requests", "Demandes de materiaux", "materials"), item("transfers", "Transferts", "materials"), item("inventory-counts", "Inventaires", "materials")] },
      { key: "equipment", label: "MATERIEL", items: [item("machines", "Machines", "equipment"), item("vehicles", "Vehicules", "equipment"), item("tools", "Outils", "equipment"), item("assignments", "Affectations", "equipment"), item("maintenance", "Maintenance", "equipment")] },
      { key: "purchases", label: "ACHATS", items: [item("suppliers", "Fournisseurs", "purchases"), item("purchase-requests", "Demandes d'achat", "purchases"), item("supplier-orders", "Commandes fournisseurs", "purchases"), item("receipts", "Receptions", "purchases")] },
      { key: "finance", label: "FINANCE", items: [item("project-budgets", "Budgets chantier", "finance"), item("actual-costs", "Couts reels", "finance"), item("expenses", "Depenses", "finance"), item("margins", "Marges", "finance"), item("cashflow", "Tresorerie", "finance"), item("excel-exports", "Exports Excel", "finance")] },
      { key: "hr", label: "RH", items: [item("employees", "Employes", "hr"), item("site-teams", "Equipes chantier", "hr"), item("attendance", "Presences", "hr"), item("hours", "Heures", "hr"), item("assignments", "Affectations", "hr"), item("advanced-hr", "RH avancee", "hr")] },
      { key: "projects", label: "PROJETS", items: [item("projects", "Projets", "projects"), item("gantt", "Gantt", "projects"), item("milestones", "Jalons", "projects"), item("documents", "Documents", "projects")] },
      { key: "ai", label: "IA", items: [item("ai-site-assistant", "Assistant Chantier IA", "ai"), item("budget-overrun-detection", "Detection depassement budget", "ai"), item("delay-forecast", "Prevision retard", "ai"), item("ai-studio", "IA Studio", "ai")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration"), item("companies-agencies", "Societes / agences", "administration"), ...adminSection.items.slice(1)] },
    ],
  },
  transport: {
    key: "transport",
    label: "Transport & Logistique",
    dashboardLabel: "Dashboard Transport",
    modules: ["dashboard", "crm", "commercial", "shipments", "fleet", "routes", "fuel", "maintenance", "finance", "hr", "ai", "administration"],
    kpis: ["shipments", "fleet-utilization", "fuel-cost", "delays", "maintenance"],
    workflows: ["shipment-to-delivery", "fuel-control", "maintenance-plan"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("transport-dashboard", "Dashboard Transport", "dashboard")] },
      { key: "crm", label: "CRM", items: [item("clients", "Clients", "crm"), item("prospects", "Prospects", "crm"), item("contracts", "Contrats", "crm"), item("suppliers", "Fournisseurs", "crm")] },
      { key: "commercial", label: "COMMERCIAL", items: [item("transport-quotes", "Devis transport", "commercial"), item("orders", "Commandes", "commercial"), item("missions", "Missions", "commercial"), item("invoices", "Factures", "commercial"), item("payments", "Paiements", "commercial"), item("ai-logistics-sales-agent", "AI Logistics Sales Agent", "commercial")] },
      { key: "shipments", label: "EXPEDITIONS", items: [item("shipments", "Expeditions", "shipments"), item("deliveries", "Livraisons", "shipments"), item("tracking", "Suivi", "shipments"), item("proof-of-delivery", "Preuves de livraison", "shipments"), item("incidents", "Incidents", "shipments")] },
      { key: "fleet", label: "FLOTTE", items: [item("vehicles", "Vehicules", "fleet"), item("drivers", "Conducteurs", "fleet"), item("assignments", "Affectations", "fleet"), item("mileage", "Kilometrage", "fleet"), item("documents", "Documents", "fleet")] },
      { key: "routes", label: "ROUTES", items: [item("routes", "Itineraires", "routes"), item("departures", "Departs", "routes"), item("destinations", "Destinations", "routes"), item("planning", "Planification", "routes")] },
      { key: "fuel", label: "CARBURANT", items: [item("fuel-ups", "Pleins", "fuel"), item("consumption", "Consommation", "fuel"), item("fuel-cost", "Cout carburant", "fuel"), item("anomalies", "Anomalies", "fuel")] },
      { key: "maintenance", label: "MAINTENANCE", items: [item("service", "Entretien", "maintenance"), item("repairs", "Reparations", "maintenance"), item("parts", "Pieces", "maintenance"), item("downtime", "Immobilisation", "maintenance")] },
      { key: "finance", label: "FINANCE", items: [item("revenue", "Revenus", "finance"), item("mission-costs", "Couts par mission", "finance"), item("expenses", "Depenses", "finance"), item("profitability", "Rentabilite", "finance"), item("excel-exports", "Exports Excel", "finance")] },
      { key: "hr", label: "RH", items: [item("drivers", "Chauffeurs", "hr"), item("staff", "Personnel", "hr"), item("attendance", "Presences", "hr"), item("hours", "Heures", "hr"), item("advanced-hr", "RH avancee", "hr")] },
      { key: "ai", label: "IA", items: [item("ai-logistics-assistant", "Assistant Logistique IA", "ai"), item("fuel-analysis", "Analyse carburant", "ai"), item("maintenance-prediction", "Prediction maintenance", "ai"), item("mission-optimization", "Optimisation missions", "ai"), item("ai-studio", "IA Studio", "ai")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration"), item("depots-agencies", "Depots / agences", "administration"), ...adminSection.items.slice(1)] },
    ],
  },
  hospitality: {
    key: "hospitality",
    label: "Hotellerie",
    dashboardLabel: "Dashboard Hotel",
    modules: ["dashboard", "clients", "reservations", "rooms", "housekeeping", "services", "billing", "stock", "finance", "hr", "ecommerce", "social", "ai", "administration"],
    kpis: ["occupancy", "revpar", "reservations", "housekeeping", "revenue"],
    workflows: ["booking-to-checkout", "room-cleaning", "guest-billing"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("hotel-dashboard", "Dashboard Hotel", "dashboard")] },
      { key: "clients", label: "CLIENTS", items: [item("clients", "Clients", "clients"), item("crm", "CRM", "clients"), item("loyalty", "Fidelite", "clients"), item("groups", "Groupes", "clients")] },
      { key: "reservations", label: "RESERVATIONS", items: [item("reservations", "Reservations", "reservations"), item("calendar", "Calendrier", "reservations"), item("check-in", "Check-in", "reservations"), item("check-out", "Check-out", "reservations"), item("no-show", "No-show", "reservations")] },
      { key: "rooms", label: "CHAMBRES", items: [item("rooms", "Chambres", "rooms"), item("room-types", "Types de chambres", "rooms"), item("availability", "Disponibilites", "rooms"), item("rates", "Tarifs", "rooms"), item("maintenance", "Maintenance", "rooms")] },
      { key: "housekeeping", label: "HOUSEKEEPING", items: [item("rooms-to-clean", "Chambres a nettoyer", "housekeeping"), item("assignments", "Affectations", "housekeeping"), item("inspections", "Inspections", "housekeeping"), item("incidents", "Incidents", "housekeeping")] },
      { key: "services", label: "SERVICES", items: [item("restaurant", "Restaurant", "services"), item("room-service", "Room Service", "services"), item("minibar", "Minibar", "services"), item("spa", "Spa", "services"), item("laundry", "Blanchisserie", "services"), item("shuttle", "Navette", "services")] },
      { key: "billing", label: "FACTURATION", items: [item("invoices", "Factures", "billing"), item("payments", "Paiements", "billing"), item("deposits", "Acomptes", "billing"), item("refunds", "Remboursements", "billing"), item("ai-revenue-agent", "AI Revenue Agent", "billing")] },
      { key: "stock", label: "STOCK", items: [item("consumables", "Consommables", "stock"), item("minibar", "Minibar", "stock"), item("restaurant-stock", "Restaurant", "stock"), item("cleaning-products", "Produits entretien", "stock"), item("inventory-counts", "Inventaires", "stock")] },
      { key: "finance", label: "FINANCE", items: [item("revenue", "Revenus", "finance"), item("expenses", "Depenses", "finance"), item("occupancy", "Occupation", "finance"), item("revpar", "RevPAR", "finance"), item("adr", "ADR", "finance"), item("excel-exports", "Exports Excel", "finance")] },
      { key: "hr", label: "RH", items: [item("staff", "Personnel", "hr"), item("attendance", "Presences", "hr"), item("schedule", "Planning", "hr"), item("advanced-hr", "RH avancee", "hr")] },
      { key: "ecommerce", label: "E-COMMERCE", items: [item("online-booking", "Reservation en ligne", "ecommerce"), item("offers", "Offres", "ecommerce")] },
      { key: "social", label: "SOCIAL", items: [item("campaigns", "Campagnes", "social"), item("reputation", "Reputation", "social")] },
      { key: "ai", label: "IA", items: [item("ai-hotel-assistant", "Assistant Hotel IA", "ai"), item("occupancy-forecast", "Prevision occupation", "ai"), item("revenue-management", "Revenue Management", "ai"), item("ai-studio", "IA Studio", "ai")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration"), item("multi-hotels", "Multi-hotels", "administration"), ...adminSection.items.slice(1)] },
    ],
  },
  manufacturing: {
    key: "manufacturing",
    label: "Manufacturing / Industrie",
    dashboardLabel: "Dashboard Production",
    modules: ["dashboard", "crm", "sales", "production", "bom", "stock", "purchases", "machines", "quality", "maintenance", "finance", "hr", "ai", "administration"],
    kpis: ["production", "machine-uptime", "raw-stock", "orders", "quality"],
    workflows: ["work-order-to-production", "quality-control", "purchase-to-production"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("production-dashboard", "Dashboard Production", "dashboard")] },
      { key: "crm", label: "CRM", items: [item("clients", "Clients", "crm"), item("prospects", "Prospects", "crm"), item("suppliers", "Fournisseurs", "crm"), item("contracts", "Contrats", "crm")] },
      { key: "sales", label: "VENTES", items: [item("quotes", "Devis", "sales"), item("customer-orders", "Commandes clients", "sales"), item("invoices", "Factures", "sales"), item("payments", "Paiements", "sales"), item("ai-manufacturing-sales-agent", "AI Manufacturing Sales Agent", "sales")] },
      { key: "production", label: "PRODUCTION", items: [item("work-orders", "Ordres de fabrication", "production"), item("production-planning", "Planning production", "production"), item("workstations", "Postes de travail", "production"), item("operations", "Operations", "production"), item("produced-quantities", "Quantites produites", "production"), item("scrap", "Rebuts", "production")] },
      { key: "bom", label: "NOMENCLATURE", items: [item("bom", "BOM", "bom"), item("manufacturing-recipes", "Recettes de fabrication", "bom"), item("routings", "Gammes", "bom")] },
      { key: "stock", label: "STOCK", items: [item("raw-materials", "Matieres premieres", "stock"), item("wip", "Encours", "stock"), item("finished-goods", "Produits finis", "stock"), item("warehouses", "Entrepots", "stock"), item("inventory-counts", "Inventaires", "stock")] },
      { key: "purchases", label: "ACHATS", items: [item("suppliers", "Fournisseurs", "purchases"), item("purchase-requests", "Demandes d'achat", "purchases"), item("orders", "Commandes", "purchases"), item("receipts", "Receptions", "purchases")] },
      { key: "machines", label: "MACHINES", items: [item("machines", "Machines", "machines"), item("capacity", "Capacite", "machines"), item("availability", "Disponibilite", "machines"), item("usage", "Utilisation", "machines")] },
      { key: "quality", label: "QUALITE", items: [item("controls", "Controles", "quality"), item("nonconformities", "Non-conformites", "quality"), item("corrective-actions", "Actions correctives", "quality"), item("lots", "Lots", "quality")] },
      { key: "maintenance", label: "MAINTENANCE", items: [item("preventive", "Preventive", "maintenance"), item("corrective", "Corrective", "maintenance"), item("interventions", "Interventions", "maintenance"), item("parts", "Pieces", "maintenance")] },
      { key: "finance", label: "FINANCE", items: [item("production-costs", "Couts de production", "finance"), item("margins", "Marges", "finance"), item("expenses", "Depenses", "finance"), item("variances", "Variances", "finance"), item("excel-exports", "Exports Excel", "finance")] },
      { key: "hr", label: "RH", items: [item("employees", "Employes", "hr"), item("operators", "Operateurs", "hr"), item("attendance", "Presences", "hr"), item("skills", "Competences", "hr"), item("advanced-hr", "RH avancee", "hr")] },
      { key: "ai", label: "IA", items: [item("ai-production-assistant", "Assistant Production IA", "ai"), item("demand-forecast", "Prevision demande", "ai"), item("shortage-forecast", "Prevision rupture", "ai"), item("predictive-maintenance", "Maintenance predictive", "ai"), item("ai-studio", "IA Studio", "ai")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration"), item("factories-sites", "Usines / sites", "administration"), ...adminSection.items.slice(1)] },
    ],
  },
  education: {
    key: "education",
    label: "Education",
    dashboardLabel: "Dashboard Education",
    modules: ["dashboard", "admissions", "academic", "schedule", "attendance", "exams", "finance", "hr", "documents", "elearning", "ai", "administration"],
    kpis: ["students", "fees", "attendance", "classes", "results"],
    workflows: ["student-enrollment", "fee-to-invoice", "exam-results"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("education-dashboard", "Dashboard Education", "dashboard")] },
      { key: "admissions", label: "INSCRIPTIONS", items: [item("prospects", "Prospects", "admissions"), item("applications", "Candidatures", "admissions"), item("students", "Etudiants", "admissions"), item("admissions", "Admissions", "admissions")] },
      { key: "academic", label: "ACADEMIQUE", items: [item("classes", "Classes", "academic"), item("programs", "Programmes", "academic"), item("courses", "Cours", "academic"), item("subjects", "Matieres", "academic"), item("rooms", "Salles", "academic")] },
      { key: "schedule", label: "PLANNING", items: [item("timetable", "Emploi du temps", "schedule"), item("teachers", "Enseignants", "schedule"), item("rooms", "Salles", "schedule")] },
      { key: "attendance", label: "PRESENCES", items: [item("student-attendance", "Etudiants", "attendance"), item("teacher-attendance", "Enseignants", "attendance"), item("absences", "Absences", "attendance"), item("late-arrivals", "Retards", "attendance")] },
      { key: "exams", label: "EXAMENS", items: [item("exams", "Examens", "exams"), item("grades", "Notes", "exams"), item("report-cards", "Bulletins", "exams"), item("results", "Resultats", "exams")] },
      { key: "finance", label: "FINANCE", items: [item("school-fees", "Frais scolaires", "finance"), item("invoices", "Factures", "finance"), item("payments", "Paiements", "finance"), item("unpaid", "Impayes", "finance"), item("expenses", "Depenses", "finance"), item("excel-exports", "Exports Excel", "finance")] },
      { key: "hr", label: "RH", items: [item("teachers", "Enseignants", "hr"), item("staff", "Personnel", "hr"), item("attendance", "Presences", "hr"), item("contracts", "Contrats", "hr"), item("advanced-hr", "RH avancee", "hr")] },
      { key: "documents", label: "DOCUMENTS", items: [item("certificates", "Certificats", "documents"), item("attestations", "Attestations", "documents"), item("student-files", "Dossiers etudiants", "documents")] },
      { key: "elearning", label: "E-LEARNING", items: [item("online-courses", "Cours en ligne", "elearning"), item("resources", "Ressources", "elearning")] },
      { key: "ai", label: "IA", items: [item("ai-education-assistant", "Assistant Education IA", "ai"), item("results-analysis", "Analyse resultats", "ai"), item("absence-analysis", "Analyse absences", "ai"), item("ai-studio", "IA Studio", "ai")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration"), item("campuses", "Etablissements / campus", "administration"), ...adminSection.items.slice(1)] },
    ],
  },
  healthcare: {
    key: "healthcare",
    label: "Healthcare / Sante",
    dashboardLabel: "Dashboard Sante",
    modules: ["dashboard", "patients", "appointments", "doctors", "consultations", "medical-records", "laboratory", "pharmacy", "billing", "finance", "hr", "ai", "administration"],
    kpis: ["patients", "appointments", "consultations", "billing", "pharmacy-stock"],
    workflows: ["appointment-to-consultation", "consultation-to-billing", "lab-request"],
    navigation: [
      { key: "dashboard", label: "TABLEAU DE BORD", items: [item("healthcare-dashboard", "Dashboard Sante", "dashboard")] },
      { key: "patients", label: "PATIENTS", items: [item("patients", "Patients", "patients"), item("records", "Dossiers", "patients"), item("contacts", "Contacts", "patients"), item("history", "Historique", "patients")] },
      { key: "appointments", label: "RENDEZ-VOUS", items: [item("agenda", "Agenda", "appointments"), item("appointments", "Rendez-vous", "appointments"), item("queues", "Files d'attente", "appointments"), item("reminders", "Rappels", "appointments")] },
      { key: "doctors", label: "MEDECINS", items: [item("doctors", "Medecins", "doctors"), item("specialties", "Specialites", "doctors"), item("availability", "Disponibilites", "doctors"), item("schedule", "Planning", "doctors")] },
      { key: "consultations", label: "CONSULTATIONS", items: [item("consultations", "Consultations", "consultations"), item("observations", "Observations", "consultations"), item("diagnostics", "Diagnostics", "consultations"), item("prescriptions", "Prescriptions", "consultations"), item("follow-up", "Suivi", "consultations")] },
      { key: "medical-records", label: "DOSSIERS MEDICAUX", items: [item("history", "Historique", "medical-records"), item("allergies", "Allergies", "medical-records"), item("exams", "Examens", "medical-records"), item("documents", "Documents", "medical-records"), item("prescriptions", "Prescriptions", "medical-records")] },
      { key: "laboratory", label: "LABORATOIRE", items: [item("requests", "Demandes", "laboratory"), item("analyses", "Analyses", "laboratory"), item("results", "Resultats", "laboratory"), item("validation", "Validation", "laboratory")] },
      { key: "pharmacy", label: "PHARMACIE", items: [item("medicines", "Medicaments", "pharmacy"), item("lots", "Lots", "pharmacy"), item("stock", "Stock", "pharmacy"), item("expirations", "Peremptions", "pharmacy"), item("dispensing", "Delivrances", "pharmacy")] },
      { key: "billing", label: "FACTURATION", items: [item("services", "Prestations", "billing"), item("invoices", "Factures", "billing"), item("payments", "Paiements", "billing"), item("insurance", "Assurances", "billing"), item("patient-balance", "Reste a charge", "billing")] },
      { key: "finance", label: "FINANCE", items: [item("revenue", "Revenus", "finance"), item("expenses", "Depenses", "finance"), item("cashflow", "Tresorerie", "finance"), item("excel-exports", "Exports Excel", "finance")] },
      { key: "hr", label: "RH", items: [item("staff", "Personnel", "hr"), item("attendance", "Presences", "hr"), item("schedule", "Planning", "hr"), item("advanced-hr", "RH avancee", "hr")] },
      { key: "ai", label: "IA", items: [item("ai-admin-assistant", "Assistant Administratif IA", "ai"), item("operational-analysis", "Analyse operationnelle", "ai"), item("ai-studio", "IA Studio", "ai")] },
      { ...adminSection, items: [item("admin-center", "Centre admin", "administration"), item("establishments", "Etablissements", "administration"), item("users", "Utilisateurs", "administration", "users.read"), item("roles-permissions", "Roles & Permissions", "administration", "roles.manage"), item("security-center", "Security Center", "administration"), item("full-audit", "Audit complet", "administration", "audit.read"), item("backup-center", "Sauvegarde", "administration"), item("settings", "Parametres", "administration")] },
    ],
  },
};

export function getSectorDefinition(sector?: string) {
  return sectorDefinitions[(sector as SectorKey) || "general"] ?? sectorDefinitions.general;
}

export function getSectorNavigation(sector?: string) {
  return getSectorDefinition(sector).navigation;
}
