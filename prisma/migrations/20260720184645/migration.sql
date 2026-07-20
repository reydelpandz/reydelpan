-- AlterTable
ALTER TABLE "OrderedProduct" ADD COLUMN     "optionChoice" TEXT,
ADD COLUMN     "optionName" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "optionName" TEXT;

-- CreateTable
CREATE TABLE "ProductOptionChoice" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductOptionChoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductOptionChoice" ADD CONSTRAINT "ProductOptionChoice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
