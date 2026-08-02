"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@modules/auth/components/AuthShell";
import { authService } from "@modules/auth/services/auth.service";
import { useI18n } from "@shared/i18n/I18nProvider";
import { sectorOptions } from "@config/sectors";

export default function RegisterPage() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sector, setSector] = useState("general");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      await authService.register({
        companyName,
        name,
        email,
        password,
        sector,
        language: locale,
      });
      router.push("/dashboard");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AuthShell
      eyebrow="EnterpriseERP SaaS"
      title={t("auth.registerTitle")}
      text={t("auth.registerHero")}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <h2 className="text-3xl font-black">{t("auth.registerTitle")}</h2>
          <p className="mt-2 text-slate-600">{t("auth.hasAccount")}{" "}
            <Link href="/login" className="font-black text-[#00A693]">
              {t("auth.goLogin")}
            </Link>
          </p>
        </div>

        {status === "error" && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">
            {t("auth.registerError")}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-black text-slate-700">{t("auth.companyName")}</span>
          <input
            required
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            placeholder="Entreprise SARL"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-slate-700">{t("auth.fullName")}</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            placeholder="Issa Bakari"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-slate-700">{t("auth.email")}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
            placeholder="admin@entreprise.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-slate-700">{t("auth.password")}</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-slate-700">Secteur</span>
          <select
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 font-bold outline-none focus:border-[#00C2A9] focus:ring-4 focus:ring-[#00C2A9]/15"
          >
            {sectorOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white shadow-sm disabled:opacity-60"
        >
          {status === "loading" ? t("auth.creating") : t("auth.register")}
        </button>
      </form>
    </AuthShell>
  );
}
