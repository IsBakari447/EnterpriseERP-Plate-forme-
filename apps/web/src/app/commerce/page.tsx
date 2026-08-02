import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";

export default function CommercePage() {
  return <SectorLandingPage sector={sectors.commerce} />;
}
