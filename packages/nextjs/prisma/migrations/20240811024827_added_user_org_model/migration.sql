/*
  Warnings:

  - You are about to drop the column `organizationId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organizationId_fkey";

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "organizationId";

-- CreateTable
CREATE TABLE "UserOrganizations" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "UserOrganizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserOrganizations_user_id_idx" ON "UserOrganizations"("user_id");

-- CreateIndex
CREATE INDEX "UserOrganizations_organization_id_idx" ON "UserOrganizations"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserOrganizations_user_id_organization_id_key" ON "UserOrganizations"("user_id", "organization_id");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganizations" ADD CONSTRAINT "UserOrganizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganizations" ADD CONSTRAINT "UserOrganizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
