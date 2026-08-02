import { navigationByKey } from "@config/navigation";
import GenericModulePage from "@modules/generic-module/GenericModulePage";
import type { ModuleKey } from "@shared/sector/types";

function isModuleKey(value: string): value is ModuleKey {
  return value in navigationByKey;
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const moduleKey = isModuleKey(module) ? module : "dashboard";
  const item = navigationByKey[moduleKey];

  return (
    <GenericModulePage
      module={{
        key: moduleKey,
        name: item.name,
        icon: item.icon,
      }}
    />
  );
}
