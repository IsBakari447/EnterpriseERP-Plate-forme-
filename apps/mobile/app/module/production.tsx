import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function ProductionScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.production"
      subtitleKey="screen.production.subtitle"
      icon="cog-outline"
      aiKey="screen.production.ai"
      apiModule="production"
    />
  );
}
