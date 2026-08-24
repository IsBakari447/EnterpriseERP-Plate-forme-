"use client";

import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";

export default function KPICard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: string;
}) {
  const { locale } = useI18n();
  const displayLabel = translateContentText(translateFixedLabel(label, locale), locale);
  const displayChange = change ? translateContentText(translateFixedLabel(change, locale), locale) : undefined;

  return (
    <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{displayLabel}</p>
      <p className="mt-3 text-3xl font-bold text-night">{value}</p>
      {displayChange && (
        <p className="mt-2 text-sm font-semibold text-turquoise">{displayChange}</p>
      )}
    </div>
  );
}
