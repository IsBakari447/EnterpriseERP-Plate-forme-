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

export type SectorDefinition = {
  key: SectorKey;
  label: string;
  modules: string[];
  kpis: string[];
  workflows: string[];
};

export const sectorDefinitions: Record<SectorKey, SectorDefinition> = {
  general: {
    key: "general",
    label: "Entreprise generale",
    modules: ["dashboard", "crm", "sales", "products", "inventory", "invoices", "payments", "finance", "hr", "reports", "ai", "settings"],
    kpis: ["revenue", "customers", "invoices", "cashflow"],
    workflows: ["crm-to-cash", "invoice-to-payment"],
  },
  retail: {
    key: "retail",
    label: "Retail Suite",
    modules: ["dashboard", "pos", "barcode", "promotions", "loyalty", "returns", "cash-register", "products", "inventory", "invoices", "payments", "reports", "ai"],
    kpis: ["sales", "transactions", "average-basket", "returns", "stock"],
    workflows: ["pos-sale", "stock-replenishment", "return-to-refund"],
  },
  restaurant: {
    key: "restaurant",
    label: "Restaurant Suite",
    modules: ["dashboard", "orders", "reservations", "menus", "kitchen", "recipes", "inventory", "purchases", "invoices", "payments", "staff", "reports", "ai"],
    kpis: ["daily-sales", "orders", "reservations", "food-cost", "low-stock"],
    workflows: ["reservation-to-table", "order-to-kitchen", "purchase-to-stock"],
  },
  construction: {
    key: "construction",
    label: "Construction Suite",
    modules: ["dashboard", "clients", "projects", "quotes", "contracts", "equipment", "materials", "suppliers", "purchases", "budgets", "billing", "employees", "reports", "ai"],
    kpis: ["active-projects", "budget", "costs", "margins", "delays"],
    workflows: ["quote-to-contract", "project-budget-control", "material-requisition"],
  },
  transport: {
    key: "transport",
    label: "Transport Suite",
    modules: ["dashboard", "clients", "fleet", "drivers", "shipments", "routes", "fuel", "maintenance", "billing", "payments", "finance", "reports", "ai"],
    kpis: ["shipments", "fleet-utilization", "fuel-cost", "delays", "maintenance"],
    workflows: ["shipment-to-delivery", "fuel-control", "maintenance-plan"],
  },
  hospitality: {
    key: "hospitality",
    label: "Hospitality Suite",
    modules: ["dashboard", "reservations", "rooms", "clients", "housekeeping", "restaurant", "billing", "payments", "staff", "finance", "reports", "ai"],
    kpis: ["occupancy", "revpar", "reservations", "housekeeping", "revenue"],
    workflows: ["booking-to-checkout", "room-cleaning", "guest-billing"],
  },
  manufacturing: {
    key: "manufacturing",
    label: "Manufacturing Suite",
    modules: ["dashboard", "clients", "production", "raw-materials", "machines", "purchases", "inventory", "suppliers", "work-orders", "billing", "finance", "employees", "reports", "ai"],
    kpis: ["production", "machine-uptime", "raw-stock", "orders", "quality"],
    workflows: ["work-order-to-production", "quality-control", "purchase-to-production"],
  },
  education: {
    key: "education",
    label: "Education Suite",
    modules: ["dashboard", "students", "teachers", "classes", "schedule", "exams", "courses", "fees", "invoices", "staff", "reports", "ai"],
    kpis: ["students", "fees", "attendance", "classes", "results"],
    workflows: ["student-enrollment", "fee-to-invoice", "exam-results"],
  },
  healthcare: {
    key: "healthcare",
    label: "Healthcare Suite",
    modules: ["dashboard", "patients", "doctors", "appointments", "consultations", "pharmacy", "laboratory", "medical-records", "billing", "payments", "finance", "staff", "reports", "ai"],
    kpis: ["patients", "appointments", "consultations", "billing", "pharmacy-stock"],
    workflows: ["appointment-to-consultation", "consultation-to-billing", "lab-request"],
  },
};

export function getSectorDefinition(sector?: string) {
  return sectorDefinitions[(sector as SectorKey) || "general"] ?? sectorDefinitions.general;
}
