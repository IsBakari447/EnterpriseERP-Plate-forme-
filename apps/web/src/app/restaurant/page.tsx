import FeatureCard from "@shared/components/marketing/FeatureCard";
import MarketingFooter from "@shared/components/marketing/MarketingFooter";
import MarketingHeader from "@shared/components/marketing/MarketingHeader";

const problems = [
  {
    icon: "📦",
    title: "Stocks difficiles à maîtriser",
    description:
      "Les ruptures, les pertes et les inventaires manuels réduisent la rentabilité.",
  },
  {
    icon: "🧾",
    title: "Informations dispersées",
    description:
      "Les clients, commandes, devis, factures et paiements sont suivis dans plusieurs outils.",
  },
  {
    icon: "📊",
    title: "Manque de visibilité",
    description:
      "Les responsables ne disposent pas toujours des indicateurs nécessaires pour décider rapidement.",
  },
  {
    icon: "⏱️",
    title: "Trop de tâches manuelles",
    description:
      "La saisie répétitive et les contrôles manuels font perdre du temps aux équipes.",
  },
];

const modules = [
  {
    icon: "👥",
    title: "CRM clients",
    description:
      "Centralisez les coordonnées, les interactions et l’historique commercial de vos clients.",
  },
  {
    icon: "💼",
    title: "Ventes et devis",
    description:
      "Suivez les opportunités, préparez les devis et transformez-les en commandes.",
  },
  {
    icon: "📦",
    title: "Stocks",
    description:
      "Surveillez les quantités, les niveaux critiques et les besoins de réapprovisionnement.",
  },
  {
    icon: "💳",
    title: "Facturation",
    description:
      "Créez les factures, suivez les échéances et visualisez les paiements en attente.",
  },
  {
    icon: "📈",
    title: "Tableau de bord",
    description:
      "Consultez les ventes, les factures, le stock et les performances depuis une seule vue.",
  },
  {
    icon: "🤖",
    title: "Assistant IA",
    description:
      "Obtenez des analyses, des alertes et des recommandations pour mieux piloter l’activité.",
  },
];

