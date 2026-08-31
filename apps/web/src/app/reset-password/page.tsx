"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiClient } from "../../shared/api/client";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function ResetPasswordPage() {
  const { locale, t } = useI18n();
  const tx = (value: string) => translateContentText(value, locale);
  const query = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);
  const [email, setEmail] = useState(query.get("email") ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await apiClient.post("/auth/reset-password", {
        email,
        code,
        password,
        confirmPassword,
      });
      setStatus("success");
      setMessage(tx(response.data?.message ?? "Mot de passe mis a jour avec succes."));
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setStatus("error");
      setMessage(tx(error?.response?.data?.message ?? "Le code est invalide ou expire."));
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-12 text-night">
      <section className="mx-auto max-w-xl rounded-[28px] bg-white p-8 shadow-2xl ring-1 ring-slate-200 lg:p-12">
        <a href="/" className="text-sm font-black text-[#00A693]">EnterpriseERP Cloud</a>
        <div className="mt-5"><LanguageSwitcher /></div>
        <h1 className="mt-8 text-4xl font-black">{t("auth.resetTitle")}</h1>
        <p className="mt-4 leading-8 text-slate-600">{t("auth.resetText")}</p>

        {message && (
          <div className={`mt-6 rounded-2xl p-4 text-sm font-bold ${status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
            {message}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-black text-slate-700">{t("auth.email")}</span>
            <input
              name="email"
              autoComplete="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-700">{t("auth.code")}</span>
            <input
              name="one-time-code"
              autoComplete="one-time-code"
              required
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-700">{t("auth.newPassword")}</span>
            <input
              name="new-password"
              autoComplete="new-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-700">{t("auth.confirmPassword")}</span>
            <input
              name="confirm-password"
              autoComplete="new-password"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white disabled:opacity-60"
          >
            {status === "loading" ? t("auth.updating") : t("auth.update")}
          </button>
        </form>
      </section>
    </main>
  );
}
