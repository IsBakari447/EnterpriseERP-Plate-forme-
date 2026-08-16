"use client";

import { faqs } from "@modules/cloud-market/data";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function FaqPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-5xl font-black">{t("faq.title")}</h1>
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <article key={faq.question} className="rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
              <h2 className="text-xl font-black">{t(`faq.${index}.question`)}</h2>
              <p className="mt-3 leading-7 text-slate-600">{t(`faq.${index}.answer`)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
