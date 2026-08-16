"use client";

import { useEffect, useMemo, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import Badge from "@shared/components/ui/Badge";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";
import { parametresKpis, settings } from "@modules/parametres/data";
import { companyService, type CompanyDto } from "@modules/company/services/company.service";
import { settingsService, type SettingsKpi } from "../services/settings.service";

export default function ParametresPage() {
  const { t } = useI18n();
  const [kpis, setKpis] = useState<SettingsKpi[]>(parametresKpis);
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [security, setSecurity] = useState({
    twoFactor: true,
    audit: true,
    backups: "daily",
  });

  useEffect(() => {
    async function loadSettings() {
      const [summary, companyData] = await Promise.all([
        settingsService.getSummary(),
        companyService.getCurrent().catch(() => null),
      ]);

      setKpis(summary.kpis);
      setSecurity(summary.security);
      setCompany(companyData);
    }

    loadSettings();
  }, []);

  const settingsRows = useMemo(
    () => [
      { labelKey: "settings.companyName", value: company?.name ?? settings[0].value },
      { labelKey: "settings.mainLanguage", value: company?.language ? t(`locale.${company.language}`) : t("locale.fr") },
      { labelKey: "settings.currency", value: company?.currency ?? "EUR" },
      { labelKey: "settings.timezone", value: company?.timezone ?? settings[3].value },
    ],
    [company, t]
  );

  return (
    <ERPLayout
      title={t("settings.title")}
      subtitle={t("settings.subtitle")}
      action={t("common.save")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.labelKey}
            label={t(kpi.labelKey)}
            value={kpi.value}
            change={kpi.changeKey ? t(kpi.changeKey) : undefined}
          />
        ))}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="mb-5 text-xl font-bold text-night">{t("settings.company")}</h2>

          <div className="mb-5">
            <LanguageSwitcher />
          </div>

          <div className="space-y-4">
            {settingsRows.map((item) => (
              <div key={item.labelKey}>
                <label className="text-sm text-slate-500">{t(item.labelKey)}</label>
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
              <Badge color={security.twoFactor ? "green" : "yellow"}>
                {security.twoFactor ? t("settings.enabled") : t("common.disabled")}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span>{t("settings.audit")}</span>
              <Badge color={security.audit ? "green" : "yellow"}>
                {security.audit ? t("settings.auditEnabled") : t("common.disabled")}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span>{t("settings.backups")}</span>
              <Badge color="cyan">{security.backups === "daily" ? t("settings.daily") : security.backups}</Badge>
            </div>
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
