"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@modules/auth/components/AuthShell";
import { authService } from "@modules/auth/services/auth.service";
import { getApiErrorMessage } from "@shared/api/errors";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const session = await authService.login({ email, password, rememberMe });
      const onboardingCompleted =
        session.onboardingCompleted ?? session.user.company?.onboardingCompleted ?? false;
      const sector = session.sector ?? session.user.company?.sector ?? "general";

      router.push(onboardingCompleted ? "/dashboard" : `/onboarding?sector=${sector}`);
    } catch (error) {
      setStatus("error");
      setErrorMessage(getApiErrorMessage(error, t("auth.loginError")));
    }
  }

  return (
    <AuthShell
      eyebrow={t("auth.secureAccess")}
      title={t("auth.loginTitle")}
      text={t("auth.loginHero")}
    >
      <form onSubmit={submit} className="space-y-6">
        <div>
          <div className="inline-flex rounded-full bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
            {t("auth.accountBadge")}
          </div>
          <h2 className="mt-5 text-3xl font-black leading-tight text-[#1E2A38] sm:text-4xl">{t("auth.loginTitle")}</h2>
          <p className="mt-3 text-slate-600">{t("auth.noAccount")}{" "}
            <Link href="/register" className="font-black text-[#00A693]">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>

        {status === "error" && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-800">
            {errorMessage || t("auth.loginError")}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-black text-slate-700">{t("auth.email")}</span>
          <input
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
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold outline-none transition focus:border-[#00C2A9] focus:bg-white focus:ring-4 focus:ring-[#00C2A9]/15"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            {t("auth.rememberMe")}
          </label>
          <Link href="/forgot-password" className="text-sm font-black text-[#00A693]">
            {t("market.forgotPassword")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e66e00] hover:shadow-xl disabled:opacity-60"
        >
          {status === "loading" ? t("auth.authenticating") : t("auth.login")}
        </button>

        <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
          {t("auth.loginTip")}
        </div>
      </form>
    </AuthShell>
  );
}
