import type { Metadata } from "next";

const siteUrl = "https://enterpriseerp-web.onrender.com";
const ogImage = "/enterpriseerp-og.png";

type SeoPageConfig = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: SeoPageConfig): Metadata {
  const canonicalPath = path === "/" ? "/" : path;
  const url = `${siteUrl}${canonicalPath}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url,
      siteName: "EnterpriseERP Cloud",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export const publicPageMetadata = {
  home: buildPageMetadata({
    title: "EnterpriseERP Cloud | ERP Cloud, Mobile et IA",
    description:
      "EnterpriseERP Cloud aide les PME a centraliser ventes, CRM, stock, facturation, finance, RH, mobile et IA dans une plateforme SaaS moderne.",
    path: "/",
    keywords: ["EnterpriseERP", "ERP Cloud", "ERP SaaS", "ERP IA", "ERP mobile"],
  }),
  cloud: buildPageMetadata({
    title: "EnterpriseERP Cloud | ERP SaaS pour PME",
    description:
      "Decouvrez EnterpriseERP Cloud, une plateforme ERP SaaS pour centraliser CRM, ventes, facturation, stock, finance, RH, mobile et IA.",
    path: "/cloud",
    keywords: ["ERP Cloud", "ERP SaaS", "EnterpriseERP Cloud", "ERP PME", "logiciel de gestion cloud"],
  }),
  solutions: buildPageMetadata({
    title: "Solutions EnterpriseERP | ERP Cloud par secteur",
    description:
      "Explorez les solutions EnterpriseERP pour commerce, restaurant, hotel, construction, industrie, transport, sante et education.",
    path: "/solutions",
    keywords: ["solution ERP", "ERP par secteur", "ERP metier", "ERP Cloud IA"],
  }),
  pricing: buildPageMetadata({
    title: "Tarifs EnterpriseERP Cloud | Plans ERP SaaS",
    description:
      "Comparez les offres EnterpriseERP Cloud pour demarrer avec un essai gratuit, un plan Business transparent et une option Enterprise sur mesure.",
    path: "/pricing",
    keywords: ["tarif ERP", "prix ERP SaaS", "EnterpriseERP pricing", "ERP PME prix"],
  }),
  demo: buildPageMetadata({
    title: "Demo EnterpriseERP Cloud | Tester l'ERP par secteur",
    description:
      "Essayez une demo EnterpriseERP Cloud avec donnees fictives, choix du secteur et parcours guide CRM, stock, facturation et dashboard.",
    path: "/demo",
    keywords: ["demo ERP", "essayer ERP Cloud", "demo ERP SaaS", "EnterpriseERP demo"],
  }),
  integrations: buildPageMetadata({
    title: "Integrations EnterpriseERP | API, webhooks et connecteurs",
    description:
      "Connectez EnterpriseERP Cloud a votre ecosysteme avec API REST, webhooks, mobile, paiements, e-mail, calendrier et connecteurs metier.",
    path: "/integrations",
    keywords: ["integration ERP", "API ERP", "webhooks ERP", "ERP Shopify WooCommerce"],
  }),
  security: buildPageMetadata({
    title: "Securite EnterpriseERP Cloud | RBAC, audit et donnees",
    description:
      "Decouvrez les fondations securite EnterpriseERP Cloud: multi-tenant, roles, permissions, audit, sessions et protection des donnees.",
    path: "/security",
    keywords: ["securite ERP", "RBAC ERP", "audit ERP", "ERP multi tenant"],
  }),
  status: buildPageMetadata({
    title: "Status EnterpriseERP Cloud | Disponibilite API et services",
    description:
      "Consultez le statut EnterpriseERP Cloud: application web, API, PostgreSQL, authentification, stockage fichiers et services IA.",
    path: "/status",
    keywords: ["status ERP", "health API", "readiness API", "EnterpriseERP status"],
  }),
  support: buildPageMetadata({
    title: "Support EnterpriseERP Cloud | Aide, contact et assistance",
    description:
      "Contactez le support EnterpriseERP Cloud pour assistance, questions commerciales, aide technique, onboarding et accompagnement SaaS.",
    path: "/support",
    keywords: ["support ERP", "aide EnterpriseERP", "contact ERP Cloud", "support SaaS"],
  }),
  faq: buildPageMetadata({
    title: "FAQ EnterpriseERP Cloud | Questions frequentes ERP SaaS",
    description:
      "Reponses aux questions frequentes sur EnterpriseERP Cloud, l'essai gratuit, le mobile, les integrations, la securite et la roadmap.",
    path: "/faq",
    keywords: ["FAQ ERP", "questions ERP SaaS", "EnterpriseERP FAQ", "ERP Cloud aide"],
  }),
  roi: buildPageMetadata({
    title: "ROI EnterpriseERP Cloud | Calculer les gains ERP",
    description:
      "Estimez les gains de temps, de tresorerie et de productivite que votre PME peut obtenir avec EnterpriseERP Cloud.",
    path: "/roi",
    keywords: ["ROI ERP", "calcul retour investissement ERP", "gains ERP", "ERP productivite"],
  }),
  roadmap: buildPageMetadata({
    title: "Roadmap EnterpriseERP Cloud | Disponible, Beta et Prevu",
    description:
      "Suivez la roadmap EnterpriseERP Cloud avec les modules disponibles, les fonctionnalites beta et les prochaines evolutions SaaS.",
    path: "/roadmap",
    keywords: ["roadmap ERP", "roadmap SaaS", "EnterpriseERP roadmap", "modules ERP"],
  }),
  commerce: buildPageMetadata({
    title: "ERP Commerce | Stock, ventes et facturation",
    description:
      "EnterpriseERP Commerce aide les boutiques, magasins et supermarches a piloter produits, ventes, stock, fournisseurs, paiements et rapports.",
    path: "/commerce",
    keywords: ["ERP commerce", "logiciel magasin", "gestion stock commerce", "ERP retail"],
  }),
  restaurant: buildPageMetadata({
    title: "ERP Restaurant | Commandes, cuisine et facturation",
    description:
      "EnterpriseERP Restaurant centralise commandes, reservations, menus, cuisine, stock, achats, paiements, personnel et rapports IA.",
    path: "/restaurant",
    keywords: ["ERP restaurant", "logiciel restaurant", "gestion commandes restaurant", "ERP restauration"],
  }),
  hotel: buildPageMetadata({
    title: "ERP Hotel | Reservations, chambres et paiements",
    description:
      "EnterpriseERP Hotel connecte reservations, chambres, clients, housekeeping, restaurant, facturation, paiements, personnel et finances.",
    path: "/hotel",
    keywords: ["ERP hotel", "logiciel hotel", "gestion hoteliere", "PMS hotel ERP"],
  }),
  construction: buildPageMetadata({
    title: "ERP Construction | Chantiers, budgets et contrats",
    description:
      "EnterpriseERP Construction aide les entreprises BTP a suivre chantiers, devis, contrats, materiels, materiaux, budgets, achats et marges.",
    path: "/construction",
    keywords: ["ERP construction", "ERP BTP", "logiciel chantier", "gestion budget chantier"],
  }),
  industrie: buildPageMetadata({
    title: "ERP Industrie | Production, stock et achats",
    description:
      "EnterpriseERP Industrie structure production, matieres premieres, machines, achats, stock, ordres de fabrication, facturation et finances.",
    path: "/industrie",
    keywords: ["ERP industrie", "logiciel production", "ERP usine", "gestion ordres de fabrication"],
  }),
  transport: buildPageMetadata({
    title: "ERP Transport | Flotte, expeditions et maintenance",
    description:
      "EnterpriseERP Transport centralise clients, flotte, conducteurs, expeditions, itineraires, carburant, maintenance, facturation et paiements.",
    path: "/transport",
    keywords: ["ERP transport", "logiciel logistique", "gestion flotte", "gestion expedition"],
  }),
  sante: buildPageMetadata({
    title: "ERP Sante | Patients, rendez-vous et facturation",
    description:
      "EnterpriseERP Sante accompagne cliniques et cabinets avec patients, medecins, rendez-vous, consultations, pharmacie, dossiers et paiements.",
    path: "/sante",
    keywords: ["ERP sante", "logiciel clinique", "gestion cabinet medical", "facturation medicale"],
  }),
  education: buildPageMetadata({
    title: "ERP Education | Etudiants, classes et frais scolaires",
    description:
      "EnterpriseERP Education organise etudiants, enseignants, classes, emploi du temps, examens, cours, frais scolaires, factures et rapports.",
    path: "/education",
    keywords: ["ERP education", "logiciel ecole", "gestion scolaire", "ERP universite"],
  }),
};
