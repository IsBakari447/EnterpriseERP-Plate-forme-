"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@modules/auth/components/AuthShell";
import { authService } from "@modules/auth/services/auth.service";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      await authService.login({ email, password, rememberMe });
      router.push("/dashboard");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AuthShell
      eyebrow="EnterpriseERP Secure Access"
      title={t("auth.loginTitle")}
      text={t("auth.loginHero")}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <h2 className="text-3xl font-black">{t("auth.loginTitle")}</h2>
          <p className="mt-2 text-slate-600">{t("auth.noAccount")}{" "}
            <Link href="/register" className="font-black text-[#00A693]">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>

        {status === "error" && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">
            {t("auth.loginError")}
          </div>
        )}

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
          className="w-full rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white shadow-sm disabled:opacity-60"
        >
          {status === "loading" ? t("auth.authenticating") : t("auth.login")}
        </button>
      </form>
    </AuthShell>
  );
}
