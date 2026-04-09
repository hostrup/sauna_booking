/*
  Warnings:

  - You are about to drop the column `endTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,startTime]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startTime` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "endTime",
DROP COLUMN "updatedAt",
ADD COLUMN     "date" DATE NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LockedSlot" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "LockedSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LockedSlot_date_startTime_key" ON "LockedSlot"("date", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_date_startTime_key" ON "Booking"("date", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
