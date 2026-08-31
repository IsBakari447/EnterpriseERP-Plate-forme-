"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@modules/auth/components/AuthShell";
import { authService } from "@modules/auth/services/auth.service";
import { getApiErrorMessage, isExistingAccountError } from "@shared/api/errors";
import { useI18n } from "@shared/i18n/I18nProvider";
import { sectorDefinitions, sectorOptions } from "@config/sectors";
import type { SectorKey } from "@shared/sector/types";

function getInitialSector(): SectorKey {
  if (typeof window === "undefined") return "general";

  const value = new URLSearchParams(window.location.search).get("sector");
  return value && value in sectorDefinitions ? (value as SectorKey) : "general";
}

export default function RegisterPage() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sector, setSector] = useState<SectorKey>(getInitialSector);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "account-exists">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await authService.register({
        companyName,
        name,
        email,
        password,
        sector,
        language: locale,
      });
      router.push(`/onboarding?sector=${sector}`);
    } catch (error) {
      const message = getApiErrorMessage(error, t("auth.registerError"));
      const accountExists = isExistingAccountError(message);

      setStatus(accountExists ? "account-exists" : "error");
      setErrorMessage(accountExists ? t("auth.accountExists") : message);
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
          <div className="inline-flex rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
            {t("auth.startPlatform")}
          </div>
          <h2 className="mt-5 text-3xl font-black leading-tight text-[#1E2A38] sm:text-4xl">{t("auth.registerTitle")}</h2>
          <p className="mt-3 text-slate-600">{t("auth.hasAccount")}{" "}
            <Link href="/login" className="font-black text-[#00A693]">
              {t("auth.goLogin")}
            </Link>
          </p>
        </div>

        {(status === "error" || status === "account-exists") && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-800">
            <p>{errorMessage || t("auth.registerError")}</p>
            {status === "account-exists" && (
              <Link href="/login" className="mt-2 inline-flex text-[#00A693] underline-offset-4 hover:underline">
                {t("auth.useExistingAccount")}
              </Link>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-black text-slate-700">{t("auth.companyName")}</span>
            <input
              name="organization"
              autoComplete="organization"
              required
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#00C2A9] focus:bg-white focus:ring-4 focus:ring-[#00C2A9]/15"
              placeholder="Entreprise SARL"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-slate-700">{t("auth.fullName")}</span>
            <input
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#00C2A9] focus:bg-white focus:ring-4 focus:ring-[#00C2A9]/15"
              placeholder="Issa Bakari"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-black text-slate-700">{t("auth.email")}</span>
          <input
            name="email"
            autoComplete="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#00C2A9] focus:bg-white focus:ring-4 focus:ring-[#00C2A9]/15"
            placeholder="admin@entreprise.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-slate-700">{t("auth.password")}</span>
          <input
            name="new-password"
            autoComplete="new-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#00C2A9] focus:bg-white focus:ring-4 focus:ring-[#00C2A9]/15"
          />
        </label>

        <label className="block">
          <span className="text-sm font-black text-slate-700">{t("auth.sector")}</span>
          <select
            value={sector}
            onChange={(event) => setSector(event.target.value as SectorKey)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none transition focus:border-[#00C2A9] focus:bg-white focus:ring-4 focus:ring-[#00C2A9]/15"
          >
            {sectorOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {t(`sector.${option.key}`)}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e66e00] hover:shadow-xl disabled:opacity-60"
        >
          {status === "loading" ? t("auth.creating") : t("auth.register")}
        </button>

        <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600 sm:grid-cols-3">
          <span>{t("auth.valueDataIsolation")}</span>
          <span>{t("auth.valueRoleAccess")}</span>
          <span>{t("auth.valueSectorWorkspace")}</span>
        </div>
      </form>
    </AuthShell>
  );
}
