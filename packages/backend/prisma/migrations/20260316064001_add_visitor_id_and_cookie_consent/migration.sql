-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "visitorId" TEXT;

-- CreateTable
CREATE TABLE "CookieConsent" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "consent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CookieConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CookieConsent_visitorId_key" ON "CookieConsent"("visitorId");

-- CreateIndex
CREATE INDEX "Event_visitorId_idx" ON "Event"("visitorId");
