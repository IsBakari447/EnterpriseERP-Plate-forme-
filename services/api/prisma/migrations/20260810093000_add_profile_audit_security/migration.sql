ALTER TABLE "User"
ADD COLUMN "firstName" TEXT,
ADD COLUMN "lastName" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "jobTitle" TEXT,
ADD COLUMN "department" TEXT,
ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'fr',
ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Europe/Stockholm',
ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN "displayCurrency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN "notificationEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notificationErp" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notificationImportant" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "signature" TEXT,
ADD COLUMN "passwordChangedAt" TIMESTAMP(3);

ALTER TABLE "AuditLog"
ADD COLUMN "before" JSONB,
ADD COLUMN "after" JSONB,
ADD COLUMN "userAgent" TEXT;
