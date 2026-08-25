import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function ReportsScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.rapports"
      subtitleKey="screen.reports.subtitle"
      icon="bar-chart-outline"
      metrics={[
        { labelKey: "screen.reports.periods", value: "5", hintKey: "trend.month" },
        { labelKey: "screen.reports.exports", value: "18", hintKey: "common.export" },
        { labelKey: "screen.reports.scheduled", value: "7", hintKey: "trend.plan" },
      ]}
      sections={[
        { titleKey: "screen.reports.analyticsTitle", items: ["screen.reports.analytics.1", "screen.reports.analytics.2", "screen.reports.analytics.3", "screen.reports.analytics.4"] },
        { titleKey: "screen.reports.exportsTitle", items: ["screen.reports.exports.1", "screen.reports.exports.2", "screen.reports.exports.3"] },
      ]}
      aiKey="screen.reports.ai"
    />
  );
}
