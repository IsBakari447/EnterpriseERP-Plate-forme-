import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";

export default function EducationPage() {
  return <SectorLandingPage sector={sectors.education} />;
}
