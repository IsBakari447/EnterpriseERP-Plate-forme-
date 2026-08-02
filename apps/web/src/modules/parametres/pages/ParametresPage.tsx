"use client";

import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import Badge from "@shared/components/ui/Badge";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";
import { parametresKpis, settings } from "@modules/parametres/data";

export default function ParametresPage() {
  const { t } = useI18n();

  return (
    <ERPLayout
      title={t("settings.title")}
      subtitle={t("settings.subtitle")}
      action={t("common.save")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {parametresKpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="mb-5 text-xl font-bold text-night">{t("settings.company")}</h2>

          <div className="mb-5">
            <LanguageSwitcher />
          </div>

          <div className="space-y-4">
            {settings.map((item) => (
              <div key={item.label}>
                <label className="text-sm text-slate-500">{item.label}</label>
                <input
                  value={item.value}
                  readOnly
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="mb-5 text-xl font-bold text-night">{t("settings.security")}</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span>{t("settings.2fa")}</span>
              <Badge color="green">{t("settings.enabled")}</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span>{t("settings.audit")}</span>
              <Badge color="green">{t("settings.auditEnabled")}</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span>{t("settings.backups")}</span>
              <Badge color="cyan">{t("settings.daily")}</Badge>
            </div>
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