const plans = [
  {
    name: "Starter",
    description: "Pour un restaurant indépendant",
    price: "À partir de 29 €",
    features: ["CRM", "Ventes", "Stock", "Facturation"],
  },
  {
    name: "Business",
    description: "Pour une activité en croissance",
    price: "À partir de 69 €",
    features: [
      "Tous les modules Starter",
      "Rapports avancés",
      "Assistant IA",
      "Multi-utilisateurs",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    description: "Pour les groupes et réseaux",
    price: "Sur devis",
    features: [
      "Multi-sites",
      "API et intégrations",
      "Personnalisation",
      "Support prioritaire",
    ],
  },
];

export default function RestaurantPage() {
  return (
    <main className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="overflow-hidden bg-gradient-to-br from-[#F7FAFC] via-white to-[#E8FBF7]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="inline-flex rounded-full border border-[#00C2A9]/30 bg-[#E8FBF7] px-4 py-2 text-sm font-semibold text-[#008F7C]">
              ERP Cloud pour le secteur de la restauration
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight text-[#1E2A38] sm:text-5xl lg:text-6xl">
              Pilotez votre restaurant avec un ERP
              <span className="text-[#00A990]"> intelligent et mobile.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              EnterpriseERP centralise la prospection, les clients, les devis,
              les factures, les paiements, le stock et les rapports dans une
              seule plateforme Cloud, Mobile et AI.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="rounded-xl bg-[#FF7A00] px-6 py-3.5 text-center font-semibold text-white shadow-lg transition hover:bg-[#e66e00]"
              >
                Demander une démonstration
              </a>

              <a
                href="https://enterpriseerp-2.onrender.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-[#1E2A38] transition hover:bg-slate-50"
              >
                Voir EnterpriseERP
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span>✓ Accessible partout</span>
              <span>✓ Données centralisées</span>
              <span>✓ Interface moderne</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-[#00C2A9]/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl">
              <div className="rounded-3xl bg-[#101A26] p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Tableau de bord restaurant
                    </p>
                    <h2 className="mt-1 text-xl font-bold">
                      Performance commerciale
                    </h2>
                  </div>

                  <div className="rounded-xl bg-[#00C2A9]/20 px-3 py-2 text-sm text-[#7FF2E1]">
                    Temps réel
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">Chiffre d’affaires</p>
                    <p className="mt-2 text-2xl font-bold">128 450 €</p>
                    <p className="mt-1 text-sm text-[#7FF2E1]">+18 %</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">Commandes</p>
                    <p className="mt-2 text-2xl font-bold">342</p>
                    <p className="mt-1 text-sm text-[#7FF2E1]">+9 %</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">Alertes stock</p>
                    <p className="mt-2 text-2xl font-bold">8</p>
                    <p className="mt-1 text-sm text-orange-300">
                      À réapprovisionner
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-slate-400">Factures dues</p>
                    <p className="mt-2 text-2xl font-bold">24</p>
                    <p className="mt-1 text-sm text-orange-300">
                      Suivi nécessaire
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#22364A] to-[#00A990] p-5">
                  <p className="font-semibold">Recommandation IA</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Priorisez les produits à forte rotation et relancez les
                    paiements arrivant à échéance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problemes" className="bg-[#F7F9FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-[#00A990]">
              Les défis du secteur
            </p>
            <h2 className="mt-4 text-3xl font-bold text-[#1E2A38] sm:text-4xl">
              Pourquoi la gestion quotidienne devient-elle complexe ?
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Lorsque les informations sont dispersées, le suivi commercial,
              opérationnel et financier devient difficile.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {problems.map((problem) => (
              <FeatureCard key={problem.title} {...problem} />
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-[#00A990]">
              Une solution centralisée
            </p>
            <h2 className="mt-4 text-3xl font-bold text-[#1E2A38] sm:text-4xl">
              Tous les modules nécessaires dans une seule plateforme
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <FeatureCard key={module.title} {...module} />
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="bg-[#101A26] py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-widest text-[#6EE7D8]">
              Démonstration
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Découvrez EnterpriseERP en action
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Consultez les indicateurs, gérez vos clients, ajoutez des
              produits, suivez vos factures et centralisez les informations
              essentielles depuis un seul tableau de bord.
            </p>

            <ul className="mt-8 space-y-4 text-slate-200">
              <li>✓ Vue globale de l’activité</li>
              <li>✓ Recherche et filtres intelligents</li>
              <li>✓ Alertes et statistiques en temps réel</li>
              <li>✓ Accès Cloud depuis ordinateur et mobile</li>
            </ul>

            <a
              href="https://enterpriseerp-2.onrender.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex rounded-xl bg-[#FF7A00] px-6 py-3.5 font-semibold text-white transition hover:bg-[#e66e00]"
            >
              Ouvrir la démonstration
            </a>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="rounded-2xl bg-white p-5 text-[#1E2A38]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Résultats du mois</p>
                  <p className="mt-1 text-2xl font-bold">Une vision claire</p>
                </div>

                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  +18 %
                </div>
              </div>

              <div className="mt-6 flex h-56 items-end gap-3 rounded-2xl bg-slate-50 p-5">
                {[35, 48, 42, 64, 57, 74, 88, 81, 96].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-[#1E2A38] to-[#00C2A9]"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tarifs" className="bg-[#F7F9FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-[#00A990]">
              Tarifs simples
            </p>
            <h2 className="mt-4 text-3xl font-bold text-[#1E2A38] sm:text-4xl">
              Une offre adaptée à votre organisation
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-3xl p-8 ${
                  plan.featured
                    ? "bg-[#1E2A38] text-white shadow-2xl"
                    : "border border-slate-200 bg-white text-[#1E2A38] shadow-sm"
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-6 top-6 rounded-full bg-[#00C2A9] px-3 py-1 text-xs font-bold text-white">
                    RECOMMANDÉ
                  </div>
                )}

                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p
                  className={`mt-2 text-sm ${
                    plan.featured ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {plan.description}
                </p>

                <p className="mt-8 text-3xl font-extrabold">{plan.price}</p>

                <ul
                  className={`mt-8 space-y-4 text-sm ${
                    plan.featured ? "text-slate-200" : "text-slate-600"
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-9 block rounded-xl px-5 py-3 text-center font-semibold transition ${
                    plan.featured
                      ? "bg-[#FF7A00] text-white hover:bg-[#e66e00]"
                      : "bg-[#1E2A38] text-white hover:bg-[#29394B]"
                  }`}
                >
                  Demander une démonstration
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[36px] bg-gradient-to-r from-[#1E2A38] to-[#00A990] px-8 py-14 text-center text-white shadow-2xl sm:px-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Prêt à moderniser la gestion de votre restaurant ?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Découvrez comment EnterpriseERP peut centraliser vos opérations,
              améliorer votre suivi commercial et vous faire gagner du temps.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="mailto:contact@enterpriseerp.com?subject=Demande de démonstration EnterpriseERP Restauration"
                className="rounded-xl bg-[#FF7A00] px-6 py-3.5 font-semibold text-white transition hover:bg-[#e66e00]"
              >
                Demander une démonstration
              </a>

              <a
                href="https://enterpriseerp-2.onrender.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Voir la plateforme
              </a>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
