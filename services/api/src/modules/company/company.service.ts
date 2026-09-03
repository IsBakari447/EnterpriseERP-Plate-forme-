import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuditService } from "../../common/audit/audit.service";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

type UpdateCompanyInput = {
  name?: string;
  sector?: string;
  businessType?: string | null;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  enabledModules?: string[];
  onboardingCompleted?: boolean;
};

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  private readonly allowedSectors = new Set([
    "general",
    "restaurant",
    "commerce",
    "construction",
    "sante",
    "education",
    "transport",
    "industrie",
    "hospitality",
    "agriculture",
    "livestock",
    "hotel",
  ]);

  private readonly allowedBusinessTypes = new Set([
    "hotel",
    "vacation_rental",
    "furnished_apartment",
    "guest_house",
    "resort",
    "aparthotel",
    "preschool",
    "primary_school",
    "secondary_school",
    "higher_education",
    "training_center",
    "crop_farm",
    "market_garden",
    "orchard",
    "dairy_farm",
    "poultry_farm",
    "cattle_farm",
    "mixed_farm",
  ]);

  private readonly allowedCurrencies = new Set(["EUR", "SEK", "USD", "CDF", "GBP"]);
  private readonly allowedLanguages = new Set(["fr", "en", "sv", "de", "es", "pt", "it", "nl"]);

  private sanitize(data: UpdateCompanyInput) {
    if (data.sector && !this.allowedSectors.has(data.sector)) {
      throw new BadRequestException("Secteur invalide");
    }

    if (data.currency && !this.allowedCurrencies.has(data.currency)) {
      throw new BadRequestException("Devise invalide");
    }

    if (data.language && !this.allowedLanguages.has(data.language)) {
      throw new BadRequestException("Langue invalide");
    }

    const businessType =
      data.businessType === null
        ? null
        : data.businessType?.trim() || undefined;

    if (businessType && !this.allowedBusinessTypes.has(businessType)) {
      throw new BadRequestException("Type d'activite invalide");
    }

    return {
      name: data.name?.trim() || undefined,
      sector: data.sector,
      businessType,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      address: data.address?.trim() || undefined,
      country: data.country?.trim() || undefined,
      currency: data.currency,
      language: data.language,
      timezone: data.timezone?.trim() || undefined,
      enabledModules: Array.isArray(data.enabledModules)
        ? Array.from(new Set(data.enabledModules.filter(Boolean)))
        : undefined,
      onboardingCompleted: data.onboardingCompleted,
      onboardingCompletedAt: data.onboardingCompleted ? new Date() : undefined,
    };
  }

  async getCurrentCompany(user: AuthenticatedUser) {
    const companyId = requireTenant(user);
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException("Entreprise introuvable");
    }

    return company;
  }

  async updateCurrentCompany(user: AuthenticatedUser, data: UpdateCompanyInput) {
    const company = await this.getCurrentCompany(user);
    const sanitized = this.sanitize(data);

    const updated = await this.prisma.company.update({
      where: {
        id: company.id,
      },
      data: sanitized,
    });

    await this.audit.record({
      companyId: company.id,
      userId: user.sub,
      module: "company",
      action: "company.updated",
      entityType: "Company",
      entityId: company.id,
      before: company,
      after: updated,
    });

    return updated;
  }

  async getCurrentModules(user: AuthenticatedUser) {
    const company = await this.getCurrentCompany(user);

    return {
      enabledModules: company.enabledModules,
    };
  }

  async updateCurrentModules(user: AuthenticatedUser, enabledModules: string[]) {
    return this.updateCurrentCompany(user, { enabledModules });
  }

  async completeOnboarding(user: AuthenticatedUser) {
    const company = await this.getCurrentCompany(user);

    if (!company.name?.trim()) {
      throw new BadRequestException("Le nom de l'entreprise est obligatoire");
    }

    if (!this.allowedSectors.has(company.sector)) {
      throw new BadRequestException("Secteur invalide");
    }

    if (!company.country?.trim()) {
      throw new BadRequestException("Le pays est obligatoire");
    }

    if (!this.allowedCurrencies.has(company.currency)) {
      throw new BadRequestException("Devise invalide");
    }

    const updated = await this.prisma.company.update({
      where: {
        id: company.id,
      },
      data: {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
      },
    });

    await this.audit.record({
      companyId: company.id,
      userId: user.sub,
      module: "company",
      action: "company.onboarding_completed",
      entityType: "Company",
      entityId: company.id,
      before: company,
      after: updated,
    });

    return updated;
  }
}
