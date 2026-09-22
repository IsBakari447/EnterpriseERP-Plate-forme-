ALTER TABLE "Client" ALTER COLUMN "revenue" DROP DEFAULT;
ALTER TABLE "Client" ALTER COLUMN "revenue" TYPE DECIMAL(19,4) USING "revenue"::numeric(19,4);
ALTER TABLE "Client" ALTER COLUMN "revenue" SET DEFAULT 0;

ALTER TABLE "SalesOrder" ALTER COLUMN "amount" DROP DEFAULT;
ALTER TABLE "SalesOrder" ALTER COLUMN "amount" TYPE DECIMAL(19,4) USING "amount"::numeric(19,4);
ALTER TABLE "SalesOrder" ALTER COLUMN "amount" SET DEFAULT 0;

ALTER TABLE "Payment" ALTER COLUMN "amount" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "amount" TYPE DECIMAL(19,4) USING "amount"::numeric(19,4);
ALTER TABLE "Payment" ALTER COLUMN "amount" SET DEFAULT 0;

ALTER TABLE "Expense" ALTER COLUMN "amount" DROP DEFAULT;
ALTER TABLE "Expense" ALTER COLUMN "amount" TYPE DECIMAL(19,4) USING "amount"::numeric(19,4);
ALTER TABLE "Expense" ALTER COLUMN "amount" SET DEFAULT 0;

ALTER TABLE "ProductionOrder" ALTER COLUMN "plannedCost" DROP DEFAULT;
ALTER TABLE "ProductionOrder" ALTER COLUMN "plannedCost" TYPE DECIMAL(19,4) USING "plannedCost"::numeric(19,4);
ALTER TABLE "ProductionOrder" ALTER COLUMN "plannedCost" SET DEFAULT 0;
ALTER TABLE "ProductionOrder" ALTER COLUMN "actualCost" TYPE DECIMAL(19,4) USING "actualCost"::numeric(19,4);

ALTER TABLE "Product" ALTER COLUMN "value" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "value" TYPE DECIMAL(19,4) USING "value"::numeric(19,4);
ALTER TABLE "Product" ALTER COLUMN "value" SET DEFAULT 0;

ALTER TABLE "Invoice" ALTER COLUMN "amount" DROP DEFAULT;
ALTER TABLE "Invoice" ALTER COLUMN "amount" TYPE DECIMAL(19,4) USING "amount"::numeric(19,4);
ALTER TABLE "Invoice" ALTER COLUMN "amount" SET DEFAULT 0;

ALTER TABLE "EducationStudent" ALTER COLUMN "balance" DROP DEFAULT;
ALTER TABLE "EducationStudent" ALTER COLUMN "balance" TYPE DECIMAL(19,4) USING "balance"::numeric(19,4);
ALTER TABLE "EducationStudent" ALTER COLUMN "balance" SET DEFAULT 0;

ALTER TABLE "EducationTeacher" ALTER COLUMN "salary" TYPE DECIMAL(19,4) USING "salary"::numeric(19,4);

ALTER TABLE "EducationSchoolFee" ALTER COLUMN "amount" DROP DEFAULT;
ALTER TABLE "EducationSchoolFee" ALTER COLUMN "amount" TYPE DECIMAL(19,4) USING "amount"::numeric(19,4);
ALTER TABLE "EducationSchoolFee" ALTER COLUMN "amount" SET DEFAULT 0;
ALTER TABLE "EducationSchoolFee" ALTER COLUMN "paid" DROP DEFAULT;
ALTER TABLE "EducationSchoolFee" ALTER COLUMN "paid" TYPE DECIMAL(19,4) USING "paid"::numeric(19,4);
ALTER TABLE "EducationSchoolFee" ALTER COLUMN "paid" SET DEFAULT 0;
