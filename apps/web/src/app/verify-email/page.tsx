"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { apiClient } from "@shared/api/client";
import { getApiErrorMessage } from "@shared/api/errors";
import { useI18n } from "@shared/i18n/I18nProvider";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(t("auth.verifyEmailInvalid"));
      return;
    }

    apiClient
      .post<{ message: string }>("/auth/verify-email", { token })
      .then((response) => {
        setStatus("success");
        setMessage(response.data.message || t("auth.verifyEmailSuccess"));
      })
      .catch((error) => {
        setStatus("error");
        setMessage(getApiErrorMessage(error, t("auth.verifyEmailInvalid")));
      });
  }, [searchParams, t]);

  return (
    <main className="min-h-screen bg-[#F3F6FA] px-6 py-16 text-[#1E2A38]">
      <section className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className={`inline-flex rounded-full px-4 py-2 text-sm font-black ${status === "success" ? "bg-emerald-50 text-emerald-700" : status === "error" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}>
          {status === "loading" ? t("auth.verifyingEmail") : status === "success" ? t("auth.emailVerified") : t("auth.verificationFailed")}
        </div>
        <h1 className="mt-5 text-3xl font-black">{t("auth.verifyEmailTitle")}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{message || t("auth.verifyingEmail")}</p>
        <Link href="/login" className="mt-8 inline-flex rounded-2xl bg-[#FF7A00] px-5 py-3 font-black text-white shadow-lg shadow-orange-200">
          {t("auth.goLogin")}
        </Link>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F3F6FA] px-6 py-16 text-[#1E2A38]">
          <section className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">
              Verification
            </div>
          </section>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
