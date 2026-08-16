"use client";

import { customerSegments } from "@modules/cloud-market/data";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function CustomersPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <span className="rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
          {t("customers.badge")}
        </span>
        <h1 className="mt-6 text-5xl font-black">{t("customers.title")}</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {customerSegments.map((segment, index) => (
            <article key={segment.name} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
              <h2 className="text-2xl font-black">{t(`customers.${index}.name`)}</h2>
              <p className="mt-4 leading-7 text-slate-600">{t(`customers.${index}.need`)}</p>
              <p className="mt-5 rounded-2xl bg-slate-50 p-4 font-bold text-[#00A693]">{t(`customers.${index}.value`)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
