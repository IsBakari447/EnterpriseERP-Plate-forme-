import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";
import { publicPageMetadata } from "@shared/seo/page-metadata";
import { JsonLd, buildSectorServiceJsonLd } from "@shared/seo/structured-data";

export const metadata = publicPageMetadata.construction;

export default function ConstructionPage() {
  return (
    <>
      <JsonLd
        data={buildSectorServiceJsonLd({
          slug: "construction",
          name: "EnterpriseERP Construction",
          description:
            "ERP Cloud pour BTP, genie civil et batiment avec chantiers, devis, contrats, materiels, materiaux, budgets et marges.",
        })}
      />
      <SectorLandingPage sector={sectors.construction} />
    </>
  );
}
