"use client";

import Link from "next/link";
import { useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";

const emailTemplates = [
  "Commerce: relance apres visite boutique",
  "Services: proposition de diagnostic ERP",
  "Restaurant: message pour reserver une demo",
  "Construction: suivi devis chantier",
  "Sante: presentation solution administrative",
  "Education: automatisation frais scolaires",
];

const scripts = [
  "Appel de prospection en 45 secondes",
  "Reponse objection prix",
  "Presentation rapide EnterpriseERP",
  "Relance devis sans reponse",
];

export default function AiSalesAgentPage() {
  const { t } = useI18n();
  const [sector, setSector] = useState("Commerce");
  const [channel, setChannel] = useState("Email");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState(
    "Bonjour, je vous contacte car beaucoup de PME perdent du temps entre CRM, factures, stock et relances. EnterpriseERP centralise ces operations dans une plateforme Cloud avec assistant IA. Seriez-vous disponible pour une courte demonstration cette semaine ?"
  );
  const [copied, setCopied] = useState(false);

  function generate() {
    setOutput(
      `Canal ${channel} - secteur ${sector}: EnterpriseERP aide votre organisation a centraliser CRM, ventes, facturation et priorites IA. ${context || "Je vous propose une courte demonstration adaptee a votre activite cette semaine."}`
    );
  }

  async function copyOutput() {
    await navigator.clipboard?.writeText(output);
    setCopied(true);
  }

  return (
    <ERPLayout title="AI Sales Agent" subtitle={t("salesAgent.subtitle")} action={t("salesAgent.action")}>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t("salesAgent.generatedEmails"), value: "126", change: "+24%" },
          { label: t("salesAgent.linkedinMessages"), value: "58", change: "+18%" },
          { label: t("salesAgent.whatsappMessages"), value: "74", change: "+31%" },
          { label: t("salesAgent.followups"), value: "39", change: "+12%" },
        ].map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#00A693]">Prospection IA</p>
          <h2 className="mt-3 text-3xl font-black text-night">{t("salesAgent.generatorTitle")}</h2>
          <p className="mt-3 leading-7 text-slate-500">{t("salesAgent.generatorText")}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label>
              <span className="text-sm font-black text-slate-700">{t("salesAgent.sector")}</span>
              <select value={sector} onChange={(event) => setSector(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-[#00C2A9]">
                <option>Commerce</option>
                <option>Restauration</option>
                <option>Services</option>
                <option>Construction</option>
                <option>Sante</option>
                <option>Education</option>
              </select>
            </label>
            <label>
              <span className="text-sm font-black text-slate-700">{t("salesAgent.channel")}</span>
              <select value={channel} onChange={(event) => setChannel(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-[#00C2A9]">
                <option>Email</option>
                <option>LinkedIn</option>
                <option>WhatsApp</option>
                <option>Telephone</option>
              </select>
            </label>
          </div>

          <textarea
            rows={6}
            value={context}
            onChange={(event) => setContext(event.target.value)}
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none focus:border-[#00C2A9]"
            placeholder={t("salesAgent.contextPlaceholder")}
          />
          <button type="button" onClick={generate} className="mt-4 rounded-2xl bg-[#FF7A00] px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20">
            {t("salesAgent.generate")}
          </button>
        </div>

        <div className="rounded-3xl bg-[#1E2A38] p-6 text-white shadow-xl">
          <h2 className="text-2xl font-black">{t("salesAgent.outputTitle")}</h2>
          <div className="mt-5 rounded-2xl bg-white/10 p-5 leading-7 text-white/80">
            {output}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={copyOutput} className="rounded-xl bg-white px-4 py-2 text-sm font-black text-night">
              {copied ? "Copie" : "Copier"}
            </button>
            <Link href="/modules/notifications" className="rounded-xl bg-white px-4 py-2 text-sm font-black text-night">
              Creer relance
            </Link>
            <Link href="/crm" className="rounded-xl bg-white px-4 py-2 text-sm font-black text-night">
              Envoyer au CRM
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("salesAgent.templates")}</h2>
          <div className="mt-5 grid gap-3">
            {emailTemplates.map((template) => (
              <button key={template} type="button" onClick={() => setContext(template)} className="rounded-2xl bg-slate-50 p-4 text-left font-bold text-slate-700 transition hover:bg-cyan-50">
                {template}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("salesAgent.scripts")}</h2>
          <div className="mt-5 grid gap-3">
            {scripts.map((script) => (
              <button key={script} type="button" onClick={() => setContext(script)} className="rounded-2xl bg-slate-50 p-4 text-left font-bold text-slate-700 transition hover:bg-cyan-50">
                {script}
              </button>
            ))}
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
