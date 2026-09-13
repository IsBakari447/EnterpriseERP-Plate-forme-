import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function ReportsScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.rapports"
      subtitleKey="screen.reports.subtitle"
      icon="bar-chart-outline"
      aiKey="screen.reports.ai"
      apiModule="reports"
    />
  );
}
