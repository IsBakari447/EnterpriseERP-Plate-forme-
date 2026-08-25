import type { ModuleKey, SectorDefinition, SectorKey } from "@/types/sector";

const common: ModuleKey[] = ["crm", "invoicing", "accounting", "reports", "ai", "settings"];

function defineSector(input: SectorDefinition): SectorDefinition {
  return input;
}

export const sectors: Record<SectorKey, SectorDefinition> = {
  general: defineSector({
    key: "general",
    labelKey: "sector.general",
    icon: "business-outline",
    accent: "#0F766E",
    modules: [...common, "sales", "stock", "hr", "users"],
    kpis: [
      { key: "revenue", label: "Revenue", value: "82 400 EUR", trend: "+11%" },
      { key: "customers", label: "Customers", value: "1 208", trend: "+12%" },
      { key: "tasks", label: "Priority tasks", value: "18", trend: "Today" },
    ],
    priorityActions: ["Late invoices", "Quotes to follow up", "Users pending validation"],
    recentActivity: ["Customer created", "Invoice paid", "Report generated"],
  }),
  retail: defineSector({
    key: "retail",
    labelKey: "sector.retail",
    icon: "storefront-outline",
    accent: "#2563EB",
    modules: [...common, "sales", "stock", "hr", "users"],
    kpis: [
      { key: "revenue", label: "Sales", value: "128 450 EUR", trend: "+18%" },
      { key: "orders", label: "Transactions", value: "342", trend: "+9%" },
      { key: "stock", label: "Critical stock", value: "12", trend: "Action" },
    ],
    priorityActions: ["Restock best sellers", "Check open returns", "Reconcile cash drawers"],
    recentActivity: ["POS sale completed", "Product updated", "Supplier delivery logged"],
  }),
  restaurant: defineSector({
    key: "restaurant",
    labelKey: "sector.restaurant",
    icon: "restaurant-outline",
    accent: "#EA580C",
    modules: [...common, "sales", "stock", "appointments", "hr"],
    kpis: [
      { key: "revenue", label: "Daily sales", value: "4 280 EUR", trend: "+12%" },
      { key: "orders", label: "Orders", value: "186", trend: "+8%" },
      { key: "stock", label: "Kitchen stock", value: "7", trend: "Urgent" },
    ],
    priorityActions: ["Confirm reservations", "Prepare kitchen restock", "Review food cost"],
    recentActivity: ["Table closed", "Reservation confirmed", "Kitchen alert resolved"],
  }),
  health: defineSector({
    key: "health",
    labelKey: "sector.health",
    icon: "medkit-outline",
    accent: "#0891B2",
    modules: [...common, "appointments", "stock", "hr"],
    kpis: [
      { key: "patients", label: "Patients", value: "34", trend: "+4" },
      { key: "appointments", label: "Appointments", value: "42", trend: "8 left" },
      { key: "billing", label: "To bill", value: "6 840 EUR", trend: "+5%" },
    ],
    priorityActions: ["Confirm appointments", "Complete patient files", "Send mutual invoices"],
    recentActivity: ["Consultation added", "Payment recorded", "Prescription prepared"],
  }),
  education: defineSector({
    key: "education",
    labelKey: "sector.education",
    icon: "school-outline",
    accent: "#7C3AED",
    modules: [...common, "hr", "appointments", "users"],
    kpis: [
      { key: "students", label: "Students", value: "1 280", trend: "+6%" },
      { key: "fees", label: "Unpaid fees", value: "27", trend: "Follow-up" },
      { key: "attendance", label: "Absences", value: "37", trend: "Watch" },
    ],
    priorityActions: ["Follow up unpaid fees", "Review unusual absences", "Publish schedules"],
    recentActivity: ["Student registered", "Teacher assigned", "Exam planned"],
  }),
  transport: defineSector({
    key: "transport",
    labelKey: "sector.transport",
    icon: "bus-outline",
    accent: "#0284C7",
    modules: [...common, "sales", "stock", "hr"],
    kpis: [
      { key: "shipments", label: "Shipments", value: "148", trend: "+10%" },
      { key: "fleet", label: "Active vehicles", value: "36", trend: "Live" },
      { key: "maintenance", label: "Maintenance", value: "5", trend: "Plan" },
    ],
    priorityActions: ["Assign delayed shipments", "Plan vehicle maintenance", "Validate delivery proofs"],
    recentActivity: ["Route completed", "Fuel entry added", "Driver checked in"],
  }),
  industry: defineSector({
    key: "industry",
    labelKey: "sector.industry",
    icon: "construct-outline",
    accent: "#9333EA",
    modules: [...common, "production", "stock", "sales", "hr"],
    kpis: [
      { key: "production", label: "Production", value: "94%", trend: "+7%" },
      { key: "machines", label: "Machines", value: "18", trend: "Online" },
      { key: "raw", label: "Raw materials", value: "9", trend: "Low" },
    ],
    priorityActions: ["Review production orders", "Check raw materials", "Schedule machine maintenance"],
    recentActivity: ["Production order closed", "Machine inspected", "Stock adjusted"],
  }),
  hotel: defineSector({
    key: "hotel",
    labelKey: "sector.hotel",
    icon: "bed-outline",
    accent: "#DB2777",
    modules: [...common, "appointments", "sales", "stock", "hr"],
    kpis: [
      { key: "occupancy", label: "Occupancy", value: "78%", trend: "+9%" },
      { key: "rooms", label: "Rooms", value: "42", trend: "Booked" },
      { key: "payments", label: "Payments", value: "18 200 EUR", trend: "+6%" },
    ],
    priorityActions: ["Confirm arrivals", "Assign housekeeping", "Close pending invoices"],
    recentActivity: ["Guest checked in", "Room cleaned", "Booking paid"],
  }),
  agriculture: defineSector({
    key: "agriculture",
    labelKey: "sector.agriculture",
    icon: "leaf-outline",
    accent: "#16A34A",
    modules: [...common, "stock", "production", "sales"],
    kpis: [
      { key: "production", label: "Production", value: "8 420 kg", trend: "+14%" },
      { key: "stock", label: "Available stock", value: "12 600 kg", trend: "Stable" },
      { key: "sales", label: "Sales", value: "38 250 EUR", trend: "+7%" },
    ],
    priorityActions: ["Plan harvest dispatch", "Check feed stock", "Prepare customer delivery"],
    recentActivity: ["Batch recorded", "Sale confirmed", "Stock counted"],
  }),
  services: defineSector({
    key: "services",
    labelKey: "sector.services",
    icon: "briefcase-outline",
    accent: "#7C3AED",
    modules: [...common, "projects", "appointments", "hr", "users"],
    kpis: [
      { key: "revenue", label: "Monthly revenue", value: "82 400 EUR", trend: "+11%" },
      { key: "projects", label: "Active projects", value: "18", trend: "3 new" },
      { key: "hours", label: "Billable hours", value: "1 248 h", trend: "+6%" },
    ],
    priorityActions: ["Follow up proposals", "Review project deadlines", "Prepare client emails"],
    recentActivity: ["Task completed", "Invoice sent", "Project updated"],
  }),
  construction: defineSector({
    key: "construction",
    labelKey: "sector.construction",
    icon: "hammer-outline",
    accent: "#CA8A04",
    modules: [...common, "projects", "stock", "hr"],
    kpis: [
      { key: "projects", label: "Active projects", value: "9", trend: "2 priority" },
      { key: "budget", label: "Committed budget", value: "1.24 M EUR", trend: "64%" },
      { key: "stock", label: "Critical materials", value: "5", trend: "Order" },
    ],
    priorityActions: ["Validate site reports", "Order critical materials", "Review budget variance"],
    recentActivity: ["Site photo added", "Budget updated", "Contract signed"],
  }),
};

export const sectorList = Object.values(sectors);
