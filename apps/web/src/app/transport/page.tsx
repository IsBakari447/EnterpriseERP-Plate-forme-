import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";
import { publicPageMetadata } from "@shared/seo/page-metadata";
import { JsonLd, buildSectorServiceJsonLd } from "@shared/seo/structured-data";

export const metadata = publicPageMetadata.transport;

export default function TransportPage() {
  return (
    <>
      <JsonLd
        data={buildSectorServiceJsonLd({
          slug: "transport",
          name: "EnterpriseERP Transport",
          description:
            "ERP Cloud pour transport, logistique et livraison avec flotte, conducteurs, expeditions, itineraires, carburant et maintenance.",
        })}
      />
      <SectorLandingPage sector={sectors.transport} />
    </>
  );
}
