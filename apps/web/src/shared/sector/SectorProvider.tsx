"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { sectorDefinitions } from "@/config/sectors";
import {
  companyService,
  type CompanyDto,
} from "@modules/company/services/company.service";
import type { BusinessTypeKey } from "@config/business-types";

import type {
  SectorDefinition,
  SectorKey,
} from "@shared/sector/types";

type SectorContextValue = {
  sectorKey: SectorKey;
  sector: SectorDefinition;

  company: CompanyDto | null;
  companyName: string;
  businessType: BusinessTypeKey | null;
  country: string | null;
  currency: string;
  enabledModules: string[];

  loading: boolean;
  error: string;

  setSector: (
    sector: SectorKey
  ) => Promise<void>;

  refreshCompany: () => Promise<void>;
};

const SectorContext =
  createContext<SectorContextValue | null>(
    null
  );

const STORAGE_KEY =
  "enterpriseerp-sector";

const COMPANY_LOAD_ERROR_KEY =
  "sector.companyLoadError";

const COMPANY_UPDATE_ERROR_KEY =
  "sector.companyUpdateError";

function isSectorKey(
  value: string | null | undefined
): value is SectorKey {
  return Boolean(
    value &&
      value in sectorDefinitions
  );
}

function readSavedSector(): SectorKey {
  if (typeof window === "undefined") {
    return "general";
  }

  const savedSector =
    window.localStorage.getItem(
      STORAGE_KEY
    );

  return isSectorKey(savedSector)
    ? savedSector
    : "general";
}

export function SectorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [sectorKey, setSectorKey] =
    useState<SectorKey>("general");

  const [company, setCompany] =
    useState<CompanyDto | null>(null);

  const [
    enabledModules,
    setEnabledModules,
  ] = useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function applyCompany(
    nextCompany: CompanyDto
  ) {
    setCompany(nextCompany);

    setEnabledModules(
      nextCompany.enabledModules ?? []
    );

    const nextSector =
      isSectorKey(nextCompany.sector)
        ? nextCompany.sector
        : "general";

    setSectorKey(nextSector);

    if (
      typeof window !== "undefined"
    ) {
      window.localStorage.setItem(
        STORAGE_KEY,
        nextSector
      );
    }
  }

  async function refreshCompany() {
    setLoading(true);
    setError("");

    try {
      const nextCompany =
        await companyService.getCurrent();

      applyCompany(nextCompany);
    } catch {
      /*
       * Offline/development fallback only.
       * The API Company remains the source
       * of truth in normal operation.
       */
      setSectorKey(
        readSavedSector()
      );

      setError(
        COMPANY_LOAD_ERROR_KEY
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshCompany();
  }, []);

  async function setSector(
    nextSector: SectorKey
  ) {
    setError("");

    try {
      const updatedCompany =
        await companyService.update({
          sector: nextSector,
        });

      applyCompany(updatedCompany);
    } catch {
      setError(
        COMPANY_UPDATE_ERROR_KEY
      );

      throw new Error(
        COMPANY_UPDATE_ERROR_KEY
      );
    }
  }

  const value = useMemo(
    () => ({
      sectorKey,

      sector:
        sectorDefinitions[sectorKey],

      company,

      companyName:
        company?.name ??
        "EnterpriseERP",

      businessType:
        company?.businessType ?? null,

      country:
        company?.country ?? null,

      currency:
        company?.currency ??
        "EUR",

      enabledModules,

      loading,
      error,
      setSector,
      refreshCompany,
    }),
    [
      sectorKey,
      company,
      enabledModules,
      loading,
      error,
    ]
  );

  return (
    <SectorContext.Provider
      value={value}
    >
      {children}
    </SectorContext.Provider>
  );
}

export function useSector() {
  const context =
    useContext(SectorContext);

  if (!context) {
    throw new Error(
      "useSector must be used inside SectorProvider."
    );
  }

  return context;
}
