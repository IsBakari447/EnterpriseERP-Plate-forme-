import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";
import { publicPageMetadata } from "@shared/seo/page-metadata";
import { JsonLd, buildSectorServiceJsonLd } from "@shared/seo/structured-data";

export const metadata = publicPageMetadata.commerce;

export default function CommercePage() {
  return (
    <>
      <JsonLd
        data={buildSectorServiceJsonLd({
          slug: "commerce",
          name: "EnterpriseERP Commerce",
          description:
            "ERP Cloud pour boutiques, magasins et supermarches avec ventes, produits, stock, fournisseurs, paiements, factures et rapports.",
        })}
      />
      <SectorLandingPage sector={sectors.commerce} />
    </>
  );
}
