"use client";

import Image from "next/image";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function MarketingFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-[#101A26] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white">
              <Image src="/enterpriseerp-icon.png" alt="EnterpriseERP" width={42} height={42} className="h-10 w-10 object-contain" />
            </span>
            <div className="text-2xl font-bold">EnterpriseERP</div>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            {t("marketing.footerText")}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">{t("marketing.solutions")}</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>{t("sector.restaurant")}</p>
            <p>{t("sector.commerce")}</p>
            <p>{t("marketing.services")}</p>
            <p>{t("marketing.sme")}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">{t("marketing.product")}</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>{t("nav.crm")}</p>
            <p>{t("nav.stock")}</p>
            <p>{t("nav.facturation")}</p>
            <p>{t("nav.assistant")}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-sm text-slate-400">
        <div className="mb-3 flex flex-wrap justify-center gap-4">
          <a href="/legal" className="hover:text-white">{t("legal.mentions")}</a>
          <a href="/privacy" className="hover:text-white">{t("legal.privacy")}</a>
          <a href="/cookies" className="hover:text-white">{t("legal.cookies")}</a>
          <a href="/dpa" className="hover:text-white">{t("legal.dpa")}</a>
        </div>
        © 2026 EnterpriseERP. {t("marketing.footerSignature")}
      </div>
    </footer>
  );
}
