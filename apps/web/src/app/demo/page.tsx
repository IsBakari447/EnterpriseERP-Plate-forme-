"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { demoHighlights } from "@modules/cloud-market/data";
import { apiClient } from "@shared/api/client";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";

type DemoForm = {
  name: string;
  email: string;
  need: string;
};

type DemoResponse = {
  success: boolean;
  message: string;
};

const initialForm: DemoForm = {
  name: "",
  email: "",
  need: "",
};

const demoSectors = ["general", "retail", "restaurant", "construction", "healthcare"] as const;

export default function DemoPage() {
  const { t } = useI18n();
  const [form, setForm] = useState<DemoForm>(initialForm);
  const [sector, setSector] = useState<(typeof demoSectors)[number]>("general");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const walkthrough = useMemo(
    () => [
      { title: t("demo.step.dashboard"), text: t("demo.step.dashboardText"), metric: sector === "restaurant" ? "286 tickets" : "482 300 EUR" },
      { title: t("demo.step.crm"), text: t("demo.step.crmText"), metric: "1 208" },
      { title: t("demo.step.inventory"), text: t("demo.step.inventoryText"), metric: "17" },
      { title: t("demo.step.billing"), text: t("demo.step.billingText"), metric: "48 200 EUR" },
    ],
    [sector, t]
  );

  const updateField = (field: keyof DemoForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await apiClient.post<DemoResponse>("/demo/requests", { ...form, sector });

      if (!response.data.success) {
        setStatus("error");
        setMessage(response.data.message);
        return;
      }

      setStatus("success");
      setMessage(response.data.message);
      setForm(initialForm);
      setSector("general");
    } catch {
      setStatus("error");
      setMessage(t("demo.error"));
    }
  };

  const resetDemo = () => {
    setForm(initialForm);
    setSector("general");
    setStatus("idle");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_.9fr]">
        <div>
          <span className="rounded-lg bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
            {t("demo.badge")}
          </span>
          <div className="mt-5"><LanguageSwitcher /></div>
          <h1 className="mt-6 text-5xl font-black">{t("demo.title")}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {t("demo.text")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/dashboard?sector=${sector}`} className="rounded-2xl bg-[#FF7A00] px-5 py-3 font-black text-white">
              {t("demo.tryNow")}
            </Link>
            <button type="button" onClick={resetDemo} className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-black text-night">
              {t("demo.reset")}
            </button>
          </div>
          <div className="mt-8 grid gap-3">
            {demoHighlights.map((item) => (
              <div key={item} className="rounded-lg bg-white p-5 font-bold shadow ring-1 ring-slate-200">
                {t(`demo.highlight.${demoHighlights.indexOf(item)}`)}
              </div>
            ))}
          </div>

          <section className="mt-8 rounded-2xl bg-[#1E2A38] p-6 text-white">
            <label className="text-sm font-black uppercase tracking-[0.18em] text-[#8df8e8]" htmlFor="demo-sector">
              {t("demo.sector")}
            </label>
            <select
              id="demo-sector"
              value={sector}
              onChange={(event) => setSector(event.target.value as (typeof demoSectors)[number])}
              className="mt-3 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-black outline-none"
            >
              {demoSectors.map((item) => (
                <option key={item} value={item} className="text-night">
                  {t(`demo.sector.${item}`)}
                </option>
              ))}
            </select>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {walkthrough.map((step) => (
                <article key={step.title} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#8df8e8]">{step.metric}</p>
                  <h2 className="mt-2 font-black">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">{step.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <form onSubmit={submit} className="rounded-lg bg-white p-7 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black">{t("demo.formTitle")}</h2>
          <p className="mt-2 text-sm text-slate-500">
            {t("demo.formText")}
          </p>

          <label className="mt-5 block text-sm font-black text-slate-600" htmlFor="demo-name">
            {t("demo.name")}
          </label>
          <input
            id="demo-name"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3"
            placeholder="Votre nom"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />

          <label className="mt-4 block text-sm font-black text-slate-600" htmlFor="demo-email">
            {t("demo.email")}
          </label>
          <input
            id="demo-email"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3"
            placeholder="vous@entreprise.com"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />

          <label className="mt-4 block text-sm font-black text-slate-600" htmlFor="demo-need">
            {t("demo.need")}
          </label>
          <textarea
            id="demo-need"
            className="mt-2 min-h-32 w-full rounded-lg border border-slate-200 px-4 py-3"
            placeholder="CRM, facturation, stock, mobile, integrations..."
            value={form.need}
            onChange={(event) => updateField("need", event.target.value)}
            required
          />

          <button
            className="mt-5 w-full rounded-lg bg-[#FF7A00] px-6 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? t("demo.sending") : t("demo.submit")}
          </button>

          {message && (
            <p
              className={`mt-4 rounded-lg px-4 py-3 text-sm font-bold ${
                status === "success"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-red-50 text-red-700 ring-1 ring-red-200"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
