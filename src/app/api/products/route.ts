import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const authSession = await getServerSession();

        if (!hasPermission(authSession?.user.role as Role, "CREATE_PRODUCTS")) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        const { categories, optionChoices, ...productData } = body;

        const choices: { label: string; price: number }[] = (
            optionChoices || []
        ).map((choice: { label: string; price: number }) => ({
            label: String(choice.label),
            price: Number(choice.price),
        }));

        // Keep the base price coherent with the choices so listings/sorting
        // (which use product.price) show the cheapest choice
        if (choices.length > 0) {
            productData.price = Math.min(...choices.map((c) => c.price));
            productData.discountedPrice = 0;
        } else {
            productData.optionName = null;
        }

        await prisma.product.create({
            data: {
                ...productData,
                slug: slugify(body.name),
                categories: {
                    create: categories || [],
                },
                optionChoices: {
                    create: choices,
                },
            },
            include: {
                categories: true,
            },
        });

        revalidatePath("/");
        revalidatePath("/products");

        return Response.json(
            { message: "Product created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}
