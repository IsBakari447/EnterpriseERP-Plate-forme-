"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";

function actionHref(action: string) {
  const value = action.toLowerCase();

  if (value.includes("audit")) return "/audit";
  if (value.includes("role")) return "/modules/roles-permissions";
  if (value.includes("stock") || value.includes("commande")) return "/stock";
  if (value.includes("facture") || value.includes("relancer") || value.includes("signer") || value.includes("export")) return "/facturation";
  if (value.includes("email")) return "/ai-sales-agent";
  if (value.includes("budget")) return "/modules/budgets";
  if (value.includes("carte")) return "/modules/itineraires";

  return "";
}

export default function AIRecommendation({
  title = "Recommandation IA",
  text,
  actions = [],
}: {
  title?: string;
  text: string;
  actions?: string[];
}) {
  const { locale } = useI18n();
  const [applied, setApplied] = useState<string | null>(null);
  const tFixed = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <section className="rounded-2xl bg-[#1E2A38] p-6 text-white shadow ring-1 ring-slate-800">
      <div className="inline-flex rounded-full bg-[#00C2A9]/15 px-3 py-1 text-xs font-black text-[#00C2A9]">
        IA
      </div>
      <h2 className="mt-4 text-xl font-black">{tFixed(title)}</h2>
      <p className="mt-3 leading-7 text-white/75">{tFixed(text)}</p>
      {actions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {actions.map((action) => (
            actionHref(action) ? (
              <Link key={action} href={actionHref(action)} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20">
                {tFixed(action)}
              </Link>
            ) : (
              <button key={action} type="button" onClick={() => setApplied(action)} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20">
                {applied === action ? tFixed("Applique") : tFixed(action)}
              </button>
            )
          ))}
        </div>
      )}
    </section>
  );
}
