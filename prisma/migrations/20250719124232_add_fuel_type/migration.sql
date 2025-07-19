-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountPrice" DOUBLE PRECISION,
ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "isPromo" BOOLEAN NOT NULL DEFAULT false;
