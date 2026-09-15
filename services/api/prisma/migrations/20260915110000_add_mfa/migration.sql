ALTER TABLE "User"
ADD COLUMN "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "mfaSecretEnc" TEXT,
ADD COLUMN "mfaTempSecretEnc" TEXT,
ADD COLUMN "mfaTempSecretExpiresAt" TIMESTAMP(3),
ADD COLUMN "mfaRecoveryCodes" JSONB,
ADD COLUMN "mfaEnabledAt" TIMESTAMP(3);

CREATE TABLE "MfaChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rememberMe" BOOLEAN NOT NULL DEFAULT false,
    "deviceName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MfaChallenge_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MfaChallenge_userId_idx" ON "MfaChallenge"("userId");
CREATE INDEX "MfaChallenge_expiresAt_idx" ON "MfaChallenge"("expiresAt");

ALTER TABLE "MfaChallenge"
ADD CONSTRAINT "MfaChallenge_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
