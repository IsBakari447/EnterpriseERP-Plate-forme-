import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

export type EducationResource =
  | "students"
  | "teachers"
  | "classes"
  | "courses"
  | "schedule"
  | "exams"
  | "attendance"
  | "fees";

type ResourceConfig = {
  delegate: string;
  dateFields: string[];
  numberFields: string[];
  arrayFields: string[];
  defaults: Record<string, unknown>;
};

const resources: Record<EducationResource, ResourceConfig> = {
  students: {
    delegate: "educationStudent",
    dateFields: ["birthDate", "enrollmentDate"],
    numberFields: ["balance"],
    arrayFields: [],
    defaults: { status: "Actif", balance: 0 },
  },
  teachers: {
    delegate: "educationTeacher",
    dateFields: ["hireDate"],
    numberFields: ["salary"],
    arrayFields: ["subjects", "classes"],
    defaults: { status: "Actif" },
  },
  classes: {
    delegate: "educationClass",
    dateFields: [],
    numberFields: ["capacity"],
    arrayFields: [],
    defaults: { status: "Actif", capacity: 0 },
  },
  courses: {
    delegate: "educationCourse",
    dateFields: [],
    numberFields: ["weeklyHours"],
    arrayFields: [],
    defaults: { status: "Actif" },
  },
  schedule: {
    delegate: "educationScheduleEntry",
    dateFields: ["date"],
    numberFields: [],
    arrayFields: [],
    defaults: { status: "Planifie" },
  },
  exams: {
    delegate: "educationExam",
    dateFields: ["date"],
    numberFields: ["participants", "average"],
    arrayFields: [],
    defaults: { status: "Programme", participants: 0 },
  },
  attendance: {
    delegate: "educationAttendance",
    dateFields: ["date"],
    numberFields: [],
    arrayFields: [],
    defaults: {},
  },
  fees: {
    delegate: "educationSchoolFee",
    dateFields: ["dueDate"],
    numberFields: ["amount", "paid"],
    arrayFields: [],
    defaults: { status: "A relancer", amount: 0, paid: 0 },
  },
};

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  private config(resource: EducationResource) {
    const config = resources[resource];

    if (!config) {
      throw new BadRequestException("Ressource education invalide");
    }

    return config;
  }

  private delegate(resource: EducationResource) {
    const { delegate } = this.config(resource);
    const prisma = this.prisma as unknown as Record<string, unknown>;
    const model = prisma[delegate];

    if (!model || typeof model !== "object") {
      throw new BadRequestException("Ressource education non configuree");
    }

    return model as {
      findMany(args: unknown): Promise<unknown[]>;
      findFirst(args: unknown): Promise<unknown | null>;
      create(args: unknown): Promise<unknown>;
      update(args: unknown): Promise<unknown>;
      delete(args: unknown): Promise<unknown>;
    };
  }

  private normalize(resource: EducationResource, body: Record<string, unknown>) {
    const config = this.config(resource);
    const data: Record<string, unknown> = {
      ...config.defaults,
      ...body,
    };

    for (const field of config.dateFields) {
      if (typeof data[field] === "string" && data[field]) {
        data[field] = new Date(data[field]);
      }
    }

    for (const field of config.numberFields) {
      if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
        data[field] = Number(data[field]);
      }
    }

    for (const field of config.arrayFields) {
      if (typeof data[field] === "string") {
        data[field] = String(data[field])
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    delete data.id;
    delete data.companyId;
    delete data.createdAt;
    delete data.updatedAt;

    return data;
  }

  async findAll(user: AuthenticatedUser, resource: EducationResource) {
    const companyId = requireTenant(user);

    return this.delegate(resource).findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(user: AuthenticatedUser, resource: EducationResource, id: string) {
    const companyId = requireTenant(user);
    const record = await this.delegate(resource).findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!record) {
      throw new NotFoundException("Donnee education introuvable");
    }

    return record;
  }

  async create(user: AuthenticatedUser, resource: EducationResource, body: Record<string, unknown>) {
    const companyId = requireTenant(user);
    const data = this.normalize(resource, body);

    return this.delegate(resource).create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  async update(user: AuthenticatedUser, resource: EducationResource, id: string, body: Record<string, unknown>) {
    await this.findOne(user, resource, id);
    const data = this.normalize(resource, body);

    return this.delegate(resource).update({
      where: { id },
      data,
    });
  }

  async remove(user: AuthenticatedUser, resource: EducationResource, id: string) {
    await this.findOne(user, resource, id);

    return this.delegate(resource).delete({
      where: { id },
    });
  }
}
