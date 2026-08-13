"use client";

import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";

export type DetailItem = {
  label: string;
  value: string;
};

export default function DetailsDrawer({
  title,
  description,
  details,
}: {
  title: string;
  description?: string;
  details: DetailItem[];
}) {
  const { locale } = useI18n();
  const tFixed = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <aside className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-night">{tFixed(title)}</h2>
          {description && <p className="mt-2 text-sm leading-6 text-slate-600">{tFixed(description)}</p>}
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
          {tFixed("Details")}
        </span>
      </div>

      <dl className="mt-5 space-y-3">
        {details.map((detail) => (
          <div key={detail.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <dt className="text-xs font-black uppercase tracking-wide text-slate-400">{tFixed(detail.label)}</dt>
            <dd className="mt-1 font-bold text-slate-700">{tFixed(detail.value)}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
