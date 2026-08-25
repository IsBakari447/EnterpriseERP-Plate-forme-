import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function SalesScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.ventes"
      subtitleKey="screen.sales.subtitle"
      icon="cart-outline"
      metrics={[
        { labelKey: "screen.sales.orders", value: "186", hintKey: "trend.live" },
        { labelKey: "screen.sales.revenue", value: "128 450 EUR", hintKey: "trend.month" },
        { labelKey: "screen.sales.pending", value: "12", hintKey: "trend.action" },
      ]}
      sections={[
        { titleKey: "screen.sales.pipelineTitle", items: ["screen.sales.pipeline.1", "screen.sales.pipeline.2", "screen.sales.pipeline.3", "screen.sales.pipeline.4"] },
        { titleKey: "screen.sales.actionsTitle", items: ["screen.sales.actions.1", "screen.sales.actions.2", "screen.sales.actions.3"] },
      ]}
      aiKey="screen.sales.ai"
      apiModule="sales"
    />
  );
}
