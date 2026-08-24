import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";
import { publicPageMetadata } from "@shared/seo/page-metadata";
import { JsonLd, buildSectorServiceJsonLd } from "@shared/seo/structured-data";

export const metadata = publicPageMetadata.hotel;

export default function HotelPage() {
  return (
    <>
      <JsonLd
        data={buildSectorServiceJsonLd({
          slug: "hotel",
          name: "EnterpriseERP Hotel",
          description:
            "ERP Cloud pour hotels, auberges et residences avec reservations, chambres, clients, housekeeping, restaurant et facturation.",
        })}
      />
      <SectorLandingPage sector={sectors.hotel} />
    </>
  );
}
