import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function HumanResourcesScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.rh"
      subtitleKey="screen.hr.subtitle"
      icon="id-card-outline"
      aiKey="screen.hr.ai"
      apiModule="hr"
    />
  );
}
