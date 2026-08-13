import { sectors } from "@config/sectors";
import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";

export default function RestaurantPage() {
  return <SectorLandingPage sector={sectors.restaurant} />;
}
