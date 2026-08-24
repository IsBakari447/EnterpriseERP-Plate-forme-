import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";
import { publicPageMetadata } from "@shared/seo/page-metadata";
import { JsonLd, buildSectorServiceJsonLd } from "@shared/seo/structured-data";

export const metadata = publicPageMetadata.sante;

export default function SantePage() {
  return (
    <>
      <JsonLd
        data={buildSectorServiceJsonLd({
          slug: "sante",
          name: "EnterpriseERP Sante",
          description:
            "ERP Cloud pour cliniques, cabinets medicaux et hopitaux avec patients, medecins, rendez-vous, consultations et facturation.",
        })}
      />
      <SectorLandingPage sector={sectors.sante} />
    </>
  );
}
