"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import AlertPanel from "@shared/components/ui/AlertPanel";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function SecurityCenterPage() {
  const { locale } = useI18n();
  const tc = (value: string) => translateContentText(value, locale);

  return (
    <ERPLayout title={tc("Security Center")} subtitle={tc("Vue administrateur pour sessions, evenements, permissions sensibles et posture SaaS.")} action={tc("Lancer controle")}>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Score securite", value: "82%", change: "Bon" },
          { label: "Sessions actives", value: "8", change: "2 appareils mobiles" },
          { label: "Permissions sensibles", value: "11", change: "Finance / roles" },
          { label: "Evenements", value: "148", change: "24h" },
        ].map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_.9fr]">
        <div className="rounded-3xl bg-[#1E2A38] p-7 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8df8e8]">{tc("Security posture")}</p>
          <h2 className="mt-4 text-4xl font-black">{tc("Protegez les roles, exports, sessions et evenements sensibles.")}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["2FA: planifie", "Logs sans tokens", "RBAC actif", "Audit entreprise"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 p-4 font-black">{tc(item)}</div>
            ))}
          </div>
        </div>

        <AlertPanel
          alerts={[
            { title: tc("2FA recommande"), description: tc("Activez progressivement le 2FA pour Owner, Admin et Comptable."), level: "warning" },
            { title: tc("Exports financiers"), description: tc("Limiter audit.export aux roles Owner et Comptable."), level: "info" },
            { title: tc("Sessions mobiles"), description: tc("Deux sessions Android restent actives depuis plus de 14 jours."), level: "warning" },
          ]}
        />
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Sessions", "Voir et revoquer les appareils suspects."],
          ["Evenements securite", "Lire les changements de roles, exports et connexions."],
          ["Permissions sensibles", "Controler finance.export, audit.export et roles.manage."],
          ["2FA", "Preparation de l'activation prochaine."],
          ["Sauvegardes", "Suivre les backups et restaurations."],
          ["Conformite", "Journaliser les changements de configuration."],
        ].map(([title, text]) => (
          <article key={title} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-xl font-black text-night">{tc(title)}</h2>
            <p className="mt-3 leading-7 text-slate-500">{tc(text)}</p>
          </article>
        ))}
      </section>
    </ERPLayout>
  );
}
