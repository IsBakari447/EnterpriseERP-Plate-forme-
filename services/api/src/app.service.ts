import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { RateLimitService } from "./common/rate-limit/rate-limit.service";

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rateLimit: RateLimitService
  ) {}

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
    const rateLimit = await this.rateLimit.getBackendStatus();
    const redisRequired = process.env.NODE_ENV === "production" && Boolean(process.env.REDIS_URL);
    const degraded = redisRequired && !rateLimit.distributed;
    const payload = {
      status: degraded ? "degraded" : "ready",
      database: "ok",
      rateLimit,
      service: "enterpriseerp-cloud-api",
      timestamp: new Date().toISOString(),
    };

    if (degraded) {
      throw new HttpException(payload, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return payload;
  }

  getModules() {
    return {
      product: "EnterpriseERP Cloud",
      modules: [
        { key: "dashboard", name: "Executive dashboard", status: "available", value: "Steering, KPIs, risks and AI priorities" },
        { key: "crm", name: "CRM", status: "available", value: "Clients, prospects, status and revenue" },
        { key: "stock", name: "Inventory", status: "available", value: "Products, SKUs, quantities and alerts" },
        { key: "facturation", name: "Billing", status: "available", value: "Invoices, due dates and payments" },
        { key: "security", name: "RBAC and audit", status: "beta", value: "Roles, permissions, sessions and audit log" },
        { key: "ai", name: "AI Assistant", status: "planned", value: "Summaries, recommendations and automations" },
        { key: "mobile", name: "Mobile", status: "beta", value: "Progressive EnterpriseERP.Mobile connection" },
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
        { name: "Starter", price: "Free trial", target: "Validation and demos" },
        { name: "Business", price: "From 49 EUR/month", target: "Growing SMEs" },
        { name: "Enterprise", price: "Custom", target: "Multi-site, SLA and integrations" },
      ],
    };
  }

  getRoadmap() {
    return {
      now: ["CRM", "Stock", "Billing", "Dashboard", "Health checks"],
      next: ["Complete authentication", "Multi-tenant", "Audit log", "AI Assistant", "Mobile sync"],
      later: ["SSO", "Marketplace integrations", "Advanced analytics", "Workflow automation"],
    };
  }

  getSecurity() {
    return {
      trustCenter: "EnterpriseERP Cloud",
      controls: [
        { key: "roles", status: "beta", description: "Role-based access control for admin, manager and employee scopes." },
        { key: "readiness", status: "available", description: "Health and readiness endpoints for cloud QA and deployment checks." },
        { key: "secrets", status: "available", description: "Environment-based configuration with secrets excluded from Git." },
        { key: "audit", status: "beta", description: "Audit trail for sensitive actions and business changes." },
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
      generatedAt: new Date().toISOString(),
      services: [
        { name: "Web app", status: "available", detail: "Next.js frontend deployed" },
        { name: "Cloud API", status: "available", detail: "NestJS API responding" },
        { name: "Database", status: "available", detail: "Readiness query validated" },
        { name: "Mobile sync", status: "beta", detail: "Progressive EnterpriseERP.Mobile connection" },
      ],
      incidents: [],
      maintenance: [{ title: "Integration monitoring upgrade", status: "planned", window: "Upcoming sprint" }],
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
