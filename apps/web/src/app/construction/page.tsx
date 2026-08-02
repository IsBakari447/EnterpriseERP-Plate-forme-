import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";

export default function ConstructionPage() {
  return <SectorLandingPage sector={sectors.construction} />;
}
