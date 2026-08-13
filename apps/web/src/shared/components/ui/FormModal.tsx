"use client";

import { FormEvent, useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";

export type FormField = {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "number" | "date";
};

export default function FormModal({
  title,
  fields,
  submitLabel = "Enregistrer",
}: {
  title: string;
  fields: FormField[];
  submitLabel?: string;
}) {
  const { locale } = useI18n();
  const [saved, setSaved] = useState(false);
  const tFixed = (value: string) => translateFixedLabel(value, locale);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-night">{tFixed(title)}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
          FormModal
        </span>
      </div>

      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className="block">
            <span className="text-sm font-black text-slate-700">{tFixed(field.label)}</span>
            <input
              type={field.type ?? "text"}
              placeholder={field.placeholder ? tFixed(field.placeholder) : undefined}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            />
          </label>
        ))}

        <div className="md:col-span-2">
          <button type="submit" className="rounded-xl bg-[#FF7A00] px-6 py-3 font-black text-white shadow">
            {tFixed(submitLabel)}
          </button>
          {saved && <span className="ml-3 text-sm font-black text-[#00A693]">{tFixed("Enregistre.")}</span>}
        </div>
      </form>
    </section>
  );
}
