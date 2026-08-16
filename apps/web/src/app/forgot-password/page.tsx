"use client";

import { FormEvent, useState } from "react";
import { apiClient } from "../../shared/api/client";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function ForgotPasswordPage() {
  const { locale, t } = useI18n();
  const tx = (value: string) => translateContentText(value, locale);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      setStatus("success");
      setMessage(tx(response.data?.message ?? "Un code de verification a ete envoye si le compte existe."));
    } catch {
      setStatus("error");
      setMessage(tx("Impossible d'envoyer la demande pour le moment."));
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-12 text-night">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200 lg:grid-cols-[.95fr_1.05fr]">
        <div className="bg-[#1E2A38] p-8 text-white lg:p-12">
          <a href="/" className="text-sm font-black text-[#00C2A9]">EnterpriseERP Cloud</a>
          <div className="mt-6"><LanguageSwitcher compact /></div>
          <h1 className="mt-10 text-4xl font-black leading-tight">{t("auth.forgotHero")}</h1>
          <p className="mt-5 leading-8 text-white/75">
            {t("auth.forgotText")}
          </p>
        </div>

        <form onSubmit={submit} className="p-8 lg:p-12">
          <h2 className="text-3xl font-black">{t("auth.forgotTitle")}</h2>
          <p className="mt-3 text-slate-600">{t("auth.forgotIntro")}</p>

          {message && (
            <div className={`mt-6 rounded-2xl p-4 text-sm font-bold ${status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
              {message}
            </div>
          )}

          <label className="mt-8 block text-sm font-black text-slate-700" htmlFor="email">{t("auth.email")}</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            placeholder="email@entreprise.com"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 w-full rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white disabled:opacity-60"
          >
            {status === "loading" ? t("auth.sending") : t("auth.sendCode")}
          </button>

          <div className="mt-6 flex flex-wrap gap-4">
            <a href="/reset-password" className="font-black text-[#00A693]">{t("auth.alreadyCode")}</a>
            <a href="/" className="font-black text-[#00A693]">{t("auth.backHome")}</a>
          </div>
        </form>
      </section>
    </main>
  );
}
