import SectorLandingPage from "@shared/components/marketing/SectorLandingPage";
import { sectors } from "@/config/sectors";
import { publicPageMetadata } from "@shared/seo/page-metadata";
import { JsonLd, buildSectorServiceJsonLd } from "@shared/seo/structured-data";

export const metadata = publicPageMetadata.education;

export default function EducationPage() {
  return (
    <>
      <JsonLd
        data={buildSectorServiceJsonLd({
          slug: "education",
          name: "EnterpriseERP Education",
          description:
            "ERP Cloud pour ecoles, universites et centres de formation avec etudiants, enseignants, classes, examens et frais scolaires.",
        })}
      />
      <SectorLandingPage sector={sectors.education} />
    </>
  );
}
