import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function ProductionScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.production"
      subtitleKey="screen.production.subtitle"
      icon="cog-outline"
      metrics={[
        { labelKey: "screen.production.orders", value: "32", hintKey: "trend.live" },
        { labelKey: "screen.production.yield", value: "94%", hintKey: "trend.month" },
        { labelKey: "screen.production.costs", value: "78 200 EUR", hintKey: "trend.watch" },
      ]}
      sections={[
        { titleKey: "screen.production.shopTitle", items: ["screen.production.shop.1", "screen.production.shop.2", "screen.production.shop.3", "screen.production.shop.4"] },
        { titleKey: "screen.production.qualityTitle", items: ["screen.production.quality.1", "screen.production.quality.2", "screen.production.quality.3"] },
      ]}
      aiKey="screen.production.ai"
      apiModule="production"
    />
  );
}
