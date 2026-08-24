"use client";

import { navigationByKey } from "@config/navigation";
import EducationModulePage from "@modules/education/EducationModulePage";
import GenericModulePage from "@modules/generic-module/GenericModulePage";
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

  return <GenericModulePage module={view} />;
}
