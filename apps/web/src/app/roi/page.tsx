"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-[#00C2A9]">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full bg-transparent px-4 py-3 outline-none"
        />
        {suffix && <span className="bg-slate-50 px-4 py-3 text-sm font-black text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
}

export default function RoiPage() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(value, locale);
  const numberLocale = locale === "sv" ? "sv-SE" : locale === "en" ? "en-US" : "fr-FR";
  const [employees, setEmployees] = useState(12);
  const [adminHours, setAdminHours] = useState(8);
  const [invoices, setInvoices] = useState(120);
  const [lateRate, setLateRate] = useState(18);
  const [hourlyCost, setHourlyCost] = useState(32);

  const result = useMemo(() => {
    const weeklyAdminCost = employees * adminHours * hourlyCost;
    const automatedSavings = weeklyAdminCost * 0.42 * 52;
    const lateInvoiceCost = invoices * (lateRate / 100) * 18 * 12;
    const expectedRecovery = lateInvoiceCost * 0.35;
    const annualSavings = automatedSavings + expectedRecovery;
    const monthlyPlatformEstimate = 349;
    const paybackMonths = annualSavings > 0 ? (monthlyPlatformEstimate * 12 * 12) / annualSavings : 0;

    return {
      automatedSavings,
      expectedRecovery,
      annualSavings,
      paybackMonths,
    };
  }, [adminHours, employees, hourlyCost, invoices, lateRate]);

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
          {tx("Calculateur ROI")}
        </span>
        <h1 className="mt-6 text-5xl font-black">{tx("Estimez les economies annuelles avec EnterpriseERP.")}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          {tx("Ajustez vos volumes et voyez rapidement l'impact potentiel sur le temps administratif, les relances et le retour sur investissement.")}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <section className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
            <h2 className="text-2xl font-black">{tx("Vos donnees")}</h2>
            <div className="mt-6 grid gap-5">
              <Field label={tx("Nombre d'employes")} value={employees} onChange={setEmployees} />
              <Field label={tx("Heures administratives par employe / semaine")} value={adminHours} onChange={setAdminHours} suffix="h" />
              <Field label={tx("Factures mensuelles")} value={invoices} onChange={setInvoices} />
              <Field label={tx("Factures en retard")} value={lateRate} onChange={setLateRate} suffix="%" />
              <Field label={tx("Cout horaire moyen")} value={hourlyCost} onChange={setHourlyCost} suffix="EUR" />
            </div>
          </section>

          <section className="rounded-3xl bg-[#101b2d] p-7 text-white shadow-xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7df5e5]">{tx("Projection")}</p>
            <h2 className="mt-3 text-3xl font-black">{tx("Valeur business estimee")}</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-sm text-white/65">{tx("Gain temps administratif")}</p>
                <p className="mt-2 text-3xl font-black">{Math.round(result.automatedSavings).toLocaleString(numberLocale)} EUR</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-sm text-white/65">{tx("Encaissements recuperables")}</p>
                <p className="mt-2 text-3xl font-black">{Math.round(result.expectedRecovery).toLocaleString(numberLocale)} EUR</p>
              </div>
              <div className="rounded-2xl bg-[#00C2A9] p-5 text-night sm:col-span-2">
                <p className="text-sm font-black uppercase">{tx("Economies annuelles estimees")}</p>
                <p className="mt-2 text-5xl font-black">{Math.round(result.annualSavings).toLocaleString(numberLocale)} EUR</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5 sm:col-span-2">
                <p className="text-sm text-white/65">{tx("Delai de retour estime")}</p>
                <p className="mt-2 text-3xl font-black">{Math.max(1, Math.round(result.paybackMonths)).toLocaleString(numberLocale)} {tx("mois")}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
