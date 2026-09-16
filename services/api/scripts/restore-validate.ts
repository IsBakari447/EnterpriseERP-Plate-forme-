import "reflect-metadata";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Check = {
  name: string;
  count: number;
  required: boolean;
};

async function main() {
  const checks: Check[] = [
    { name: "companies", count: await prisma.company.count(), required: true },
    { name: "users", count: await prisma.user.count(), required: true },
    { name: "clients", count: await prisma.client.count(), required: false },
    { name: "products", count: await prisma.product.count(), required: false },
    { name: "invoices", count: await prisma.invoice.count(), required: false },
    { name: "payments", count: await prisma.payment.count(), required: false },
    { name: "expenses", count: await prisma.expense.count(), required: false },
    { name: "auditLogs", count: await prisma.auditLog.count(), required: false },
    { name: "userSessions", count: await prisma.userSession.count(), required: false },
  ];

  const failed = checks.filter((check) => check.required && check.count <= 0);

  console.log(
    JSON.stringify(
      {
        status: failed.length ? "failed" : "pass",
        databaseUrlPresent: Boolean(process.env.DATABASE_URL),
        validatedAt: new Date().toISOString(),
        checks,
      },
      null,
      2
    )
  );

  if (failed.length) {
    throw new Error(`Restore validation failed: ${failed.map((check) => check.name).join(", ")}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
