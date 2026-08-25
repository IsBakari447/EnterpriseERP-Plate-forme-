import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function HumanResourcesScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.rh"
      subtitleKey="screen.hr.subtitle"
      icon="id-card-outline"
      metrics={[
        { labelKey: "screen.hr.employees", value: "48", hintKey: "status.active" },
        { labelKey: "screen.hr.presence", value: "42", hintKey: "trend.today" },
        { labelKey: "screen.hr.leave", value: "6", hintKey: "trend.follow" },
      ]}
      sections={[
        { titleKey: "screen.hr.teamTitle", items: ["screen.hr.team.1", "screen.hr.team.2", "screen.hr.team.3", "screen.hr.team.4"] },
        { titleKey: "screen.hr.docsTitle", items: ["screen.hr.docs.1", "screen.hr.docs.2", "screen.hr.docs.3"] },
      ]}
      aiKey="screen.hr.ai"
    />
  );
}
