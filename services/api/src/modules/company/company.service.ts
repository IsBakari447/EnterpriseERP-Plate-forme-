import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

type UpdateCompanyInput = {
  name?: string;
  sector?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  currency?: string;
  language?: string;
  timezone?: string;
};

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentCompany() {
    const existingCompany = await this.prisma.company.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (existingCompany) {
      return existingCompany;
    }

    return this.prisma.company.create({
      data: {
        name: "EnterpriseERP Demo",
        sector: "general",
        country: "Suède",
        currency: "EUR",
        language: "fr",
        timezone: "Europe/Stockholm",
      },
    });
  }

  async updateCurrentCompany(data: UpdateCompanyInput) {
    const company = await this.getCurrentCompany();

    if (!company) {
      throw new NotFoundException("Entreprise introuvable");
    }

    return this.prisma.company.update({
      where: {
        id: company.id,
      },
      data,
    });
  }
}
