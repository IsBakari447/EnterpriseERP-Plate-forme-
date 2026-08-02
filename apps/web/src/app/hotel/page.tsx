import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";

export default function HotelPage() {
  return <SectorLandingPage sector={sectors.hotel} />;
}
