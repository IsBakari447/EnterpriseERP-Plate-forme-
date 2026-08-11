"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { sectorDefinitions, sectorOptions } from "@config/sectors";
import { useI18n } from "@shared/i18n/I18nProvider";
import type { ModuleKey, SectorKey } from "@shared/sector/types";

type OnboardingStep = {
  key: string;
};

const steps: OnboardingStep[] = [
  { key: "company" },
  { key: "sector" },
  { key: "settings" },
  { key: "modules" },
  { key: "users" },
  { key: "import" },
];

function getInitialSector(): SectorKey {
  if (typeof window === "undefined") return "general";
  const params = new URLSearchParams(window.location.search);
  const value = params.get("sector");
  return value && value in sectorDefinitions ? (value as SectorKey) : "general";
}

export default function OnboardingPage() {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [sector, setSector] = useState<SectorKey>(getInitialSector);
  const [company, setCompany] = useState("EnterpriseERP");
  const [country, setCountry] = useState("Suede");
  const [currency, setCurrency] = useState("EUR");
  const [invites, setInvites] = useState("manager@entreprise.com");
  const [importStatus, setImportStatus] = useState("");
  const [selectedModules, setSelectedModules] = useState<ModuleKey[]>(() =>
    sectorDefinitions[getInitialSector()].modules.slice(0, 8)
  );

  const sectorConfig = sectorDefinitions[sector];
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const recommendedModules = useMemo(
    () => sectorConfig.modules.filter((module) => !["dashboard", "parametres"].includes(module)),
    [sectorConfig.modules]
  );

  function toggleModule(module: ModuleKey) {
    setSelectedModules((current) =>
      current.includes(module) ? current.filter((item) => item !== module) : [...current, module]
    );
  }

  function changeSector(nextSector: SectorKey) {
    setSector(nextSector);
    setSelectedModules(sectorDefinitions[nextSector].modules.slice(0, 8));
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-10 text-night lg:px-16">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
          <aside className="rounded-3xl bg-[#1E2A38] p-7 text-white shadow-xl">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#7df5e5]">
              {t("onboarding.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight">{t("onboarding.title")}</h1>
            <p className="mt-4 leading-8 text-white/70">
              {t("onboarding.subtitle")}
            </p>

            <div className="mt-8 rounded-2xl bg-white/10 p-4">
              <div className="flex items-center justify-between text-sm font-black">
                <span>{t("onboarding.progress")}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[#00C2A9]" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {steps.map((step, index) => (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`w-full rounded-2xl p-4 text-left transition ${
                    index === currentStep ? "bg-white text-night" : "bg-white/5 text-white/75 hover:bg-white/10"
                  }`}
                >
                  <p className="text-sm font-black">{t("onboarding.step")} {index + 1}</p>
                  <p className="mt-1 font-black">{t(`onboarding.${step.key}.title`)}</p>
                  <p className="mt-1 text-sm opacity-70">{t(`onboarding.${step.key}.description`)}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#00A693]">
                  {t("onboarding.step")} {currentStep + 1} / {steps.length}
                </p>
                <h2 className="mt-2 text-3xl font-black">{t(`onboarding.${steps[currentStep].key}.title`)}</h2>
                <p className="mt-2 text-slate-500">{t(`onboarding.${steps[currentStep].key}.description`)}</p>
              </div>
              <Link href="/dashboard" className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:border-[#00C2A9]">
                {t("onboarding.skip")}
              </Link>
            </div>

            <div className="mt-8">
              {currentStep === 0 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-black text-slate-700">{t("onboarding.companyName")}</span>
                    <input value={company} onChange={(event) => setCompany(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-[#00C2A9]" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-black text-slate-700">{t("onboarding.workspace")}</span>
                    <input value={`${company.toLowerCase().replaceAll(" ", "-")}.enterpriseerp.cloud`} readOnly className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-500" />
                  </label>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid gap-4 md:grid-cols-3">
                  {sectorOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => changeSector(option.key)}
                      className={`rounded-3xl border p-5 text-left transition ${
                        sector === option.key ? "border-[#00C2A9] bg-[#00C2A9]/10" : "border-slate-200 bg-slate-50 hover:border-[#00C2A9]"
                      }`}
                    >
                      <p className="text-3xl">{option.icon}</p>
                      <h3 className="mt-3 font-black">{t(`sector.${option.key}`)}</h3>
                      <p className="mt-2 text-sm font-semibold text-slate-500">{t(`sector.${option.key}.description`)}</p>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid gap-5 md:grid-cols-3">
                  <label className="block">
                    <span className="text-sm font-black text-slate-700">{t("onboarding.country")}</span>
                    <select value={country} onChange={(event) => setCountry(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-[#00C2A9]">
                      {["Suede", "France", "RDC", "Belgique", "Canada"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-black text-slate-700">{t("onboarding.currency")}</span>
                    <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-[#00C2A9]">
                      {["EUR", "SEK", "USD", "CDF"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="font-black">{t("onboarding.taxTitle")}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-500">{t("onboarding.taxText")}</p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid gap-3 md:grid-cols-3">
                  {recommendedModules.map((module) => (
                    <button
                      key={module}
                      type="button"
                      onClick={() => toggleModule(module)}
                      className={`rounded-2xl border p-4 text-left text-sm font-black transition ${
                        selectedModules.includes(module) ? "border-[#00C2A9] bg-[#00C2A9]/10 text-[#008f7d]" : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {t(`nav.${module}`)}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
                  <label className="block">
                    <span className="text-sm font-black text-slate-700">{t("onboarding.invites")}</span>
                    <textarea value={invites} onChange={(event) => setInvites(event.target.value)} rows={8} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-[#00C2A9]" />
                  </label>
                  <div className="space-y-3">
                    {["Owner", "Manager", "Comptable", "RH", "Employe"].map((role) => (
                      <div key={role} className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-black">{role}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{t("onboarding.roleText")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="grid gap-5 md:grid-cols-3">
                  {[
                    [t("nav.clients"), t("onboarding.importClients")],
                    [t("nav.produits"), t("onboarding.importProducts")],
                    [t("nav.facturation"), t("onboarding.importInvoices")],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
                      <h3 className="text-xl font-black">{title}</h3>
                      <p className="mt-2 text-sm font-semibold text-slate-500">{text}</p>
                      <button type="button" onClick={() => setImportStatus(`${title}: fichier pret a importer.`)} className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow ring-1 ring-slate-200">
                        {t("onboarding.chooseFile")}
                      </button>
                    </div>
                  ))}
                  {importStatus && <p className="md:col-span-3 rounded-2xl bg-[#00C2A9]/10 p-4 font-black text-[#008f7d]">{importStatus}</p>}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
                className="rounded-2xl border border-slate-200 px-6 py-3 font-black text-slate-700 disabled:opacity-40"
                disabled={currentStep === 0}
              >
                {t("onboarding.back")}
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((step) => Math.min(steps.length - 1, step + 1))}
                  className="rounded-2xl bg-[#FF7A00] px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20"
                >
                  {t("onboarding.continue")}
                </button>
              ) : (
                <Link href="/dashboard" className="rounded-2xl bg-[#00A693] px-6 py-3 text-center font-black text-white shadow-lg shadow-emerald-500/20">
                  {t("onboarding.openDashboard")}
                </Link>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
