"use client";

import { FormEvent, useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";
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
  onSubmit,
}: {
  title: string;
  fields: FormField[];
  submitLabel?: string;
  onSubmit?: (values: Record<string, string>) => Promise<void> | void;
}) {
  const { locale } = useI18n();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const tFixed = (value: string) => translateContentText(translateFixedLabel(value, locale), locale);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setSaved(false);
    setSubmitting(true);

    const formData = new FormData(form);
    const values = Object.fromEntries(
      fields.map((field) => [field.label, String(formData.get(field.label) ?? "").trim()])
    );

    try {
      await onSubmit?.(values);
      setSaved(true);
      form.reset();
    } catch (submitError) {
      setSaved(false);
      setError(submitError instanceof Error ? submitError.message : "Unable to save. Check the information.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-night">{tFixed(title)}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
          {tFixed("FormModal")}
        </span>
      </div>

      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className="block">
            <span className="text-sm font-black text-slate-700">{tFixed(field.label)}</span>
            <input
              name={field.label}
              type={field.type ?? "text"}
              placeholder={field.placeholder ? tFixed(field.placeholder) : undefined}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            />
          </label>
        ))}

        <div className="md:col-span-2">
          <button type="submit" className="rounded-xl bg-[#FF7A00] px-6 py-3 font-black text-white shadow">
            {submitting ? tFixed("Saving...") : tFixed(submitLabel)}
          </button>
          {saved && !error && <span className="ml-3 text-sm font-black text-[#00A693]">{tFixed("Enregistre.")}</span>}
          {error && <span className="ml-3 text-sm font-black text-red-600">{tFixed(error)}</span>}
        </div>
      </form>
    </section>
  );
}
