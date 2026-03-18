-- CreateTable
CREATE TABLE "qrcodes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalUrl" TEXT NOT NULL,
    "qrCodeData" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessCount" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "access_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qrCodeId" TEXT NOT NULL,
    "accessedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "referer" TEXT,
    CONSTRAINT "access_logs_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "qrcodes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "qrcodes_expiresAt_idx" ON "qrcodes"("expiresAt");

-- CreateIndex
CREATE INDEX "qrcodes_isActive_idx" ON "qrcodes"("isActive");

-- CreateIndex
CREATE INDEX "qrcodes_createdAt_idx" ON "qrcodes"("createdAt");

-- CreateIndex
CREATE INDEX "access_logs_qrCodeId_idx" ON "access_logs"("qrCodeId");

-- CreateIndex
CREATE INDEX "access_logs_accessedAt_idx" ON "access_logs"("accessedAt");
