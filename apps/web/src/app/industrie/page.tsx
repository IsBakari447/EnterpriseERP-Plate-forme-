import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";
import { publicPageMetadata } from "@shared/seo/page-metadata";
import { JsonLd, buildSectorServiceJsonLd } from "@shared/seo/structured-data";

export const metadata = publicPageMetadata.industrie;

export default function IndustriePage() {
  return (
    <>
      <JsonLd
        data={buildSectorServiceJsonLd({
          slug: "industrie",
          name: "EnterpriseERP Industrie",
          description:
            "ERP Cloud pour usines et production avec matieres premieres, machines, achats, stock, fournisseurs et ordres de fabrication.",
        })}
      />
      <SectorLandingPage sector={sectors.industrie} />
    </>
  );
}
