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

        const { categories, ...productData } = body;

        await prisma.product.create({
            data: {
                ...productData,
                slug: slugify(body.name),
                categories: {
                    create: categories || [],
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
