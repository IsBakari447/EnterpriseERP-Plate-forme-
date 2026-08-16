"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import { useI18n } from "@shared/i18n/I18nProvider";

const supportAnswers = [
  {
    keywords: ["facture", "paiement", "payer", "invoice", "payment"],
    titleKey: "support.answer.billing.title",
    answerKey: "support.answer.billing.text",
    links: [
      { labelKey: "support.link.billing", href: "/facturation" },
      { labelKey: "support.link.payments", href: "/modules/paiements" },
    ],
  },
  {
    keywords: ["stock", "produit", "rupture", "sku", "inventory"],
    titleKey: "support.answer.stock.title",
    answerKey: "support.answer.stock.text",
    links: [
      { labelKey: "support.link.stock", href: "/stock" },
      { labelKey: "support.link.products", href: "/modules/produits" },
    ],
  },
  {
    keywords: ["client", "crm", "prospect", "relance", "sales"],
    titleKey: "support.answer.crm.title",
    answerKey: "support.answer.crm.text",
    links: [
      { labelKey: "support.link.crm", href: "/crm" },
      { labelKey: "support.link.salesAgent", href: "/ai-sales-agent" },
    ],
  },
  {
    keywords: ["role", "permission", "utilisateur", "securite", "access"],
    titleKey: "support.answer.permissions.title",
    answerKey: "support.answer.permissions.text",
    links: [
      { labelKey: "support.link.governance", href: "/gouvernance" },
      { labelKey: "support.link.roles", href: "/modules/roles-permissions" },
    ],
  },
  {
    keywords: ["rapport", "bilan", "activite", "analyse", "dashboard"],
    titleKey: "support.answer.reports.title",
    answerKey: "support.answer.reports.text",
    links: [
      { labelKey: "support.link.dashboard", href: "/dashboard" },
      { labelKey: "support.link.reports", href: "/modules/rapports" },
    ],
  },
];

export default function SupportPage() {
  const { t } = useI18n();
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");

  const response = useMemo(() => {
    const normalized = submittedQuestion.toLowerCase();

    return (
      supportAnswers.find((item) =>
        item.keywords.some((keyword) => normalized.includes(keyword))
      ) ?? {
        titleKey: "support.defaultTitle",
        answerKey: "support.defaultAnswer",
        links: [
          { labelKey: "support.openDashboard", href: "/dashboard" },
          { labelKey: "support.link.aiStudio", href: "/ai-studio" },
        ],
      }
    );
  }, [submittedQuestion, t]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuestion(question.trim() || t("support.defaultQuestion"));
  }

  return (
    <ERPLayout title={t("support.title")} subtitle={t("support.subtitle")} action={t("support.action")}>
      <section className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-3xl bg-gradient-to-br from-[#1E2A38] via-[#15253a] to-[#00A990] p-7 text-white shadow-xl">
          <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black">
            {t("support.robotBadge")}
          </div>
          <h2 className="mt-6 text-4xl font-black">{t("support.robotTitle")}</h2>
          <p className="mt-4 leading-8 text-white/75">{t("support.robotText")}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["support.quick.billing", "facture"],
              ["support.quick.crm", "crm"],
              ["support.quick.stock", "stock"],
              ["support.quick.permissions", "permission"],
            ].map(([labelKey, value]) => (
              <button
                key={labelKey}
                type="button"
                onClick={() => {
                  setQuestion(t(labelKey));
                  setSubmittedQuestion(value);
                }}
                className="rounded-2xl bg-white/10 p-4 text-left font-black transition hover:bg-white/15"
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <form onSubmit={submit}>
            <label className="block">
              <span className="text-sm font-black text-slate-700">{t("support.questionLabel")}</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={5}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none focus:border-[#00C2A9] focus:bg-white"
                placeholder={t("support.placeholder")}
              />
            </label>
            <button type="submit" className="mt-4 rounded-2xl bg-[#FF7A00] px-6 py-3 font-black text-white shadow-lg shadow-orange-500/20">
              {t("support.ask")}
            </button>
          </form>

          {submittedQuestion && (
            <article className="mt-6 rounded-3xl border border-[#00C2A9]/20 bg-[#00C2A9]/5 p-5">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#008f7d]">{t("support.aiSupport")}</p>
              <h3 className="mt-2 text-2xl font-black text-night">{t(response.titleKey)}</h3>
              <p className="mt-3 leading-7 text-slate-600">{t(response.answerKey)}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {response.links.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-xl bg-white px-4 py-2 text-sm font-black text-night shadow ring-1 ring-slate-200">
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </article>
          )}
        </div>
      </section>
    </ERPLayout>
  );
}
