"use client";

import { sectorOptions } from "@/config/sectors";
import { useI18n } from "@shared/i18n/I18nProvider";
import { useSector } from "./SectorProvider";
import type { SectorKey } from "./types";

export default function SectorSelector() {
  const { sectorKey, error, setSector } = useSector();
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <label
        htmlFor="sector-selector"
        className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400"
      >
        {t("auth.sector")}
      </label>

      <select
        id="sector-selector"
        value={sectorKey}
        onChange={(event) => setSector(event.target.value as SectorKey)}
        className="h-10 w-full rounded-lg border border-white/10 bg-[#263647] px-3 text-sm font-semibold text-white outline-none"
      >
        {sectorOptions.map((option) => (
          <option key={option.key} value={option.key} className="bg-white text-slate-900">
            {t(`sector.${option.key}`)}
          </option>
        ))}
      </select>

      {error && <p className="mt-2 text-xs leading-5 text-orange-300">{error}</p>}
    </div>
  );
}
