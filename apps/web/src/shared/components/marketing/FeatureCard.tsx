"use client";

import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const { locale } = useI18n();

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8FBF7] text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#1E2A38]">{translateContentText(title, locale)}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{translateContentText(description, locale)}</p>
    </article>
  );
}
