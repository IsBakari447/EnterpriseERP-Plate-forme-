"use client";

import Link from "next/link";
import MarketingHeader from "@shared/components/marketing/MarketingHeader";
import { useI18n } from "@shared/i18n/I18nProvider";

type RoadmapContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  pillars: string[];
  architectureTitle: string;
  architecture: string[];
  modulesTitle: string;
  modules: string[];
  phasesTitle: string;
  phases: Array<{
    title: string;
    items: string[];
  }>;
  ctaTitle: string;
  ctaText: string;
  openPlatform: string;
  requestDemo: string;
};

const content: Record<string, RoadmapContent> = {
  fr: {
    eyebrow: "Roadmap SaaS professionnelle",
    title: "La vision produit pour transformer EnterpriseERP Cloud en ERP SaaS complet.",
    subtitle:
      "Une feuille de route claire pour construire une plateforme cloud, mobile, IA, multi-tenant et multi-sectorielle pour les PME.",
    pillars: [
      "Cloud native",
      "Mobile first",
      "AI ready",
      "Multi-tenant",
      "Securise",
      "Evolutif",
    ],
    architectureTitle: "Architecture cible",
    architecture: [
      "Landing website",
      "Next.js frontend",
      "NestJS API",
      "PostgreSQL",
      "Redis",
      "Object storage",
    ],
    modulesTitle: "Modules strategiques",
    modules: [
      "Multi-entreprise avec isolation par companyId",
      "Authentification complete avec JWT, refresh token, MFA et sessions",
      "Utilisateurs, roles et permissions granulaires",
      "CRM, ventes, stock, facturation, finance, RH et projets",
      "Dashboards sectoriels pour restaurant, commerce, construction, transport et sante",
      "Assistant IA pour rapports, relances, devis et previsions",
      "Notifications, audit, rapports PDF/Excel/CSV et monitoring",
      "Landing pages sectorielles et tarification SaaS",
    ],
    phasesTitle: "Priorites de developpement",
    phases: [
      {
        title: "Phase 1 - Fondation SaaS",
        items: ["Multi-tenant", "Authentification", "Entreprises", "Roles", "Permissions", "Audit"],
      },
      {
        title: "Phase 2 - Coeur ERP",
        items: ["CRM", "Produits", "Stock", "Fournisseurs", "Ventes", "Factures", "Paiements"],
      },
      {
        title: "Phase 3 - Produit Cloud",
        items: ["Dashboard", "Rapports", "Notifications", "Import / Export", "Sauvegardes"],
      },
      {
        title: "Phase 4 - IA et secteurs",
        items: ["Assistant IA", "Workflows metier", "Dashboards sectoriels", "Packages par secteur"],
      },
      {
        title: "Phase 5 - Commercialisation",
        items: ["Landing pages", "Demo interactive", "Abonnements", "Documentation", "Support"],
      },
    ],
    ctaTitle: "Objectif final",
    ctaText:
      "EnterpriseERP Cloud doit offrir une experience moderne, des donnees isolees par entreprise, des workflows metier complets et une architecture prete pour la production.",
    openPlatform: "Ouvrir la plateforme",
    requestDemo: "Demander une demo",
  },
  en: {
    eyebrow: "Professional SaaS roadmap",
    title: "The product vision to turn EnterpriseERP Cloud into a complete SaaS ERP.",
    subtitle:
      "A clear roadmap for building a cloud, mobile, AI-ready, multi-tenant and multi-industry platform for SMEs.",
    pillars: ["Cloud native", "Mobile first", "AI ready", "Multi-tenant", "Secure", "Scalable"],
    architectureTitle: "Target architecture",
    architecture: ["Landing website", "Next.js frontend", "NestJS API", "PostgreSQL", "Redis", "Object storage"],
    modulesTitle: "Strategic modules",
    modules: [
      "Multi-company isolation with companyId",
      "Complete authentication with JWT, refresh token, MFA and sessions",
      "Users, roles and granular permissions",
      "CRM, sales, inventory, billing, finance, HR and projects",
      "Industry dashboards for restaurant, retail, construction, transport and healthcare",
      "AI assistant for reports, follow-ups, quotes and forecasting",
      "Notifications, audit, PDF/Excel/CSV reports and monitoring",
      "Industry landing pages and SaaS pricing",
    ],
    phasesTitle: "Development priorities",
    phases: [
      { title: "Phase 1 - SaaS foundation", items: ["Multi-tenant", "Authentication", "Companies", "Roles", "Permissions", "Audit"] },
      { title: "Phase 2 - ERP core", items: ["CRM", "Products", "Inventory", "Suppliers", "Sales", "Invoices", "Payments"] },
      { title: "Phase 3 - Cloud product", items: ["Dashboard", "Reports", "Notifications", "Import / Export", "Backups"] },
      { title: "Phase 4 - AI and industries", items: ["AI assistant", "Business workflows", "Industry dashboards", "Industry packages"] },
      { title: "Phase 5 - Go to market", items: ["Landing pages", "Interactive demo", "Subscriptions", "Documentation", "Support"] },
    ],
    ctaTitle: "Final objective",
    ctaText:
      "EnterpriseERP Cloud must deliver a modern experience, company-isolated data, complete business workflows and a production-ready architecture.",
    openPlatform: "Open platform",
    requestDemo: "Request a demo",
  },
  sv: {
    eyebrow: "Professionell SaaS-roadmap",
    title: "Produktvisionen for att gora EnterpriseERP Cloud till ett komplett SaaS ERP.",
    subtitle:
      "En tydlig roadmap for en molnbaserad, mobil, AI-redo, multi-tenant och branschanpassad plattform for SME.",
    pillars: ["Molnbaserad", "Mobil forst", "AI-redo", "Multi-tenant", "Saker", "Skalbar"],
    architectureTitle: "Malarkitektur",
    architecture: ["Publik webbplats", "Next.js frontend", "NestJS API", "PostgreSQL", "Redis", "Objektlagring"],
    modulesTitle: "Strategiska moduler",
    modules: [
      "Flerforetagsstod med isolering via companyId",
      "Komplett autentisering med JWT, refresh token, MFA och sessioner",
      "Anvandare, roller och detaljerade behorigheter",
      "CRM, forsaljning, lager, fakturering, ekonomi, HR och projekt",
      "Branschdashboards for restaurang, handel, bygg, transport och vard",
      "AI-assistent for rapporter, uppfoljning, offerter och prognoser",
      "Notifieringar, audit, PDF/Excel/CSV-rapporter och monitoring",
      "Branschlandningssidor och SaaS-priser",
    ],
    phasesTitle: "Utvecklingsprioriteringar",
    phases: [
      { title: "Fas 1 - SaaS-grund", items: ["Multi-tenant", "Autentisering", "Foretag", "Roller", "Behorigheter", "Audit"] },
      { title: "Fas 2 - ERP-karna", items: ["CRM", "Produkter", "Lager", "Leverantorer", "Forsaljning", "Fakturor", "Betalningar"] },
      { title: "Fas 3 - Molnprodukt", items: ["Oversikt", "Rapporter", "Notifieringar", "Import / Export", "Sakerhetskopior"] },
      { title: "Fas 4 - AI och branscher", items: ["AI-assistent", "Affarsfloden", "Branschdashboards", "Branschpaket"] },
      { title: "Fas 5 - Marknad", items: ["Landningssidor", "Interaktiv demo", "Abonnemang", "Dokumentation", "Support"] },
    ],
    ctaTitle: "Slutmal",
    ctaText:
      "EnterpriseERP Cloud ska ge en modern upplevelse, foretagsisolerad data, kompletta affarsfloden och en produktionsklar arkitektur.",
    openPlatform: "Oppna plattformen",
    requestDemo: "Boka demo",
  },
};

