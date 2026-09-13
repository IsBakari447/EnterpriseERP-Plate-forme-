import "reflect-metadata";
import { ArgumentMetadata, BadRequestException, ValidationPipe } from "@nestjs/common";
import { RegisterDto } from "../src/modules/auth/dto/auth.dto";
import { CreateClientDto } from "../src/modules/crm/dto/client.dto";
import { CreateInvoiceDto } from "../src/modules/facturation/dto/invoice.dto";
import { CreateProductDto } from "../src/modules/stock/dto/product.dto";
import { CreateUserDto } from "../src/modules/users/dto/user.dto";
import { CreateSalesOrderDto } from "../src/modules/operations/dto/operations.dto";

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});

type DtoClass = new () => object;

function metadata(type: DtoClass): ArgumentMetadata {
  return {
    type: "body",
    metatype: type,
    data: "",
  };
}

async function expectAccepted(type: DtoClass, payload: Record<string, unknown>, label: string) {
  await pipe.transform(payload, metadata(type));
  console.log(`PASS accepted: ${label}`);
}

async function expectRejected(type: DtoClass, payload: Record<string, unknown>, label: string) {
  try {
    await pipe.transform(payload, metadata(type));
  } catch (error) {
    if (error instanceof BadRequestException) {
      console.log(`PASS rejected: ${label}`);
      return;
    }

    throw error;
  }

  throw new Error(`Expected validation rejection for ${label}`);
}

async function main() {
  await expectAccepted(
    RegisterDto,
    {
      companyName: "EnterpriseERP Test",
      name: "Owner Test",
      email: "owner@example.com",
      password: "StrongPass123",
      sector: "commerce",
      language: "fr",
    },
    "auth register valid payload"
  );

  await expectRejected(
    RegisterDto,
    {
      companyName: "EnterpriseERP Test",
      name: "Owner Test",
      email: "owner@example.com",
      password: "StrongPass123",
      role: "OWNER",
      companyId: "OTHER_COMPANY",
    },
    "auth register mass assignment"
  );

  await expectRejected(CreateClientDto, { name: "Client", email: "bad-email", companyId: "OTHER" }, "crm invalid email and tenant injection");
  await expectRejected(CreateProductDto, { name: "Product", sku: "SKU-1", quantity: -1, value: 10 }, "stock negative quantity");
  await expectRejected(CreateInvoiceDto, { number: "INV-1", customer: "Client", amount: 10, due: "not-a-date" }, "invoice invalid date");
  await expectRejected(CreateUserDto, { name: "User", email: "user@example.com", role: "ROOT" }, "user invalid role");
  await expectRejected(CreateSalesOrderDto, { number: "SO-1", customer: "Client", amount: 1, companyId: "OTHER" }, "sales order tenant injection");

  console.log("Input validation security checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
