import { apiClient } from "@shared/api/client";

export type PlatformFoundation = {
  product: string;
  positioning: string;
  principles: string[];
  architecture: string[];
  tenantIsolation: {
    strategy: string;
    status: string;
  };
};

export type RoleMatrixItem = {
  role: string;
  permissions: string[];
};

export type WorkflowItem = {
  key: string;
  label: string;
  steps: string[];
};

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

const fallbackFoundation: PlatformFoundation = {
  product: "EnterpriseERP Cloud",
  positioning: "Cloud ERP SaaS for SMEs",
  principles: ["cloud-native", "mobile-first", "ai-ready", "multi-tenant", "secure", "modular"],
  architecture: ["landing-website", "nextjs-frontend", "nestjs-api", "postgresql", "redis", "object-storage"],
  tenantIsolation: {
    strategy: "companyId on all business tables",
    status: "progressive-rollout",
  },
};

const fallbackRoles: RoleMatrixItem[] = [
  { role: "OWNER", permissions: ["company.read", "company.update", "users.read", "users.invite", "roles.manage"] },
  { role: "MANAGER", permissions: ["crm.read", "sales.read", "stock.read", "reports.read", "projects.manage"] },
  { role: "ACCOUNTING", permissions: ["invoice.read", "invoice.create", "invoice.validate", "finance.export"] },
  { role: "VIEWER", permissions: ["company.read", "crm.read", "invoice.read", "stock.read", "reports.read"] },
];

const fallbackWorkflows: WorkflowItem[] = [
  { key: "crm-to-cash", label: "CRM to cash", steps: ["Prospect", "Lead", "Opportunity", "Quotation", "Order", "Invoice", "Payment"] },
  { key: "purchase-to-pay", label: "Purchase to pay", steps: ["Purchase request", "Purchase order", "Reception", "Supplier invoice", "Payment"] },
  { key: "stock-control", label: "Stock control", steps: ["Product", "Stock entry", "Adjustment", "Low stock alert", "Replenishment"] },
];

async function getOrFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    const { data } = await apiClient.get<T>(path);
    return data;
  } catch {
    return fallback;
  }
}

export const governanceService = {
  getFoundation() {
    return getOrFallback("/platform/foundation", fallbackFoundation);
  },

  getRoles() {
    return getOrFallback("/platform/roles", fallbackRoles);
  },

  getWorkflows() {
    return getOrFallback("/platform/workflows", fallbackWorkflows);
  },

  getUsers() {
    return getOrFallback<UserItem[]>("/users", []);
  },
};
