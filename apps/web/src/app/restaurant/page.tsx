import { sectors } from "@config/sectors";
import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { publicPageMetadata } from "@shared/seo/page-metadata";
import { JsonLd, buildSectorServiceJsonLd } from "@shared/seo/structured-data";

export const metadata = publicPageMetadata.restaurant;

export default function RestaurantPage() {
  return (
    <>
      <JsonLd
        data={buildSectorServiceJsonLd({
          slug: "restaurant",
          name: "EnterpriseERP Restaurant",
          description:
            "ERP Cloud pour restaurants, cafes, fast-food, patisseries et traiteurs avec commandes, reservations, cuisine, stock et paiements.",
        })}
      />
      <SectorLandingPage sector={sectors.restaurant} />
    </>
  );
}
