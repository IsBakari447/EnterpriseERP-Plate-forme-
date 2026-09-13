import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function AccountingScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.comptabilite"
      subtitleKey="screen.accounting.subtitle"
      icon="calculator-outline"
      aiKey="screen.accounting.ai"
      apiModule="accounting"
    />
  );
}
