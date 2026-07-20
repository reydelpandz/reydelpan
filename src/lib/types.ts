import type { Prisma } from "@/generated/prisma";

export type ProductWithCategories = Prisma.ProductGetPayload<{
    include: {
        categories: true;
        optionChoices: true;
    };
}>;

export type ProductWithChoices = Prisma.ProductGetPayload<{
    include: {
        optionChoices: true;
    };
}>;
