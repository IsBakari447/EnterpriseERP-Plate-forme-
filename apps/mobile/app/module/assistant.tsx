import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function AssistantScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.assistant"
      subtitleKey="screen.assistant.subtitle"
      icon="sparkles-outline"
      aiKey="screen.assistant.ai"
      apiModule="assistant"
    />
  );
}
