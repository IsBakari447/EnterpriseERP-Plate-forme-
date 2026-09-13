import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function SalesScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.ventes"
      subtitleKey="screen.sales.subtitle"
      icon="cart-outline"
      aiKey="screen.sales.ai"
      apiModule="sales"
    />
  );
}
