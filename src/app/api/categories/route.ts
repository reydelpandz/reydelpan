import { Prisma, Role } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { getServerSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters: Prisma.CategoryWhereInput = {};

        const [categories, count] = await Promise.all([
            prisma.category.findMany({ where: filters }),
            prisma.category.count({ where: filters }),
        ]);

        return Response.json({ records: categories });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Error on the server side. Check server logs." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const authSession = await getServerSession();

        if (
            !hasPermission(authSession?.user.role as Role, "CREATE_CATEGORIES")
        ) {
            return Response.json(
                { message: "Not enough permissions." },
                { status: 403 }
            );
        }

        await prisma.category.create({
            data: {
                label: body.label,
                image: body.image,
                priority: body.priority,
            },
        });

        revalidatePath("/");
        revalidatePath("/products");

        return Response.json(
            { message: "Category created successfully" },
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
