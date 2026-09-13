-- Scope tenant-owned business references to their company and remove orphaned
-- rows that cannot be safely isolated.
UPDATE "Payment"
SET "invoiceId" = NULL
WHERE "invoiceId" IN (
  SELECT "id"
  FROM "Invoice"
  WHERE "companyId" IS NULL
);

DELETE FROM "Client" WHERE "companyId" IS NULL;
DELETE FROM "Product" WHERE "companyId" IS NULL;
DELETE FROM "Invoice" WHERE "companyId" IS NULL;

DROP INDEX IF EXISTS "Client_email_key";
DROP INDEX IF EXISTS "Product_sku_key";
DROP INDEX IF EXISTS "Invoice_number_key";

ALTER TABLE "Client" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Invoice" ALTER COLUMN "companyId" SET NOT NULL;

CREATE UNIQUE INDEX "Client_companyId_email_key" ON "Client"("companyId", "email");
CREATE UNIQUE INDEX "Product_companyId_sku_key" ON "Product"("companyId", "sku");
CREATE UNIQUE INDEX "Invoice_companyId_number_key" ON "Invoice"("companyId", "number");
