import { Injectable } from "@nestjs/common";
import { getSectorDefinition, getSectorNavigation, sectorDefinitions } from "../../common/platform/sector-engine";
import { enterprisePermissions, enterpriseRoles, rolePermissions } from "../../common/security/permissions";

@Injectable()
export class PlatformService {
  getSaasFoundation() {
    return {
      product: "EnterpriseERP Cloud",
      positioning: "Cloud ERP SaaS for SMEs",
      principles: ["cloud-native", "mobile-first", "ai-ready", "multi-tenant", "secure", "modular"],
      architecture: ["landing-website", "nextjs-frontend", "nestjs-api", "postgresql", "redis", "object-storage"],
      tenantIsolation: {
        strategy: "companyId on all business tables",
        status: "progressive-rollout",
      },
    };
  }

  getModules() {
    return [
      { key: "crm", label: "CRM", status: "active", permissions: ["crm.read", "crm.create", "crm.update", "crm.delete"] },
      { key: "sales", label: "Sales", status: "planned", permissions: ["sales.read", "sales.create"] },
      { key: "inventory", label: "Inventory", status: "active", permissions: ["stock.read", "stock.adjust", "stock.transfer"] },
      { key: "billing", label: "Invoices", status: "active", permissions: ["invoice.read", "invoice.create", "invoice.validate", "invoice.cancel"] },
      { key: "finance", label: "Finance", status: "planned", permissions: ["finance.read", "finance.export"] },
      { key: "hr", label: "Human Resources", status: "planned", permissions: ["hr.read", "hr.manage"] },
      { key: "projects", label: "Projects", status: "planned", permissions: ["projects.read", "projects.manage"] },
      { key: "ai", label: "AI Assistant", status: "planned", permissions: ["ai.use"] },
      { key: "reports", label: "Reports", status: "planned", permissions: ["reports.read"] },
      { key: "settings", label: "Settings", status: "active", permissions: ["settings.manage"] },
    ];
  }

  getSectors() {
    return Object.values(sectorDefinitions);
  }

  getSector(sector: string) {
    return getSectorDefinition(sector);
  }

  getSectorNavigation(sector: string) {
    const definition = getSectorDefinition(sector);

    return {
      sector: definition.key,
      dashboardLabel: definition.dashboardLabel,
      navigation: getSectorNavigation(sector),
    };
  }

  getRoles() {
    return enterpriseRoles.map((role) => ({
      role,
      permissions: rolePermissions[role],
    }));
  }

  getPermissions() {
    return enterprisePermissions;
  }

  getWorkflows() {
    return [
      {
        key: "crm-to-cash",
        label: "CRM to cash",
        steps: ["Prospect", "Lead", "Opportunity", "Quotation", "Order", "Invoice", "Payment"],
      },
      {
        key: "purchase-to-pay",
        label: "Purchase to pay",
        steps: ["Purchase request", "Purchase order", "Reception", "Supplier invoice", "Payment"],
      },
      {
        key: "stock-control",
        label: "Stock control",
        steps: ["Product", "Stock entry", "Adjustment", "Low stock alert", "Replenishment"],
      },
    ];
  }

  getRoadmap() {
    return [
      {
        phase: "Foundation SaaS",
        status: "in-progress",
        items: ["Multi-tenant", "Authentication", "Companies", "Users", "Roles", "Permissions", "Audit"],
      },
      {
        phase: "Core ERP",
        status: "in-progress",
        items: ["CRM", "Products", "Stock", "Suppliers", "Sales", "Invoices", "Payments", "Finance"],
      },
      {
        phase: "Cloud Product",
        status: "planned",
        items: ["Dashboard", "Reports", "Notifications", "Import / Export", "Documents", "Backups", "Monitoring"],
      },
      {
        phase: "AI and sectors",
        status: "planned",
        items: ["AI Assistant", "Industry dashboards", "Business workflows", "Sector packages"],
      },
      {
        phase: "Commercialization",
        status: "planned",
        items: ["Landing pages", "Interactive demo", "Subscriptions", "Payments", "Documentation", "Support"],
      },
    ];
  }
}
