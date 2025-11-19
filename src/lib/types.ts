import type { Prisma } from "@/generated/prisma";

export type ProductWithCategories = Prisma.ProductGetPayload<{
    include: {
        categories: true;
    };
}>;
