import { navigationItems, type NavigationItem } from "@/config/navigation";
import type { SectorDefinition } from "@shared/sector/types";

export type SidebarLink = {
  href: string;
  icon: string;
  key?: string;
  label: string;
};

type BuildNavigationSectionsInput = {
  enabledModules: string[];
  sector: SectorDefinition;
  t: (key: string) => string;
  translateSectorLabel: (value: string) => string;
};

const alwaysVisibleKeys = new Set(["dashboard", "parametres"]);
const administrationKeys = new Set(["utilisateurs", "roles-permissions"]);

function isVisibleForCompany(item: NavigationItem, enabledModules: string[]) {
  return (
    enabledModules.length === 0 ||
    enabledModules.includes(item.key) ||
    alwaysVisibleKeys.has(item.key)
  );
}

function getModuleLabel(
  item: NavigationItem,
  sector: SectorDefinition,
  t: (key: string) => string,
  translateSectorLabel: (value: string) => string,
) {
  const sectorLabel = sector.labels?.[item.key];
  return sectorLabel ? translateSectorLabel(sectorLabel) : t(`nav.${item.key}`);
}

function toSidebarLink(
  item: NavigationItem,
  sector: SectorDefinition,
  t: (key: string) => string,
  translateSectorLabel: (value: string) => string,
): SidebarLink {
  return {
    key: item.key,
    href: item.href,
    icon: item.icon,
    label: getModuleLabel(item, sector, t, translateSectorLabel),
  };
}

export function buildNavigationSections({
  enabledModules,
  sector,
  t,
  translateSectorLabel,
}: BuildNavigationSectionsInput) {
  const visibleItems = navigationItems.filter(
    (item) => sector.modules.includes(item.key) && isVisibleForCompany(item, enabledModules),
  );

  return {
    businessItems: visibleItems
      .filter((item) => !administrationKeys.has(item.key))
      .map((item) => toSidebarLink(item, sector, t, translateSectorLabel)),
    administrationItems: visibleItems
      .filter((item) => administrationKeys.has(item.key))
      .map((item) => toSidebarLink(item, sector, t, translateSectorLabel)),
    accountItems: [
      { href: "/profile", label: t("account.profile"), icon: "ME" },
      { href: "/account/security", label: t("account.security"), icon: "SC" },
      { href: "/account/sessions", label: t("account.sessions"), icon: "DV" },
      { href: "/account/preferences", label: t("account.preferences"), icon: "PF" },
    ],
    adminExtraItems: [
      { href: "/audit", label: t("account.audit"), icon: "AU" },
      { href: "/security-center", label: t("account.securityCenter"), icon: "SE" },
    ],
  };
}
