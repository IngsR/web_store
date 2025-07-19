/*
  Warnings:

  - The `images` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fuelType` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('Baru', 'Bekas');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('Bensin', 'Listrik', 'Hybrid');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "condition" "Condition" NOT NULL DEFAULT 'Baru',
ADD COLUMN     "mileage" INTEGER,
DROP COLUMN "images",
ADD COLUMN     "images" TEXT[],
DROP COLUMN "fuelType",
ADD COLUMN     "fuelType" "FuelType";
