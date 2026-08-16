"use client";

import { useI18n } from "@shared/i18n/I18nProvider";

const securityBlocks = [
  {
    title: "Chiffrement et transport",
    badge: "Disponible",
    description: "Les connexions web utilisent HTTPS/TLS sur l'hebergement cloud afin de proteger les echanges entre navigateur, API et services.",
  },
  {
    title: "Isolation tenant",
    badge: "Disponible",
    description: "Les donnees metier sont structurees par entreprise afin de preparer une isolation stricte par companyId sur les routes sensibles.",
  },
  {
    title: "Roles et permissions",
    badge: "Beta",
    description: "Les roles, permissions et guards serveur sont en place pour limiter l'acces selon le profil utilisateur et le module.",
  },
  {
    title: "Sessions et appareils",
    badge: "Disponible",
    description: "Chaque utilisateur dispose d'un espace securite pour suivre les sessions actives, changer son mot de passe et deconnecter les appareils.",
  },
  {
    title: "Journalisation et audit",
    badge: "Beta",
    description: "Les evenements sensibles sont prepares pour l'audit: connexions, changements de role, exports, paiements et modifications critiques.",
  },
  {
    title: "Sauvegarde et restauration",
    badge: "Prevu",
    description: "La politique de sauvegarde, retention et restauration sera documentee par environnement avant toute promesse de conformite specifique.",
  },
  {
    title: "Sous-traitants et hebergement",
    badge: "Prevu",
    description: "Une fiche de transparence listant hebergement, stockage, email, monitoring et fournisseurs externes sera ajoutee au Trust Center.",
  },
  {
    title: "Gestion des incidents",
    badge: "Prevu",
    description: "Le processus incident couvrira detection, communication client, correction, post-mortem et prevention des repetitions.",
  },
];

function badgeClass(badge: string) {
  if (badge === "Disponible") return "bg-emerald-50 text-emerald-700";
  if (badge === "Beta") return "bg-cyan-50 text-cyan-700";
  return "bg-slate-100 text-slate-600";
}

export default function SecurityPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
          {t("securityPage.badge")}
        </span>
        <h1 className="mt-6 text-5xl font-black">{t("securityPage.title")}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {t("securityPage.subtitle")}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {securityBlocks.map((item, index) => (
            <article key={item.title} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-black">{t(`securityPage.block.${index}.title`)}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${badgeClass(item.badge)}`}>
                  {t(`securityPage.status.${item.badge}`)}
                </span>
              </div>
              <p className="mt-3 leading-7 text-slate-600">{t(`securityPage.block.${index}.description`)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
