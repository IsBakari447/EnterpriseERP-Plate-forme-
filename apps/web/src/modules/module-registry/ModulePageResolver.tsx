"use client";

import { navigationByKey } from "@config/navigation";
import AssistantPage from "@modules/assistant/pages/AssistantPage";
import ComptabilitePage from "@modules/comptabilite/pages/ComptabilitePage";
import CRMPage from "@modules/crm/pages/CRMPage";
import EducationModulePage from "@modules/education/EducationModulePage";
import FacturationPage from "@modules/facturation/pages/FacturationPage";
import GenericModulePage from "@modules/generic-module/GenericModulePage";
import ParametresPage from "@modules/parametres/pages/ParametresPage";
import RHPage from "@modules/rh/pages/RHPage";
import StockPage from "@modules/stock/pages/StockPage";
import VentesPage from "@modules/ventes/pages/VentesPage";
import { useSector } from "@shared/sector/SectorProvider";
import type { ModuleKey } from "@shared/sector/types";

type ModuleView = {
  key: ModuleKey;
  name: string;
  icon: string;
};

const educationModules: ModuleKey[] = [
  "etudiants",
  "enseignants",
  "classes",
  "emploi-du-temps",
  "examens",
  "cours",
  "presences",
  "frais-scolaires",
];

export default function ModulePageResolver({ module }: { module: ModuleView }) {
  const { sectorKey } = useSector();
  const item = navigationByKey[module.key];
  const view = {
    ...module,
    name: item?.name ?? module.name,
    icon: item?.icon ?? module.icon,
  };

  if (sectorKey === "education" && educationModules.includes(module.key)) {
    return <EducationModulePage module={view} />;
  }

  if (module.key === "clients" || module.key === "crm") {
    return <CRMPage />;
  }

  if (module.key === "stock" || module.key === "produits") {
    return <StockPage />;
  }

  if (module.key === "facturation") {
    return <FacturationPage />;
  }

  if (module.key === "ventes" || module.key === "commandes") {
    return <VentesPage />;
  }

  if (module.key === "rh") {
    return <RHPage />;
  }

  if (module.key === "comptabilite" || module.key === "finances") {
    return <ComptabilitePage />;
  }

  if (module.key === "parametres") {
    return <ParametresPage />;
  }

  if (module.key === "assistant") {
    return <AssistantPage />;
  }

  return <GenericModulePage module={view} />;
}
