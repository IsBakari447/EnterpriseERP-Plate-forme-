import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
  requiredFields: string[];
  defaults: Record<string, unknown>;
  duplicateMessage: string;
};

const resources: Record<EducationResource, ResourceConfig> = {
  students: {
    delegate: "educationStudent",
    dateFields: ["birthDate", "enrollmentDate"],
    numberFields: ["balance"],
    arrayFields: [],
    requiredFields: ["matricule", "firstName", "lastName"],
    defaults: { status: "Actif", balance: 0 },
    duplicateMessage: "Student ID already exists.",
  },
  teachers: {
    delegate: "educationTeacher",
    dateFields: ["hireDate"],
    numberFields: ["salary"],
    arrayFields: ["subjects", "classes"],
    requiredFields: ["teacherCode", "firstName", "lastName"],
    defaults: { status: "Actif" },
    duplicateMessage: "Teacher ID already exists.",
  },
  classes: {
    delegate: "educationClass",
    dateFields: [],
    numberFields: ["capacity"],
    arrayFields: [],
    requiredFields: ["name"],
    defaults: { status: "Actif", capacity: 0 },
    duplicateMessage: "Class already exists.",
  },
  courses: {
    delegate: "educationCourse",
    dateFields: [],
    numberFields: ["weeklyHours"],
    arrayFields: [],
    requiredFields: ["code", "name"],
    defaults: { status: "Actif" },
    duplicateMessage: "Course code already exists.",
  },
  schedule: {
    delegate: "educationScheduleEntry",
    dateFields: ["date"],
    numberFields: [],
    arrayFields: [],
    requiredFields: ["courseName", "className", "date"],
    defaults: { status: "Planifie" },
    duplicateMessage: "Schedule entry already exists.",
  },
  exams: {
    delegate: "educationExam",
    dateFields: ["date"],
    numberFields: ["participants", "average"],
    arrayFields: [],
    requiredFields: ["title", "subject", "className", "date"],
    defaults: { status: "Programme", participants: 0 },
    duplicateMessage: "Exam already exists.",
  },
  attendance: {
    delegate: "educationAttendance",
    dateFields: ["date"],
    numberFields: [],
    arrayFields: [],
    requiredFields: ["studentName", "className", "date", "status"],
    defaults: {},
    duplicateMessage: "Attendance record already exists.",
  },
  fees: {
    delegate: "educationSchoolFee",
    dateFields: ["dueDate"],
    numberFields: ["amount", "paid"],
    arrayFields: [],
    requiredFields: ["studentName", "feeName"],
    defaults: { status: "A relancer", amount: 0, paid: 0 },
    duplicateMessage: "School fee already exists.",
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

  private validateRequiredFields(config: ResourceConfig, data: Record<string, unknown>) {
    const missingFields = config.requiredFields.filter((field) => {
      const value = data[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missingFields.length > 0) {
      throw new BadRequestException("Missing required fields.");
    }
  }

  private handlePrismaError(resource: EducationResource, error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ConflictException(this.config(resource).duplicateMessage);
      }

      if (error.code === "P2025") {
        throw new NotFoundException("Education record not found.");
      }
    }

    throw error;
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
    const config = this.config(resource);
    const data = this.normalize(resource, body);
    this.validateRequiredFields(config, data);

    try {
      return await this.delegate(resource).create({
        data: {
          ...data,
          companyId,
        },
      });
    } catch (error) {
      this.handlePrismaError(resource, error);
    }
  }

  async update(user: AuthenticatedUser, resource: EducationResource, id: string, body: Record<string, unknown>) {
    await this.findOne(user, resource, id);
    const data = this.normalize(resource, body);

    try {
      return await this.delegate(resource).update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handlePrismaError(resource, error);
    }
  }

  async remove(user: AuthenticatedUser, resource: EducationResource, id: string) {
    await this.findOne(user, resource, id);

    return this.delegate(resource).delete({
      where: { id },
    });
  }
}
