import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getRoot() {
    return {
      status: "ok",
      service: "enterpriseerp-cloud-api",
      message: "EnterpriseERP API is running. Use /health for status and /api for application endpoints.",
      endpoints: {
        health: "/health",
        readiness: "/health/ready",
        auth: "/api/auth/login",
        modules: "/api/modules",
        platform: "/api/platform/foundation",
      },
      timestamp: new Date().toISOString(),
    };
  }

  getHealth() {
    return {
      status: "ok",
      service: "enterpriseerp-cloud-api",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: "ready",
      database: "ok",
      service: "enterpriseerp-cloud-api",
      timestamp: new Date().toISOString(),
    };
  }

  getModules() {
    return {
      product: "EnterpriseERP Cloud",
      modules: [
        { key: "dashboard", name: "Dashboard CEO", status: "ready", value: "Pilotage, KPIs, risques et priorites IA" },
        { key: "crm", name: "CRM", status: "ready", value: "Clients, prospects, statut et revenu" },
        { key: "stock", name: "Stock", status: "ready", value: "Produits, SKU, quantites et alertes" },
        { key: "facturation", name: "Facturation", status: "ready", value: "Factures, echeances et encaissements" },
        { key: "ai", name: "Assistant IA", status: "planned", value: "Syntheses, recommandations et automatisations" },
        { key: "mobile", name: "Mobile", status: "planned", value: "Connexion EnterpriseERP.Mobile" },
      ],
    };
  }

  getPricing() {
    return {
      currency: "EUR",
      trial: {
        durationDays: 14,
        role: "Admin complet",
        limits: {
          users: 3,
          invoices: 20,
          products: 50,
        },
        afterTrial: "read_only",
        dataRetentionDays: 90,
      },
      plans: [
        { name: "Starter", price: "Free trial", target: "Validation et demos" },
        { name: "Business", price: "Quote", target: "PME en croissance" },
        { name: "Enterprise", price: "Custom", target: "Multi-sites, SLA, integrations" },
      ],
    };
  }

  getRoadmap() {
    return {
      now: ["CRM", "Stock", "Facturation", "Dashboard", "Health checks"],
      next: ["Authentification complete", "Multi-tenant", "Audit log", "Assistant IA", "Mobile sync"],
      later: ["SSO", "Marketplace integrations", "Advanced analytics", "Workflow automation"],
    };
  }

  getSecurity() {
    return {
      trustCenter: "EnterpriseERP Cloud",
      controls: [
        { key: "roles", status: "planned", description: "Role-based access control for admin, manager and employee scopes." },
        { key: "readiness", status: "ready", description: "Health and readiness endpoints for cloud QA and deployment checks." },
        { key: "secrets", status: "ready", description: "Environment-based configuration with secrets excluded from Git." },
        { key: "audit", status: "planned", description: "Audit trail for sensitive actions and business changes." },
        { key: "retention", status: "planned", description: "Trial and subscription data retention policy." },
      ],
    };
  }

  getIntegrations() {
    return {
      strategy: "API-first integrations for web, mobile, BI and automation.",
      available: ["CRM API", "Products API", "Invoices API", "Health API", "Readiness API"],
      planned: ["EnterpriseERP.Mobile sync", "Webhooks", "Payment providers", "Email and calendar", "Accounting connectors", "BI exports"],
    };
  }

  getOnboarding() {
    return {
      goal: "Convert trial users into paying customers with a clear activation path.",
      steps: [
        "Create company workspace",
        "Invite up to 3 trial users",
        "Import clients, products and open invoices",
        "Review dashboard KPIs and AI priorities",
        "Connect mobile/API integrations",
        "Upgrade before read-only mode",
      ],
    };
  }

  getCompetitivePosition() {
    return {
      comparableCloudSignals: [
        "Integrated business suite",
        "CRM, finance, stock, HR and analytics",
        "Free trial and clear pricing path",
        "API-first architecture",
        "Mobile-ready product story",
        "AI recommendations and automation roadmap",
        "Trust center and readiness checks",
      ],
      focus: "Small and medium businesses that need a simpler cloud ERP with professional dashboards and mobile extensibility.",
    };
  }

  getDemoScript() {
    return {
      duration: "15 minutes",
      objective: "Show how EnterpriseERP Cloud helps SMEs centralize operations and make faster decisions.",
      steps: [
        "Open the Cloud landing page",
        "Explain the free trial and limits",
        "Show CEO dashboard KPIs",
        "Create or review client/product/invoice records",
        "Open integrations and trust center",
        "Close with ROI and onboarding path",
      ],
    };
  }

  getRoiModel() {
    return {
      assumptions: {
        adminHoursSavedPerWeek: 4,
        invoiceFollowUpImprovement: "Prioritized collection",
        reportingTimeSaved: "Single dashboard instead of spreadsheets",
      },
      outputs: [
        { metric: "Administrative time", estimatedGain: "Up to 50%" },
        { metric: "Decision speed", estimatedGain: "Real-time KPIs" },
        { metric: "Cash-flow visibility", estimatedGain: "Overdue invoice focus" },
      ],
    };
  }

  getFaq() {
    return {
      items: [
        {
          question: "Is EnterpriseERP Cloud different from EnterpriseERP?",
          answer: "Yes. It is the SaaS API-first cloud version prepared for web, mobile, integrations and multi-company usage.",
        },
        {
          question: "What happens after the trial?",
          answer: "The recommended policy is read-only mode until payment, with data retained for 90 days.",
        },
        {
          question: "Can it connect to mobile?",
          answer: "Yes. The API-first architecture is prepared for EnterpriseERP.Mobile synchronization.",
        },
      ],
    };
  }

  getPlatformStatus() {
    return {
      services: [
        { name: "Web app", status: "operational" },
        { name: "Cloud API", status: "operational" },
        { name: "Prisma schema", status: "valid" },
        { name: "Mobile sync", status: "planned" },
      ],
    };
  }

  getLoginHelp() {
    return {
      message: "Use POST /api/auth/login from the web or mobile app.",
      method: "POST",
      endpoint: "/api/auth/login",
    };
  }

  getRegisterHelp() {
    return {
      message: "Use POST /api/auth/register from the web or mobile app.",
      method: "POST",
      endpoint: "/api/auth/register",
    };
  }

  getDashboardHelp() {
    return {
      message: "Dashboard UI belongs to apps/web. This API service only exposes backend endpoints.",
      api: "/api",
      health: "/health",
    };
  }
}
