export type SectorKey =
  | "general"
  | "retail"
  | "restaurant"
  | "health"
  | "education"
  | "transport"
  | "industry"
  | "hotel"
  | "agriculture"
  | "services"
  | "construction";

export type ModuleKey =
  | "crm"
  | "sales"
  | "stock"
  | "invoicing"
  | "accounting"
  | "hr"
  | "appointments"
  | "production"
  | "projects"
  | "ai"
  | "users"
  | "reports"
  | "settings";

export type SectorDefinition = {
  key: SectorKey;
  labelKey: `sector.${SectorKey}`;
  icon: string;
  accent: string;
  modules: ModuleKey[];
  kpis: { key: string; label: string; value: string; trend: string }[];
  priorityActions: string[];
  recentActivity: string[];
};