export default function RoadmapPage() {
  const { locale } = useI18n();
  const copy = content[locale] ?? content.fr;

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#1E2A38]">
      <MarketingHeader />

      <section className="relative overflow-hidden bg-[#121C2A] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,194,169,0.22),transparent_34%),linear-gradient(135deg,rgba(255,122,0,0.16),transparent_42%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-[#00C2A9]">
              {copy.eyebrow}
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              {copy.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {copy.pillars.map((pillar) => (
                <span key={pillar} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold">
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-black">{copy.architectureTitle}</h2>
            <div className="mt-6 space-y-3">
              {copy.architecture.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00C2A9] text-sm font-black text-[#121C2A]">
                    {index + 1}
                  </span>
                  <span className="font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black">{copy.modulesTitle}</h2>
            <p className="mt-2 max-w-2xl text-slate-600">{copy.ctaText}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="rounded-xl bg-[#1E2A38] px-5 py-3 text-sm font-bold text-white">
              {copy.openPlatform}
            </Link>
            <Link href="/demo" className="rounded-xl bg-[#FF7A00] px-5 py-3 text-sm font-bold text-white">
              {copy.requestDemo}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {copy.modules.map((item) => (
            <article key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 h-1.5 w-12 rounded-full bg-[#00C2A9]" />
              <p className="text-sm font-bold leading-6 text-slate-700">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-black">{copy.phasesTitle}</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-5">
            {copy.phases.map((phase, index) => (
              <article key={phase.title} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E2A38] font-black text-white">
                  {index + 1}
                </div>
                <h3 className="text-base font-black">{phase.title}</h3>
                <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-600">
                  {phase.items.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-3xl bg-[#1E2A38] p-8 text-white shadow-xl md:p-10">
          <h2 className="text-3xl font-black">{copy.ctaTitle}</h2>
          <p className="mt-4 max-w-3xl text-slate-200">{copy.ctaText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1E2A38]">
              {copy.openPlatform}
            </Link>
            <Link href="/demo" className="rounded-xl bg-[#FF7A00] px-5 py-3 text-sm font-bold text-white">
              {copy.requestDemo}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
