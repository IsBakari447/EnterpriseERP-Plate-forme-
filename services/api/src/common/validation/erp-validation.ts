import { BadRequestException } from "@nestjs/common";

export function assertRequiredFields(data: Record<string, unknown>, fields: string[]) {
  const missingFields = fields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missingFields.length > 0) {
    throw new BadRequestException("Missing required fields.");
  }
}

export function assertEmail(value: unknown, fieldName = "email") {
  if (value === undefined || value === null || String(value).trim() === "") {
    return;
  }

  const email = String(value).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BadRequestException(`Invalid ${fieldName}.`);
  }
}

export function assertNonNegativeNumber(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new BadRequestException(`${fieldName} must be zero or greater.`);
  }
}

export function assertValidDate(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException(`Invalid ${fieldName}.`);
  }
}
