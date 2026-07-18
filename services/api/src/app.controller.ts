import { Controller, Get, Header } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Header("Content-Type", "text/html; charset=utf-8")
  getRoot() {
    return renderPage({
      title: "EnterpriseERP Cloud",
      active: "home",
      body: `
        <section class="hero">
          <div class="hero-grid">
            <div>
              <div class="badge">ERP Cloud + API + AI ready</div>
              <h1>L'ERP nouvelle generation pour gerer votre entreprise <span>dans le cloud.</span></h1>
              <p>
                EnterpriseERP Cloud centralise vos clients, produits, stock, ventes et factures
                dans une API moderne prete pour le web, le mobile et les futurs modules IA.
              </p>
              <div class="hero-buttons">
                <a class="btn btn-primary" href="/register">Creer un compte</a>
                <a class="btn btn-dark" href="/login">Se connecter</a>
                <a class="btn btn-dark" href="/health">Verifier l'API</a>
              </div>
              <div class="stats">
                <div class="stat"><strong>API</strong><span>NestJS</span></div>
                <div class="stat"><strong>DB</strong><span>PostgreSQL</span></div>
                <div class="stat"><strong>ORM</strong><span>Prisma</span></div>
                <div class="stat"><strong>MVP</strong><span>CRM, Stock, Factures</span></div>
              </div>
            </div>

            <div class="mockup">
              <div class="mockup-top"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
              <div class="dash-card">
                <h3>Cloud API Status</h3>
                <p>Service : online</p>
                <p>Priorite : connecter le web et le mobile.</p>
              </div>
              <div class="dash-grid">
                <div class="mini">Clients<strong>/clients</strong></div>
                <div class="mini">Produits<strong>/products</strong></div>
                <div class="mini">Factures<strong>/invoices</strong></div>
                <div class="mini">Health<strong>/health</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section class="section" id="modules">
          <div class="section-header">
            <h2>Une base API propre pour EnterpriseERP</h2>
            <p>Le service cloud fournit les endpoints essentiels pour construire le SaaS EnterpriseERP.</p>
          </div>
          <div class="cards">
            <div class="card"><div class="icon">CRM</div><h3>CRM clients</h3><p>Gestion des clients, pays, statut et chiffre d'affaires.</p></div>
            <div class="card"><div class="icon">STK</div><h3>Produits et stock</h3><p>Catalogue produits, SKU, quantites, valeur et statut.</p></div>
            <div class="card"><div class="icon">INV</div><h3>Facturation</h3><p>Factures, client, montant, echeance et suivi du statut.</p></div>
          </div>
        </section>
      `,
    });
  }

  @Get("health")
  getHealth() {
    return {
      status: "ok",
      service: "enterpriseerp-cloud-api",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("health/ready")
  async getReadiness() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: "ready",
      database: "ok",
      service: "enterpriseerp-cloud-api",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("modules")
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

  @Get("pricing")
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

  @Get("roadmap")
  getRoadmap() {
    return {
      now: ["CRM", "Stock", "Facturation", "Dashboard", "Health checks"],
      next: ["Authentification complete", "Multi-tenant", "Audit log", "Assistant IA", "Mobile sync"],
      later: ["SSO", "Marketplace integrations", "Advanced analytics", "Workflow automation"],
    };
  }

  @Get("security")
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

  @Get("integrations")
  getIntegrations() {
    return {
      strategy: "API-first integrations for web, mobile, BI and automation.",
      available: ["CRM API", "Products API", "Invoices API", "Health API", "Readiness API"],
      planned: ["EnterpriseERP.Mobile sync", "Webhooks", "Payment providers", "Email and calendar", "Accounting connectors", "BI exports"],
    };
  }

  @Get("onboarding")
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

  @Get("competitive-position")
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

  @Get("login")
  @Header("Content-Type", "text/html; charset=utf-8")
  getLogin() {
    return renderPage({
      title: "Connexion - EnterpriseERP Cloud",
      active: "login",
      body: renderAuthCard({
        eyebrow: "Acces securise",
        title: "Connexion",
        text: "Connectez-vous a votre espace EnterpriseERP Cloud.",
        button: "Se connecter",
        alternateText: "Pas encore de compte ?",
        alternateHref: "/register",
        alternateLabel: "Creer un compte",
        fields: `
          <label>Email</label>
          <input type="email" name="email" placeholder="admin@enterpriseerp.com" autocomplete="email" />
          <label>Mot de passe</label>
          <input type="password" name="password" placeholder="Votre mot de passe" autocomplete="current-password" />
        `,
      }),
    });
  }

  @Get("register")
  @Header("Content-Type", "text/html; charset=utf-8")
  getRegister() {
    return renderPage({
      title: "Inscription - EnterpriseERP Cloud",
      active: "register",
      body: renderAuthCard({
        eyebrow: "Essai gratuit",
        title: "Creer un compte",
        text: "Demarrez votre espace EnterpriseERP Cloud et preparez votre environnement SaaS.",
        button: "Commencer",
        alternateText: "Deja inscrit ?",
        alternateHref: "/login",
        alternateLabel: "Se connecter",
        fields: `
          <label>Nom complet</label>
          <input type="text" name="name" placeholder="Votre nom" autocomplete="name" />
          <label>Email professionnel</label>
          <input type="email" name="email" placeholder="admin@entreprise.com" autocomplete="email" />
          <label>Mot de passe</label>
          <input type="password" name="password" placeholder="Minimum 8 caracteres" autocomplete="new-password" />
        `,
      }),
    });
  }

  @Get("dashboard")
  @Header("Content-Type", "text/html; charset=utf-8")
  getDashboard() {
    return renderPage({
      title: "Dashboard - EnterpriseERP Cloud",
      active: "dashboard",
      body: `
        <section class="dashboard-page">
          <div class="page-header">
            <div>
              <div class="badge">EnterpriseERP Command Center</div>
              <h1>Tableau de bord Cloud</h1>
              <p>Bienvenue dans votre espace EnterpriseERP Cloud. Pilotez les modules CRM, stock et facturation depuis une base API propre.</p>
            </div>
            <div class="hero-buttons">
              <a class="btn btn-primary" href="/clients">Clients API</a>
              <a class="btn btn-dark" href="/products">Produits API</a>
              <a class="btn btn-dark" href="/invoices">Factures API</a>
            </div>
          </div>

          <div class="stats dashboard-stats">
            <div class="stat"><strong>CRM</strong><span>Clients connectes</span></div>
            <div class="stat"><strong>Stock</strong><span>Produits et SKU</span></div>
            <div class="stat"><strong>Factures</strong><span>Ventes et echeances</span></div>
            <div class="stat"><strong>API</strong><span>Service actif</span></div>
          </div>

          <div class="dashboard-grid-panel">
            <div class="panel">
              <h2>Actions rapides</h2>
              <div class="cards dashboard-actions">
                <a class="card" href="/clients"><div class="icon">CRM</div><h3>Voir les clients</h3><p>Ouvrir la liste JSON des clients.</p></a>
                <a class="card" href="/products"><div class="icon">STK</div><h3>Voir le stock</h3><p>Ouvrir la liste JSON des produits.</p></a>
                <a class="card" href="/invoices"><div class="icon">INV</div><h3>Voir les factures</h3><p>Ouvrir la liste JSON des factures.</p></a>
              </div>
            </div>

            <div class="panel">
              <h2>Etat du service</h2>
              <div class="status-list">
                <div><span>API</span><strong>Online</strong></div>
                <div><span>Framework</span><strong>NestJS</strong></div>
                <div><span>Base</span><strong>PostgreSQL</strong></div>
                <div><span>ORM</span><strong>Prisma</strong></div>
              </div>
            </div>
          </div>
        </section>
      `,
    });
  }
}

type PageOptions = {
  title: string;
  active: "home" | "login" | "register" | "dashboard";
  body: string;
};

type AuthCardOptions = {
  eyebrow: string;
  title: string;
  text: string;
  fields: string;
  button: string;
  alternateText: string;
  alternateHref: string;
  alternateLabel: string;
};

function renderPage(options: PageOptions) {
  const isActive = (page: PageOptions["active"]) => options.active === page ? "active" : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${options.title}</title>
  <style>
    * { box-sizing: border-box; }
    :root {
      --bg: #020617;
      --panel: #0f172a;
      --panel2: #111827;
      --border: #334155;
      --text: #f8fafc;
      --muted: #94a3b8;
      --purple: #8b5cf6;
      --purple2: #7c3aed;
      --blue: #0b1228;
    }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, Segoe UI, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    a { color: inherit; text-decoration: none; }
    .navbar {
      min-height: 86px;
      padding: 0 7%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid #1e293b;
      background: rgba(2, 6, 23, .94);
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(16px);
    }
    .brand {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -1px;
    }
    .brand span { color: var(--purple); }
    .nav-links, .nav-actions, .hero-buttons {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    .nav-links a {
      color: #cbd5e1;
      font-weight: 800;
      font-size: 14px;
    }
    .nav-links a.active { color: white; }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      padding: 0 22px;
      border-radius: 14px;
      border: 1px solid var(--border);
      font-weight: 900;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--purple2), var(--purple));
      border-color: transparent;
      color: white;
      box-shadow: 0 16px 36px rgba(124, 58, 237, .28);
    }
    .btn-dark { background: #111827; color: white; }
    .hero {
      padding: 105px 7% 88px;
      background:
        radial-gradient(circle at 12% 18%, rgba(124, 58, 237, .25), transparent 28%),
        radial-gradient(circle at 92% 8%, rgba(56, 189, 248, .12), transparent 24%),
        linear-gradient(135deg, #020617, #0b1228);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr .9fr;
      gap: 56px;
      align-items: center;
    }
    .badge {
      display: inline-flex;
      padding: 11px 20px;
      border-radius: 999px;
      background: rgba(124, 58, 237, .32);
      color: #ddd6fe;
      font-weight: 900;
      margin-bottom: 28px;
    }
    h1 {
      margin: 0;
      font-size: clamp(48px, 6vw, 86px);
      line-height: 1.05;
      letter-spacing: -1px;
    }
    h1 span { color: #a78bfa; }
    .hero p, .section p, .card p, .auth-panel p {
      color: var(--muted);
      line-height: 1.75;
      font-size: 18px;
    }
    .hero p { max-width: 820px; margin: 28px 0 34px; }
    .stats, .dash-grid, .cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .stats { margin-top: 34px; }
    .stat, .mini, .card {
      background: rgba(15, 23, 42, .86);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px;
    }
    .stat strong, .mini strong { display: block; color: white; font-size: 22px; margin-bottom: 6px; }
    .stat span, .mini { color: var(--muted); font-weight: 700; }
    .mockup {
      border: 1px solid var(--border);
      border-radius: 30px;
      background: rgba(15, 23, 42, .78);
      padding: 28px;
      box-shadow: 0 30px 90px rgba(0,0,0,.36);
    }
    .mockup-top { display: flex; gap: 8px; margin-bottom: 18px; }
    .dot { width: 13px; height: 13px; border-radius: 50%; background: #64748b; }
    .dash-card {
      border: 1px solid var(--border);
      border-radius: 22px;
      padding: 28px;
      margin-bottom: 18px;
      background: #111827;
    }
    .dash-card h3 { margin: 0 0 18px; color: #a78bfa; font-size: 28px; }
    .dash-grid { grid-template-columns: repeat(2, 1fr); }
    .mini strong { font-size: 18px; color: white; }
    .section { padding: 82px 7%; }
    .section-header { max-width: 850px; margin-bottom: 34px; }
    .section h2 { font-size: clamp(34px, 3.5vw, 52px); margin: 0 0 14px; }
    .cards { grid-template-columns: repeat(3, 1fr); }
    .card { min-height: 205px; }
    .icon {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: rgba(124,58,237,.22);
      color: #ddd6fe;
      font-size: 13px;
      font-weight: 900;
      margin-bottom: 18px;
    }
    .card h3 { margin: 0 0 10px; font-size: 22px; }
    .auth-wrap {
      min-height: calc(100vh - 86px);
      display: grid;
      grid-template-columns: .95fr 1.05fr;
      background:
        radial-gradient(circle at 14% 18%, rgba(124, 58, 237, .24), transparent 28%),
        linear-gradient(135deg, #020617, #0b1228);
    }
    .auth-side {
      padding: 80px 7vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .auth-side h1 { font-size: clamp(42px, 5vw, 70px); }
    .auth-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 54px 7vw;
    }
    .auth-card {
      width: min(100%, 520px);
      padding: 34px;
      border: 1px solid var(--border);
      border-radius: 26px;
      background: rgba(15, 23, 42, .9);
      box-shadow: 0 30px 90px rgba(0,0,0,.34);
    }
    .auth-card h2 { margin: 0 0 10px; font-size: 34px; }
    form { display: grid; gap: 12px; margin-top: 24px; }
    label { color: #cbd5e1; font-size: 14px; font-weight: 900; }
    input {
      width: 100%;
      min-height: 54px;
      padding: 0 16px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: #020617;
      color: white;
      font: inherit;
      outline: none;
    }
    input:focus { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(139, 92, 246, .2); }
    .form-note { margin-top: 18px; color: var(--muted); }
    .form-note a { color: #c4b5fd; font-weight: 900; }
    .footer {
      padding: 28px 7%;
      border-top: 1px solid #1e293b;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
      background: #020617;
    }
    .dashboard-page {
      min-height: calc(100vh - 86px);
      padding: 58px 7% 82px;
      background:
        radial-gradient(circle at 16% 14%, rgba(124, 58, 237, .22), transparent 30%),
        linear-gradient(135deg, #020617, #0b1228);
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 28px;
      padding: 28px;
      border: 1px solid var(--border);
      border-radius: 26px;
      background: rgba(15, 23, 42, .78);
      box-shadow: 0 24px 70px rgba(0,0,0,.28);
    }
    .page-header h1 {
      font-size: clamp(38px, 5vw, 66px);
    }
    .page-header p {
      max-width: 720px;
      color: var(--muted);
      line-height: 1.7;
      font-size: 18px;
      margin: 18px 0 0;
    }
    .dashboard-stats {
      margin: 24px 0;
    }
    .dashboard-grid-panel {
      display: grid;
      grid-template-columns: 1.3fr .7fr;
      gap: 20px;
    }
    .panel {
      padding: 26px;
      border: 1px solid var(--border);
      border-radius: 24px;
      background: rgba(15, 23, 42, .86);
    }
    .panel h2 {
      margin: 0 0 18px;
      font-size: 26px;
    }
    .dashboard-actions {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .status-list {
      display: grid;
      gap: 12px;
    }
    .status-list div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 16px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: #111827;
      color: var(--muted);
      font-weight: 800;
    }
    .status-list strong { color: #c4b5fd; }
    @media(max-width: 1020px) {
      .hero-grid, .auth-wrap { grid-template-columns: 1fr; }
      .page-header, .dashboard-grid-panel { grid-template-columns: 1fr; }
      .page-header { align-items: flex-start; flex-direction: column; }
      .stats, .cards { grid-template-columns: repeat(2, 1fr); }
      .navbar { align-items: flex-start; flex-direction: column; padding-top: 20px; padding-bottom: 20px; }
    }
    @media(max-width: 680px) {
      .stats, .cards, .dash-grid { grid-template-columns: 1fr; }
      .hero, .section, .auth-side, .auth-panel { padding-left: 24px; padding-right: 24px; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>
  <header class="navbar">
    <a class="brand" href="/">Enterprise<span>ERP</span></a>
    <nav class="nav-links">
      <a class="${isActive("home")}" href="/">Accueil</a>
      <a href="/clients">Clients API</a>
      <a href="/products">Produits API</a>
      <a href="/invoices">Factures API</a>
      <a class="${isActive("dashboard")}" href="/dashboard">Dashboard</a>
      <a href="/health">Health</a>
    </nav>
    <div class="nav-actions">
      <a class="btn btn-dark ${isActive("login")}" href="/login">Connexion</a>
      <a class="btn btn-primary ${isActive("register")}" href="/register">Essayer gratuitement</a>
    </div>
  </header>
  ${options.body}
  <footer class="footer">
    <div>EnterpriseERP Cloud API</div>
    <div>Version 0.1.0 - NestJS + Prisma + PostgreSQL</div>
  </footer>
</body>
</html>`;
}

function renderAuthCard(options: AuthCardOptions) {
  return `
    <section class="auth-wrap">
      <div class="auth-side">
        <div class="badge">${options.eyebrow}</div>
        <h1>EnterpriseERP <span>Cloud</span></h1>
        <p>Une experience professionnelle inspiree du design EnterpriseERP, connectee a votre API SaaS.</p>
        <div class="stats">
          <div class="stat"><strong>14j</strong><span>Essai gratuit</span></div>
          <div class="stat"><strong>3</strong><span>Modules MVP</span></div>
        </div>
      </div>
      <div class="auth-panel">
        <div class="auth-card">
          <div class="badge">${options.eyebrow}</div>
          <h2>${options.title}</h2>
          <p>${options.text}</p>
          <form method="get" action="/dashboard">
            ${options.fields}
            <button class="btn btn-primary" type="submit">${options.button}</button>
          </form>
          <div class="form-note">${options.alternateText} <a href="${options.alternateHref}">${options.alternateLabel}</a></div>
        </div>
      </div>
    </section>
  `;
}
