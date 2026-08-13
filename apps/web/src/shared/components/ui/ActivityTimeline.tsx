"use client";

import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";

export type ActivityItem = {
  title: string;
  description: string;
  date: string;
};

export default function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  const { locale } = useI18n();
  const tFixed = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  return (
    <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="text-xl font-black text-night">{tFixed("Activites")}</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <article key={`${item.title}-${item.date}`} className="relative pl-6">
            <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#00C2A9]" />
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black text-night">{tFixed(item.title)}</h3>
                <span className="text-xs font-bold text-slate-400">{item.date}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{tFixed(item.description)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
